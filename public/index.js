const userId = 1
console.log("userId:", userId)

let contId = 0
let contactInfo = []

const title = document.getElementById('title')
const leftNav = document.getElementById('back')
const rightNav = document.getElementById('right')
const main = document.querySelector('main')

//
// === nav ===
//

let leftNavAction = () => {}
let rightNavAction = () => {}

function doLeftNavAction(evt) {
    console.log("doLeftNavAction() === === ===")
    evt.preventDefault()
    leftNavAction()
}

function doRightNavAction(evt) {
    console.log("doRightNavAction() === === ===")
    evt.preventDefault()
    rightNavAction()
}

//
// === contact ===
//

function showContact(contactInfoIn) {
    console.log("showContact(contactInfoIn) === === ===")
    contactInfo = contactInfoIn
    showContactDisp()
}

function showNewContact() {
    console.log("showContact(contactInfoIn) === === ===")
    contactInfo = [
        {
            company: '',
            fname: '',
            lname: '',
            note: ''
        },
        {
            phone: '',
            phone_id: 0,
            type: 'mobile',
            type_id: 1
        },
        {
            email: '',
            email_id: 0,
            type: 'home',
            type_id: 1
        },
        {
            addr1: '',
            addr2: '',
            address_id: 0,
            city: '',
            state: '',
            type: 'home',
            type_id: 1,
            zip: ''
        }
    ]
    leftNavAction = showAllContacts
    rightNavAction = addContact
    showContactAddEdit('Add')
}

function showEditContact() {
    leftNavAction = showContactDisp
    rightNavAction = updateContact
    showContactAddEdit('Edit')
}

function addContact() {
    console.log("addContact() === === ===")

    const phones = []
    document.getElementsByName('phone').forEach(ele => phones.push(ele.value.trim()))
    const emails = []
    document.getElementsByName('email').forEach(ele => emails.push(ele.value.trim()))
    const addr1s = []
    document.getElementsByName('addr1').forEach(ele => addr1s.push(ele.value.trim()))
    const addr2s = []
    document.getElementsByName('addr2').forEach(ele => addr2s.push(ele.value.trim()))
    const cities = []
    document.getElementsByName('city').forEach(ele => cities.push(ele.value.trim()))
    const states = []
    document.getElementsByName('state').forEach(ele => states.push(ele.value.trim()))
    const zips = []
    document.getElementsByName('zip').forEach(ele => zips.push(ele.value.trim()))

    const contactObj = {
        fname: document.getElementsByName('fname')[0].value.trim(),
        lname: document.getElementsByName('lname')[0].value.trim(),
        note: document.getElementsByName('note')[0].value.trim(),
        phones: phones,
        emails: emails,
        addr1s: addr1s,
        addr2s: addr2s,
        cities: cities,
        states: states,
        zips: zips        
    }

    console.log("addContact contactObj:", contactObj)

    axios.post(`/api/contact/${userId}`, contactObj)
    .then(res => {
        console.log("addContact then res.body:", res.data)
        showContact(res.data)
    })
    .catch(err => console.log(err))
}

function updateContact() {
    console.log("updateContact() === === ===")

    const phoneIds = []
    document.getElementsByName('phone_id').forEach(ele => phoneIds.push(ele.value))
    const emailIds = []
    document.getElementsByName('email_id').forEach(ele => emailIds.push(ele.value))
    const addrIds = []
    document.getElementsByName('addr_id').forEach(ele => addrIds.push(ele.value))

    const phones = []
    document.getElementsByName('phone').forEach(ele => phones.push(ele.value.trim()))
    const emails = []
    document.getElementsByName('email').forEach(ele => emails.push(ele.value.trim()))
    const addr1s = []
    document.getElementsByName('addr1').forEach(ele => addr1s.push(ele.value.trim()))
    const addr2s = []
    document.getElementsByName('addr2').forEach(ele => addr2s.push(ele.value.trim()))
    const cities = []
    document.getElementsByName('city').forEach(ele => cities.push(ele.value.trim()))
    const states = []
    document.getElementsByName('state').forEach(ele => states.push(ele.value.trim()))
    const zips = []
    document.getElementsByName('zip').forEach(ele => zips.push(ele.value.trim()))

    const contactObj = {
        fname: document.getElementsByName('fname')[0].value.trim(),
        lname: document.getElementsByName('lname')[0].value.trim(),
        note: document.getElementsByName('note')[0].value.trim(),
        phoneIds: phoneIds,
        phones: phones,
        emailIds: emailIds,
        emails: emails,
        addrIds: addrIds,
        addr1s: addr1s,
        addr2s: addr2s,
        cities: cities,
        states: states,
        zips: zips        
    }

    console.log("updateContact contactObj:", contactObj)

    axios.put(`/api/contact/${contId}`, contactObj)
    .then(res => {
        console.log("updateContact then res.body:", res.data)
        showContact(res.data)
    })
    .catch(err => console.log(err))
}

