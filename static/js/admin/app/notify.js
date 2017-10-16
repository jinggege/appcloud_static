/**
 * 事件处理
 */

define(function(require, exports, module){

    var Notify = function(){ };

    var listenerList = [];

    Notify.prototype = {

        /**
         * 发送事件
         */
        emit:function(eventType, data){
            var item = this.getListtener(eventType);
            
            if(item == null){
                alert(eventType+"：事件未注册!");
                return;
            }

            item.callback.call(data);
        },


        /**
         * 注册监听事件
         */
        addListener:function(eventType, data, callback){
            var item = this.getListtener(eventType);

            if(item != null){
                alert(eventType+"：事件重复注册!");
                return;
            }

            listenerList.push(
                {eventType:eventType, data:data, callback:callback}
            );

        },


        getListtener:function(eventType){

            var len = listenerList.length;

            var i=0;
            var item = null;
            for(i=0; i<len; i++){
                item = listenerList[i];
                if(item.eventType == eventType){
                    return item;
                }
            }

            return null;
        }




    }



    module.exports = new Notify();

});