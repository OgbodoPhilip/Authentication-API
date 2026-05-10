import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../model/userSchema.js";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      try {
        console.log(email, password);

        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, {
            message: "Incorrect email"
          });
        }

        const isMatch = await bcrypt.compare(
          password,
          user.password
        );

        if (!isMatch) {
          return done(null, false, {
            message: "Incorrect password"
          });
        }

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

// save user id in session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// get user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default passport;