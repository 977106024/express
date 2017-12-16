var WaterFall = (function(){
  var $ct;
  var $items;

  function render($c){
    $ct = $c;
    $items = $ct.children();

    var nodeWidth = $items.outerWidth(true), //元素的宽度 true表示包括margin
        colNum = parseInt($(window).width()/nodeWidth), //窗口宽度/单个元素的宽度 得知一行能容纳几个元素

        colSumHeight = [];

    for(var i=0;i<colNum;i++){
      colSumHeight.push(0);   //初始值
    }

    $items.each(function(){
      var $cur = $(this);

      var idx = 0;
      minSumHeight = colSumHeight[0]; //第一个元素的高度

      for(var i=0;i<colSumHeight.length;i++){
        if(colSumHeight[i] < minSumHeight){
          idx = i;
          minSumHeight = colSumHeight[i]  //找出最小高度的元素
        }
      }

      $cur.css({
        left: nodeWidth*idx, //距离左边的宽度
        top: minSumHeight    //距离上边的高度
      })
      colSumHeight[idx] = $cur.outerHeight(true) + colSumHeight[idx]
      // 新高度
    })
  }

  $(window).on('resuze',function(){//窗口大小变化时 重新布局
    render($ct)
  })

  return {
    init: render
  }

})();

module.exports = WaterFall
