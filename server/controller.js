require('dotenv').config()
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

const bcrypt = require('bcryptjs')

function passHashToSave(passHash) {
    // replace "$" with "|" so sequelize can use it
    return passHash.replace(/[$]/g,'|')
}
function passHashToUse(passHash) {
    // replace "|" with "$" so bcrypt can use it
    return passHash.replace(/[|]/g,'$')
}

function setGroupQuery(userId, groupId) {
    return `update users set group_id=${groupId} where user_id=${userId};`
}

function setContactQuery(userId, contId) {
    return `update users set contact_id=${contId} where user_id=${userId};`
}

function contactsQuery(userId, groupId) {

    if (groupId > 0) {
        return `select contacts.contact_id, fname, lname from contacts, contacts_groups where contacts.contact_id=contacts_groups.contact_id and user_id=${userId} and group_id=${groupId} order by lname, fname, contact_id`
    } else {
        return `select contact_id, fname, lname from contacts where user_id=${userId} order by lname, fname, contact_id`
    }
}

function contactQuery(contId) {
    let qry = `select contact_id, fname, lname, company, note from contacts where contact_id=${contId};`
    qry += `select phone_id, phone, phones.type_id, type from phones, phone_types where phones.type_id=phone_types.id and contact_id=${contId} order by sort;`
    qry += `select email_id, email, emails.type_id, type from emails, email_types where emails.type_id=email_types.id and contact_id=${contId} order by sort;`
    qry += `select address_id, addr1, addr2, city, state, zip, addresses.type_id, type from addresses, address_types where addresses.type_id=address_types.id and contact_id=${contId} order by sort;`
    return qry
}

function groupsQuery(userId) {
    return `select group_id, name from groups where user_id=${userId} order by name, group_id`
}

