const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    issueCount: {
        type: Number,
        default: 0,
    },
    issuedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    imageLink: {
        type: String, // Field for image link
        default: 'https://i.pinimg.com/736x/c4/30/9c/c4309c9e8d6ddc90eb3e4ee73ade76e9.jpg', // Default value if no image is provided
    },
});

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
