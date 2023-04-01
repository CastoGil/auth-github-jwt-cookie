import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import { userModel } from "../Dao/models/user.js";
const JWT_SECRET = process.env.JWT_SECRET;

//Middleware para verificar si es Admin
const isAdmin = (req, res, next) => {
  const { email, password } = req.body;
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    res.cookie("role", "admin", { httpOnly: true });
    return res.redirect("/api/products");
  }
  next();
}

//Middleware para verificar la autenticación del usuario
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; 
    if (!token) {
      throw new Error("Debe autenticarse para realizar esta acción");
    }
    const decoded = jwt.verify(token, JWT_SECRET); // decodifica el token
    const user = await userModel.findById(decoded.id); 
    if (!user) {
      throw new Error("Token inválido, usuario no encontrado en la base de datos");
    }
    req.user = user; 
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ status: "error", message: error.message });
  }
};

export { auth, isAdmin };
