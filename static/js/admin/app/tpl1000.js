define(function(require, exports, module){

    var $ = require("JQ");

    var Tpl1000 = function(){  };

    Tpl1000.prototype = {

        init:function(){
            this.eleTemp = $(".temp");
            this.screenH = $(".phone").height();
            this.eleTemp.css("height",this.screenH+"px");

            this.editAreaEle = $(".area-edit");

            this.createEditDom();

            this.inTxtEle1 = $('.temp1000-text1');
            this.inTxtEle2 = $('.temp1000-text2');
            this.inTxtEle3 = $('.temp1000-text3');

            this.outTxtEle1 = $("#temp1000-edit-input1");
            this.outTxtEle2 = $("#temp1000-edit-input2");
            this.outTxtEle3 = $("#temp1000-edit-input3");

            this.bindEvent();
        },

        bindEvent:function(){
            var _this = this;

            $('.btn-temp1000-edit').on("click",function(){
                _this.inTxtEle1.text( _this.outTxtEle1.val() );
                _this.inTxtEle2.text( _this.outTxtEle2.val() );
                _this.inTxtEle3.text( _this.outTxtEle3.val() );

                


            });


        },

        createEditDom:function(){

            var html  = [
            '<div class="edit-panel">',
                '<form class="layui-form layui-form-pane"> ',
                   ' <div class="layui-form-item">',
                        '<label class="layui-form-label">文字1</label>',
                        '<div class="layui-input-block">',
                            '<input name="title" id="temp1000-edit-input1" placeholder="输入内容，替换文字1" autocomplete="off" class="layui-input" type="text">',
                        '</div>',
                    '</div>',

                    '<div class="layui-form-item">',
                        '<label class="layui-form-label">文字2</label>',
                        '<div class="layui-input-block">',
                            '<input name="title" id="temp1000-edit-input2"  placeholder="输入内容，替换文字2" autocomplete="off" class="layui-input" type="text">',
                        '</div>',
                    '</div>',

                    '<div class="layui-form-item layui-form-text">',
                        '<label class="layui-form-label">文字3</label>',
                        '<div class="layui-input-block">',
                            '<textarea  id="temp1000-edit-input3" placeholder="输入内容，替换文字3" class="layui-textarea"></textarea>',
                        '</div>',
                    '</div>',
                '</form>',

                '<div class="layui-form-item">',
                    '<button class="layui-btn btn-temp1000-edit" >修改</button>',
                '</div>',

            '</div>'
         ];


         $('.edit-panel').remove();

         this.editAreaEle.append( $(html.join("")) );

        }







    



    }


    module.exports = new Tpl1000();


});