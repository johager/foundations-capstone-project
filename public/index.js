const userId = 1
console.log("userId:", userId)

let contId = 0
let contactInfo = []

const pTypes = []
const eTypes = []
const aTypes = []

const title = document.getElementById('title')
const leftNav = document.getElementById('left')
const rightNav = document.getElementById('right')
const main = document.querySelector('main')

//
// === nav ===
//

let leftNavAction = () => {}
let rightNavAction = () => {}

function doLeftNavAction(evt) {
    console.log("doLeftNavAction() === === ===")
    leftNavAction()
}

function doRightNavAction(evt) {
    console.log("doRightNavAction() === === ===")
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

function contactObjForAdd() {

    const pTypeIds = []
    document.getElementsByName('ptype_id').forEach(ele => pTypeIds.push(ele.value))
    const eTypeIds = []
    document.getElementsByName('etype_id').forEach(ele => eTypeIds.push(ele.value))
    const aTypeIds = []
    document.getElementsByName('atype_id').forEach(ele => aTypeIds.push(ele.value))

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
        pTypeIds: pTypeIds,
        phones: phones,
        eTypeIds: eTypeIds,
        emails: emails,
        aTypeIds: aTypeIds,
        addr1s: addr1s,
        addr2s: addr2s,
        cities: cities,
        states: states,
        zips: zips        
    }

    return contactObj
}

function addContact() {
    console.log("addContact() === === ===")

    const contactObj = contactObjForAdd()

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

    const contactObj = contactObjForAdd()

    const phoneIds = []
    document.getElementsByName('phone_id').forEach(ele => phoneIds.push(ele.value))
    const emailIds = []
    document.getElementsByName('email_id').forEach(ele => emailIds.push(ele.value))
    const addrIds = []
    document.getElementsByName('addr_id').forEach(ele => addrIds.push(ele.value))

    contactObj.phoneIds = phoneIds
    contactObj.emailIds = emailIds
    contactObj.addrIds = addrIds

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

    const {fname, lname, company} = contactInfo[0]
    const note = contactInfo[0].note.replace(/(?:\r\n|\r|\n)/g, '<br>')

    title.textContent = `${fname} ${lname}`
    leftNav.textContent = '< Contacts'
    rightNav.textContent = 'Edit'

    leftNavAction = showAllContacts
    rightNavAction = showEditContact

    let innerHTML = ''
    if (company.length > 0) {
        innerHTML += `\n<div>${company}</div>`
    }

    let i = 1
    let isFirst = true
    while (contactInfo.length > i && "phone" in contactInfo[i]) {
        if (isFirst) {
            innerHTML += '\n<div class="cont_sect">Phone</div>'
            isFirst = false
        }
        const {phone, type: pType} = contactInfo[i]
        innerHTML += '\n<div class="cont_details">'
        innerHTML += `\n<div class="type">${pType}</div><div>${phone}</div>`
        innerHTML += '\n</div>'
        i++
    }
    
    isFirst = true
    while (contactInfo.length > i && "email" in contactInfo[i]) {
        if (isFirst) {
            innerHTML += '\n<div class="cont_sect">Email</div>'
            isFirst = false
        }
        const {email, type: eType} = contactInfo[i]
        innerHTML += '\n<div class="cont_details">'
        innerHTML += `\n<div class="type">${eType}</div><div><a href="mailto:${email}">${email}</a></div>`
        innerHTML += '\n</div>'
        i++
    }
    
    isFirst = true
    while (contactInfo.length > i && "addr1" in contactInfo[i]) {
        if (isFirst) {
            innerHTML += '\n<div class="cont_sect">Address</div>'
            isFirst = false
        }
        const {addr1, addr2, city, state, zip, type: aType} = contactInfo[i]
        innerHTML += '\n<div class="cont_details">'
        
        let addrHref = ''
        let addrInnerHTML = ''
        if (addr1.length > 0) {
            addrHref += addr1
            addrInnerHTML += `${addr1}<br>`
        }
        if (addr2.length > 0) {
            if (addrHref.length > 0) {
                addrHref += ', '
            }
            addrHref += addr2
            addrInnerHTML += `${addr2}<br>`
        }
        if (city.length > 0) {
            if (addrHref.length > 0) {
                addrHref += ', '
            }
            addrHref += city
            addrInnerHTML += city
            if (state.length > 0 || zip.length > 0) {
                addrInnerHTML += ', '
            }
        }
        if (state.length > 0) {
            if (addrHref.length > 0) {
                addrHref += ', '
            }
            addrHref += state
            addrInnerHTML += state
            if (zip.length > 0) {
                addrInnerHTML += ' '
            }
        }
        if (zip.length > 0) {
            if (addrHref.length > 0) {
                addrHref += ' '
            }
            addrHref += zip
            addrInnerHTML += zip
        }
        innerHTML += `\n<div class="type">${aType}</div><div><a href="https://www.google.com/maps/place/${addrHref}">${addrInnerHTML}</a></div>`
        innerHTML += '\n</div>'
        i++
    }

    if (note.length > 0) {
        innerHTML += '\n<div class="cont_sect">Note</div>'
        innerHTML += `\n<div class="note">${note}</div>`
    }

    main.innerHTML = innerHTML
}

