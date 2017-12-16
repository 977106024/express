var Toast = require('./toast.js').Toast;
var Note = require('./note.js').Note;
var Event = require('mod/event.js');


var NoteManager = (function(){

  function load() {
    $.get('/api/notes')
      .done(function(ret){
        if(ret.status == 0){
          $.each(ret.data, function(idx, article) {
              new Note({
                id: article.id,
                context: article.text,
                offsetTop:article.offsetLeft,
                offsetLeft:article.offsetTop,
              });
          });

          Event.fire('waterfall');
        }else{
          Toast(ret.errorMsg);
        }
      })
      .fail(function(){
        Toast('网络异常');
      });


  }

  function add(){
    new Note();
  }

  return {
    load: load,  //加载全部
    add: add  //添加便签
  }

})();

module.exports.NoteManager = NoteManager
