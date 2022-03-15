let mainHeaderIsBig = true
let shouldShowContactView = true
let isShowingContactDisp = false

let userId = -1
console.log("userId:", userId)

let groupIdDisplayed = 0
let groups = []

let contacts = []

// let getContactsCount = 0

let contId = -1
// let contId = 78
let contactInfo = []
let contactInfoDisplayed = []

let fNameDisp = ''
let lNameDisp = ''
let shouldGetContacts = false

const pTypes = []
const eTypes = []
const aTypes = []

let pSelect = null  // phone-type select element
let eSelect = null  // email-type select element
let aSelect = null  // addr-type select element

const mainHeader = document.querySelector('.mainheader')

const loginBtn = document.getElementById('login_btn')
const signUpLink = document.querySelector('form').querySelector('a')

const loginView = document.getElementById('login_view')
const contactsView = document.getElementById('contacts_view')
const contactView = document.getElementById('contact_view')

const contactsLeftNav = document.getElementById('contacts_left_nav')
const contactsRightNav = document.getElementById('contacts_right_nav')

const contactLeftNav = document.getElementById('contact_left_nav')
const contactRightNav = document.getElementById('contact_right_nav')

const groupSelect = document.getElementById('groups')
const groupAssignSelect = document.getElementById('group_assign')

const contactsContent = document.getElementById('contacts_content')
const contactContent = document.getElementById('contact_content')

// console.log("   loginView.style:", loginView.style)
// console.log("contactsView.style:", contactsView.style)
// console.log(" contactView.style:", contactView.style)

// console.log(`   loginView.style.display: '${loginView.style.display}'`)
// console.log(`contactsView.style.display: '${contactsView.style.display}'`)
// console.log(` contactView.style.display: '${contactView.style.display}'`)

//
// === misc ===
//

function clearTSelects() {
    pSelect = null
    eSelect = null
    aSelect = null
}

//
// === view size ===
//

function setMainHeaderIsBig() {
    mainHeaderIsBig = mainHeader.offsetWidth > 600
    console.log(`setMainHeaderIsBig: ${mainHeaderIsBig}`)
}

function isMainHeaderBig() {
    return mainHeader.offsetWidth > 600
}

function handleWindowResize(evt) {
    console.log(`handleWindowResize mainHeader.offsetWidth: ${mainHeader.offsetWidth}`)

    const mainHeaderIsNowBig = isMainHeaderBig()

    if (mainHeaderIsNowBig === mainHeaderIsBig) {
        console.log(`handleWindowResize - same`)
        return
    }

    console.log(`handleWindowResize - change`)

    mainHeaderIsBig = mainHeaderIsNowBig

    if (userId < 0) {
        return
    }

    if (mainHeaderIsNowBig) {
        showContactsView()
        showContactView()
        if (isShowingContactDisp) {
            contactLeftNav.textContent = ''
        }
    } else {
        if (shouldShowContactView) {
            hideContactsView()
            showContactView()
            if (isShowingContactDisp) {
                contactLeftNav.textContent = '< Contacts'
            }
        } else {
            showContactsView()
            hideContactView()
        }
    }
}

//
// === nav ===
//

let contactsLeftNavAction = () => {}

let contactLeftNavAction = () => {}
let contactRightNavAction = () => {}

function doContactsLeftNavAction(evt) {
    console.log("doContactsLeftNavAction() === === ===")
    contactsLeftNavAction()
}

function doContactLeftNavAction(evt) {
    console.log("doContactLeftNavAction() === === ===")
    contactLeftNavAction()
}

function doContactRightNavAction(evt) {
    console.log("doContactRightNavAction() === === ===")
    contactRightNavAction()
}

// function contactsViewIsHidden() {
//     console.log("contactsViewIsHidden() === === ===")
//     // return contactsView.style.display === 'none'
//     const isHidden = contactsView.style.display === 'none'
//     console.log("isHidden:", isHidden)
//     console.log(" display:", contactsView.style.display)
//     console.log("   style:", contactsView.style)
//     return isHidden
// }

