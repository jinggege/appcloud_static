define(function(require, exports, module){
    var $ = require("JQ");

    var L = require("LAY");

    var TPL1000 = require("./tpl1000.js");

    var Layout = function(){ };

    Layout.prototype = {

        init:function(){
            L.resize();
            this.eleTemp = $(".temp");
            this.screenH = $(".phone").height();
            this.eleTemp.css("height",this.screenH+"px");
            this.adepterApp();
        },

        adepterApp:function(){
            TPL1000.init();

        }

    };


    module.exports = new Layout();

});