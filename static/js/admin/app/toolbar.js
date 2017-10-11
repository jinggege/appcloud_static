define(function(require, exports, module){

    var $ = require("JQ");

    var STemp = require("./select_temp.js");

    var ToolBar = function(){ };

    ToolBar.prototype = {

        init:function(){

            $('.tool-item').on("click",function(){
                var btnFlag = $(this).attr("tool-name");

                console.log(btnFlag);//todo 此处报错  为何?

                switch(btnFlag){
                    case "temp" :
                        STemp.open();
                    break;

                    case "define" :

                    break;

                    case "save-temp" :
                        var tempHtml = $('.temp1000').prop("outerHTML");
                        if( tempHtml == undefined){
                            layer.msg("先请编辑模板!");
                            return;
                        }
                        //todo  save to db
                        console.log(tempHtml);

                    break;
                }

            });

        }


    }


    module.exports = new ToolBar();

});