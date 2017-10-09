define(function(require, exports, module){

    var $ = require("JQ");

    var STemp = require("./select_temp.js");

    var ToolBar = function(){ };

    ToolBar.prototype = {

        init:function(){

            $('.tool-item').on("click",function(){
                var btnFlag = $(this).attr("tool-name");
                switch(btnFlag){
                    case "temp" :
                        STemp.open();
                    break;

                    case "define" :

                    break;
                }


            });
        }


    }


    module.exports = new ToolBar();

});