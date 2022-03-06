let userId = -1
console.log("userId:", userId)

let contId = 0
let contactInfo = []

const pTypes = []
const eTypes = []
const aTypes = []

const title = document.getElementById('title')
const leftNav = document.getElementById('left')
const rightNav = document.getElementById('right')
const content = document.querySelector('.content')

const loginAside = document.querySelector('aside')
const loginBtn = document.getElementById('login_btn')
const signUpLink = document.querySelector('form').querySelector('a')

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
// === login ===
//

function setLoginAside(innerHTML) {
    console.log("setLoginAside(innerHTML) === === ===")
    loginAside.style.visibility = 'visible'
    loginAside.innerHTML = innerHTML
}

function clearLoginAside() {
    loginAside.style.visibility = 'hidden'
    loginAside.textContent = ''
}

function getLoginInputs() {
    return document.querySelectorAll('input')
}

function doLogin(name) {
    console.log("doLogin(name) === === ===")
    console.log("doLogin name:", name)

    clearLoginAside()

    const inputs = document.querySelectorAll('input')
    for (let input of inputs) {
        input.value = ''
    }

    inputs[0].style.visibility = 'hidden'
    inputs[3].style.display = 'none'
    loginBtn.textContent = 'Login'
    signUpLink.style.display = 'inline'

    document.getElementById('login_view').style.display = 'none'

    document.querySelector('.top_header').firstChild.innerHTML = `Welcome, ${name}<span>|</span><button id="logout">Logout</button>`
    document.getElementById('logout').addEventListener('click', handleLogout)

    showAllContacts()
    getTypeArrays()
}

function handleCreateUser(inputs) {
    console.log("handleCreateUser() === === ===")

    if (inputs.passwd != inputs.passwd2) {
        setLoginAside(`The passwords don't match.<br>Please try again.`)
        return
    }

    clearLoginAside()

    delete inputs.passwd2

    axios.post(`/api/createuser`, inputs)
    .then(res => {
        console.log("handleLogin then res.data:", res.data)
        if(res.data.userId < 0) {
            console.log("handleCreateUser - exist")
            loginAside.style.visibility = 'visible'
            loginAside.innerHTML = `An account already exists for that email.`
        } else {
            console.log("handleCreateUser - user exists")
            userId = res.data.userId
            console.log("handleCreateUser userId:", userId)
            doLogin(res.data.name)
        }
    })
    .catch(err => console.log(err))
}

function handleLogin(inputs) {
    console.log("handleLogin() === === ===")

    delete inputs.name
    delete inputs.passwd2
    console.log("handleLoginButton inputs:", inputs)
    
    axios.post(`/api/checkuser`, inputs)
    .then(res => {
        console.log("handleLogin then res.data:", res.data)
        if(res.data.userId < 0) {
            console.log("handleLoginButton - user doesn't exist")
            setLoginAside(`That login is incorrect.<br>Please try again.`)
        } else {
            console.log("handleLoginButton - user exists")
            userId = res.data.userId
            console.log("handleLoginButton userId:", userId)
            doLogin(res.data.name)
        }
    })
    .catch(err => console.log(err))
}

function handleLoginButton(evt) {
    console.log("handleLoginButton(evt) === === ===")
    evt.preventDefault()

    clearLoginAside()
    
    const inputs = {}
    
    for (let input of getLoginInputs()) {
        inputs[input.name] = input.value
    }
    console.log("handleLoginButton inputs:", inputs)
    
    if (evt.target.textContent === 'Login') {
        handleLogin(inputs)
    } else {
        handleCreateUser(inputs)
    }
}

function handleSignUpLink(evt) {
    console.log("handleSignUpLink(evt) === === ===")
    clearLoginAside()
    const inputs = getLoginInputs()
    inputs[0].style.visibility = 'visible'
    inputs[3].style.display = 'block'
    loginBtn.textContent = 'Create Account'
    signUpLink.style.display = 'none'
}

//
// === logout ===
//

function handleLogout(evt) {
    console.log("handleLogout(evt) === === ===")

    userId = -1
    contId = 0
    contactInfo = []

    document.getElementById('login_view').style.display = 'block'
    document.querySelector('.top_header').firstChild.innerHTML = ''
    content.innerHTML = ''
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
    document.getElementsByName('ptype_id').forEach(ele => pTypeIds.push(+ele.value))
    const eTypeIds = []
    document.getElementsByName('etype_id').forEach(ele => eTypeIds.push(+ele.value))
    const aTypeIds = []
    document.getElementsByName('atype_id').forEach(ele => aTypeIds.push(+ele.value))

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

    emails.shift()  // remove the login email

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
    document.getElementsByName('phone_id').forEach(ele => phoneIds.push(+ele.value))
    const emailIds = []
    document.getElementsByName('email_id').forEach(ele => emailIds.push(+ele.value))
    const addrIds = []
    document.getElementsByName('addr_id').forEach(ele => addrIds.push(+ele.value))

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
    // display phones
    let isFirst = true
    while (contactInfo.length > i && "phone" in contactInfo[i]) {
        if (isFirst) {
            innerHTML += '\n<div class="cont_sect">Phone</div>'
            isFirst = false
        }
        const {phone, type: pType} = contactInfo[i]
        const pHref = phone.replace(/[^0-9.]/g, '')
        innerHTML += '\n<div class="cont_details">'
        innerHTML += `\n<div class="type">${pType}</div><div><a href="tel:${pHref}">${phone}</a></div>`
        innerHTML += '\n</div>'
        i++
    }
    
    // display emails
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
    
    // display addrs
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

    // display note
    if (note.length > 0) {
        innerHTML += '\n<div class="cont_sect">Note</div>'
        innerHTML += `\n<div class="note">${note}</div>`
    }

    content.innerHTML = innerHTML
}

