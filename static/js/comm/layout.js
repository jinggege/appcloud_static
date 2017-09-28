define(function(require, exports, module){
    var $ = require("JQ");

    var Layout = function(){ };

    Layout.prototype = {

        resize:function(){
            var _this = this;
            this.eleMenuLeft = $('.M-menu-left');
            this.eleMContent = $('.M-content');
            this.doc = $(document);
            _this.setEleWH();

           $(window).resize(function(){
               _this.setEleWH();

           });


        },

        setEleWH:function(){
            var cW = this.doc.width()-200;
            var cH = this.doc.height()-60;
            this.eleMenuLeft.css("height",cH+'px');
            this.eleMContent.css({
                "width":cW+'px',
                "height":cH+'px'
            });


        }


    }

    module.exports = new Layout();

});