require('less/note.less');

var Toast = require('./toast.js').Toast;
// var Event = require('mod/event.js');

function Note(opts){
  this.initOpts(opts);
  this.createNote();
  this.setStyle();
  this.bindEvent(opts);
}
Note.prototype = {
  colors: [
    ['./images/button.jpg','#FEF4AC'],  //默认样式
    ['./images/button2.jpg','#4AA09D'],
    ['./images/button3.jpg','#DD598B'],
    ['./images/button4.jpg','#CCCCFE']
    // ['#c1c341','#d0d25c'],
    // ['#3f78c3','#5591d2'],
    // ['#635041','#BA3548'],
    // ['#BA3548','#635041'],
    // ['#BDB993','#635041'],
    // ['#635041','#F1B62E'],
    // ['#4AA09D','#30A78B'],
    // ['#30A78B','#4AA09D']
  ],

  defaultOpts:{
    id:'',   //Note的 id
    $ct: $('.notes').length>0 ? $('.notes') : $('body'),  //默认存放 Note 的容器
    content: 'input here',  //Note 的内容
    offsetTop:50,
    offsetLeft:10
  },

  initOpts: function(opts){
    this.opts = $.extend({},this.defaultOpts,opts||{});  //合并对象 也是jq插件写法
    if(this.opts.id){                                    //$.fn.extend
      this.id = this.opts.id;
    }
  },

  createNote: function(){
    var tpl = '<div class="note">'
              + '<div class="note-head"><span class="delete">&times;</span></div>'
              + '<div class="note-ct" contenteditable="true"></div>'
              + '</div>';
    this.$note = $(tpl);                     // contenteditable 属性规定是否可编辑元素的内容。
    this.$note.find('.note-ct').html(this.opts.context);
    this.opts.$ct.append(this.$note);
    // if(!this.id) this.$note.css('bottom','10px');
  },

  setStyle: function(){
    var color = this.colors[Math.floor(Math.random()*4)]; //*n 因为有n组样式
    this.$note.find('.note-head').css('background-image','url('+color[0]+')'); //头部
    this.$note.find('.note-ct').css('background-color',color[1]);   //内容
  },

  // setLayout: function(){
  //   var self = this;
  //   if(self.clk){
  //     clearTimeout(self.clk)
  //   }
  //   self.clk = setTimeout(function(){
  //     Event.fire('waterfall')  //触发瀑布布局
  //   },100)
  // },

  bindEvent: function(opts){
    var self = this,
        $note = this.$note,
        $noteHead = $note.find('.note-head'),
        $noteCt = $note.find('.note-ct'),
        $delete = $note.find('.delete');

    $delete.on('click',function(){
      self.delete();
    })

    //判断内容的变动
    $noteCt.on('focus',function(){
      if($noteCt.html() == 'input here') $noteCt.html('');
      $noteCt.data('before',$noteCt.html());
    }).on('blur paste',function(){
      if($noteCt.data('before') != $noteCt.html()){
        $noteCt.data('before',$noteCt.html());
        this.msg = $noteCt.html()
        // self.setLayout();
        if(self.id){
          self.edit()
        }else{
          self.add($noteCt.html())
        }
      }
    });

    $note.offset({
      top:this.opts.offsetTop,
      left:this.opts.offsetLeft
    })
    //设置便利贴的移动
    $noteHead.on('mousedown',function(e){
      var evtX = e.pageX - $note.offset().left, //evtX 计算事件的触发点在 dialog内部到 dialog 的左边缘的距离
          evtY = e.pageY - $note.offset().top;
      $note.addClass('draggable').data('evtPos',{x:evtX,y:evtY});//把事件到 dialog 边缘的距离保存下来
    }).on('mouseup',function(){
      self.offset = $('.draggable').offset()
      $note.removeClass('draggable').removeData('evtPos')
      self.edit()
    })

    $('body').on('mousemove',function(e){
      $('.draggable').length && $('.draggable').offset({
        top: e.pageY - $('.draggable').data('evtPos').y,  // 当用户鼠标移动时，根据鼠标的位置和前面保存的距离，计算 dialog 的绝对位置
        left: e.pageX - $('.draggable').data('evtPos').x
      })
    })
  },

  edit: function(){

    var self = this;
    $.post('/api/notes/edit',{
      id:this.id,
      note:this.msg,
      offsetTop:this.offset.top,
      offsetLeft:this.offset.left,
    }).done(function(ret){
      if(ret.status === 0){
        Toast('update success')
      }else{
        Toast(ret.errorMsg)
      }
    })
  },

  add: function(msg){
    var self = this;
    $.post('/api/notes/add',{
      note:msg,
      offsetTop:this.offset.top,
      offsetLeft:this.offset.left,
      }).done(function(ret){
      if(ret.status === 0){
        Toast('add success')
      }else{
        self.$note.remove();
        // Event.fire('waterfall')
        Toast(ret.errorMsg)
      }
    })
  },

  delete: function(){
    var self = this;
    $.post('/api/notes/delete',{id:this.id}).done(function(ret){
      if(ret.status === 0){
        Toast('delete success')
        self.$note.remove()
        // Event.fire('waterfall')
      }else{
        Toast(ret.errorMsg)
      }
    })
  }
}

module.exports.Note = Note;
