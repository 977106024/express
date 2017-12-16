var express = require('express');
var router = express.Router();
var Note = require('../model/note.js').Note;

/* 获取所有 notes */
router.get('/notes',function(req,res,next){
  var opts = {raw: true} //如果没有登陆 获取全部
  if(req.session.user){  //如果登陆 只获取登陆用户自己的
    opts.where = {uid:req.session.user.id}
  }

  Note.findAll(opts).then(function(notes){
    res.send({status:0,data:notes})
  }).catch(function(){
    res.send({status:1,errorMsg:'数据库异常'})
  })
})

/*新增 note*/
router.post('/notes/add',function(req,res,next){
  if(!req.session.user){
    return res.send({status:1,errorMsg:'请先登陆'})
  }
  if(!req.body.note){
    return res.send({status:2,errorMsg:'内容不能为空'})
  }

  var uid = req.session.user.id
  Note.create({text:req.body.note,offsetLeft:req.body.offsetTop,offsetTop:req.body.offsetLeft,uid:uid}).then(function(){
    res.send({status:0})
  }).catch(function(){
    res.send({status:1,errorMsg:'数据库异常或者你没有权限'})
  })
})

/*修改 note*/              //express req.body 请求主体             //sequelize 传递一个 where 对象来过滤查询。
router.post('/notes/edit',function(req,res,next){
  if(!req.session.user){
    return res.send({status:1,errorMsg:'请先登陆'})
  }
  console.log(req.body.note)
  console.log(req.body.offsetLeft)
  console.log(req.body.offsetTop)
  var uid = req.session.user.id
  Note.update({text:req.body.note,offsetLeft:req.body.offsetTop,offsetTop:req.body.offsetLeft},{where:{id:req.body.id,uid:uid}}).then(function(list){
    console.log(list)
    if(list[0] === 0){
      return res.send({status:1,errorMsg:'请输入内容'})
    }
    res.send({status:0})
  }).catch(function(){
    res.send({status:1,errorMsg:'数据库异常'})
  })
})

/*删除note*/
router.post('/notes/delete',function(req,res,next){
  if(!req.session.user){
    return res.send({status:1,errorMsg:'请先登陆'})
  }

  var uid = req.session.user.id
  Note.destroy({where:{id:req.body.id,uid:uid}}).then(function(deleteLen){
    if(deleteLen === 0){
      return res.send({status:1,errorMsg:'你没有权限'})
    }
    res.send({status:0})
  }).catch(function(){
    res.send({status:1,errorMsg:'数据库异常'})
  })
})

module.exports = router;
