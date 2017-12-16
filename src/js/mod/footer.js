var Event = require('mod/event.js');
var Footer = {
  init:function(){
    this.$footer = $('footer')
    this.$ul = this.$footer.find('ul')
    this.$box = this.$footer.find('.box')
    this.$leftBtn = this.$footer.find('.icon-left')
    this.$rightBtn = this.$footer.find('.icon-right')
    this.isToEnd = false
    this.isToStart = true
    this.isAnimate = false

    this.bind()
    this.render()
  },

  bind:function(){
    var _this = this
    $(window).resize(function(){
      _this.setStyle()
    })
    this.$rightBtn.on('click',function(){
      if(_this.isAnimate) return
      var itemWidth = _this.$box.find('li').outerWidth(true)
      var rowCount = Math.floor(_this.$box.width()/itemWidth)

      if(!_this.isToEnd){
        _this.isAnimate = true
        _this.$ul.animate({
          left:'-='+rowCount * itemWidth
        },400,function(){
          _this.isAnimate = false
          _this.isToStart = false
          if(parseInt(_this.$box.width()) - parseInt(_this.$ul.css('left')) >= _this.$ul.width()){
            _this.isToEnd = true
            // _this.$rightBtn.addClass('disabled')
          }
        })
      }
    })

    this.$leftBtn.on('click',function(){
      if(_this.isAnimate) return
      var itemWidth = _this.$box.find('li').outerWidth(true)
      var rowCount = Math.floor(_this.$box.width()/itemWidth)
      if(!_this.isToStart){
        _this.isAnimate = true
        _this.$ul.animate({
          left:'+='+rowCount * itemWidth
        },400,function(){
          _this.isAnimate = false
          _this.isToEnd = false
          if(parseInt(_this.$ul.css('left')) >= 0){
            _this.isToStart = true
            // _this.$leftBtn.addClass('disabled')
          }
        })
      }
    })

    this.$footer.on('click','li',function(){
      $(this).addClass('active')
            .siblings().removeClass('active')

    Event.fire('select-albumn',{
      channelId:$(this).attr('data-channel-id'),
      channelName:$(this).attr('data-channel-name')
  })
    })
  },

  render:function(){
    var _this = this
    $.getJSON('//api.jirengu.com/fm/getChannels.php')
      .done(function(ret){
      _this.renderFooter(ret.channels)
    }).fail(function(error){
      console.log('error');
    })
  },

  renderFooter:function(channels){
    var html = ''
    channels.forEach(function(channel){
      html += '<li data-channel-id='+channel.channel_id+' data-channel-name='+channel.name+'>'
            + ' <div class="cover" style="background-image:url('+channel.cover_small+')"></div>'
            + ' <h3>'+channel.name+'</h3>'
            + '</li>'
    })
    this.$ul.html(html)
    this.setStyle()
  },

  setStyle:function(){
    var count = this.$footer.find('li').length
    var width = this.$footer.find('li').outerWidth(true)
    this.$ul.css({
      width:count * width + 'px'
    })
  }
}
module.exports = Footer
