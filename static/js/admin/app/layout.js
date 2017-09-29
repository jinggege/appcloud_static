define(function(require, exports, module){
    var $ = require("JQ");

    var L = require("LAY");

    var Layout = function(){ };

    Layout.prototype = {

        init:function(){
            L.resize();
            this.eleTemp = $(".temp");
            this.screenH = $(".phone").height();
            this.eleTemp.css("height",this.screenH+"px");
        }


    };


    module.exports = new Layout();

});