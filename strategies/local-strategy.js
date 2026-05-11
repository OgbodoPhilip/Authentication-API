import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import User from "../model/userSchema.js";
import dotenv from "dotenv";
dotenv.config();

/* LOCAL STRATEGY */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email"
    },
    async (email, password, done) => {
      try {
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

/* GOOGLE STRATEGY */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          email: profile.emails[0].value
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });
        }

        return done(null, user);

      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id).select("-password");
  done(null, user);
});

export default passport;