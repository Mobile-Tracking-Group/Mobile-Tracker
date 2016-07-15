'use strict'

require('../model/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user', user);
var device = mongoose.model('device', device);
var sess;
var image = mongoose.model('image' , image);

var nodemailer = require("nodemailer");
var secret = require('../config/secret');
var smtpTransport = nodemailer.createTransport("SMTP", {
    service: "Gmail",
    auth: {
        user: secret.user,
        pass: secret.pass
    }
});


/** Purpose: module used for signup
    Date   : 04 july 2016
    Author : 
**/
exports.userpage = function(req, res) {
    sess = req.session;
    if (sess.username) {

        device.find(function(err, devices, count) {
            image.find(function(err, images, count) {
                res.render('userpage', {
                    username: sess.username,
                    devices: devices,
                    device1: devices,
                    images:images
                });
            });
        });

    } else {
        res.redirect('/');
    }
};


exports.info = function(req, res) {
    sess = req.session;
    if (sess.username) {

        device.findById(req.params.id, function(err, devices) {
            user.find({
                'username': devices.device_user
            }, function(err, users) {
                image.find(function(err, images, count) {
                 console.log(users);
                  if (users[0]) {
                        res.render('info', {
                         logged: sess.username,
                         email: users[0].email,
                         devices: devices,
                         images:images
                        });
                 } else {
                     res.render('info', {
                            logged: sess.username,
                            devices: devices,
                            images:images
                        });
                    }
                });
            });
        });
    } else {
        res.redirect('/');
    }
};

exports.search = function(req, res) {

    sess = req.session;
    if (sess.username) {

        device.find({
            'device_name': new RegExp(".*" + req.body.searchip + ".*", "i")
        }, function(err, devices) {
            device.find(function(err, device1, count) {

                image.find(function(err, images, count) {
                res.render('userpage', {
                    username: sess.username,
                    devices: devices,
                    device1: device1,
                    images:images
                });
            });
            });
        });
    } else {
        res.redirect('/');
    }


};

exports.search1 = function(req, res) {

    sess = req.session;
    if (sess.username) {

        device.find({
            'device_name': new RegExp(".*" + req.body.searchip + ".*", "i")
        }, function(err, devices) {
            device.find(function(err, device1, count) {

                image.find(function(err, images, count) {
                res.render('admin', {
                    username: sess.username,
                    devices: devices,
                    device1: device1,
                    images:images
                });
            });
            });
        });
    } else {
        res.redirect('/');
    }


};


exports.collect = function(req, res) {
    sess = req.session;
    device.findById(req.params.id, function(err, devices) {
        devices.device_user = sess.username;
        devices.device_availability = "U";

        devices.save(function(err, devices, count) {
            var mailOptions = {
            to: "abhijith.sharma@gmail.com",
            subject: "Device Collected",
            text: "The Device with id '" + devices.device_id + "' was collected by " + sess.username ,
            cc: "binoyyj@gmail.com" + ", ammuvimal8@gmail.com" + ", sarahasheena@gmail.com"
           }
             console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) { 
             if (error) {
                console.log(error);
                res.end("error");
            } else {
                 console.log("Message sent: " + response.message);
                  user.findOne({
        'username': sess.username
    }, function(err, user) {
          if (user.access == 'U') {
                res.redirect('/userpage');
            } else {

                res.redirect('/admin')
            }
       
        
    });
             }
             });
        });
    });
};

exports.return = function(req, res) {
    sess = req.session;
    device.findById(req.params.id, function(err, devices) {
        devices.device_user = "No User";
        devices.device_availability = "A";

        
            devices.save(function(err, devices, count) {
            var mailOptions = {
            to: "abhijith.sharma@gmail.com",
            subject: "Device Collected",
            text: "The Device with id " + devices.device_id + " was returned by " + sess.username ,
            cc: "binoyyj@gmail.com" + ", ammuvimal8@gmail.com" + ", sarahasheena@gmail.com"
           }
             console.log(mailOptions);
            smtpTransport.sendMail(mailOptions, function(error, response) { 
             if (error) {
                console.log(error);
                res.end("error");
            } else {
                 console.log("Message sent: " + response.message);
                 
   user.findOne({
        'username': sess.username
    }, function(err, user) {
          if (user.access == 'U') {
                res.redirect('/userpage');
            } else {

                res.redirect('/admin')
            }
       
        
    });



             }
            });
        });
    });
};


