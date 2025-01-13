const { body } = require("express-validator");
const User = require("../models/userModel");

const validateRegister = [
  body("username").notEmpty(),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Por favor, insira um e-mail válido.")
    .matches(/^\S*$/)
    .withMessage("A senha não pode conter espaços em branco.")
    .normalizeEmail()
    .custom(async (email) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Este e-mail já está cadastrado.");
      }
    }),
  body("password")
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("A senha deve ter pelo menos 8 caracteres.")
    .matches(/[A-Z]/)
    .withMessage("A senha deve conter pelo menos uma letra maiúscula.")
    .matches(/[a-z]/)
    .withMessage("A senha deve conter pelo menos uma letra minúscula.")
    .matches(/\d/)
    .withMessage("A senha deve conter pelo menos um número.")
    .matches(/^\S*$/)
    .withMessage("A senha não pode conter espaços em branco.")
    .trim()
    .matches(/[\W_]/)
    .withMessage("A senha deve conter pelo menos um caractere especial."),
];

const validateLogin = [
  body("email").isEmail().notEmpty().withMessage("E-mail inválido."),
  body("password").notEmpty().withMessage("Senha obrigatória."),
];

module.exports = { validateRegister, validateLogin };
