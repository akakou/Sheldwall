/*
  app/index.js

  It is config source of sheldwall.
*/
'use strict'

var MongoClient = require("mongodb").MongoClient;
var fs = require('fs');


var config = {
  // admin auth data
  auth: {
    name: 'admin',
    password: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  },

  // git repository
  git: {
    url: process.env.GIT,
    directory: 'signature'
  },

  // mongo db
  mongo: {
    url: 'mongodb://db:27017/local',
  },

  // port
  port: {
    proxy: process.env.PROXY_PORT,
    web: process.env.WEB_PORT
  },

  // ssl keys
  ssl: {
    key: fs.readFileSync(__dirname + process.env['SSL_KEY'], 'utf8'),
    cert: fs.readFileSync(__dirname + process.env['SSL_CERT'], 'utf8')
  },

  // danger_message
  danger_message: 'This site is danger !'
};


module.exports = config;
