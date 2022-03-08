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

const {createUser, checkUser, getContact, addContact, editContact, deleteContact, getContacts, getGroups, addGroup, getTypeArrays} = require('./controller.js')

// login
app.post('/api/createuser', createUser)
app.post('/api/checkuser', checkUser)

// contact
app.get('/api/contact', getContact)
app.post('/api/contact/:id', addContact)
app.put('/api/contact/:id', editContact)
app.delete('/api/contact', deleteContact)

// contacts
app.get('/api/contacts', getContacts)

// groups
app.get('/api/groups', getGroups)
app.post('/api/group/:id', addGroup)

// setup
app.get('/api/typearrays', getTypeArrays)

app.listen(PORT, () => { console.log(`Up on port ${PORT}`) })