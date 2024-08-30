const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/", reviewController.exibirHome);
router.get("/add", reviewController.exibirCadastro);
router.post("/add", reviewController.adicionarReview);

module.exports = router;
