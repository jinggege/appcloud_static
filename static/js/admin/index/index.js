define(function(require, exports, module){

    var $ = require("JQ");
    
    var L = require("LAY");
    
    var Index = function(){ };
    
    Index.prototype = {
    
        init:function(){
                L.resize();
                L.setTopMenuState("menu-index");
        }
    
    
    }
    
    module.exports = new Index();
    
    });