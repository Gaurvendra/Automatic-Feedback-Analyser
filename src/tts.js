tts = (path) => {
  let promise = new Promise(function (myResolve, myReject) {
    const fs = require("fs");
    const SpeechToTextV1 = require("ibm-watson/speech-to-text/v1");
    const { IamAuthenticator } = require("ibm-watson/auth");
    console.log("dfd");
    const speechToText = new SpeechToTextV1({
      authenticator: new IamAuthenticator({
        apikey: process.env.TEXT_KEY,
      }),
      serviceUrl: process.env.TEXT_URL,
      disableSslVerification: true,
    });
    const params = {
      objectMode: true,
      contentType: "audio/flac",
      model: "en-US_BroadbandModel",

      maxAlternatives: 0,
    };

    // Create the stream.
    const recognizeStream = speechToText.recognizeUsingWebSocket(params);

    // Pipe in the audio.
    fs.createReadStream(path).pipe(recognizeStream);

    recognizeStream.on("data", function (event) {
      onEvent("Data:", event);
    });
    recognizeStream.on("error", function (event) {
      onEvent("Error:", event);
    });
    recognizeStream.on("close", function (event) {
      onEvent("Close:", event);
    });
    let str = "";
    // Display events on the console.
    function onEvent(name, event) {
      if (name == "Data:") {
        event.results.forEach((element) => {
          str = str + element.alternatives[0].transcript + ". ";
        });
      }
      if (name == "Error:") {
        myReject(event);
      }
      if (name == "Close:") {
        myResolve(str);
      }
    }
  });

  return promise;
};
module.exports = tts;
