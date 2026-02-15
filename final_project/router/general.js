const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username: username, password: password });

  return res.status(200).json({ message: "User successfully registered" });
});

public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/author/:author', function (req, res) {

  const author = req.params.author;
  const bookKeys = Object.keys(books);
  let filteredBooks = {};

  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found by this author" });
  }
});

public_users.get('/title/:title', function (req, res) {

  const title = req.params.title;
  const bookKeys = Object.keys(books);
  let filteredBooks = {};

  bookKeys.forEach(key => {
    if (books[key].title.toLowerCase() === title.toLowerCase()) {
      filteredBooks[key] = books[key];
    }
  });

  if (Object.keys(filteredBooks).length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

public_users.get('/review/:isbn', function (req, res) {

  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
