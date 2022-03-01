require('dotenv').config()
const path = require('path')

const express = require('express')
const app = express()

const {PORT} = process.env

app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})

app.use(express.static(path.join(__dirname, '../public')))

const {getContact, getAllContacts} = require('./controller.js')

// contact
app.get('/api/contact', getContact)

// contacts
app.get('/api/contacts', getAllContacts)

app.listen(PORT, () => { console.log(`Up on port ${PORT}`) })