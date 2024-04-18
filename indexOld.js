const mysql = require('mysql2');
const { fakerEN_IN: faker } = require('@faker-js/faker');

function getRandomUser(){
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
}
let bulkUsers=[]
for(let i=0;i<100;i++){
  bulkUsers.push(getRandomUser());
}
// console.log(getRandomUser())

// Create the connection to database
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'delta_app',
    password:'raghav'
})

q="insert into users (id,username,email,password) values (?, ?, ? ,?)"
user=[101,'raghav','raghav@gmail.com','raghav'];

q2="insert into users (id,username,email,password) values ?"
user2=[
  [102, 'john_doe', 'john_doe@example.com', 'password123'],
  [103, 'jane_smith', 'jane_smith@example.com', 'letmein']
]



try{
  connection.query(q2,[bulkUsers],(err,result)=>{
    if(err) throw err;
    console.log(result);
    connection.end()
  })
}
catch(e){
console.log("error : ",e);
}





