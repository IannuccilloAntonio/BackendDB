const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookSchema = new Schema( 
    {
        _id: {
            type: ObjectId,
        },
        name: {
            type: String,
            required: true
        },
        authorName: {
            type: String
        },
        seller: {
            name: {
                type: String,
                required: true
            },
            surname: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: Number,
                required: true
            },
            department: {
                type: String,
                required: true
            },
            matriculation: {
                type: Number,
                required: true
            }
        },
        description: {
            numberOfPage: {
                type: Number,
            },
            isbn: {
                type: String,
            },
            language: {
                type: String,
            }
        },
        condition: {
            type: String,
        },
        picture: {
            type: String,
        },
        price: {
            type: Number,
            required: true
        },
    }
)

var Book = mongoose.model('books', BookSchema);
module.exports = Book;