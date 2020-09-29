const express = require("express");
const books = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



var Book = require("../models/Book");

var User = require("../models/User");
const { ObjectId } = require("mongodb");

books.use(cors());

books.post("/newBook", (req, res) => {
  const bookData = {
    _id: ObjectId(),
    name: req.body.book.result.name,
    authorName: req.body.book.result.authorName,
    seller: {
      name: req.body.book.result.seller.name,
      surname: req.body.book.result.seller.surname,
      email: req.body.book.result.seller.email,
      phone: req.body.book.result.seller.phone,
      department: req.body.book.result.seller.department,
      matriculation: req.body.book.result.seller.matriculation,
    },
    description: {
      numberOfPage: req.body.book.result.description.numberOfPage,
      isbn: req.body.book.result.description.isbn,
      language: req.body.book.result.description.language,
    },
    condition: req.body.book.result.condition,
    picture: req.body.book.result.picture,
    price: req.body.book.result.price,
  };
  console.log(bookData);
  const idUser = req.body.idUser;
  console.log(idUser);
  const token = req.body.token;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  if (decoder) {
    Book.create(bookData)
      .then(() => {
        User.update({ _id: idUser }, { $push: { book: bookData._id } })
          .then((user) => {
            res.json({ code: 0, status: "Libro inserito con successo" });
            console.log(bookData);
          })
          .catch((err) => {
            res.json({
              code: -4,
              status: "Errore nell'aggiunta del libro ausa id utente",
            });
            console.log(bookData);
          });
      })
      .catch((err) => {
        res.json({
          code: -1,
          status: "Verifica che hai inserito tutti i dati nel modo giusto",
        });
        console.log(bookData._id);
        console.log(bookData);
      });
  } else {
    res.json({
      code: -1,
      status: "Token di sessione scaduto, rifai l'accesso",
    });
  }
});

books.post("/getAllBook", (req, res) => {
  const token = req.body.token;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  Book.find(function (err, result) {
    if (decoder) {
      res.json({ code: 0, status: "Libri recuperati con successo", result });
      console.log(result._id);
      
    } else {
      res.json({
        code: -1,
        status: "Controlla che il token di sessione non sia scaduto",
      });
    }
  }).limit(10);
});

// Query che restituisce gli elementi filtrati per corso di studi
books.post("/filters", (req, res) => {
  const token = req.body.token;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  var typeOfQuery = req.body.typeOfQuery;
  var query = req.body.query;

  if (decoder) {
    switch (typeOfQuery) {
      case "seller.department":
        Book.find({ "seller.department": query }, (err, result) => {
          if (result) {
            res.json({
              code: 0,
              status: "Libri recuperati con successo",
              result,
            });
            console.log(result);
          } else {
            res.json({
              code: -1,
              status: "La ricerca non ha fornito risultati",
            });
          }
          console.log(result);
        });

        break;
      case "condition":
        Book.find({ condition: query }, (err, result) => {
          if (result) {
            res.json({
              code: 0,
              status: "Libri recuperati con successo",
              result,
            });
            console.log(result);
          } else {
            res.json({
              code: -1,
              status: "La ricerca non ha fornito risultati",
            });
          }
          console.log(result);
        });
        break;
      case "price":
        Book.find(
          { $or: [{ price: { $lt: query } }, { price: query }] },
          (err, result) => {
            if (result) {
              res.json({
                code: 0,
                status: "Libri recuperati con successo",
                result,
              });
              console.log(result);
            } else {
              res.json({
                code: -1,
                status: "La ricerca non ha fornito risultati",
              });
            }
            console.log(result);
          }
        );
        break;

      case "language":
        Book.find({ language: query }, (err, result) => {
          if (result) {
            res.json({
              code: 0,
              status: "Libri recuperati con successo",
              result,
            });
            console.log(result);
          } else {
            res.json({
              code: -1,
              status: "La ricerca non ha fornito risultati",
            });
          }
          console.log(result);
        });
        break;
    }
  } else {
    res.json({
      code: -1,
      status: "Token di sessione scaduto",
    });
  }
});

books.post("/search", function (req, res) {
  var query = req.body.query;
  const token = req.body.token;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  if (decoder) {
    Book.find(
      {
        $or: [
          { name: { $regex: ".*" + query + ".*", $options: "i" } },
          {
            "description.isbn": { $regex: ".*" + query + ".*", $options: "i" },
          },
        ],
      },
      (err, result) => {
        if (result) {
          res.json({
            code: 0,
            status: "Libri recuperati con successo",
            result,
          });
          console.log(result);
        } else {
          res.json({
            code: -1,
            status: "La ricerca non ha fornito risultati",
          });
        }
        console.log(result);
      }
    );
  } else {
    res.json({
      code: -2,
      status: "Token di sessione scaduto",
    });
  }
});

books.post("/detailBook", function (req, res) {
  var id = req.body.id;
  const token = req.body.token;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  if (decoder) {
    Book.findOne({ _id: id }, (err, result) => {
      if (result) {
        res.json({
          code: 0,
          status: "Libri recuperati con successo",
          result,
        });
        console.log(result);
      } else {
        res.json({
          code: -1,
          status: "La ricerca non ha fornito risultati",
        });
      }
      console.log(result);
    });
  } else {
    res.json({
      code: -2,
      status: "Token di sessione scaduto",
    });
  }
});

books.post("/editBook", function (req, res) {
  var id = req.body.idBook;
  
  const token = req.body.token;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  if (decoder) {
    Book.updateOne(
      { _id: id },
      {
        $set: {
          name: req.body.book.result.name,
          authorName: req.body.book.result.authorName,
          "description.numberOfPage": req.body.book.result.description.numberOfPage,
          "description.isbn": req.body.book.result.description.isbn,
          "description.language": req.body.book.result.description.language,
          condition: req.body.book.result.condition,
          price: req.body.book.result.price,
        },
      },
      (err, result) => {
        if (result) {
          res.json({
            code: 0,
            status: "Modifica Effettuata con successo",
            result,
          });
          console.log(result);
        } else {
          res.json({
            code: -1,
            status: "Modifica non avvenuta",
          });
        }
        console.log(result);
      }
    );
  } else {
    res.json({
      code: -2,
      status: "Token di sessione scaduto",
    });
  }
});

books.post("/deleteBook", function (req, res) {
  var id = req.body.idBook;
  
  const token = req.body.token;
  const userID = req.body.idUser;
  var decoder = jwt.verify(token, process.env.SECRET_KEY);
  if (decoder) {
    Book.remove(
      { _id: id},
      (err, result) => {
        User.update({_id: ObjectId(userID)}, {$pull: { "book": id}}).then(
          (res) => {
            res.json({code: 0,
            status:"Libro rimosso con successo"})
            console.log(res)
          })
        if (result) {
          res.json({
            code: 0,
            status: "Libro eleminato con successo",
            result,
          });
          console.log(result);
        } else {
          res.json({
            code: -1,
            status: "Eliminazione non avvenuta",
          });
        }
        console.log(result);
      }
    );
  } else {
    res.json({
      code: -2,
      status: "Token di sessione scaduto",
    });
  }
});
module.exports = books;
