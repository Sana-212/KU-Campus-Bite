const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Cart = require("../models/cart");

const signup = async (req, res) => {
  try {
    const { name, email, password, guestId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      passwordHash,
    });

    await user.save();

    if (guestId) {
      const guestCart = await Cart.findOneAndUpdate(
        { guestId },
        { userId: user._id, guestId: null },
        { new: true }
      );
      console.log("Guest cart linked to new user:", guestCart);
    }

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, guestId } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Special case: Admin login (hardcoded email + password)
    if (email === process.env.ADMIN_EMAIL) {
      if (password === process.env.ADMIN_PASSWORD) {
        return res.status(200).json({
          message: "Admin login successful",
          role: "admin",
        });
      } else {
        return res.status(401).json({ message: "Invalid admin credentials" });
      }
    }

    // Normal user login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //Cart Merging Logic
    if (guestId) {
      const guestCart = await Cart.findOne({ guestId });
      if (guestCart) {
        let userCart = await Cart.findOne({ userId: user._id });
        if (userCart) {
          guestCart.items.forEach((guestItem) => {
            const existingItem = userCart.items.find((item) => {
              return item.menuItemId.toString() === guestItem.menuItemId.toString();
            });
            if (existingItem) {
              existingItem.quantity += guestItem.quantity;
            } else {
              userCart.items.push(guestItem);
            }
          });
          await userCart.save();
          // Delete the guest cart after merging
          await Cart.findByIdAndDelete(guestCart._id);
          console.log("Guest cart merged and deleted");
        } else {
          // If no user cart exists, simply link the guest cart to the user
          guestCart.userId = user._id;
          guestCart.guestId = null;
          await guestCart.save();
          console.log("Guest Cart linked to user");
        }
      }
    }

    //create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
     const userWithoutPassword = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    return res
      .status(200)
      .json({ message: "Login successful", role: user.role, token ,user:userWithoutPassword});
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = { signup, login };
