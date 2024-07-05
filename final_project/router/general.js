const express = require('express');
const axios = require('axios').default;
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let datalink="https://raw.githubusercontent.com/OrnelieManz/expressBookReviews/main/final_project/router/booksdetails.json";
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

    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/', async(req, res) => {

    //get data from github repo
    const outcome=axios.get(datalink);
    let response=(await outcome).data;
    
    //send response
    res.send(response);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {

    const isbn=req.params.isbn
    
    //get data from github repo
    const outcome=axios.get(datalink);
    let response=(await outcome).data;
    
    //send response
    res.send(response[isbn]);
    
 });
  
// Get book details based on author
public_users.get('/author/:author', async (req, res)=> {
    
    const author=req.params.author
    const filterByauthor = (author) => deepObjFilter (o => o.author === author)

    //get data from github repo
    const outcome=axios.get(datalink);
    let response=(await outcome).data;

    //filter the books list by author
    let filtered_byauthor=filterByauthor(author)(response);
    //send response
    res.send(filtered_byauthor);
});

// Get all books based on title
public_users.get('/title/:title',async (req, res) =>{
    const title=req.params.title
    const filterBytitle = (title) => deepObjFilter (o => o.title === title)

    //get data from github repo
    const outcome=axios.get(datalink);
    let response=(await outcome).data;

    //filter the books list by title
    let filtered_bytitle=filterBytitle(title)(books);
    //send response
    res.send(filtered_bytitle);
  
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
