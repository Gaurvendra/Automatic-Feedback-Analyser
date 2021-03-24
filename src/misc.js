const express = require("express");
const router = express.Router();
const { authCheck } = require("./authMiddleware");

router.get("/logout", authCheck, (req, res) => {
  res.clearCookie("jwt", { path: "/" });
  res.cookie("jwt", "", { maxAge: 0 });
  res.redirect("/login");
});
router.get("*", (req, res) => {
  res.render("404");
});

module.exports = router;
