import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import User from "./model/userSchema.js";
import routes from "./routes/index.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport"
import "./strategies/local-strategy.js";
import { isAuthenticated } from "./middlewares/authMiddleware.js";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 * 60 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);





app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  
  res.cookie("cookiename","namevalue",{maxAge:3600000,  httpOnly: true})
  
  res.send("Hello World");
});

app.post("/api/auth", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info.message
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      res.json({
        success: true,
        message: "Authentication successful",
        sessionId: req.session.id,
        user: {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email
        }
      });
    });

  })(req, res, next);
});





app.get("/dashboard", isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Welcome to your dashboard, ${req.user.name}`,
    user: req.user
  });
});






app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});



app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(e => e.message);

    return res.status(400).json({
      success: false,
      type: "Validation Error",
      errors
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      type: "Duplicate Error",
      message: "Email already exists"
    });
  }

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});


app.listen(process.env.PORT, () => {
  console.log(`Server connected to port ${process.env.PORT}`);
});
