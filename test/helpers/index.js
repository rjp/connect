
/**
 * Module dependencies.
 */

var connect = require('connect');

require('./http')

exports.run = function run(middleware){
    return new connect.Server(middleware).listen();
}