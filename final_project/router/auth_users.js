const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let user = users.find(u => u.username === username);
  if (user) {
    return false;
  }
  return true;
};

const authenticatedUser = (username, password) => {
  let user = users.find(u => u.username === username && u.password === password);
  if (user) {
    return true;
  }
  return false;
};

regd_users.post("/login", (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(403).json({ message: "Invalid login" });
  }

  let accessToken = jwt.sign(
    { username: username },
    "access",
    { expiresIn: 60 * 60 }
  );

  req.session.authorization = {
    accessToken
  };

  return res.status(200).json({ message: "User successfully logged in" });
});

regd_users.put("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({ message: "Review added/updated successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

  const isbn = req.params.isbn;
  const username = req.user.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }

  return res.status(404).json({ message: "Review not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
