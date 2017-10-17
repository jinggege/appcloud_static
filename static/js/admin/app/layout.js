define(function(require, exports, module){
    var $ = require("JQ");

    var L = require("LAY");

    var ToolBar = require("./toolbar.js");

    var TempControl = require("./temp_control.js");

    var UIControl = require("./ui_control.js");

    var Layout = function(){ };

    Layout.prototype = {

        init:function(){
            L.resize();
            this.eleTemp = $(".temp");
            this.screenH = $(".phone").height();
            this.eleTemp.css("height",this.screenH+"px");

            ToolBar.init();

            TempControl.init();

            UIControl.init();
        }
    };


    module.exports = new Layout();

});