function showContactDisp() {
    console.log("showContactDisp() === === ===")

    const {fname, lname, company, note} = contactInfo[0]

    // title.textContent = 'Contact'
    title.textContent = `${fname} ${lname}`
    leftNav.textContent = '< Contacts'
    rightNav.textContent = 'Edit'

    leftNavAction = showAllContacts
    rightNavAction = showEditContact

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

function showContactAddEdit(titleText) {
    console.log("showContactAddEdit() === === ===")

    const {fname, lname, company, note} = contactInfo[0]

    title.textContent = titleText
    leftNav.textContent = 'Cancel'
    rightNav.textContent = 'Save'

    // let innerHTML = `<div>${fname} ${lname}</div>`
    // let innerHTML = '<div class="cont_details">'
    let innerHTML = ''

    // title.textContent = `${fname} ${lname}`
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">first:</div><input type="text" class="data" name="fname" value="${fname}">`
    innerHTML += '\n</div>'
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">last:</div><input type="text" class="data" name="lname" value="${lname}">`
    innerHTML += '\n</div>'

    if (company.length > 0) {
        innerHTML += `\n<div>${company}</div>`
    }

    innerHTML += '\n<div class="cont_sect">Phone</div>'
    const {phone_id: phoneId, phone, type: pType} = contactInfo[1]
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="phone_id" value="${phoneId}">`
    innerHTML += `\n<div class="type">${pType}:</div><input type="text" class="data" name="phone" value="${phone}">`
    innerHTML += '\n</div>'

    innerHTML += '\n<div class="cont_sect">Email</div>'
    const {email_id: emailId, email, type: eType} = contactInfo[2]
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="email_id" value="${emailId}">`
    innerHTML += `\n<div class="type">${eType}:</div><input type="email" class="data" name="email" value="${email}">`
    innerHTML += '\n</div>'

    innerHTML += '\n<div class="cont_sect">Address</div>'
    const {address_id: addrId, addr1, addr2, city, state, zip, type: aType} = contactInfo[3]
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="addr_id" value="${addrId}">`
    innerHTML += `\n<div class="type">${aType}:</div><div>`
    innerHTML += `\n<input type="text" class="data" name="addr1" value="${addr1}"><br>`
    innerHTML += `\n<input type="text" class="data" name="addr2" value="${addr2}"><br>`

    innerHTML += `\n<input type="text" class="city" name="city" value="${city}">, <input type="text" class="state" name="state" value="${state}"> <input type="text" class="zip" name="zip" value="${zip}"></div>`
    innerHTML += '\n</div>'

    // for (let i = 1; i < contactInfo; i++) {}
    //     
    // }

    innerHTML += '\n<div class="cont_sect">Note</div>'
    innerHTML += `\n<textarea rows="10" name="note">${note}</textarea>`

    main.innerHTML = innerHTML
}

function getContact() {
    console.log("showContact(contId) === === ===")
    console.log("showContact contId:", contId)
    axios.get(`/api/contact?id=${contId}`)
    .then(res => {
        console.log("showContact then res.data:", res.data)
        showContact(res.data)
    })
    .catch(err => console.log(err))
}

//
// === contacts ===
//

function showContacts(contacts) {    
    console.log("showContacts(contacts) === === ===")
    title.textContent = 'Contacts'
    leftNav.textContent = ''
    rightNav.textContent = 'Add'

    rightNavAction = showNewContact

    main.innerHTML = ''
    for (let contact of contacts) {
        const {contact_id: contId, fname, lname} = contact
        console.log("showContacts contId:", contId, "fname:", fname, "lname:", lname)
        const div = document.createElement('div')
        const span = document.createElement('span')
        span.id = contId
        span.textContent = `${lname}, ${fname}`
        span.addEventListener('click', clickedOnContact)
        div.appendChild(span)
        const delBtn = document.createElement('button')
        delBtn.textContent = 'X'
        delBtn.className = 'del_btn'
        delBtn.id = contId
        delBtn.addEventListener('click', delContact)
        div.appendChild(delBtn)
        main.appendChild(div)
    }
}

function clickedOnContact(evt) {
    contId = evt.target.id
    console.log("clickedOnContact contId:", contId)
    getContact()
}

function delContact(evt) {
    console.log("delContact contId:", evt.target.id)
    axios.delete(`/api/contact?cont_id=${evt.target.id}&user_id=${userId}`)
    .then(res => {
        console.log("delContact then res.body:", res.data)
        showContacts(res.data)
    })
    .catch(err => console.log(err))
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

leftNav.addEventListener('click', doLeftNavAction)
rightNav.addEventListener('click', doRightNavAction)

showAllContacts();