const express = require('express');
const router = express.Router();


const userController = require('../controllers/userController')
const bookController = require('../controllers/bookController')
const mid1=require('../middleware/tokenAuth')


//POST FOR USER
router.post('/register', userController.createUser)

//POST FOR LOGIN USER
router.post('/login', userController.loginUser)

//POST FOR BOOK
router.post('/books', mid1.mid1,bookController.createBook)

// get Book
router.get('/bookslist', mid1.mid1,bookController.getBook)

//grt books with all reviews
router.get("/Books/:bookId",mid1.mid1,bookController.getBookWithreview)

//update Book
router.put('/books/:bookId', mid1.mid1,bookController.updateBook)

router.delete('/books/:bookId', mid1.mid1,bookController.deleteById)

//add review

router.post('/books/:bookId/review',bookController.addReview)

//Update review
router.put('/books/:bookId/review/:reviewId',bookController.updateReview)

//fdlkjf
// router.post('/check/:id',bookController.check)



//delete
router.delete('/books/:bookId/review/:reviewId',bookController.deleteReview)

//aws api 
router.post("/write-file-aws", bookController.getFileData)
//
router.post("/addBookCover", bookController.addBookCover)






module.exports = router;