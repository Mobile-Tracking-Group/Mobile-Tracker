require('../model/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user', user);
var device = mongoose.model('device', device);
var bcrypt = require('bcrypt-nodejs');
var sess;
var image = mongoose.model('image' , image);


exports.sign = function(req, res) {
    res.render('sign', {
        errormsg: ''
    });
};

exports.create = function(req, res) {
    if(req.body.password!=req.body.cpassword){
       res.render('sign', {
        errormsg: "Passwords don't match"
    }); 
    }
    else
    {
    user.findOne({
        'username': req.body.username
    }, function(err, users) {
        if (!users) {
            var hash = bcrypt.hashSync(req.body.password);

            new user({
                username: req.body.username,
                password: hash,
                email: req.body.email,
                access: 'U'
            }).save(function(err, user, count) {
                res.redirect('/');
            });

        } else {
            res.redirect('/signsame');
        }
    });
}
};

exports.signsame = function(req, res) {
    res.render('sign', {
        errormsg: 'User already exists'
    });
};