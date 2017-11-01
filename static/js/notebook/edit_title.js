/**
 * 主题编辑
 */
define(function(require, exports, module){

    var $ = require("JQ");
    
    var U = require("UTIL");

    var EditTitle = function(){ };

    EditTitle.prototype = {

        init:function(){

            this.eleTitleList = $('.title-list-con');

            this.eleInTitle = $('#in-title');

            this.eleSubBtn = $('.btn-sub');

            this.bindEvent();

        },

        bindEvent:function(){
            var _this = this;

            _this.eleSubBtn.on("click",function(){
                var txt = _this.eleInTitle.val();
                var url = "http://api.appcloud.com/nb/addtitle";
                U.get(url,{content:txt}, function(data){
                        console.log(data);
                    },
                    function(data){ },
                    function(data){  }
                );
            });


        }


    }



    module.exports = new EditTitle();


});