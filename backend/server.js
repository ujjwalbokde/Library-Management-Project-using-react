const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const Book = require("./Model/bookData");
const User = require("./Model/userData");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const { isAdmin, verifyToken, authenticateToken } = require("./authMiddleware");

dotenv.config();
const app = express();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.get("/userData", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Error fetching user data:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", async (req, res) => {
  try {
    let allBooks = await Book.find();
    res.json(allBooks);
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//only admin create route
app.post("/", isAdmin, async (req, res) => {
  try {
    const { name, author ,imageLink} = req.body;
    const newBook = new Book({
      name,
      author,
      imageLink:imageLink||"https://global.discourse-cdn.com/openai1/original/4X/e/9/1/e91eefdc8650969cf0fd5a78ffd3486415ec23af.jpeg",
    });
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (err) {
    console.error("Error saving book:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Admin endpoint to get a single book by ID (no authentication required)
app.get("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    const singleBook = await Book.findById(id);
    if (!singleBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(singleBook);
  } catch (err) {
    console.error("Error fetching single book:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Admin Endpoint to update a book by ID (no authentication required)
app.patch("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const { name, author,imageLink } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (author) updateFields.author = author;
    if (imageLink) updateFields.imageLink=imageLink
    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(updatedBook);
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Admin-only endpoint to delete a book by ID
app.delete("/:id", isAdmin, async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(deletedBook);
  } catch (err) {
    console.error("Error deleting book:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });
    await newUser.save();
    res.json({ status: true, message: "User registered successfully" });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per `window` (here, per 15 minutes)
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

// Endpoint for user login (no authentication required)
app.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists in the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate the password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.KEY,
      { expiresIn: "1h" }
    );

    // Set cookie with JWT token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000,
      sameSite: "strict",
    });

    // Send success response
    res.json({ status: true, message: "Login successful" });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint for user logout (no authentication required)
app.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ status: true, message: "Logout successful" });
  } catch (err) {
    console.error("Error logging out:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//for all user

// Endpoint to register a new user (no authentication required)
app.get("/:id/issue", verifyToken, async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid book ID format" });
    }
    const singleBook = await Book.findById(id);
    if (!singleBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(singleBook);
  } catch (err) {
    console.error("Error fetching single book:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/:id/issue", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params; // Get the book ID from the request parameters
    const userId = req.user.userId; // Get the user ID from the authenticated user

    console.log(`Issuing book ${id} to user ${userId}`);

    // Find the book by its ID
    const book = await Book.findById(id);
    if (!book) {
      console.log(`Book not found for ID: ${id}`);
      return res.status(404).json({ message: "Book not found" });
    }

    // Update the book's issuedTo field with the user ID
    book.issuedTo.push(userId);
    book.issueCount += 1; // Increment the issue count
    await book.save();

    // Update the user's issuedBooks array with the issued book's ID
    await User.findByIdAndUpdate(userId, { $push: { issuedBooks: book._id } });

    console.log(`Book ${id} issued successfully to user ${userId}`);
    res.status(200).json({ message: "Book issued successfully", book });
  } catch (err) {
    console.error("Error issuing book:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Endpoint to fetch books issued to the authenticated user
app.get("/account/issued-books", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch books where issuedTo field matches the current user's ID
    const issuedBooks = await Book.find({ issuedTo: userId });

    res.json(issuedBooks);
  } catch (err) {
    console.error("Error fetching issued books:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post(
  "/account/issued-books/:id/return",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId; // Assuming req.user contains the authenticated user's ID

    try {
      const book = await Book.findById(id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      if (book.issuedTo.toString() !== userId) {
        return res
          .status(403)
          .json({ message: "You are not authorized to return this book" });
      }

      book.issuedTo = null;
      await book.save();

      await User.findByIdAndUpdate(userId, {
        $pull: { issuedBooks: book._id },
      });

      res.json({ message: "Book returned successfully" });
    } catch (err) {
      console.error("Error returning book:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);


app.post('/upload',authenticateToken, upload.single('photo'), async (req, res) => {
  const userId = req.user.userId; // Assuming the user ID is sent in the request body
  const { buffer, mimetype, originalname } = req.file;
  const photo = {
    filename: originalname,
    contentType: mimetype,
    imageBase64: buffer.toString('base64')
  };

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    user.photo = photo;

    await user.save();

    res.json({ id: user._id, message: 'Photo uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

// Serve the photo endpoint
app.get('/photo/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.photo) {
      return res.status(404).send('Photo not found');
    }

    res.set('Content-Type', user.photo.contentType);
    res.send(Buffer.from(user.photo.imageBase64, 'base64'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
