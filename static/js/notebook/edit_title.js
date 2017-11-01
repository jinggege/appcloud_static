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

            this.getTitleList();

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

        },

        getTitleList:function(){
            var _this = this;
            var url = "http://api.appcloud.com/nb/gettitle";
            U.get(url,{}, function(data){
                    console.log(data);
                    var titleList = data.data;
                    var item = null;
                    var html = '<div>';
                    for(var i=0; i<titleList.length; i++){
                        item = titleList[i];
                        html += '<div>';
                        html += item.title_id+"-----"+item.title;
                        html += '</div>';
                    }
                    html += '</div>';

                    _this.eleTitleList.append( $(html) );


                    
                },
                function(data){ },
                function(data){  }
            );
        }




    }



    module.exports = new EditTitle();


});