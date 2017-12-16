var Event = require('mod/event.js');
var boomText = require('../lib/boomText.js');
var Fm = {
  init:function(){
    this.$container = $('#page-music')
    this.audio = new Audio()
    this.audio.autoplay = true

    this.bind()
  },

  bind:function(){
    var _this = this
    $(document).ready(function(){
      _this.loadMusic()
      _this.audio.play()
    })

    Event.on('select-albumn',function(channelObj){
      _this.channelId = channelObj.channelId
      _this.channelName = channelObj.channelName
      _this.loadMusic()
    })

    this.$container.find('.btn-play').on('click',function(){
      _this.$container[0].querySelector('.btn-play').classList.toggle('active')
      _this.$container[0].querySelector('.btn-pause').classList.toggle('active')
      _this.audio.play()
    })
    this.$container.find('.btn-pause').on('click',function(){
      _this.$container[0].querySelector('.btn-play').classList.toggle('active')
      _this.$container[0].querySelector('.btn-pause').classList.toggle('active')
      _this.audio.pause()
    })

    this.$container.find('.btn-next').on('click',function(){
      _this.loadMusic()
    })

    this.audio.addEventListener('play',function(){
      console.log('play')
      clearInterval(_this.statusClock)
      _this.statusClock = setInterval(function(){
        _this.updateStatus()
      },1000)
    })
    this.audio.addEventListener('pause',function(){
      console.log('pause')
      clearInterval(_this.statusClock)
    })
  },

  loadMusic(){
    var _this = this
    $.getJSON('//api.jirengu.com/fm/getSong.php',{channel:this.channelId ? this.channelId : 'public_tuijian_autumn'}).done(function(ret){
      _this.song = ret['song'][0]
      _this.setMusic()
      _this.loadLyric()
    })
  },

  loadLyric(){
    var _this = this

    $.getJSON('//api.jirengu.com/fm/getLyric.php',{sid:this.song.sid}).done(function(ret){
      var lyric = ret.lyric
      var lyricObj = {}
      lyric.split('\n').forEach(function(line){
        var times = line.match(/\d{2}:\d{2}/) //时间
        var str = line.replace(/\[.+?\]/g,'') //歌词
        if(Array.isArray(times)){          //过滤空的歌词
          times.forEach(function(time){
            lyricObj[time] = str
          })
        }
      })
      _this.lyricObj = lyricObj
    })
  },

  setMusic(){
    this.audio.src = this.song.url
    // $('.bg').css('background-image','url('+this.song.picture+')')
    this.$container.find('.aside figure').css('background-image','url('+this.song.picture+')')
    this.$container.find('.detail h1').text(this.song.title)
    this.$container.find('.detail .author').text(this.song.artist)
    this.$container.find('.detail .tag').text(this.channelName || '秋日私语')

    this.$container[0].querySelector('.btn-play').classList.remove('active')
    this.$container[0].querySelector('.btn-pause').classList.remove('active')
  },

  updateStatus(){
    console.log('update...')
    var min = Math.floor(this.audio.currentTime/60)
    var second = Math.floor(this.audio.currentTime%60)+''
    second = second.length === 2 ? second:'0'+second
    this.$container.find('.current-time').text(min+':'+second)
    this.$container.find('.bar-progress').css('width',this.audio.currentTime/this.audio.duration*100+'%')
                                                                      // 5/10 = 0.5 0.5*100
    var line = this.lyricObj['0'+min+':'+second]
    if(line){
      this.$container.find('.lyric p').text(line).boomText()
    }

  }
}
module.exports = Fm
