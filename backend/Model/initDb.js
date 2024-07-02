// init-db.js

const mongoose = require('mongoose');
const Book = require('./bookData'); // Adjust path as per your file structure

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/E-Library', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Sample data of 50 books
const booksData = [
    { name: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { name: '1984', author: 'George Orwell' },
    { name: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
    { name: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { name: 'Harry Potter and the Philosopher\'s Stone', author: 'J.K. Rowling' },
    { name: 'Animal Farm', author: 'George Orwell' },
    { name: 'Brave New World', author: 'Aldous Huxley' },
    { name: 'The Hobbit', author: 'J.R.R. Tolkien' },
    { name: 'Moby-Dick', author: 'Herman Melville' },
    { name: 'War and Peace', author: 'Leo Tolstoy' },
    { name: 'Pride and Prejudice', author: 'Jane Austen' },
    { name: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
    { name: 'Jane Eyre', author: 'Charlotte Bronte' },
    { name: 'The Grapes of Wrath', author: 'John Steinbeck' },
    { name: 'One Hundred Years of Solitude', author: 'Gabriel Garcia Marquez' },
    { name: 'The Odyssey', author: 'Homer' },
    { name: 'Alice\'s Adventures in Wonderland', author: 'Lewis Carroll' },
    { name: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle' },
    { name: 'The Picture of Dorian Gray', author: 'Oscar Wilde' },
    { name: 'The Bell Jar', author: 'Sylvia Plath' },
    { name: 'Crime and Punishment', author: 'Fyodor Dostoevsky' },
    { name: 'The Road', author: 'Cormac McCarthy' },
    { name: 'Frankenstein', author: 'Mary Shelley' },
    { name: 'Anna Karenina', author: 'Leo Tolstoy' },
    { name: 'Gone with the Wind', author: 'Margaret Mitchell' },
    { name: 'The Brothers Karamazov', author: 'Fyodor Dostoevsky' },
    { name: 'Les Miserables', author: 'Victor Hugo' },
    { name: 'Catch-22', author: 'Joseph Heller' },
    { name: 'The Count of Monte Cristo', author: 'Alexandre Dumas' },
    { name: 'Wuthering Heights', author: 'Emily Bronte' },
    { name: 'The Wind-Up Bird Chronicle', author: 'Haruki Murakami' },
    { name: 'Slaughterhouse-Five', author: 'Kurt Vonnegut' },
    { name: 'The Stranger', author: 'Albert Camus' },
    { name: 'Beloved', author: 'Toni Morrison' },
    { name: 'Don Quixote', author: 'Miguel de Cervantes' },
    { name: 'The Sun Also Rises', author: 'Ernest Hemingway' },
    { name: 'The Hitchhiker\'s Guide to the Galaxy', author: 'Douglas Adams' },
    { name: 'Lord of the Flies', author: 'William Golding' },
    { name: 'Middlemarch', author: 'George Eliot' },
    { name: 'The Handmaid\'s Tale', author: 'Margaret Atwood' },
    { name: 'Milk and Honey', author: 'Rupi Kaur' },
    { name: 'The Shining', author: 'Stephen King' },
    { name: 'The Book Thief', author: 'Markus Zusak' },
    { name: 'The Alchemist', author: 'Paulo Coelho' },
    { name: 'The Little Prince', author: 'Antoine de Saint-Exupery' },
    { name: 'The Stand', author: 'Stephen King' },
    { name: 'A Game of Thrones', author: 'George R.R. Martin' },
    { name: 'The Complete Stories', author: 'Flannery O\'Connor' },
];

async function initializeBooks() {
    try {
        // Delete existing data to start fresh (optional step)
        await Book.deleteMany();

        // Insert new data
        await Book.insertMany(booksData);

        console.log('Database initialized with 50 books.');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error initializing database:', err);
        mongoose.connection.close();
    }
}

initializeBooks();
