ta = (text) => {
  let promise = new Promise(function (myResolve, myReject) {
    const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
    const { IamAuthenticator } = require("ibm-watson/auth");

    const emotion = [
      "Analytical",
      "Sadness",
      "Anger",
      "Fear",
      "Joy",
      "Confident",
      "Tentative",
    ];

    const toneAnalyzer = new ToneAnalyzerV3({
      version: "2017-09-21",
      authenticator: new IamAuthenticator({
        apikey: process.env.TONE_KEY,
      }),
      serviceUrl: process.env.TONE_URL,
    });

    const toneParams = {
      toneInput: { text: text },
      contentType: "application/json",
    };

    toneAnalyzer
      .tone(toneParams)
      .then((toneAnalysis) => {
        let wholeDoc = toneAnalysis.result.document_tone.tones;
        let eachSentence = toneAnalysis.result.sentences_tone;
        let tones = [];
        let DocTones = {};
        wholeDoc.forEach((result) => {
          DocTones[result.tone_name] = result.score;
        });
        emotion.forEach((emo) => {
          if (DocTones[emo] == undefined) {
            DocTones[emo] = 0;
          }
        });

        eachSentence.forEach((ele) => {
          let obj = { id: ele.sentence_id };
          let toneObj = {};
          ele.tones.forEach((tonesed) => {
            toneObj[tonesed.tone_name] = tonesed.score;
          });
          obj.emotes = toneObj;
          emotion.forEach((emo) => {
            if (obj.emotes[emo] == undefined) {
              obj.emotes[emo] = 0;
            }
          });

          tones.push(obj);
        });

        let obj = {
          wholeDoc: DocTones,
          eachSentence: tones,
        };
        myResolve(obj);
      })
      .catch((err) => {
        myReject(err);
      });
  });

  return promise;
};
module.exports = ta;
