const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  issuedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }], // Reference to books issued by the user
  photo: {
    filename: String,
    contentType: String,
    imageBase64: String
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
