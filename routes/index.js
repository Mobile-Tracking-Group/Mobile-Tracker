/*
 * GET home page.
 */
require('../model/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user', user);
var device = mongoose.model('device', device);
var bcrypt = require('bcrypt-nodejs');
var sess;

exports.about = function(req, res) {
    res.render('about');
};

exports.edit = function(req, res) {
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.username) {
    res.render('edit',{
        errormsg: '',
        username: sess.username
    });
    }
};

exports.change = function(req, res) {
    sess = req.session;
    user.findOne({
        'username': sess.username
    }, function(err, user1) {
        if (user1) {
            if (bcrypt.compareSync(req.body.oldpass, user1.password)){

    if(req.body.newpass!=req.body.cnewpass){
       res.render('edit', {
        errormsg: "Passwords don't match",
        username: sess.username
    }); 
    }
    else
    {
    user.findOne({
        'username': sess.username
    }, function(err, users) {
        
            var hash = bcrypt.hashSync(req.body.newpass);

                users.password = hash;
                
            users.save(function(err, user, count) {
                res.redirect('/');
            });

        
    });
}
}
else
{
   res.render('edit', {
        errormsg: "Please Re-enter old password",
        username: sess.username
    });  
}
}
else
{
   res.render('edit', {
        errormsg: "Please Re-enter old password",
        username: sess.username
    }); 
}
});
};

exports.index = function(req, res) {
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.username) {
        /*
         * This line check Session existence.
         * If it existed will do some action.
         */
        user.findOne({
            'username': sess.username
        }, function(err, user) {
            if (user) {
                if (user.access == 'U') {
                    res.redirect('/userpage');
                } else {

                    res.redirect('/adminpage')
                }
            } else {
                user.find(function(err, user, count) {
                    res.render('index', {
                        title: '',
                        user: user
                    });
                });
            }
        });
    } else {
        res.render('index', {
            title: '',
            user: user
        });
    }
};