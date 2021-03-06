const express = require('express')
const router = express.Router()
const Author = require('../models/author')

// ALL Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !=='') {
        searchOptions.name = new RegExp(req.query.name,'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        //res.redirect('/')
        res.render('Authors/index', {
            authors : authors,
            searchOptions: req.query
        })
     } catch (error) {
         res.redirect('/')
     }
    
 })

// New Author Route
router.get('/new', (req, res) => {
    res.render('Authors/new', { author: new Author() })
})

//Creating new Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        //res.send(req.body.name)
        res.redirect('authors')

    } catch (err) {
        res.render('Authors/new', {
            author: author,
            errorMessage: 'Error creating Author'
        })
    }
})

module.exports = router