// function contactViewIsHidden() {
//     console.log("contactViewIsHidden() === === ===")
//     // return contactView.style.display === 'none'
//     const isHidden = contactView.style.display === 'none'
//     console.log("isHidden:", isHidden)
//     console.log(" display:", contactView.style.display)
//     console.log("   style:", contactView.style)
//     return isHidden
// }

function showLoginView() {
    console.log("showLoginView() === === ===")
    loginView.style.display = 'block'
}

function hideLoginView() {
    console.log("hideLoginView() === === ===")
    loginView.style.display = 'none'
}

function showContactsView() {
    console.log("showContactsView() === === ===")
    contactsView.style.display = 'block'
}

function hideContactsView() {
    console.log("hideContactsView() === === ===")
    contactsView.style.display = 'none'
}

function showContactView() {
    console.log("showContactView() === === ===")
    contactView.style.display = 'block'
}

function hideContactView() {
    console.log("hideContactView() === === ===")
    contactView.style.display = 'none'
}

function switchToContactsView() {
    console.log("switchToContactsView() === === ===")
    if (mainHeaderIsBig) {
        return
    }
    hideContactView()
    showContactsView()
}

function switchToContactView() {
    console.log("switchToContactView() === === ===")
    if (mainHeaderIsBig) {
        return
    }
    hideContactsView()
    showContactView()
}

//
// === login ===
//

function showAlert(str) {
    console.log("showAlert(str) === === ===")
    str += '\nPlease try again.'
    alert(str)
}

function getLoginInputs() {
    return document.querySelectorAll('input')
}

function doLogin(name) {
    console.log("doLogin(name) === === ===")
    console.log("doLogin name:", name)

    hideLoginView()
    showContactsView()
    if (mainHeaderIsBig) {
        showContactView()
    }

    const inputs = document.querySelectorAll('input')
    for (let input of inputs) {
        input.value = ''
    }

    inputs[0].style.visibility = 'hidden'
    inputs[3].style.display = 'none'
    loginBtn.textContent = 'Login'
    signUpLink.style.display = 'inline'

    document.getElementById('login_view').style.display = 'none'

    mainHeader.firstChild.innerHTML = `Welcome, ${name}<span>|</span><button id="logout">Logout</button>`
    document.getElementById('logout').addEventListener('click', handleLogout)

    getGroups()
    getContacts()
    
    if (contId > 0) {
        getContact()
    }

    getTypeArrays()
}

function testLoginInputs(inputs,error) {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputs.email)) {
        if (error.length > 0) {
            error += '\n'
        }
        error += 'The email address is invalid.'
    }

    if (inputs.passwd.length < 6) {
        if (error.length > 0) {
            error += '\n'
        }
        error += 'The password must have at least six (6) characters.'
    }

    if (!/[0-9]+/.test(inputs.passwd) ) {
        if (error.length > 0) {
            error += '\n'
        }
        error +='The password must contain at least one (1) number.'
    }

    return error
}

