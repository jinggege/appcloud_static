define(function(require, exports, module){

    var $ = require("JQ");

    var Tpl1000 = function(){  };

    Tpl1000.prototype = {

        init:function(){
            this.eleTemp = $(".temp");
            this.screenH = $(".phone").height();
            this.eleTemp.css("height",this.screenH+"px");
        }

    



    }


    module.exports = new Tpl1000();


});