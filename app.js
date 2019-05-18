const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./product');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(cors());

const mongoURI = 'mongodb://localhost:27017/http_client';
mongoose.connect(mongoURI, {useNewUrlParser: true});

var myLogger = (req, res, next) => {
    console.log(req.body);
    next();
}

app.use(myLogger);

// -------------------------------------------------------------------------------------
app.get('/products', (req, res) => {
    
    Product.find().lean().exec(
        (err, produtos) => {
            if(err) res.status(500).send(err);
            else res.status(200).send(produtos);
        }
    )

});
// -------------------------------------------------------------------------------------
app.get('/err', (req, res) => {
    
    setTimeout(
        () => { res.status(500).send('Error message from server') }
    , 2000);

});
// -------------------------------------------------------------------------------------
app.get('/products/delay', (req, res) => {
    
    setTimeout(
        () => { 
            Product.find().lean().exec(
                (err, produtos) => {
                    if(err) res.status(500).send(err);
                    else res.status(200).send(produtos);
                }
            );
        }
    , 2000);

});
// -------------------------------------------------------------------------------------
app.get('/products/ids', (req, res) => {
    
    Product.find().lean().exec(
        (err, produtos) => {
            if(err) res.status(500).send(err);
            else res.status(200).send(produtos.map(p => p._id));
        }
    );

});
// -------------------------------------------------------------------------------------
app.get('/products/name/:id', (req, res) => {
    
    const id = req.params.id

    Product.findById(id).lean().exec(
        (err, prod) => {
            if(err) res.status(500).send(err);
            else if(!prod) res.status(400).send({})
            else res.status(200).send(prod.name);
        }
    );

});
// -------------------------------------------------------------------------------------
app.post('/products', (req, res) => {

    p = new Product({
        name: req.body.name,
        department: req.body.department,
        price: req.body.price
    });

    p.save((err, prod) => {
        if(err) res.status(500).send(err);
        else res.status(200).send(prod);
    })

});
// -------------------------------------------------------------------------------------
app.delete('/products/:id', (req, res) => {

    Product.deleteOne({ _id: req.params.id }, 
        (err) => {
            if(err) res.status(500).send(err);
            else res.status(200).send({});
        });

});
// -------------------------------------------------------------------------------------
app.patch('/products/:id', (req, res) => {

    Product.findById(req.params.id, 
        (err, prod) => {
            if(err) res.status(500).send(err);
            else if(!prod) res.status(404).send( { } );
            else {
                prod.name = req.body.name;
                prod.price = req.body.price;
                prod.department = req.body.department;
                prod.save((err, prod) => {
                    if(err) res.status(500).send(err);
                    else res.status(200).send(prod);
                })
            }
        });

});
// -------------------------------------------------------------------------------------

app.listen(3000);