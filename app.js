
import db from './config.js';
import { createRequire } from "module";
import cons from 'consolidate';
import firebase from "firebase";
const require = createRequire(import.meta.url)
const express = require("express");
const bodypareser = require("body-parser");
const engines = require("consolidate");
const paypal = require("paypal-rest-sdk");

const app = express();

const state = {
    TotalPrice:0,
    userid:''
}

app.engine("ejs", engines.ejs);
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodypareser.json());
app.use(bodypareser.urlencoded({extended:true}));
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AeQ9P9PydfTrfqh_V_dnrmB0WCIiEWGsZePZQ3xa3_zC-EcQKDCyBu9I-AVPycdxjQF6IxVtz8jWt8mX',
    'client_secret': 'EGvBr_9XBOL_OF7S2Dg-cG-l1AfNt3o9h5Zh1sFjLkIgkAhK-7xZDbT98ljeSv3x7VnfoZ_56DhWrTE-'
  });

app.get("/", (req,res) => {
    res.render('index')
    totalprice()
});

const totalprice = async() => {
    const PriceCollection = db.collection('Status')
    const Snapshot = await PriceCollection.get().catch(error => {
        console.log(error)
    })
    Snapshot.docs.map(doc => {
        state.TotalPrice = doc.data().TotalPrice;
        console.log(doc.data().TotalPrice,"me hoo na")
    })
    state.TotalPrice = state.TotalPrice / 70
}

app.get('/paypal', (req,res) => {
    totalprice()
    console.log(state.TotalPrice)
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://192.168.1.106:3000/success",
            "cancel_url": "http://192.168.1.106:3000/cancel"
        },
        "transactions": [{
            "items_list": {
                "items": [{
                    "name":"Travel Easy Items",
                    "sku": "Items",
                    "price":state.TotalPrice,
                    "currency":"USD",
                    "quantity":"1"
                }]
            },
            "amount": {
                "currency": "USD",
                "total": state.TotalPrice
            },
            "description": "Travel Easy Payment"
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href)
        }
    });
});

app.get('/success', (req, res) => {

    var payerID = req.query.PayerID;

    var paymentID = req.query.paymentId

    var execute_payment_json = {
        "payer_id": payerID,
        "transactions": [{
            "amount": {
                "currency": "USD",
                "total": state.TotalPrice
            }
        }]
    };
    
    paypal.payment.execute(paymentID, execute_payment_json, function (error, payment) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log("Get Payment Response");
            console.log(JSON.stringify(payment));
            res.render('success')
        }
    });
});

app.get('/cancel', (req, res) => {
    res.render("cancel");
});

app.listen(3000, () => {
    console.log("Server Is Running");
});