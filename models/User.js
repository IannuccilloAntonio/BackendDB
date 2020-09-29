const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema( 
    {
        name: {
            type: String
        },
        surname: {
            type: String
        },
        email: {
            type: String,
            required: true
        },
        matriculation: {
            type: Number,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        book:[
            {
                type: String
            }
        ]
    }
)

var User = mongoose.model('users', UserSchema);
module.exports = User