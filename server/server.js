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

const {getContact, postContact, putContact, deleteContact, getAllContacts, getTypeArrays} = require('./controller.js')

// contact
app.get('/api/contact', getContact)
app.post('/api/contact/:id', postContact)
app.put('/api/contact/:id', putContact)
app.delete('/api/contact', deleteContact)

// contacts
app.get('/api/contacts', getAllContacts)

// setup
app.get('/api/typearrays', getTypeArrays)

app.listen(PORT, () => { console.log(`Up on port ${PORT}`) })