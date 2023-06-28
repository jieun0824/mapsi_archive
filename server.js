

//express 라이브러리 첨부와사용
const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;

//ejs
app.set('view engine', 'ejs');

//body-parser
app.use(express.urlencoded({extended: true}))

//db통신
var db;
MongoClient.connect('mongodb+srv://suspen064:ashley824@cluster0.ft73auc.mongodb.net/?retryWrites=true&w=majority', {useUnifiedTopology:true}, function(에러, client){
  if (에러) return console.log(에러)
  db = client.db('mapsi');

  app.listen(8080, function(){
    console.log('listening on 8080')
  })
})


//get 요청


//get 요청시 html파일을 쏴주기
//sendFile() 함수를 쓰면파일을보낼 수 있다. 
//__dirname -> 현재 파일의 경로 (같은경로)
app.get('/', function(요청, 응답){
    응답.sendFile(__dirname+'/index.html')
});

//write 보여주는


//post 요청 처리

app.post('/add', function(요청, 응답){
  db.collection('counter').findOne({name:'게시물갯수'}, function(에러, 결과){
    var 총게시물갯수 =결과.totalPost;
    db.collection('guestmessage').insertOne({_id: (총게시물갯수+1), 받는이: 요청.body.toName, 보내는이: 요청.body.fromName, 내용: 요청.body.message, 비밀번호: 요청.body.password}, function(){
      db.collection('counter').updateOne( {name : '게시물갯수' } , { $inc : { totalPost : 1 } } , function(에러, 결과){
        if(에러){return console.log(에러)}

        return 응답.redirect('/list');
        
        
      })
    });
  });

  });


  app.get('/list', function(요청, 응답){
    db.collection('guestmessage').find().toArray(function(에러, 결과){
      console.log(결과)
      응답.render('list.ejs', {posts: 결과})
    })
  })

//delete
app.delete('/delete', function(요청, 응답){
  요청.body._id = parseInt(요청.body._id);
  console.log(요청.body)
  db.collection('guestmessage').deleteOne({_id: 요청.body._id}, function(에러, 결과){

  })
  응답.status(200).send({message:'삭제완료'})

})



//
