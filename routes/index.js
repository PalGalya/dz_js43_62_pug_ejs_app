var express = require("express");
var router = express.Router();

/* GET home page (PUG). */
router.get("/", function (req, res, next) {
  // Використовуємо PUG шаблон з папки views/pug
  res.render("pug/index", { title: "PUG + EJS Demo" });
});

module.exports = router;
