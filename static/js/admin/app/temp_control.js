/**
 * 模板切换控制
 */

define(function(require, exports, module){

    var $ = require("JQ");

    var N = require("./notify.js");

    var EType = require("./event_type.js");

    var TempControl = function(){ };

    TempControl.prototype = {

        init:function(){

            N.addListener(EType.E_SWITCH_TEMP, this.switchTemp);

            N.addListener(EType.E_SAVE_TEMP,this.saveTemp);
        },

        switchTemp:function(data){
            console.log(1, data);
        },


        saveTemp:function(data){
            var tempHtml = $('.temp1000').prop("outerHTML");
            if( tempHtml == undefined){
                layer.msg("先请编辑模板!");
                return;
            }
            //todo  save to db
            console.log(tempHtml);
        }



    }



    module.exports = new TempControl();

});