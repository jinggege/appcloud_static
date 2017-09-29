define(function(require, exports, module){

    var L = require("LAY");

    var Apply = function(){ };

    Apply.prototype = {

        init:function(){
            L.resize();
            L.setTopMenuState("menu-apply");
        }


    }

    module.exports = new Apply();


});