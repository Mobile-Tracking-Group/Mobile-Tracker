require('../model/user');
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var user = mongoose.model('user', user);
var device = mongoose.model('device', device);
var sess;
var path = require('path'),
  fs = require('fs');
var image = mongoose.model('image' , image);


exports.add_dev = function(req, res) {
    new device({
        device_name: req.body.name,
        device_os: req.body.os,
        device_mac: req.body.mac,
        device_sim: req.body.sim,
        device_imei: req.body.imei,
        device_location: req.body.location,
        device_availability: "A",
        device_user: "No User",
        device_usermail: "No User",
        device_id: req.body.id
    }).save(function(err, devicess, count) {
        var tmp_path = req.files.file.path;
    // Set where the file should actually exists - in this case it is in the "images" directory.
    var target_path = './public/' + req.body.name + req.files.file.name;
    console.log(target_path);
    // Move the file from the temporary location to the intended location
    fs.rename(tmp_path, target_path, function(err) {
        if (err)
            throw err;
        // Delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files.
        fs.unlink(tmp_path, function() {
            if (err)
                throw err;
            //
            
        });
    });
    new image({
        device: req.body.name,
        path: req.files.file.name
        
    }).save(function(err, devicess, count) {
        res.redirect('/');
    });
    });

};




exports.newdev = function(req, res) {
    sess = req.session;
    if (sess.username) {
        res.render('add_dev', {
            username: sess.username
        });
    }
};


exports.delete = function(req, res) {
    device.findById(req.params.id, function(err, devices) {
        image.findOne({
            'device': devices.device_name
             }, function(err, images) {
             images.remove(function(err, imagess) {
           
              });
        });
        devices.remove(function(err, devicess) {
            res.redirect('/');
        });
    });
};


exports.adminpage = function(req, res) {
    sess = req.session;
    if (sess.username) {
        user.findOne({
        'username': sess.username
    }, function(err, user) {
          if (user.access == 'U') {
                res.redirect('/');
            } else {
      
   
        device.find(function(err, devices, count) {
            res.render('adminpage', {
                username: sess.username,
                devices: devices,
                device1: devices
            });
        });
    }
    });

    } else {
        res.redirect('/');
    }
};

exports.admin = function(req, res) {
    sess = req.session;
    if (sess.username) {

        user.findOne({
        'username': sess.username
    }, function(err, user) {
          if (user.access == 'U') {
                res.redirect('/');
            } else {

        device.find(function(err, devices, count) {
            image.find(function(err, images, count) {
                res.render('admin', {
                    username: sess.username,
                    devices: devices,
                    device1: devices,
                    images:images
                });
            });
        });
    }
    });
    } else {
        res.redirect('/');
    }
};

exports.block = function(req, res) {
    sess = req.session;
    device.findById(req.params.id, function(err, devices) {
        devices.device_user = "No User";
        devices.device_availability = "B";

        devices.save(function(err, devices, count) {
            res.redirect('/');
        });
    });
};

exports.unblock = function(req, res) {
    sess = req.session;
    device.findById(req.params.id, function(err, devices) {
        devices.device_user = "No User";
        devices.device_availability = "A";

        devices.save(function(err, devices, count) {
            res.redirect('/');
        });
    });
};