module.exports = {
    //
    // === user ===
    ///
    createUser: (req, res) => {
        console.log("createUser")

        const {name, email, passwd} = req.body

        qry = `select user_id, name, passwd from users where email='${email}';`
        console.log("createUser qry:", qry)
        sequelize.query(qry)
        .then(dbRes => {
            if (dbRes[0].length > 0) {  // email exists
                const {user_id, name, passwd: passHash} = dbRes[0][0]
                if (bcrypt.compareSync(passwd, passHashToUse(passHash))) {  // passwd matches
                    res.status(200).send({userId: user_id, name: name})
                } else {  // passwd doesn't match
                    res.status(200).send({userId: -1})
                }
            } else {  // create new user
                const salt = bcrypt.genSaltSync(9)
                const passHash = bcrypt.hashSync(passwd, salt)
                const passHashSave = passHashToSave(passHash)
                let qry = `insert into users (name, email, passwd) values ('${name}','${email}', '${passHashSave}') returning user_id;`
                console.log("createUser qry:", qry)
                sequelize.query(qry)
                .then(dbRes => {
                    const {user_id} = dbRes[0][0]
                    res.status(200).send({userId: user_id, name: name})
                })
                .catch(err => console.log(err))
            }
        })
        .catch(err => console.log(err))
    },
    checkUser: (req, res) => {
        console.log("checkUser")
        const {email, passwd} = req.body
        console.log("checkUser  email:", email)
        console.log("checkUser passwd:", passwd)
        let qry = `select user_id, name, passwd, group_id, contact_id from users where email='${email}';`
        console.log("checkUser qry:", qry)
        sequelize.query(qry)
        .then(dbRes => {
            console.log("checkUser then dbRes[0]:", dbRes[0])
            if (dbRes[0].length > 0) {  // email exists
                const {user_id, name, passwd: passHash, group_id, contact_id} = dbRes[0][0]
                console.log("checkUser  user_id:", user_id)
                console.log("checkUser     name:", name)
                console.log("checkUser passHash:", passHash)
                if (bcrypt.compareSync(passwd, passHashToUse(passHash))) {  // passwd matches
                    console.log("checkUser  email:", email)
                    res.status(200).send({userId: user_id, name: name, groupId: group_id, contId: contact_id})
                    return
                }
            }
            res.status(200).send({userId: -1})
        })
        .catch(err => console.log(err))
    },
    //
    // === contact ===
    //
    getContact: (req, res) => {
        const {uid: userId, cid: contId} = req.query
        console.log("getContact userId:", userId, "contId:", contId)
        let qry = setContactQuery(userId, contId)
        qry += contactQuery(contId)
        console.log("getContact qry:", qry)
        sequelize.query(qry)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    addContact: (req, res) => {
        console.log("addContact req.params:", req.params)
        const userId = req.params.id
        console.log("addContact req.body:", req.body)

        const {fname, lname, pTypeIds, phones, eTypeIds, emails, aTypeIds, addr1s, addr2s, cities, states, zips, note} = req.body

        let qry = `insert into contacts (user_id, fname, lname, note) values(${userId}, '${fname}', '${lname}', '${note}') returning contact_id`
        console.log("addContact qry:", qry)

        sequelize.query(qry)
            .then(dbRes => {
                console.log("addContact then1 dbRes[0]:", dbRes[0])
                console.log("addContact then1 dbRes[0][0]:", dbRes[0][0])
                const contId = dbRes[0][0].contact_id
                console.log("addContact then1 contId:", contId)

                let qry = setContactQuery(userId, contId)

                for(let i in phones) {
                    if (pTypeIds[i] > 0 && phones[i].length > 0) {
                        qry += `insert into phones (contact_id, type_id, phone, sort) values(${contId}, ${pTypeIds[i]}, '${phones[i]}', 1);`
                    }
                }

                for(let i in emails) {
                    if (eTypeIds[i] > 0 && emails[i].length > 0) {
                        qry += `insert into emails (contact_id, type_id, email, sort) values(${contId}, ${eTypeIds[i]}, '${emails[i]}', 1);`
                    }
                }

                for(let i in addr1s) {
                    if (aTypeIds[i] > 0 && (addr1s[i].length > 0 || addr2s[i].length > 0 || states[i].length > 0 || cities[i].length > 0 || zips[i].length > 0)) {
                        qry += `insert into addresses (contact_id, type_id, addr1, addr2, city, state, zip, sort) values(${contId}, ${aTypeIds[i]}, '${addr1s[i]}', '${addr2s[i]}', '${cities[i]}', '${states[i]}', '${zips[i]}', 1);`
                    }
                }

                qry += contactQuery(contId)
                console.log("addContact then1 qry:", qry)

                sequelize.query(qry)
                    .then(dbRes => res.status(200).send(dbRes[0]))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    },
    editContact: (req, res) => {
        console.log("editContact req.params:", req.params)
        const contId = req.params.id
        console.log("editContact contId:", contId)
        console.log("editContact req.body:", req.body)

        const {fname, lname, phoneIds, pTypeIds, phones, emailIds, eTypeIds, emails, addrIds, aTypeIds, addr1s, addr2s, cities, states, zips, note} = req.body

        const noteE = sequelize.escape(note)
        console.log("editContact phoneIds:", phoneIds)
        console.log("editContact emailIds:", emailIds)
        console.log("editContact addrIds:", addrIds)
        console.log("editContact  note: === === ===\n", note,"\n=== === ===")
        console.log("editContact noteE: === === ===\n", noteE,"\n=== === ===")

        let qry = `update contacts set fname='${fname}', lname='${lname}', note='${note}' where contact_id=${contId};`

        for(let i in phones) {
            if (phoneIds[i] > 0) {
                if (pTypeIds[i] > 0 && phones[i].length > 0) {
                    qry += `update phones set type_id=${pTypeIds[i]}, phone='${phones[i]}' where phone_id=${phoneIds[i]};`
                } else {
                    qry += `delete from phones where phone_id=${phoneIds[i]};`
                }
            } else if (phones[i].length > 0) {
                qry += `insert into phones (contact_id, type_id, phone, sort) values(${contId}, ${pTypeIds[i]}, '${phones[i]}', ${i + 1});`
            }
        }

        for(let i in emails) {
            console.log(`putContact emails[${i}], emailIds[i]:`, emailIds[i], "eTypeIds[i]:", eTypeIds[i], "emails[i]:", emails[i])
            if (emailIds[i] > 0) {
                if (eTypeIds[i] > 0 && emails[i].length > 0) {
                    qry += `update emails set type_id=${eTypeIds[i]}, email='${emails[i]}' where email_id=${emailIds[i]};`
                } else {
                    qry += `delete from emails where email_id=${emailIds[i]};`
                }
            } else if (emails[i].length > 0) {
                qry += `insert into emails (contact_id, type_id, email, sort) values(${contId}, ${eTypeIds[i]}, '${emails[i]}', ${i + 1});`
            }
        }

        for(let i in addr1s) {
            if (addrIds[i] > 0) {
                if (aTypeIds[i] > 0 && (addr1s[i].length > 0 || addr2s[i].length > 0 || states[i].length > 0 || cities[i].length > 0 || zips[i].length > 0)) {
                    qry += `update addresses set type_id=${aTypeIds[i]}, addr1='${addr1s[i]}', addr2='${addr2s[i]}', city='${cities[i]}', state='${states[i]}', zip='${zips[i]}' where address_id=${addrIds[i]};`
                } else {
                    qry += `delete from addresses where address_id=${addrIds[i]};`
                }
            } else if (addr1s[i].length > 0 || addr2s[i].length > 0 || states[i].length > 0 || cities[i].length > 0 || zips[i].length > 0) {
                qry += `insert into addresses (contact_id, type_id, addr1, addr2, city, state, zip, sort) values(${contId}, ${aTypeIds[i]}, '${addr1s[i]}', '${addr2s[i]}', '${cities[i]}', '${states[i]}', '${zips[i]}', ${i + 1});`
            }
        }

        qry += contactQuery(contId)
        console.log("editContact qry:", qry)

        sequelize.query(qry)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    //
    // === contacts ===
    //
    getContacts: (req, res) => {
        const {uid: userId, gid: groupId} = req.query
        console.log("getContacts userId:", userId, "groupId:", groupId)
        let qry = setGroupQuery(userId, groupId)
        qry += contactsQuery(userId, groupId)
        console.log("getContacts qry:", qry)
        sequelize.query(qry)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    deleteContacts: (req, res) => {
        console.log("deleteContacts req.body:", req.body)
        const {userId, contIds} = req.body
        console.log("deleteContacts userId:", userId, "contIds:", contIds)

        let qry = ''
        for (let contId of contIds) {
            qry += `delete from phones where contact_id=${contId};`
            qry += `delete from emails where contact_id=${contId};`
            qry += `delete from addresses where contact_id=${contId};`
            qry += `delete from contacts_groups where contact_id=${contId};`
            qry += `delete from contacts where contact_id=${contId};`
        }
        qry += contactsQuery(userId)
        console.log("deleteContacts qry:", qry)
        sequelize.query(qry)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    addContactsToGroup: (req, res) => {
        console.log("addContactsToGroup req.body:", req.body)
        const {userId, groupId, contIds} = req.body
        console.log("addContactsToGroup userId:", userId, "groupId:", groupId, "contIds:", contIds)

        let qry = ''
        for (let contId of contIds) {
            qry += `insert into contacts_groups (contact_id, group_id) values (${contId}, ${groupId});`
        }
        console.log("addContactsToGroup qry:", qry)

        sequelize.query(qry)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    //
    // === groups ===
    //
    getGroups: (req, res) => {
        const userId = req.query.id
        console.log("getGroups userId:", userId)
        const qry = groupsQuery(userId)
        console.log("getGroups qry:", qry)
        sequelize.query(qry)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    addGroup: (req, res) => {
        console.log("addGroup")
        const userId = req.params.id
        console.log("addGroup req.body:", req.body)
        const {name} = req.body

        let qry = `insert into groups (user_id, name) values(${userId}, '${name}');`
        qry += groupsQuery(userId)
        console.log("addGroup qry:", qry)

        sequelize.query(qry)
            .then(dbRes => { res.status(200).send(dbRes[0])})
            .catch(err => console.log(err))
    },
    // === set up ===
    ///
    getTypeArrays: (req, res) => {
        console.log("getTypeArrays")
        let qry = `select * from phone_types order by id;`
        qry += `select * from email_types order by id;`
        qry += `select * from address_types order by id;`
        console.log("getTypeArrays qry:", qry)
        sequelize.query(qry)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    }
}