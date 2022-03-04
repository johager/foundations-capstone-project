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

function contactsQuery(userId) {
    return `select contact_id, fname, lname from contacts where user_id=${userId} order by lname, fname, contact_id`
}

function contactQuery(contId) {
    let qry = `select contact_id, fname, lname, company, note from contacts where contact_id=${contId};`
    qry += `select phone_id, phone, phones.type_id, type from phones, phone_types where phones.type_id=phone_types.id and contact_id=${contId} order by sort;`
    qry += `select email_id, email, emails.type_id, type from emails, email_types where emails.type_id=email_types.id and contact_id=${contId} order by sort;`
    qry += `select address_id, addr1, addr2, city, state, zip, addresses.type_id, type from addresses, address_types where addresses.type_id=address_types.id and contact_id=${contId} order by sort;`
    return qry
}

module.exports = {
    //
    // === contact ===
    //
    getContact: (req, res) => {
        const contId = req.query.id
        console.log("getContact contId:", contId)
        const qry = contactQuery(contId)
        console.log("getContact qry:", qry)
        sequelize.query(qry)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    postContact: (req, res) => {
        console.log("putContact req.params:", req.params)
        const userId = req.params.id
        console.log("postContact req.body:", req.body)

        const {fname, lname, pTypeIds, phones, eTypeIds, emails, aTypeIds, addr1s, addr2s, cities, states, zips, note} = req.body

        let qry = `insert into contacts (user_id, fname, lname, note) values(${userId}, '${fname}', '${lname}', '${note}') returning contact_id`
        console.log("putContact qry:", qry)

        // res.status(200)

        sequelize.query(qry)
            .then(dbRes => {
                console.log("putContact then1 dbRes[0]:", dbRes[0])
                console.log("putContact then1 dbRes[0][0]:", dbRes[0][0])
                const contId = dbRes[0][0].contact_id
                console.log("putContact then1 contId:", contId)

                let qry = ''

                for(let i in phones) {
                    qry += `insert into phones (contact_id, type_id, phone, sort) values(${contId}, ${pTypeIds[i]}, '${phones[i]}', 1);`
                }

                for(let i in emails) {
                    qry += `insert into emails (contact_id, type_id, email, sort) values(${contId}, ${eTypeIds[i]}, '${emails[i]}', 1);`
                }

                for(let i in addr1s) {
                    qry += `insert into addresses (contact_id, type_id, addr1, addr2, city, state, zip, sort) values(${contId}, ${aTypeIds[i]}, '${addr1s[i]}', '${addr2s[i]}', '${cities[i]}', '${states[i]}', '${zips[i]}', 1);`
                }

                qry += contactQuery(contId)
                console.log("putContact then1 qry:", qry)

                sequelize.query(qry)
                    .then(dbRes => res.status(200).send(dbRes[0]))
                    .catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    },
    putContact: (req, res) => {
        console.log("putContact req.params:", req.params)
        const contId = req.params.id
        console.log("putContact contId:", contId)
        console.log("putContact req.body:", req.body)

        const {fname, lname, phoneIds, pTypeIds, phones, emailIds, eTypeIds, emails, addrIds, aTypeIds, addr1s, addr2s, cities, states, zips, note} = req.body

        console.log("putContact phoneIds:", phoneIds)
        console.log("putContact emailIds:", emailIds)
        console.log("putContact addrIds:", addrIds)

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
        console.log("putContact qry:", qry)

        // res.status(200)

        sequelize.query(qry)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    deleteContact: (req, res) => {
        console.log("deleteContact req.query:", req.query)
        const contId = req.query.cont_id
        const userId = req.query.user_id
        console.log("deleteContact contId:", contId, "userId:", userId)

        let qry = `delete from phones where contact_id=${contId};`
        qry += `delete from emails where contact_id=${contId};`
        qry += `delete from addresses where contact_id=${contId};`
        qry += `delete from contacts_groups where contact_id=${contId};`
        qry += `delete from contacts where contact_id=${contId};`
        qry += contactsQuery(userId)
        console.log("deleteContact qry:", qry)
        sequelize.query(qry)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    //
    // === contacts ===
    //
    getAllContacts: (req, res) => {
        const userId = req.query.id
        console.log("getAllContacts userId:", userId)
        const qry = contactsQuery(userId)
        console.log("getAllContacts qry:", qry)
        sequelize.query(qry)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },
    //
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