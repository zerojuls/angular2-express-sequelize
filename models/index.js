"use strict";

var fs        = require("fs");
var path      = require("path");
var Sequelize = require("sequelize");
var sequelize = new Sequelize(process.env.POSTGRESQL_LOCAL_DB, "", "", {
    host : 'localhost',
    dialect: 'postgres',

    pool: {
        max: 9,
        min: 0,
        idle: 10000
    }
});


var db = {};

fs
    .readdirSync(__dirname)
    .filter(function(file) {
        return (file.indexOf(".") !== 0) && (file !== "index.js");
    })
    .forEach(function(file) {
        var model = sequelize["import"](path.join(__dirname, file));
console.log("file:"+file) ;
console.log("model.name:"+model.name) ;
        db[model.name] = model;
    });

Object.keys(db).forEach(function(modelName) {
    if ("associate" in db[modelName]) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;