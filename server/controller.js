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

module.exports = {
    getContact: (req, res) => {
        const contId = req.query.id
        console.log("getContact contId:", contId)
        let qry = `select contact_id, fname, lname, company, note from contacts where contact_id=${contId};`
        qry += `select phone_id, phone, type from phones, phone_types where phones.type_id=phone_types.id and contact_id=${contId} order by sort;`
        qry += `select email_id, email, type from emails, email_types where emails.type_id=email_types.id and contact_id=${contId} order by sort;`
        qry += `select address_id, addr1, addr2, city, state, zip, type from addresses, address_types where addresses.type_id=address_types.id and contact_id=${contId} order by sort;`
        console.log("getContact qry:", qry)
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
        const qry = `select contact_id, fname, lname from contacts where user_id=${userId} order by lname, fname, contact_id`
        console.log("getAllContacts qry:", qry)
        sequelize.query(qry)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    }
}