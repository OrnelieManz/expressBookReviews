const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const deepObjFilter = (pred) => (o) => Object .fromEntries (
    pathEntries (o) .filter (([p, v]) => pred (v)) .map (([p, v]) => [p .at (-1), v])
  );
const pathEntries = (o, p = []) => [
    ... (p .length > 0 ? [[p, o]] : []),
    ... (Object (o) === o ? Object .entries (o) .flatMap (
          ([k, v]) => pathEntries (v, [...p, Array .isArray (o) ? Number (k) : k])) : []
        )
  ];
public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

    const isbn=req.params.isbn
    res.send(books[isbn])
    //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    
    const author=req.params.author
    const filterByauthor = (author) => deepObjFilter (o => o.author === author)
    let filtered_byauthor=filterByauthor(author)(books)
    res.send(filtered_byauthor)
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title=req.params.title
    const filterBytitle = (title) => deepObjFilter (o => o.title === title)
    let filtered_bytitle=filterBytitle(title)(books)
    res.send(filtered_bytitle)
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn=req.params.isbn
    let book =books[isbn]
    let reviews=book['reviews']
    res.send(reviews)

  //Write your code here
  
});

module.exports.general = public_users;
