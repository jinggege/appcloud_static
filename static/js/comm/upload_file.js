
/**
 * Author: mj
 * description: comm  upload file
 *
 */
define(function(require,exports,module){
    var $ = require('JQ');
    var U = require('UTIL');

    var UploadFile = function(){
    }

    UploadFile.prototype = {

        /**
         * params
         *  {
         *     elem://绑定触发元素    '#btn-upload'
         *     url: //上传接口  //http://www.btg.com/upload
         *     callback: //回调
         * }
         */
        upload:function(options){
            layui.use('upload', function(){
                var upload = layui.upload;
                var uploadInst = upload.render({
                  elem: options.elem, 
                  url: options.url,
                  field:"avatar",
                  accept:"file",
                  done: function(res){
                      if(options.callback){
                        options.callback(res);
                      }
                  },
                  error: function(err){
                    if(options.callback){
                        options.callback(null);
                    }
                  }
                });
              });

        }

      



    }

    module.exports = new UploadFile();

});