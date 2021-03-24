const express = require("express");
const router = express.Router();
const { authCheckTrue } = require("./authMiddleware");
const { query } = require("../db/query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/login", authCheckTrue, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  authCheckTrue,
  express.json(),
  express.urlencoded({ extended: false }),
  (req, res) => {
    const p = req.body.password;
    const email = req.body.email;
    const q = { email: email };
    query(q).then((user) => {
      if (user.length == 1) {
        bcrypt.compare(p, user[0].password).then((matched) => {
          if (matched) {
            const token = jwt.sign(
              { _id: user[0]._id },
              process.env.JWT_SECRET
            );
            res.cookie("jwt", token, {
              httpOnly: true,
            });
            res.redirect("/audio");
          } else {
            res.status(400).send({ message: "Password not matched" });
          }
        });
      } else {
        res.status(400).send({ message: "no user found" });
      }
    });
  }
);

module.exports = router;
