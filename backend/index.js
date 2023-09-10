import express from 'express'
import mongoose from 'mongoose'
import { PORT, mongoDBURL } from './config.js'
import { Book } from './models/bookModel.js'

const app = express()

// Middleware for parsing request body
app.use(express.json())

app.get('/', (req, res) => {
  console.log(req)
  return res.status(234).send('Hello World!')
})

// Route for Save a new Book
app.post('/books', async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      })
    }

    const newBook = {
      title: req.body.title,
      author: req.body.author,
      publishYear: req.body.publishYear,
    }

    const book = await Book.create(newBook)

    return res.status(201).send(book)
  } catch (error) {
    console.log(error)
    response.status(500).send({ message: error.message })
  }
})

// Route for Get All Books from DB
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find({})

    return res.status(200).json({
      count: books.length,
      data: books,
    })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }
})

// Route for Update a Book
app.put('/books/:id', async (req, res) => {
  try {
    if (!req.body.title || !req.body.author || !req.body.publishYear) {
      return res.status(400).send({
        message: 'Send all required fields: title, author, publishYear',
      })
    }

    const { id } = req.params

    const result = await Book.findByIdAndUpdate(id, req.body)

    if (!result) {
      return res.status(404).json({ message: 'Book not found' })
    }

    return res.status(200).send({ message: 'Book updated successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error.message })
  }
})

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.log(error)
  })
