const express = require("express");
const exphbr = require("express-handlebars");
const porta = process.env.PORT || 3002;
const app = express();
const reviewsRouters = require("./routers/reviewsRouters");
const usuariosRouters = require("./routers/usuariosRouters");
const cookieParser = require("cookie-parser");
const path = require("path");

//estabelece a pasta de partials ao handlebars
const hbs = exphbr.create({
  partialsDir: ["views/partials"],
  helpers: {
    igual: (a, b) => a === b,
    maiorq: (a, b) => a < b,
    menorq: (a, b) => a > b,
    maiorIgual: (a, b) => a >= b,
    menorIgual: (a, b) => a <= b,
    and: (a, b) => a && b,
    or: (a, b) => a || b,
  },
});

// view engine
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// para utilizar cookies
app.use(cookieParser());

// tratamento pra requisições via POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// seta os routers nos middlewares, ** tem que importar o router antes
app.use("/reviews", reviewsRouters);
app.use("/usuario", usuariosRouters);
// seta a pasta publica padrão
app.use(express.static(path.join(__dirname, "public")));

//rota padrão
app.get("/", (req, res) => {
  res.redirect("/reviews");
});

// qualquer endereço digitado ele cai nesse middleware mostrando a pagina 404, ** use
app.use((req, res) => {
  res.render("validacao/404");
});

// inicia o servidor
app.listen(porta, () => {
  console.log("servidor rodando na porta: " + porta);
});
