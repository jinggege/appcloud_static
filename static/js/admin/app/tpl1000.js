define(function(require, exports, module){

    var $ = require("JQ");

    var Tpl1000 = function(){  };

    Tpl1000.prototype = {

        init:function(){
            this.eleTemp = $(".temp");
            this.screenH = $(".phone").height();
            this.eleTemp.css("height",this.screenH+"px");

            this.inTxtEle1 = $('.temp1000-text1');
            this.inTxtEle2 = $('.temp1000-text2');
            this.inTxtEle3 = $('.temp1000-text3');

            this.outTxtEle1 = $("#temp1000-edit-input1");
            this.outTxtEle2 = $("#temp1000-edit-input2");
            this.outTxtEle3 = $("#temp1000-edit-input3");

            this.bindEvent();
        },

        bindEvent:function(){
            console.log("event");
            var _this = this;
            $('.btn-temp1000-edit').on("click",function(){
                _this.inTxtEle1.text( _this.outTxtEle1.val() );
                _this.inTxtEle2.text( _this.outTxtEle2.val() );
                _this.inTxtEle3.text( _this.outTxtEle3.val() );

                console.log( _this.outTxtEle3.val() );

            });


        }

    



    }


    module.exports = new Tpl1000();


});