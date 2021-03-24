const express = require("express");
const router = express.Router();
const { authCheckTrue } = require("./authMiddleware");
const { inserts, query } = require("../db/query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

hashPass = async (value) => {
  var hashedval = await bcrypt.hashSync(value, 10);
  return hashedval;
};

router.get("/register", authCheckTrue, (req, res) => {
  res.render("register");
});

router.post(
  "/register",
  authCheckTrue,
  express.json(),
  express.urlencoded({ extended: false }),
  (req, res) => {
    const p = req.body.password;
    const c = req.body.confirmpassword;
    const name = req.body.name;
    const email = req.body.email;

    const q = { email: email };
    query(q).then((user) => {
      if (user.length == 1) {
        res.status(400).send({ message: "Failed! Email is already in use!" });
      } else {
        if (c === p) {
          const obj = {
            name: name,
            email: email,
            password: p,
          };
          hashPass(p).then((value) => {
            obj.password = value;
            inserts(obj).then((result) => {
              const token = jwt.sign(
                { _id: result._id },
                process.env.JWT_SECRET
              );
              res.cookie("jwt", token, {
                httpOnly: true,
              });
              res.redirect("/audio");
            });
          });
        } else {
          res.status(400).send({ message: "Password not matched" });
        }
      }
    });
  }
);
module.exports = router;
