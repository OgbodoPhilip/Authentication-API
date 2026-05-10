import User from "../model/userSchema.js";
import mongoose from "mongoose";
// export const createUser = async (req, res,next) => {
//   try {
//     const { name, email, password } = req.body;
//     const user = new User({ name, email, password });
//     await user.save();
//     res.status(201).json(user);
//   } catch (error) {
//     next(error);
//   }
// };






// export const createUser = async (req, res, next) => {
//   try {
//     const { name, email, password } = req.body;

//     if (!password) {
//       return res.status(400).json({
//         success: false,
//         message: "Password is required"
//       });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword
//     });

//     res.status(201).json(user);

//   } catch (error) {
//     next(error);
//   }
// };




import bcrypt from "bcrypt";


export const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // create session
    req.session.userId = user._id;

    res.status(201).json({
      success: true,
      message: "User created successfully",
      sessionId: req.session.id,
      user
    });

  } catch (error) {
    next(error);
  }
};
export const getAllUsers = async (req, res, next) => {
  try {
    const { name, email } = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (email) {
      filter.email = { $regex: email, $options: "i" };
    }

    const users = await User.find(filter).sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
};


export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
};

export const updateUser =  async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser =  async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } else {
      res.json({ message: "User deleted successfully" });
    }       
  } catch (error) {
    next(error);
  }
};



