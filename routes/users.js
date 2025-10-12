var express = require("express");
var router = express.Router();

// Тестові дані користувачів
const users = [
  {
    id: 1,
    name: "Олександр Петренко",
    email: "alex.petrenko@example.com",
    age: 28,
    bio: "Full-stack розробник з 5-річним досвідом",
    location: "Київ, Україна",
  },
  {
    id: 2,
    name: "Марія Іваненко",
    email: "maria.ivanenko@example.com",
    age: 25,
    bio: "UI/UX дизайнер та фронтенд розробник",
    location: "Львів, Україна",
  },
  {
    id: 3,
    name: "Дмитро Сидоренко",
    email: "dmitry.sidorenko@example.com",
    age: 32,
    bio: "DevOps інженер та системний адміністратор",
    location: "Харків, Україна",
  },
];

/* GET users listing - використовуємо PUG шаблонізатор */
router.get("/", function (req, res, next) {
  // Вказуємо повний шлях до PUG шаблону
  res.render("pug/users", {
    title: "Список користувачів (PUG)",
    users: users,
  });
});

/* GET user detail - використовуємо PUG шаблонізатор */
router.get("/:userId", function (req, res, next) {
  const userId = parseInt(req.params.userId);
  const user = users.find((u) => u.id === userId);

  // Вказуємо повний шлях до PUG шаблону
  res.render("pug/user-detail", {
    title: user
      ? `Деталі користувача: ${user.name}`
      : "Користувача не знайдено",
    user: user,
  });
});

module.exports = router;
