const express = require('express')
const users = express.Router()
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

var User = require('../models/User')

users.use(cors());

process.env.SECRET_KEY  = 'secret';

users.post('/registration', (req, res) => {
const userData = {
        name: req.body.name,
        surname: req.body.surname,
        email: req.body.email,
        matriculation:  req.body.matriculation,
        department:  req.body.department,
        phone: req.body.phone,
        username: req.body.username,
        password: req.body.password,
        book: req.body.book
    }

    User.findOne({
        username: req.body.username
    }).then(user => {
        if(!user) {
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                userData.password = hash
                User.create(userData).then( user => {
                    res.json( { code: 0, 
                                status: 'Utente registrato con successo'})
                                    console.log(userData);
                                
                })
                .catch( err => {
                    console.log(userData);
                    res.json( { code: -1, 
                                status: 'Errore Imprevisto'})
                })
                
            })
            
        } else {
            res.json( { code: -2, 
                                status: 'L/utente esiste già'})

        }
    }).catch( err => {
        res.send('errore' + err);
    })
})

users.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).then( user => {
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                // Controllo password
                const payload = {
                    _id : user._id,
                    name: user.name,
                    surname: user.surname,
                    username: user.username
                }
                let token =jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({ code: 0,
                            status: 'Accesso avvenuto con successo', 
                            token: token})
            } else{
                res.json({code: -1,
                status: 'Controlla inserimento dati', })
            }
        }else{
            res.json({code: -2,
            status: 'Errore imprevisto ', })
        }
    })

    
})

users.post('/profile', (req, res) => {
    const token = req.body.token;
    var decoder = jwt.verify(token, process.env.SECRET_KEY)

    User.findOne({
        _id: decoder._id
    }).then(user => {
        if(user){
            res.json({code: 0,
                        status: 'Profilo recuperato con successo',
                        user }
            )
            console.log(user.book)
        }else{
            res.json({code: -1,
            status: 'Errore imprevisto' })
    }
        
    })
})

module.exports = users;