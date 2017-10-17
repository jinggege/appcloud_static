define(function(require, exports, module){

    var $ = require("JQ");

    var STemp = require("./select_temp.js");

    var N = require("./notify.js");

    var EType = require("./event_type.js");

    var ToolBar = function(){ };

    ToolBar.prototype = {

        init:function(){

            var _this = this;

            $('.tool-item').on("click",function(){
                var btnFlag = $(this).attr("tool-name");

                console.log(btnFlag);//todo 此处报错  为何?

                switch(btnFlag){
                    case "temp" :
                        STemp.open();

                        //N.emit(EType.E_SWITCH_TEMP, {name:123}, _this);
                    break;

                    case "define" :

                    break;

                    case "temp-save" :
                        N.emit(EType.E_SAVE_TEMP, "", _this);
                    break;

                    case "temp-list" :

                    break
                }

            });

        }


    }


    module.exports = new ToolBar();

});