define(function(require, exports, module){

    var $ = require("JQ");

    var U = require("UTIL");

    var CFG = window.CFG;

    //var T1000 = require("./tpl1000.js");

    var tempControlPath = CFG.static_domain+"/js/admin/app/"

    var SelectTemp = function(){ };

        SelectTemp.prototype = {

            open:function(){

                var _this = this;

                layer.open({
                    title:"选择模板",
                    closeBtn:1,
                    type: 1, 
                    content: _this.getDom(),
                    skin:"pop-select-temp",
                    area:['440px','700px']
                    
                });

                var currTmpIndex = 1;

                _this.setImg(currTmpIndex);

                $('.select-btn').on("click",function(){
                    var flag = $(this).attr("btn-flag");
                    switch(flag){
                        case "left" :
                            currTmpIndex--;
                            if(currTmpIndex <1){
                                currTmpIndex = 1;
                                layer.msg("到头啦!");
                            }
                            _this.setImg(currTmpIndex);
                        break

                        case "right" :
                            currTmpIndex++;
                            if(currTmpIndex>3){
                                currTmpIndex = 3;
                                layer.msg("到底啦!");
                            }
                            _this.setImg(currTmpIndex);
                        break;
                    }

                });


                $("#temp-img").on("click",function(){
                    var tempId = $(this).attr("temp-id");

                });

            },

            setImg:function(tempIndex){
                var imgEle = $('#temp-img');
                var baseUrl = CFG.static_domain+"/imgs/temp/imgs/temp_";
                var imgUrl = baseUrl + tempIndex+".png";
                imgEle.attr("src", imgUrl);
                imgEle.attr("temp-id",tempIndex);

                this.getTempHtml(1000);
            },


            getDom:function(){
                var html = '<div class="win-temp">';
                html += '<div class="s-t-panel s-t-btn" >';
                html += '<button class="layui-icon select-btn" btn-flag="left">&#xe65a</button>';
                html +='</div>';

                html += '<div class="s-t-panel s-t-panel-m" >';
                html += '<img id="temp-img">'
                html +='</div>';

                html += '<div class="s-t-pane s-t-btn" >';
                html += '<button class="layui-icon select-btn" btn-flag="right"  >&#xe65b;</button>';
                html +='</div>';

                html += '</div>';

                return html;
            },

            getTempHtml:function(tempId){
                var url = CFG.app_domain+"/temp/"+tempId;

                U.get(url,{},
                    function(data){
                        if(data.code != 0){
                            layer.msg(data.msg);
                            return;
                        }

                        var tempHtml = data.data;

                        var tempConEle = $('.phone');
                        $('.temp').remove();
                        tempConEle.append( $(tempHtml) );

                        var tempControl = require("./tpl1000.js");
                        tempControl.init();

                    },
                    function(data){ 
                        //console.log(2,data) 
                    },
                    function(data){ 
                        console.log("=error=") 
                    }
                );


            }


        }



    module.exports = new SelectTemp();

});