/**
 * UI 管理器
 */

define(function(require, exports, module ){

    var $ = require("JQ");

    var N = require("./notify.js");
    
    var EType = require("./event_type.js");
    
    var UIKey = require("./uikey.js");

    var UIControl = function(){ };

    var uiList = {};

    var _instance = null;


    UIControl.prototype = {

        init:function(){

            _instance = this;

            uiList[UIKey.UI_TEMP_LIST] = require("./select_temp.js");

            N.addListener(EType.E_UI_OPEN, this.openUI,this);

        },

        openUI:function(data){
            var uKey = data.data;

            var ui = _instance.getUI( uKey );
            
            ui.open();

        },

        getUI:function(uiKey){
            return uiList[uiKey];
        }

        


    }


    module.exports = new UIControl();

});