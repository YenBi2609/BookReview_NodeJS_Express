const express = require('express')
const router = express.Router();

let books = {
    "1": { author: "a", title: "a", review: {"1": {content: "a", user: "1"}}},
    "2": {author: "b", title: "b", review: {"2" : {content: "b", user: "2"}}},
}

// Get the book list 
router.get('/', (req, res) => {
    res.send(JSON.stringify(books, null, 4))
})

// Get the book base on ISBN
router.get("/isbn/:ISBN", (req, res) => {
    res.send(books[req.params.ISBN])
})

// Get the book base on Title
router.get("/title/:title", (req, res) => {
    for(let b of books){
        if(b.title == req.params.title){
            return res.send(b) 
        }
    }
    return res.send([])
})

// Get book Review base on ISBN
router.get("/book-review/:ISBN", (req, res) => {
    const book = books[req.params.ISBN];
    if(!book){
        return res.status(400).json({message: "The book does not exist"})
    }
    res.send(book.review)
})

// Add a book review
router.post("/review/:ISBN", (req, res) => {
    const isbn = req.params.ISBN;
    if(!books[isbn]){
        return res.status(400).send("The book does not exist")
    }
    const review = req.body.review
    if(review){
        const idReview = Data.now();
        books[isbn].review[idReview] = {
            content: review,
            user: req.session.user
        }
        res.send(`The book review ${idReview} added`)
    }
   res.status(400).send("Error add book review. Please check params")
})

// Update a book review
router.put("/review/:ISBN/:idReview", (req, res) => {
    const isbn = req.params.ISBN;
    if(!books[isbn]){
        return res.status(400).send("The book does not exist")
    }
    const newReview = req.body.review
    const review = books[isbn].review[req.params.idReview]
    if(review){
        if(review.user == req.session.user){
            books[isbn].review[req.params.idReview].content = newReview
            res.send("The book review updated")
        }else return res.status(400).send("You cannot modify review of other user")
    }
    return res.status(400).send("The review does not exist")
})

router.delete("/review/:ISBN/:idReview", (req, res) => {
    const isbn = req.params.ISBN;
    if(!books[isbn]){
        return res.status(400).send("The book does not exist")
    }
    const newReview = req.body.review
    const review = books[isbn].review[req.params.idReview]
    if(review){
        if(review.user == req.session.user){
            delete books[isbn].review[req.params.idReview]
            res.send("The book review deleted")
        }else return res.status(400).send("You cannot delete review of other user")
    }
    return res.status(400).send("The review does not exist")
})

module.exports = router;