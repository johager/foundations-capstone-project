const userId = 1
console.log("userId:", userId)

const back = document.getElementById('back')
const title = document.getElementById('title')
const right = document.getElementById('right')
const main = document.querySelector('main')

//
// === nav ===
//

function goBack() {
    showAllContacts()
}

function addContact() {

}

//
// === contact ===
//

function showContactDisp(contactInfo) {

    const {fname, lname, company, note} = contactInfo[0]

    back.textContent = '< Contacts'
    // title.textContent = 'Contact'
    title.textContent = `${fname} ${lname}`
    right.textContent = 'Edit'

    // let innerHTML = `<div>${fname} ${lname}</div>`
    // let innerHTML = '<div class="cont_details">'
    let innerHTML = ''
    if (company.length > 0) {
        innerHTML += `\n<div>${company}</div>`
    }

    innerHTML += '\n<div class="cont_sect">Phone</div>'
    const {phone, type: pType} = contactInfo[1]
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">${pType}:</div><div>${phone}</div>`
    innerHTML += '\n</div>'

    innerHTML += '\n<div class="cont_sect">Email</div>'
    const {email, type: eType} = contactInfo[2]
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">${eType}:</div><div>${email}</div>`
    innerHTML += '\n</div>'

    innerHTML += '\n<div class="cont_sect">Address</div>'
    const {addr1, addr2, city, state, zip, type: aType} = contactInfo[3]
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">${aType}:</div><div>`
    if (addr1.length > 0) {
        innerHTML += `${addr1}<br>`
    }
    if (addr2.length > 0) {
        innerHTML += `${addr2}<br>`
    }
    innerHTML += `${city}, ${state} ${zip}</div>`
    innerHTML += '\n</div>'

    // for (let i = 1; i < contactInfo; i++) {}
    //     
    // }

    if (note.length > 0) {
        innerHTML += '\n<div class="cont_sect">Note</div>'
        innerHTML += `\n<div class="note">${note}</div>`
    }

    main.innerHTML = innerHTML
}

function showContact(contId) {
    console.log("showContact contId:", contId)
    axios.get(`/api/contact?id=${contId}`)
    .then(res => {
        console.log("showContact then res.data:", res.data)
        showContactDisp(res.data)
    })
    .catch(err => console.log(err))
}

//
// === contacts ===
//

function showContacts(contacts) {    
    back.textContent = ''
    title.textContent = 'Contacts'
    right.textContent = 'Add'
    main.innerHTML = ''
    for (let contact of contacts) {
        const {contact_id: contId, fname, lname} = contact
        console.log("showContacts contId:", contId, "fname:", fname, "lname:", lname)
        const p = document.createElement('p')
        p.id = contId
        p.textContent = `${lname}, ${fname}`
        p.addEventListener('click', clickedOnContact)
        main.appendChild(p)
    }
}

function clickedOnContact(evt) {
    console.log("clickedOnContact contId:", evt.target.id)
    showContact(evt.target.id)
}

function showAllContacts() {
    console.log("showAllContacts get userId:", userId)
    axios.get(`/api/contacts?id=${userId}`)
    .then(res => {
        console.log("showAllContacts then res.body:", res.data)
        showContacts(res.data)
    })
    .catch(err => console.log(err))
}

back.addEventListener('click', goBack)

showAllContacts(userId);