import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
////////////////////////////////////////////////////////////////////////////////////
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
////////////////////////////////////////////////////////////
const JWT_SECRET = process.env.JWT_SECRET;

////////////////////////////////funciones para jwt///////////////////////////////
const currentStrategy = () => {
  return new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromExtractors([
          ExtractJwt.fromHeader("cookie"),
          ExtractJwt.fromUrlQueryParameter("token"),
        ]),
      ]),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await userModel.findById(payload.sub);
        if (!user) {
          return done(null, false);
        }
        done(null, user);
      } catch (error) {
        done(error, false);
      }
    }
  );
};
const generateToken = (user) => {
  const payload = {
    sub: user._id,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};
////////////////////////////////////////////////////////////////////
export { __dirname, currentStrategy, generateToken };
