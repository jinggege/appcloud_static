'use strict'
/**
 * appcloud 静态服务器
 */

var Koa = require("koa");

var StaticWare = require("koa-static");

var Path = require("path");

var cors = require('koa-cors');

var app = new Koa();

const STATIC_PATH = Path.resolve(__dirname,"..")+"/static";


const SERVER_PORT = 3001;

app.use( cors());

app.use( StaticWare(STATIC_PATH) );

app.listen( SERVER_PORT );

console.log("====appcloud static server start by "+SERVER_PORT+" ====");

