define(function(require, exports, module){
    var $ = require("JQ");
    var Login = function(){ };

    Login.prototype = {

        init:function(){
            this.eleName     = $('#uName');
            this.elePassword = $('#password');
            this.eleBtnLogin = $('.btn-login');
            this.bindEvent();
        },

        bindEvent:function(){
            var _this = this;
            this.eleBtnLogin.on("click",function(){
                window.location.href ="/admin"
            });
        }



    }



    module.exports = new Login();

});