function handleCreateUser(inputs) {
    console.log("handleCreateUser() === === ===")

    let error = ''

    if (inputs.name.length < 3) {
        error += 'The name must have at least three (3) characters.'
    }
    
    error = testLoginInputs(inputs,error)

    if (inputs.passwd != inputs.passwd2) {
        if (error.length > 0) {
            error += '\n'
        }
        error += `The passwords don't match.`
    }

    if (error.length > 0) {
        showAlert(error)
        return
    }

    delete inputs.passwd2

    axios.post(`/api/createuser`, inputs)
    .then(res => {
        console.log("handleCreateUser then res.data:", res.data)
        if (res.data.userId < 0) {
            console.log("handleCreateUser - exist")
            showAlert(`An account already exists for that email.`)
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

    let error = testLoginInputs(inputs,'')

    if (error.length > 0) {
        showAlert(error)
        return
    }
    
    axios.post(`/api/checkuser`, inputs)
    .then(res => {
        console.log("handleLogin then res.data:", res.data)
        if (res.data.userId < 0) {
            console.log("handleLogin - user doesn't exist")
            showAlert(`That login is incorrect.`)
        } else {
            console.log("handleLogin - user exists")
            userId = res.data.userId
            groupIdDisplayed = res.data.groupId
            contId = res.data.contId
            console.log("handleLogin ......... userId:", userId)
            console.log("handleLogin groupIdDisplayed:", groupIdDisplayed)
            console.log("handleLogin ......... contId:", contId)
            groupSelect.value = groupIdDisplayed
            doLogin(res.data.name)
        }
    })
    .catch(err => console.log(err))
}

function handleLoginButton(evt) {
    console.log("handleLoginButton(evt) === === ===")
    evt.preventDefault()
    
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
    
    showLoginView()
    removeNewGroupView()
    hideContactsView()
    hideContactView()

    userId = -1
    groups = []
    contacts = []
    contId = -1
    contactInfo = []
    contactInfoDisplayed = []

    mainHeader.firstChild.innerHTML = ''
    contactsContent.innerHTML = ''
    contactContent.innerHTML = ''

    contactLeftNav.textContent = ''
    contactRightNav.textContent = ''

    clearTSelects()

    // getContactsCount = 0
}

//
// === contact ===
//

function showContact(contactInfoIn) {
    console.log("showContact(contactInfoIn) === === ===")
    contactInfo = contactInfoIn
    showContactDisp()

    if (shouldGetContacts) {
        getContacts()
    }
}

function showAddContact() {
    console.log("showContact(contactInfoIn) === === ===")

    contactInfoDisplayed = contactInfo

    contactInfo = [
        {
            company: '',
            fname: '',
            lname: '',
            note: ''
        }
    ]

    contactsLeftNav.textContent = ''
    contactsRightNav.textContent = ''

    if (mainHeaderIsBig) {
        if (contId < 0 ) {
            contactLeftNavAction = showContactDispNoContact
        } else {
            contactLeftNavAction = showContactDisplayed
        }
    } else {
        contactLeftNavAction = getContacts
    }

    contactRightNavAction = addContact
    showContactAddEdit('Add')
}

function setDefaultContactsNav() {
    contactsLeftNav.textContent = 'Edit'
    contactsRightNav.textContent = 'Add'
}

function showEditContact() {
    contactLeftNavAction = showContactDisp
    contactRightNavAction = updateContact
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

function namesAreOK(contactObj) {

    const {fname, lname} = contactObj

    if (fname.length < 3 && lname.length < 3) {
        showAlert(`Either the first or last name must have more than three (3) characters.`)
        return false
    }

    return true
}

function addContact() {
    console.log("addContact() === === ===")

    const contactObj = contactObjForAdd()

    console.log("addContact contactObj:", contactObj)

    if (!namesAreOK(contactObj)) {
        return
    }

    axios.post(`/api/contact/${userId}`, contactObj)
    .then(res => {
        console.log("addContact then res.body:", res.data)
        shouldGetContacts = true
        showContact(res.data)
    })
    .catch(err => console.log(err))
}

function updateContact() {
    console.log("updateContact() === === ===")

    const contactObj = contactObjForAdd()

    if (!namesAreOK(contactObj)) {
        return
    }

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

    shouldGetContacts = contactObj.fname != fNameDisp || contactObj.lname != lNameDisp

    axios.put(`/api/contact/${contId}`, contactObj)
    .then(res => {
        console.log("updateContact then res.body:", res.data)
        showContact(res.data)
    })
    .catch(err => console.log(err))
}

function showContactDispNoContact() {
    console.log("showContactDispNoContact() === === ===")

    setDefaultContactsNav()
    contactLeftNav.textContent = ''
    contactRightNav.textContent = ''
    contactContent.innerHTML = ''
    clearTSelects()
}

function showContactDisplayed() {
    console.log("showContactDisplayed() === === ===")

    setDefaultContactsNav()
    contactInfo = contactInfoDisplayed
    showContactDisp()
}

function showContactDisp() {
    console.log("showContactDisp() === === ===")

    isShowingContactDisp = true

    clearTSelects()

    switchToContactView()

    const {fname, lname, company} = contactInfo[0]
    const note = contactInfo[0].note.replace(/(?:\r\n|\r|\n)/g, '<br>')

    if (mainHeaderIsBig) {
        contactLeftNav.textContent = ''
    } else {
        contactLeftNav.textContent = '< Contacts'
    }

    contactRightNav.textContent = 'Edit'

    contactLeftNavAction = getContacts
    contactRightNavAction = showEditContact

    let innerHTML = '<div class="cont_disp_container">'

    innerHTML += `\n<div class="contact_name">${fname}`
    if (fname.length > 0 && lname.length > 0) {
        innerHTML += ' '
    }
    innerHTML += `${lname}</div>`

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
        // innerHTML += '\n<div class="cont_sect">Note</div>'
        innerHTML += `\n<div class="note">${note}</div>`
    }

    innerHTML += "</div>"

    contactContent.innerHTML = innerHTML
}

function tSelId(tSelType) {
    return `${tSelType}_sel`
}

function setTSelect(tSelType) {
    console.log(`setTSelect(tSelType) - ${tSelType} === === ===`)

    switch (tSelType) {
        case 'p':
            pSelect = document.getElementById(tSelId(tSelType))
            pSelect.addEventListener('change', handlePSelectChanged)
            break
        case 'e':
            eSelect = document.getElementById(tSelId(tSelType))
            eSelect.addEventListener('change', handleESelectChanged)
            break
        case 'a':
            aSelect = document.getElementById(tSelId(tSelType))
            aSelect.addEventListener('change', handleASelectChanged)
    }
}

function makeSelect(name, types, typeId, tSelType) {
    let innerHTML = `<select`
    if (typeId === 0 ) {
        innerHTML += ` id=${tSelId(tSelType)}`
    }
    innerHTML += ` name="${name}">\n`
    if (typeId === 0) {
        innerHTML += '<option value="0">&ndash; type &ndash;</option>\n'
    } else {
        innerHTML += '<option value="0">&ndash; delete &ndash;</option>\n'
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
    innerHTML += `\n<div class="type_edit">${makeSelect('ptype_id', pTypes, pTypeId, 'p')}</div><input type="text" class="data" name="phone" placeholder="phone" value="${phone}">`
    innerHTML += '\n</div>'
    return innerHTML
}

function makeEmailItem(emailId,email,eTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="email_id" value="${emailId}">`
    innerHTML += `\n<div class="type_edit">${makeSelect('etype_id', eTypes, eTypeId, 'e')}</div><input type="email" class="data" name="email" placeholder="email" value="${email}">`
    innerHTML += '\n</div>'
    return innerHTML
}

function makeAddrItem(addrId,addr1,addr2,city,state,zip,aTypeId) {
    let innerHTML = '\n<div class="cont_details">'
    innerHTML += `\n<input type="hidden" name="addr_id" value="${addrId}">`
    innerHTML += `\n<div class="type_edit">${makeSelect('atype_id', aTypes, aTypeId, 'a')}</div><div>`
    innerHTML += `\n<input type="text" class="data" name="addr1" placeholder="street" value="${addr1}"><br>`
    innerHTML += `\n<input type="text" class="data" name="addr2" placeholder="street" value="${addr2}"><br>`
    innerHTML += `\n<input type="text" class="data" name="city" placeholder="city" value="${city}"><br>`
    innerHTML +=  `\n<input type="text" class="state" name="state" placeholder="state" value="${state}"><br>`
    innerHTML += `\n<input type="text" class="zip" name="zip" placeholder="zip" value="${zip}"></div>`
    innerHTML += '\n</div>'
    return innerHTML
}

function handlePSelectChanged(evt) {
    console.log("handlePSelectChanged(evt) === === ===")

    pSelect.removeEventListener('change', handlePSelectChanged)
    pSelect.removeAttribute('id');

    const div = document.createElement('div')
    div.innerHTML = makePhoneItem(0,'',0)
    
    document.getElementById('p_sect').appendChild(div)

    setTSelect('p')
}

function handleESelectChanged(evt) {
    console.log("handleESelectChanged(evt) === === ===")

    eSelect.removeEventListener('change', handleESelectChanged)
    eSelect.removeAttribute('id');

    const div = document.createElement('div')
    div.innerHTML = makeEmailItem(0,'',0)
    
    document.getElementById('e_sect').appendChild(div)

    setTSelect('e')
}

function handleASelectChanged(evt) {
    console.log("handleASelectChanged(evt) === === ===")

    aSelect.removeEventListener('change', handleASelectChanged)
    aSelect.removeAttribute('id');

    const div = document.createElement('div')
    div.innerHTML = makeAddrItem(0,'','','','','',0)
    
    document.getElementById('a_sect').appendChild(div)

    setTSelect('a')
}

function showContactAddEdit(titleText) {
    console.log("showContactAddEdit() === === ===")

    switchToContactView()

    shouldShowContactView = true
    isShowingContactDisp = false

    const {fname, lname, company, note} = contactInfo[0]

    fNameDisp = fname
    lNameDisp = lname

    contactLeftNav.textContent = 'Cancel'
    contactRightNav.textContent = 'Save'

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
    innerHTML += `\n<div id="p_sect">`
    while (contactInfo.length > i && "phone" in contactInfo[i]) {
        const {phone_id: phoneId, phone, type_id: pTypeId} = contactInfo[1]
        innerHTML += makePhoneItem(phoneId,phone,pTypeId)
        i++
    }
    innerHTML += makePhoneItem(0,'',0)
    innerHTML += `\n</div>`
    
    console.log("look for email, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect_edit">Email</div>'
    innerHTML += `\n<div id="e_sect">`
    while (contactInfo.length > i && "email" in contactInfo[i]) {
        const {email_id: emailId, email, type_id: eTypeId} = contactInfo[i]
        innerHTML += makeEmailItem(emailId,email,eTypeId)
        i++
    }
    innerHTML += makeEmailItem(0,'',0)
    innerHTML += `\n</div>`
    
    console.log("look for addr1, i:", i, "contactInfo.length:", contactInfo.length)
    innerHTML += '\n<div class="cont_sect_edit">Address</div>'
    innerHTML += `\n<div id="a_sect">`
    while (contactInfo.length > i && "addr1" in contactInfo[i]) {
        const {address_id: addrId, addr1, addr2, city, state, zip, type_id: aTypeId} = contactInfo[i]
        innerHTML += makeAddrItem(addrId,addr1,addr2,city,state,zip,aTypeId)
        i++
    }
    innerHTML += makeAddrItem(0,'','','','','',0)
    innerHTML += `\n</div>`

    innerHTML += '\n<div class="cont_sect_edit">Note</div>'
    innerHTML += `\n<div class="textarea"><textarea rows="10" name="note" placeholder="note">${note}</textarea></div>`

    contactContent.innerHTML = innerHTML

    setTSelect('p')
    setTSelect('e')
    setTSelect('a')
}

function getContact() {
    console.log("showContact(contId) === === ===")
    console.log("showContact contId:", contId)
    axios.get(`/api/contact?uid=${userId}&cid=${contId}`)
    .then(res => {
        console.log("showContact then res.data:", res.data)
        showContact(res.data)
    })
    .catch(err => console.log(err))
}

//
// === contacts ===
//

function makeGroupSelect() {
    // console.log("makeGroupSelect groupIdDisplayed:", groupIdDisplayed)

    let innerHTML = '<option value="0">&mdash; select group &mdash;</option>\n'
    for (let group of groups) {
        innerHTML += `<option value="${group.group_id}"`
        if (group.group_id === groupIdDisplayed) {
            innerHTML += ' selected="selected"'
        }
        innerHTML += `>${group.name}</option>\n`
    }
    innerHTML += '<option value="-1">&mdash; new group &mdash;</option>\n'
    groupSelect.innerHTML = innerHTML
}

function makeGroupAssignSelect() {
    let innerHTML = '<option value="0">&mdash; select &mdash;</option>\n'
    for (let group of groups) {
        innerHTML += `<option value="${group.group_id}"`
        innerHTML += `>${group.name}</option>\n`
    }
    groupAssignSelect.innerHTML = innerHTML
}

function doShowContacts() {
    console.log("doShowContacts() === === ===")

    switchToContactsView()

    contactsLeftNav.textContent = 'Edit'
    contactsRightNav.textContent = 'Add'

    contactsLeftNavAction = doEditContacts

    contactsContent.innerHTML = ''
    for (let contact of contacts) {
        const {contact_id: contId, fname, lname} = contact
        // console.log("doShowContacts contId:", contId, "fname:", fname, "lname:", lname)
        const div = document.createElement('div')
        const span = document.createElement('span')
        span.id = contId
        span.classList = "hover"
        let textContent = lname
        if (fname.length > 0) {
            if (textContent.length > 0) {
                textContent += ', '
            }
            textContent += fname
        }
        span.textContent = textContent
        span.addEventListener('click', clickedOnContact)
        div.appendChild(span)
        contactsContent.appendChild(div)
    }
}

function showContacts(contactsToDisplay) {    
    console.log("showContacts(contactsToDisplay) === === ===")
    contacts = contactsToDisplay
    
    doShowContacts()
}

function clickedOnContact(evt) {
    contId = evt.target.id
    console.log("clickedOnContact contId:", contId)
    getContact()
}

function getContIds() {
    const contIds = []

    for (let contItem of document.getElementsByName('cont')) {
        if (contItem.checked) {
            contIds.push(contItem.value)
        }
    }

    console.log("contIds:", contIds)
    return contIds
}

function clearAssignToGroup() {
    console.log("clearAssignToGroup() === === ===")

    for (let contItem of document.getElementsByName('cont')) {
        contItem.checked = false
    }
}

function assignGroup(evt) {
    console.log("assignGroup(evt) === === ===")
    const groupId = groupAssignSelect.value
    console.log("assignGroup groupId:", groupId)

    if (groupId < 1) {
        showAlert('You must select a group before you can assign contacts to it.')
        return
    }

    const contIds = getContIds()

    if (contIds.length < 1) {
        return
    }

    axios.post(`/api/contacts`, {userId: userId, groupId: groupId, contIds: contIds})
    .then(res => {
        console.log("assignGroup then res.body:", res.data)
    })
    .catch(err => console.log(err))

    groupAssignSelect.value = 0

    for (let contItem of document.getElementsByName('cont')) {
        contItem.checked = false
    }
}

function delContacts(evt) {
    console.log("delContacts(evt) === === ===")

    const contIds = getContIds()

    if (contIds.length < 1) {
        return
    }

    axios.delete(`/api/contacts`, {data: {userId: userId, groupId: groupIdDisplayed, contIds: contIds}})
    .then(res => {
        console.log("delContacts then res.body:", res.data)
        editContacts(res.data)
    })
    .catch(err => console.log(err))
}

function getContacts() {
    console.log("getContacts get userId:", userId, "groupIdDisplayed:", groupIdDisplayed)

    setDefaultContactsNav()
    clearTSelects()

    // getContactsCount++
    // if (getContactsCount > 2) {
    //     doShowContacts()
    //     return
    // }

    axios.get(`/api/contacts?uid=${userId}&gid=${groupIdDisplayed}`)
    .then(res => {
        console.log("getContacts then res.body:", res.data)
        showContacts(res.data)
    })
    .catch(err => console.log(err))
}

function doneEditContacts(evt) {
    console.log("doneEditContacts(evt) === === ===")
    document.querySelector('.groups').style.display = 'block'
    document.querySelector('.edit_contacts').style.display = 'none'
    doShowContacts()
}

function editContacts(contactsToSet) {
    console.log("editContacts(evt) === === ===")
    contacts = contactsToSet
    doEditContacts()
}

function doEditContacts() {
    console.log("editContacts() === === ===")

    contactsLeftNav.textContent = 'Done'
    contactsRightNav.textContent = ''

    contactsLeftNavAction = doneEditContacts

    document.querySelector('.groups').style.display = 'none'
    document.querySelector('.edit_contacts').style.display = 'block'
    makeGroupAssignSelect()

    contactsContent.innerHTML = ''
    for (let contact of contacts) {
        const {contact_id: contId, fname, lname} = contact
        // console.log("editContacts contId:", contId, "fname:", fname, "lname:", lname)
        const div = document.createElement('div')
        const label = document.createElement('label')
        let name = lname
        if (fname.length > 0) {
            if (name.length > 0) {
                name += ', '
            }
            name += fname
        }
        let innerHTML = `<input type="checkbox" name="cont" value="${contId}"> ${name}`
        label.innerHTML = innerHTML
        div.appendChild(label)
        contactsContent.appendChild(div)
    }
}

//
// === groups ===
//

function getGroups() {
    console.log("getGroups() === === ===")
    console.log("getGroups get userId:", userId)
    // contactsContent.innerHTML = 'Contacts'
    axios.get(`/api/groups?id=${userId}`)
    .then(res => {
        console.log("getGroups then res.body:", res.data)
        groups = res.data
        makeGroupSelect()
    })
    .catch(err => console.log(err))
}

function removeNewGroupView() {
    console.log("removeNewGroupView() === === ===")
    document.getElementById('new_group_view').remove()
    document.getElementById('new_group_background_view').remove()
    groupSelect.value = groupIdDisplayed
}

function cancelMakeNewGroup(evt) {
    console.log("cancelMakeNewGroup() === === ===")
    evt.preventDefault()
    removeNewGroupView()
}

function makeNewGroup(evt) {
    console.log("makeNewGroup() === === ===")
    evt.preventDefault()
    
    const name = document.getElementsByName('group')[0].value.trim()
    console.log("makeNewGroup group:", name)

    if (name.length < 1) {
        showAlert(`The group name must have more than one (1) character.`)
        return false
    }

    removeNewGroupView()

    axios.post(`/api/group/${userId}`, {name: name})
    .then(res => {
        console.log("makeNewGroup then res.data:", res.data)
        groups = res.data
        makeGroupSelect()
    })
    .catch(err => console.log(err))
}

function showNewGroupView() {
    console.log("showNewGroupView() === === ===")

    const newGroupBackgroundView = document.createElement('section')
    newGroupBackgroundView.id = 'new_group_background_view'
    newGroupBackgroundView.classList = "two_wide"
    document.querySelector('main').appendChild(newGroupBackgroundView)

    const newGroupView = document.createElement('section')
    newGroupView.id = 'new_group_view'
    newGroupView.classList = "two_wide"

    let innerHTML = `<div class="new_group">\n`
    innerHTML += `<form>\n`
    innerHTML += `<p>Make new group</p>\n`
    innerHTML += `<input type="text" name="group" placeholder="group name">\n`
    innerHTML += `<div>\n`
    innerHTML += `<button id="cancel">Cancel</button><button id="create">Create</button>\n`
    innerHTML += `</div>\n`
    innerHTML += `</form>\n`
    innerHTML += `</div>\n`

    newGroupView.innerHTML = innerHTML

    document.querySelector('main').appendChild(newGroupView)

    document.getElementById('cancel').addEventListener('click', cancelMakeNewGroup)
    document.getElementById('create').addEventListener('click', makeNewGroup)
}

function handleGroupSelectChanged(evt) {
    console.log("handleGroupSelectChanged(evt)")
    const groupIdSelected = evt.target.value
    console.log("handleGroupSelectChanged groupId:", groupIdSelected)

    if (groupIdSelected < 0) {
        showNewGroupView()
        return
    }

    groupIdDisplayed = groupIdSelected

    getContacts()
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

window.onresize = handleWindowResize

loginBtn.addEventListener('click', handleLoginButton)
signUpLink.addEventListener('click', handleSignUpLink)

contactsLeftNav.addEventListener('click', doContactsLeftNavAction)
contactsRightNav.addEventListener('click', showAddContact)

groupSelect.addEventListener('change', handleGroupSelectChanged)

document.getElementById('assign_group').addEventListener('click', assignGroup)
document.getElementById('delete').addEventListener('click', delContacts)

contactLeftNav.addEventListener('click', doContactLeftNavAction)
contactRightNav.addEventListener('click', doContactRightNavAction)

if (userId > 0) {
    doLogin('James')
}
// getContacts()
// getTypeArrays()

setMainHeaderIsBig()