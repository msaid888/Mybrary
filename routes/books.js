const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif','image/jpg']
const uploadPath = path.join('public', Book.coverImageBasePath)
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

// ALL Books Route
router.get('/', async (req, res) => {
    res.send('All Books')
})

// New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book(), false)
})

//Creating new Book
router.post('/',  upload.single('cover'), async (req, res) => { 
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate),
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })
    console.log('book:',book)
    try {
        const newBook = await book.save()
        // res.redirect(`Books/${newBook.id}`)
        //res.send(req.body.title)
        res.redirect('books')
    } catch {
        renderNewPage(res, book, true)
    }
})

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        console.log('hasError:',hasError)
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('Books/new', params)
    } catch {
        res.redirect('books')
    }
}

module.exports = router