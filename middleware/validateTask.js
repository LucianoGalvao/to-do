const { body } = require("express-validator");

const validateTask = [
  body("title")
    .isLength({ max: 100 })
    .notEmpty()
    .withMessage("O campo 'title'é obrigatório!"),
  body("description")
    .isLength({ max: 200 })
    .withMessage("A descrição deve ter no máximo 200 caracteres."),
];

module.exports = validateTask;