function makeSelect(name, types, typeId) {
    let innerHTML = `<select name="${name}">\n`
    if (typeId === 0) {
        innerHTML += '<option value="0">&ndash; type &mdash;</option>\n'
    } else {
        innerHTML += '<option value="0">&ndash; delete &mdash;</option>\n'
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
    innerHTML += `\n<div class="type_edit">${makeSelect('ptype_id', pTypes, pTypeId)}</div><input type="text" class="data" name="phone" placeholder="phone" value="${phone}">`
    innerHTML += '\n</div>'
    return innerHTML
}

function makeEmailItem(emailId,email,eTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="email_id" value="${emailId}">`
    innerHTML += `\n<div class="type_edit">${makeSelect('etype_id', eTypes, eTypeId)}</div><input type="email" class="data" name="email" placeholder="email" value="${email}">`
    innerHTML += '\n</div>'
    return innerHTML
}

function makeAddrItem(addrId,addr1,addr2,city,state,zip,aTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="addr_id" value="${addrId}">`
    innerHTML += `\n<div class="type_edit">${makeSelect('atype_id', aTypes, aTypeId)}</div><div>`
    innerHTML += `\n<input type="text" class="data" name="addr1" placeholder="street" value="${addr1}"><br>`
    innerHTML += `\n<input type="text" class="data" name="addr2" placeholder="street" value="${addr2}"><br>`
    innerHTML += `\n<input type="text" class="data" name="city" placeholder="city" value="${city}"><br>`
    innerHTML +=  `\n<input type="text" class="state" name="state" placeholder="state" value="${state}"><br>`
    innerHTML += `\n<input type="text" class="zip" name="zip" placeholder="zip" value="${zip}"></div>`
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
    innerHTML += `\n<div class="type_edit">first</div><input type="text" class="data" name="fname" placeholder="first" value="${fname}">`
    innerHTML += '\n</div>'
    innerHTML += '\n<div class="cont_details">'
    innerHTML += `\n<div class="type_edit">last</div><input type="text" class="data" name="lname" placeholder="last" value="${lname}">`
    innerHTML += '\n</div>'

    if (company.length > 0) {
        innerHTML += `\n<div>${company}</div>`
    }

    let i = 1
    console.log("look for phone, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect_edit">Phone</div>'
    while (contactInfo.length > i && "phone" in contactInfo[i]) {
        const {phone_id: phoneId, phone, type_id: pTypeId} = contactInfo[1]
        innerHTML += makePhoneItem(phoneId,phone,pTypeId)
        i++
    }
    innerHTML += makePhoneItem(0,'',0)
    
    console.log("look for email, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect_edit">Email</div>'
    while (contactInfo.length > i && "email" in contactInfo[i]) {
        const {email_id: emailId, email, type_id: eTypeId} = contactInfo[i]
        innerHTML += makeEmailItem(emailId,email,eTypeId)
        i++
    }
    innerHTML += makeEmailItem(0,'',0)
    
    console.log("look for addr1, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect_edit">Address</div>'
    while (contactInfo.length > i && "addr1" in contactInfo[i]) {
        const {address_id: addrId, addr1, addr2, city, state, zip, type_id: aTypeId} = contactInfo[i]
        innerHTML += makeAddrItem(addrId,addr1,addr2,city,state,zip,aTypeId)
        i++
    }
    innerHTML += makeAddrItem(0,'','','','','',0)

    innerHTML += '\n<div class="cont_sect_edit">Note</div>'
    innerHTML += `\n<div class="textarea"><textarea rows="10" name="note" placeholder="note">${note}</textarea></div>`

    content.innerHTML = innerHTML
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

    content.innerHTML = ''
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
        content.appendChild(div)
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
    // content.innerHTML = 'Contacts'
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

loginBtn.addEventListener('click', handleLoginButton)
signUpLink.addEventListener('click', handleSignUpLink)

leftNav.addEventListener('click', doLeftNavAction)
rightNav.addEventListener('click', doRightNavAction)

if (userId > 0 ) {
    doLogin('James')
}
// showAllContacts()
// getTypeArrays()