const express = require("express");
const router = express.Router();
const { authCheck } = require("./authMiddleware");
const multer = require("multer");
const hash = require("random-hash");
const jwt = require("jsonwebtoken");
const { query, updatePush } = require("../db/query");
const tts = require("./tts");
const ta = require("./ta");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    let temp = file.originalname.split(".");
    const filename =
      temp[0] + "-" + hash.generateHash({ length: 5 }) + "." + temp[1];
    cb(null, filename);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

router.get("/audio", authCheck, (req, res) => {
  let token = req.cookies.jwt;
  let obj = jwt.verify(token, process.env.JWT_SECRET);
  let q = { _id: obj._id };
  query(q).then((user) => {
    res.render("audio", { name: user[0].name });
  });
});

router.post("/audio", authCheck, upload.single("audio"), (req, res) => {
  let token = req.cookies.jwt;
  let obj = jwt.verify(token, process.env.JWT_SECRET);
  let q = { _id: obj._id };
  let pushEle = { audioRoot: req.file.path };
  updatePush(q, pushEle).then(async (result) => {
    try {
      let str = await tts(req.file.path);
      let finalDoc = await ta(str);
      let labelss = [];
      let anger = [];
      let joy = [];
      let analytical = [];
      let sadness = [];
      let fear = [];
      let confident = [];
      let tentative = [];
      let docLabel = [];
      let docData = [];
      let maxval = 0;
      let maxstr;
      docLabel.push("Joy");
      docData.push(finalDoc.wholeDoc.Joy);
      if (finalDoc.wholeDoc.Joy >= maxval) {
        maxval = finalDoc.wholeDoc.Joy;
        maxstr = "Joy";
      }
      docLabel.push("Analytical");
      docData.push(finalDoc.wholeDoc.Analytical);
      if (finalDoc.wholeDoc.Analytical >= maxval) {
        maxval = finalDoc.wholeDoc.Analytical;
        maxstr = "Analytical";
      }
      docLabel.push("Sadness");
      docData.push(finalDoc.wholeDoc.Sadness);
      if (finalDoc.wholeDoc.Sadness >= maxval) {
        maxval = finalDoc.wholeDoc.Sadness;
        maxstr = "Sadness";
      }
      docLabel.push("Anger");
      docData.push(finalDoc.wholeDoc.Anger);
      if (finalDoc.wholeDoc.Anger >= maxval) {
        maxval = finalDoc.wholeDoc.Anger;
        maxstr = "Anger";
      }
      docLabel.push("Fear");
      docData.push(finalDoc.wholeDoc.Fear);
      if (finalDoc.wholeDoc.Fear >= maxval) {
        maxval = finalDoc.wholeDoc.Fear;
        maxstr = "Fear";
      }
      docLabel.push("Confident");
      docData.push(finalDoc.wholeDoc.Confident);
      if (finalDoc.wholeDoc.Confident >= maxval) {
        maxval = finalDoc.wholeDoc.Confident;
        maxstr = "Confident";
      }
      docLabel.push("Tentative");
      docData.push(finalDoc.wholeDoc.Tentative);
      if (finalDoc.wholeDoc.Tentative >= maxval) {
        maxval = finalDoc.wholeDoc.Tentative;
        maxstr = "Tentative";
      }

      finalDoc.eachSentence.forEach((element) => {
        labelss.push(element.id + 1);
        anger.push(element.emotes.Anger);
        joy.push(element.emotes.Joy);
        analytical.push(element.emotes.Analytical);
        sadness.push(element.emotes.Sadness);
        fear.push(element.emotes.Fear);
        confident.push(element.emotes.Confident);
        tentative.push(element.emotes.Tentative);
      });

      let q = { _id: obj._id };
      query(q).then((user) => {
        viewData = {
          labels: labelss,
          anger: anger,
          sadness: sadness,
          joy: joy,
          analytical: analytical,
          fear: fear,
          confident: confident,
          tentative: tentative,
          name: user[0].name,
          length: labelss.length,
          docData: docData,
          docLabel: docLabel,
          fin: maxstr,
        };
        console.log(viewData);

        res.render("dashboard", viewData);
      });
    } catch (err) {
      console.log(err);
    }
  });
});
module.exports = router;
