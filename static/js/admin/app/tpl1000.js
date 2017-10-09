define(function(require, exports, module){

    var $ = require("JQ");

    var Tpl1000 = function(){  };

    Tpl1000.prototype = {

        init:function(){

            this.toBottom($('.temp1000'), $(".footer"));

        },

        toBottom:function(conELe, targetEle){

            var flagEle = $('.main-title');

            var flagTop = flagEle.offset().top;

            var flagH = flagEle.height();
           
            var conH = $('.temp1000').height();

            var targetH = targetEle.height();

            var offY = conH - flagTop + flagH  - targetH;


            //targetEle.css("top",offY+"px");


        }



    }


    module.exports = new Tpl1000();


});