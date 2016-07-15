require('../model/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user', user);
var device = mongoose.model('device', device);
var secret = require('../config/secret');
var sess;

var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: secret.user,
        pass: secret.pass
    }
});


exports.return = function(req, res) {
     user.findOne({
        'username': sess.username
    }, function(err, user) {
    var mailOptions = {
        to: req.params.id,
        subject: "Request to Return the Device",
        text: req.body.date + "  " + req.body.purpose,
        cc: user.email 
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.redirect('/');
        }
    });
    });
};

exports.reqos = function(req, res) {
     user.findOne({
        'access': "A"
    }, function(err, user) {
    var mailOptions = {
        to: user.email,
        subject: "Request to Update OS",
        text: req.body.os + "  " + req.body.purpose,
        cc: "abhijith.sharma@gmail.com"
    }
    console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response) {
        if (error) {
            console.log(error);
            res.end("error");
        } else {
            console.log("Message sent: " + response.message);
            res.redirect('/');
        }
    });
    });
};

exports.recover = function(req, res) {
    user.findOne({
        'username': req.body.recname
    }, function(err, user) {
        if (user) {
            var mailOptions = {
                to: user.email,
                subject: "Password Recovery",
                text: user.password,
                cc: "binoyyj@gmail.com"
            }
            console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) {
                if (error) {
                    console.log(error);
                    res.end("error");
                } else {
                    console.log("Message sent: " + response.message);
                    res.redirect('/');
                }
            });
        } else {
            res.redirect('/');
        }
    });
};