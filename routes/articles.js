var express = require("express");
var router = express.Router();

// Тестові дані статей
const articles = [
  {
    id: 1,
    title: "Вступ до Node.js та Express",
    excerpt: "Ознайомлення з основами серверної розробки на JavaScript",
    content: `
      <p>Node.js - це потужна платформа для серверної розробки на JavaScript. Express - це мінімалістичний веб-фреймворк для Node.js.</p>
      <p>У цій статті розглянемо основи створення веб-серверів з використанням Express Framework.</p>
      <h3>Основні можливості Express:</h3>
      <ul>
        <li>Швидка розробка веб-додатків</li>
        <li>Потужний routing</li>
        <li>Підтримка middleware</li>
        <li>Шаблонізатори</li>
      </ul>
    `,
    author: "Олексій Коваленко",
    date: "2024-01-15",
    category: "Веб-розробка",
    tags: ["Node.js", "Express", "JavaScript"],
    image: "/images/nodejs-express.jpg",
  },
  {
    id: 2,
    title: "Шаблонізатори: PUG vs EJS",
    excerpt: "Порівняння двох популярних шаблонізаторів для Express",
    content: `
      <p>Шаблонізатори допомагають створювати динамічні HTML сторінки. PUG та EJS - два найпопулярніші шаблонізатори для Express.</p>
      <h3>PUG (раніше Jade):</h3>
      <ul>
        <li>Чистий та мінімалістичний синтаксис</li>
        <li>Без закривних тегів</li>
        <li>Відступи замість дужок</li>
      </ul>
      <h3>EJS (Embedded JavaScript):</h3>
      <ul>
        <li>Схожий на звичайний HTML</li>
        <li>Вбудований JavaScript код</li>
        <li>Простий для початківців</li>
      </ul>
    `,
    author: "Марія Петрова",
    date: "2024-02-20",
    category: "Frontend",
    tags: ["PUG", "EJS", "Template Engines"],
    image: "/images/template-engines.jpg",
  },
  {
    id: 3,
    title: "RESTful API з Express",
    excerpt: "Створення REST API для сучасних веб-додатків",
    content: `
      <p>REST API - це архітектурний стиль для створення веб-сервісів. Express ідеально підходить для створення RESTful API.</p>
      <h3>Основні принципи REST:</h3>
      <ul>
        <li>Використання HTTP методів (GET, POST, PUT, DELETE)</li>
        <li>Статусні коди відповідей</li>
        <li>JSON формат даних</li>
        <li>Без збереження стану (stateless)</li>
      </ul>
      <p>Express надає всі необхідні інструменти для швидкого створення API endpoints.</p>
    `,
    author: "Андрій Семенов",
    date: "2024-03-10",
    category: "Backend",
    tags: ["REST", "API", "Express", "HTTP"],
    image: "/images/rest-api.jpg",
  },
];

/* GET articles listing - використовуємо EJS шаблонізатор */
router.get("/", function (req, res, next) {
  // Для EJS потрібно явно вказати розширення файлу
  res.render("ejs/articles.ejs", {
    title: "Список статей (EJS)",
    articles: articles,
  });
});

/* GET article detail - використовуємо EJS шаблонізатор */
router.get("/:articleId", function (req, res, next) {
  const articleId = parseInt(req.params.articleId);
  const article = articles.find((a) => a.id === articleId);

  // Для EJS потрібно явно вказати розширення файлу
  res.render("ejs/article-detail.ejs", {
    title: article ? article.title : "Статтю не знайдено",
    article: article,
  });
});

module.exports = router;
