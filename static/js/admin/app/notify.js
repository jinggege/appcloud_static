/**
 * 事件处理
 */

define(function(require, exports, module){

    var Notify = function(){ };

    var listenerList = [];

    Notify.prototype = {

        init:function(){},

        /**
         * 发送事件
         */
        emit:function(eventType, data, target){
            var item = this.getListener(eventType);
            
            if(item == null){
                alert(eventType+"：事件未注册!");
                return;
            }

            var emitItem = {
                eventType:eventType,
                data:data,
                target:target
            }

            item.callback.call(null, emitItem );
        },


        /**
         * 注册监听事件
         */
        addListener:function(eventType, callback){
            var item = this.getListener(eventType);

            if(item != null){
                alert(eventType+"：事件重复注册!");
                return;
            }

            listenerList.push(
                {eventType:eventType, callback:callback}
            );

        },


        getListener:function(eventType){

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