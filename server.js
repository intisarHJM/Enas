const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])

require("dotenv").config()
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const session = require("express-session")
const mongoose = require("mongoose")
const { MongoStore } = require("connect-mongo")
const path = require("path")

const PORT = process.env.PORT ? process.env.PORT : 3000

const app = express()

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err)
})
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err)
})

async function start() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is missing. Check that your .env file is in the project root.")
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log("Connected to MongoDB:", mongoose.connection.name)
  } catch (err) {
    console.error("MongoDB connection failed:")
    console.error(err)
    process.exit(1)
  }

  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  app.use(express.static(path.join(__dirname, "public")))
  app.use(morgan("dev"))
  app.use(methodOverride("_method"))
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: MongoStore.create({
        client: mongoose.connection.getClient(),
      }),
    })
  )

  app.get("/", (req, res) => {
    res.send("Enas Game is open! Yalla, let the challenge begin ✨ . . . ")
  })

  app.listen(PORT, () => {
    console.log(`Enas Game is live on Port ${PORT}. Get ready for the questions 😉. . .`)
  })
}

start()