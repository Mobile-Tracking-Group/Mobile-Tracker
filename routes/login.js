require('../model/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user', user);
var device = mongoose.model('device', device);
var bcrypt = require('bcrypt-nodejs');
var sess;
var image = mongoose.model('image' , image);


exports.failed = function(req, res) {
    user.find(function(err, user, count) {
        res.render('index', {
            title: 'Invalid Username or Password',
            user: user
        });
    });
};


exports.forget = function(req, res) {
    res.render('forgotpass');

};

exports.valid = function(req, res) {
    user.findOne({
        'username': req.body.user
    }, function(err, user) {
        if (user) {
            if (bcrypt.compareSync(req.body.pass, user.password)){
                sess = req.session;
                       //In this we are assigning email to sess.email variable.
            //email comes from HTML page.
            sess.username = req.body.user;
            if (user.access == 'U') {
                res.redirect('/userpage');
            } else {

                res.redirect('/adminpage')
            }
        }
        else {
            res.redirect('/failed');
        }
        } else {
            res.redirect('/failed');
        }
    });
};

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
};