require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const loginRoute = require("./login");
const registerRoute = require("./register");
const miscRoute = require("./misc");
const audioRoute = require("./audio");

//VariableSet
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../templates"));

//middlewareUse
app.use(express.static(path.join(__dirname, "../public")));
app.use(cookieParser());

//routeDefined

//home
app.get("/", (req, res) => {
  res.render("home");
});

//Login
app.use(loginRoute);

//Register
app.use(registerRoute);

//Audio
app.use(audioRoute);

//Misc
app.use(miscRoute);

app.listen(process.env.PORT,"3.234.194.20", () =>
  console.log(`Listening on port ${process.env.PORT}.`)
);
