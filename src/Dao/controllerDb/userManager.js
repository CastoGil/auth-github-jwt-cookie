import { userModel } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

const showRegisterForm = (req, res) => {
  res.render("register");
};
const processRegisterForm = async (req, res, next) => {
  const { first_name, last_name, age, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      console.log("El usuario ya está registrado");
      return res.render("register", { error: "El usuario ya está registrado" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new userModel({
      first_name,
      last_name,
      age,
      email,
      password: hashedPassword,
      role: "usuario",
    });
    await user.save();
    req.login(user, (err) => {
      if (err) return next(err);
      const token = jwt.sign(
        { Id: user._id, first_name: user.first_name, role: user.role },
        jwtSecret
      );
      res.cookie("token", token, { httpOnly: true, sameSite: true });
      res.redirect("/api/products");
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
};

const showLoginForm = (req, res) => {
  res.render("login");
};
const processLoginForm = async (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    async (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.render("login", { error: info.message });
      }
      try {
        ///creamos el token///
        const token = jwt.sign(
          { Id: user._id, first_name: user.first_name, role: user.role },
          jwtSecret
        );
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/api/products");
      } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
      }
    }
  )(req, res, next);
};
const closeSession = async (req, res) => {
  res.clearCookie("token");
  res.clearCookie("role"); // borra la cookie "role"
  req.logout(function (err) {
    if (err) return next(err);
    req.session.destroy(function (err) {
      if (err) return next(err);
      res.redirect("/auth/login");
    });
  });
};

export {
  processLoginForm,
  showRegisterForm,
  processRegisterForm,
  showLoginForm,
  closeSession,
};
