require('less/index.less');

var NoteManager = require('mod/note-manager.js').NoteManager;
var Event = require('mod/event.js');
var WaterFall = require('mod/waterfall.js');
var Footer = require('mod/footer.js');
var Fm = require('mod/fm.js');
Footer.init()
Fm.init()

NoteManager.load(); //加载全部数据

$('.add-note').on('click',function(){  //添加便签
  NoteManager.add()
})

// Event.on('waterfall',function(){
//   WaterFall.init($('#content'))
// })
$('.btn').on('click',function(){
  WaterFall.init($('.notes'))
})
