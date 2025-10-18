var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var articlesRouter = require("./routes/articles");
var authRouter = require("./routes/auth");

var app = express();

// view engine setup - підтримка двох шаблонізаторів
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Налаштування EJS для певних роутів
app.engine("ejs", require("ejs").renderFile);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Middleware для theme cookies
app.use((req, res, next) => {
  res.locals.theme = req.cookies.theme || "light";
  res.locals.user = req.cookies.user || null;
  next();
});

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("pug/error");
});

module.exports = app;
