import express from "express";
import {
  processRegisterForm,
  closeSession,
  showLoginForm,
  showRegisterForm,
  processLoginForm,
} from "../Dao/controllerDb/userManager.js";
import { auth, isAdmin } from "../middlewares/index.js";
import passport from "passport";
const router = express.Router();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;

/////////////////////rutas login y registro//////////////////////////////
router.get("/login", showLoginForm);
router.post("/login", isAdmin, processLoginForm);
router.get("/logout", closeSession);
router.get("/register", showRegisterForm);
router.post("/register", processRegisterForm);
///////////////////////////////////////////////////////////////////////
/////////ruta /auth/current///////////////////////////////////////////
router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

//////////////////////////ruta github////////////////////////////////////
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign(
      {
        Id: req.user._id,
        first_name: req.user.first_name,
        role: req.user.role,
      },
      jwtSecret
    );
    res.cookie("token", token);
    res.redirect("/api/products");
  }
);
////////////////////////////////////////////////////////////////////

export default router;
