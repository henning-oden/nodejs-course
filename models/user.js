const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;


class User {
    constructor(username, email, id) {
        this.name = username;
        this.email = email;
        this._id = new mongodb.ObjectId(id);
    }

    save() {

        return getDb()
            .collections('users')
            .insertOne(this);
    }


    static findById(userId) {
    const db = getDb();
    return db
        .collection('users')
        .findOne({ _id: new mongodb.ObjectId(userId) })
        .then(user => {
            console.log(user);
            return user;
        })
        .catch(err => {
            console.log(err);
        });
}
}

module.exports = User;