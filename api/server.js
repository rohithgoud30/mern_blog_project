import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
import { connectDB } from './db.js'
import { UserModel } from './models/userModel.js'
import { PostModel } from './models/postModel.js'
import cookieParser from 'cookie-parser'
const uploadMiddleware = multer({ dest: 'api/uploads/' })

dotenv.config()

connectDB()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)
app.use(cookieParser())
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/post/:id', async (req, res) => {
  res.send(
    await PostModel.findOne({ _id: req.params.id }).populate('author', [
      'username',
    ])
  )
})

app.get('/post', async (req, res) => {
  res.send(
    await PostModel.find()
      .populate('author', ['username'])
      .sort({ createdAt: -1 })
      .limit(20)
  )
})

app.put('/post', uploadMiddleware.single('file'), async (req, res) => {
  let newpath = null
  if (req.file) {
    const { originalname, path } = req.file
    newpath = path + '.' + originalname.split('.').at(-1)
    fs.renameSync(path, newpath)
  }

  const { token } = req.cookies
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { title, summary, content, id } = req.body
    const postData = await PostModel.findById(id)
    if (JSON.stringify(postData.author) === JSON.stringify(decoded.id)) {
      const updatedPost = await PostModel.findByIdAndUpdate(
        id,
        {
          title,
          summary,
          content,
          cover: newpath ?? postData.cover,
        },
        { new: true }
      )
      res.json(updatedPost)
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/post', uploadMiddleware.single('file'), async (req, res) => {
  const { token } = req.cookies
  const { originalname, path } = req.file
  const newpath = path + '.' + originalname.split('.').at(-1)
  fs.renameSync(path, newpath)

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, decoded) => {
    if (err) {
      res.status(500).json({ message: err.message })
    } else {
      try {
        const { title, summary, content } = req.body
        const newPost = await PostModel.create({
          title,
          summary,
          content,
          cover: newpath,
          author: decoded.id,
        })
        res.json(newPost)
      } catch (error) {
        res.status(500).json({ message: error.message })
      }
    }
  })
})

app.get('/logout', (req, res) => {
  res.cookie('token', '').send()
})

app.get('/user', (req, res) => {
  const { token } = req.cookies
  if (token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    res.send({ username: payload.username, id: payload._id })
  } else {
    res.sendStatus(200)
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await UserModel.findOne({ username })
    const passOk = await bcrypt.compare(password, user.password)
    if (passOk) {
      jwt.sign(
        { id: user._id, username },
        process.env.JWT_SECRET,
        (err, token) => {
          if (err) {
            res.status(500).json({ message: err.message })
          } else {
            res
              .status(200)
              .cookie('token', token)
              .send({ id: user._id, username })
          }
        }
      )
    } else {
      res.status(401).json({ message: 'Wrong Credentials' })
    }
  } catch (error) {
    res.status(500).json({ message: "User doesn't exits" })
  }
})

app.post('/register', async (req, res) => {
  const { username, password } = req.body
  try {
    const hashedPassword = await bcrypt.hash(password, 10)
    try {
      const newUser = await UserModel.create({
        username,
        password: hashedPassword,
      })
      res.status(201).json({ id: newUser._id, username })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`Server running on port ${port}...`)
})
