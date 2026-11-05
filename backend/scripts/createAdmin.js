const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
  try {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } =
      process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGO_URI) {
      throw new Error("Please configure all admin variables in .env");
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error("Admin password must contain at least 8 characters.");
    }

    await mongoose.connect(MONGO_URI);

    const email = ADMIN_EMAIL.trim().toLowerCase();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.role = "admin";
      await existingUser.save();

      console.log("Existing account successfully promoted to Admin.");
    } else {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);

      await User.create({
        name: ADMIN_NAME.trim(),
        email,
        password: hashedPassword,
        role: "admin"
      });

      console.log("Admin account created successfully.");
    }

    console.log("Admin email:", email);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createAdmin();