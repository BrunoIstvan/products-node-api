const mongoose = require('mongoose');
const Product = require('./product');
const Faker = require('faker');

const mongoURI = 'mongodb://localhost:27017/http_client';

mongoose.connect(mongoURI, {useNewUrlParser: true});

async function generateProducts() {

    for( let i = 0; i < 10; i++) {

        let prod = new Product({
            name: Faker.commerce.productName(),
            department: Faker.commerce.department(),
            price: Faker.commerce.price()
        });

        try {
            
            await prod.save();

        } catch (error) {
            throw new Error('Error generating products');
        }

    }

}

generateProducts()
    .then(() => {
        mongoose.disconnect();
        console.log('Products OK');
    })
    .catch(error => log(`Oh no, something went wrong!`, error));
