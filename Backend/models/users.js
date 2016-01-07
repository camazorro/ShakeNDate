/**
 * Created by camazorro on 9/14/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema[{
    userID: String,
    password: String,
    lastLogin: {type: Date}
}];