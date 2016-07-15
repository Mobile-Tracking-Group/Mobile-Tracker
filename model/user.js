var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;
var secret = require('../config/secret');


var user = new Schema({
    username    : String,
    password    : String,
    email		: String,
    access		: String
});

var device = new Schema({
	device_name : String,
	device_os : String,
	device_mac : String,
	device_sim : String,
	device_imei : String,
	device_location : String,
	device_availability : String,
	device_user : String,
	device_usermail : String,
	device_id : String
});

var image = new Schema({
    path    : String,
    device    : String
});

mongoose.model('device' , device);
mongoose.model('image' , image);
mongoose.model( 'user', user );
mongoose.connect( secret.databse );