function makeSelect(name, types, typeId) {
    let innerHTML = `<select name="${name}">\n`
    if (typeId === 0) {
        innerHTML += '<option value="0">- type -</option>\n'
    } else {
        innerHTML += '<option value="0">- delete -</option>\n'
    }
    for (let type of types) {
        innerHTML += `<option value="${type.id}"`
        if (type.id === typeId) {
            innerHTML += ' selected="selected"'
        }
        innerHTML += `>${type.type}</option>\n`
    }
    innerHTML += '</select>'
    return innerHTML
}

function makePhoneItem(phoneId,phone,pTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="phone_id" value="${phoneId}">`
    innerHTML += `\n<div class="type">${makeSelect('ptype_id', pTypes, pTypeId)}</div><input type="text" class="data" name="phone" placeholder="phone" value="${phone}">`
    innerHTML += '\n</div>'
    return innerHTML
}

function makeEmailItem(emailId,email,eTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="email_id" value="${emailId}">`
    innerHTML += `\n<div class="type">${makeSelect('etype_id', eTypes, eTypeId)}</div><input type="email" class="data" name="email" placeholder="email" value="${email}">`
    innerHTML += '\n</div>'
    return innerHTML
}

function makeAddrItem(addrId,addr1,addr2,city,state,zip,aTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="addr_id" value="${addrId}">`
    innerHTML += `\n<div class="type">${makeSelect('atype_id', aTypes, aTypeId)}</div><div>`
    innerHTML += `\n<input type="text" class="data" name="addr1" placeholder="street" value="${addr1}"><br>`
    innerHTML += `\n<input type="text" class="data" name="addr2" placeholder="street" value="${addr2}"><br>`

    innerHTML += `\n<input type="text" class="city" name="city" placeholder="city" value="${city}">, <input type="text" class="state" name="state" placeholder="state" value="${state}"> <input type="text" class="zip" name="zip" placeholder="zip" value="${zip}"></div>`
    innerHTML += '\n</div>'
    return innerHTML
}

function showContactAddEdit(titleText) {
    console.log("showContactAddEdit() === === ===")

    const {fname, lname, company, note} = contactInfo[0]

    title.textContent = titleText
    leftNav.textContent = 'Cancel'
    rightNav.textContent = 'Save'

    let innerHTML = ''

    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">first</div><input type="text" class="data" name="fname" placeholder="first" value="${fname}">`
    innerHTML += '\n</div>'
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type">last</div><input type="text" class="data" name="lname" placeholder="last" value="${lname}">`
    innerHTML += '\n</div>'

    if (company.length > 0) {
        innerHTML += `\n<div>${company}</div>`
    }

    let i = 1
    console.log("look for phone, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect">Phone</div>'
    while (contactInfo.length > i && "phone" in contactInfo[i]) {
        const {phone_id: phoneId, phone, type_id: pTypeId} = contactInfo[1]
        innerHTML += makePhoneItem(phoneId,phone,pTypeId)
        i++
    }
    innerHTML += makePhoneItem(0,'',0)
    
    console.log("look for email, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect">Email</div>'
    while (contactInfo.length > i && "email" in contactInfo[i]) {
        const {email_id: emailId, email, type_id: eTypeId} = contactInfo[i]
        innerHTML += makeEmailItem(emailId,email,eTypeId)
        i++
    }
    innerHTML += makeEmailItem(0,'',0)
    
    console.log("look for addr1, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect">Address</div>'
    while (contactInfo.length > i && "addr1" in contactInfo[i]) {
        const {address_id: addrId, addr1, addr2, city, state, zip, type_id: aTypeId} = contactInfo[i]
        innerHTML += makeAddrItem(addrId,addr1,addr2,city,state,zip,aTypeId)
        i++
    }
    innerHTML += makeAddrItem(0,'','','','','',0)

    // for (let i = 1; i < contactInfo; i++) {}
    //     
    // }

    innerHTML += '\n<div class="cont_sect">Note</div>'
    innerHTML += `\n<textarea rows="10" name="note" placeholder="note">${note}</textarea>`

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
        span.classList = "hover"
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

//
// === set up ===
///

function setTypeArrays(typeObjs) {
    console.log("setTypeArrays()")
    // typeObjs is an array of objects like {id:, type:}
    // id is 1 for the first object of each type

    const types = [pTypes, eTypes, aTypes]
    let typeIndex = -1
    let type = []
    for (let typeObj of typeObjs) {
        if (typeObj.id === 1) {
            typeIndex++
            type = types[typeIndex]
        }
        type.push(typeObj)
    }
    console.log("setTypeArrays pTypes:", pTypes)
    console.log("setTypeArrays eTypes:", eTypes)
    console.log("setTypeArrays aTypes:", aTypes)
}

function getTypeArrays() {
    console.log("getTypeArrays()")
    axios.get(`/api/typearrays`)
    .then(res => {
        console.log("getTypeArrays then res.body:", res.data)
        setTypeArrays(res.data)
    })
    .catch(err => console.log(err))
}

leftNav.addEventListener('click', doLeftNavAction)
rightNav.addEventListener('click', doRightNavAction)

showAllContacts()
getTypeArrays()