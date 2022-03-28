var connection = require('./connection')

class AddressRepository {
    getUserAddress(userId, valueCallback) {
        const query = `select * from addresses where user_id = ?`
        connection.query(query, [userId], (err, rows, fields) => {
            if (err != null) {
                console.log(err)
                valueCallback([])
            } else {
                valueCallback(rows)
            }
        })
    }

    addUserAddress(userId, data) {
        const query = `insert into addresses values(NULL, ?, ?, ?, ?, ?)`
        connection.query(query, [userId, data.alias, data.phone_number, data.address_line, data.postal_code])
    }

    updateUserAddress(id, data) {
        const query = `update addresses set alias = ?, phone_number = ?, address_line = ?, postal_code = ? where id = ?`
        connection.query(query, [data.alias, data.phone_number, data.address_line, data.postal_code, id])
    }

    deleteUserAddress(id) {
        const query = `delete from addresses where id = ?`
        connection.query(query, [id])
    }
}

module.exports = new AddressRepository()