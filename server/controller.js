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

                let qry = `insert into phones (contact_id, type_id, phone, sort) values(${contId}, ${pTypeIds[0]}, '${phones[0]}', 1);`
                qry += `insert into emails (contact_id, type_id, email, sort) values(${contId}, ${eTypeIds[0]}, '${emails[0]}', 1);`
                qry += `insert into addresses (contact_id, type_id, addr1, addr2, city, state, zip, sort) values(${contId}, ${aTypeIds[0]}, '${addr1s[0]}', '${addr2s[0]}', '${cities[0]}', '${states[0]}', '${zips[0]}', 1);`
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
        qry += `update phones set type_id=${pTypeIds[0]}, phone='${phones[0]}' where phone_id=${phoneIds[0]};`
        qry += `update emails set type_id=${eTypeIds[0]}, email='${emails[0]}' where email_id=${emailIds[0]};` 
        qry += `update addresses set type_id=${aTypeIds[0]}, addr1='${addr1s[0]}', addr2='${addr2s[0]}', city='${cities[0]}', state='${states[0]}', zip='${zips[0]}' where address_id=${addrIds[0]};`
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