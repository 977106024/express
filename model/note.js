const Sequelize = require('sequelize');
const path = require('path');
const sequelize = new Sequelize('undefined', 'undefined', 'undefined', {
  host: 'localhost',
  dialect: 'sqlite',

  // 仅限 SQLite
  storage: path.join(__dirname,'../database/database.sqlite')
});

// sequelize //测试连接
//   .authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });

//创建表结构
const Note = sequelize.define('note', {
  text: {
    type: Sequelize.STRING
  },
  uid: {
    type: Sequelize.STRING
  },
  offsetLeft: {
    type: Sequelize.STRING
  },
  offsetTop: {
    type: Sequelize.STRING
  }
});

// sequelize.drop(Note)
// Note.drop();
// Note.sync({force:true})
//创建一个表
// Note.sync().then(() => {
//
//   Note.create({offsetTop: '375',
//               offsetLeft:'375',
//             text:'555555sss0'})
// }).then(function(){
//   //查询
//   Note.findAll({raw:true}).then(notes => {
//     console.log(notes)
//   })
// })

//按id查询
// Note.findAll({raw:true,where:{id:2}}).then(function(notes){
//   console.log(notes)
// })

module.exports.Note = Note;
