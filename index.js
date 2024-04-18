// this is new js (practice que wali)

const mysql = require('mysql2');
const { fakerEN_IN: faker } = require('@faker-js/faker');
const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "/views"));


// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'raghav'
})

app.listen(8080, () => {
  console.log(`server running at 8080`)
})

app.get("/", (req, resp) => {
  let q = `select count(*) from users`
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      console.log(result);
      // resp.send(result);  // output =>   [ { 'count(*)': 303 } ]
      let n = result[0]['count(*)']
      resp.render("home.ejs", { n });
      // connection.end()
    })
  }
  catch (e) {
    console.log("error in db : ", e);
  }
})

app.get("/users", (req, resp) => {
  let q = 'select * from users limit 10';
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      usersArr = result;
      console.log(result);
      resp.render("users.ejs", { usersArr });

    })
  }
  catch (e) {
    console.log(`Error in db : ${e}`);
  }
})

app.get("/users/:id/edit", (req, resp) => {
  let userId = req.params.id;
  console.log(userId)
  let q = `select id,username,email from users where id ='${userId}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      resp.render("edit.ejs", { user });
      console.log(user);
    })
  }
  catch (e) {
    resp.send(`Some error occured`);
    console.log(`Error : ${e}`);
  }
});

app.patch("/users/:id/", (req, resp) => {
  let userId = req.params.id;
  let newUsername = req.body.username;
  let pw = req.body.password;
  console.log(userId)
  let q = `select username,password from users where id ='${userId}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(`userPass: ${user['password']}`)
      console.log(`pw: ${pw}`)
      if (user['password'] === pw) {
        let q2 = `update users set username='${newUsername}' where username='${user['username']}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            console.log(result);
            resp.send(`Updated Successfully`);
          });
        }
        catch (e) {
          resp.send(`Error occured in DB`)
        }
      }
      else {
        resp.send("Incorrect Password ");
      }
    })
  }
  catch (e) {
    resp.send(`Some error occured`);
    console.log(`Error : ${e}`);
  }
});

app.get("/users/new", (req, resp) => {
  resp.render("newUser.ejs");
})

app.post("/users/new", (req, resp) => {
  let userId = faker.string.uuid();
  let { username, email, password } = req.body;
  // console.log(username,email,password);
  let q = `insert into users (id, username, email, password) values ('${userId}', '${username}', '${email}', '${password}')`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      // let user = result[0];
      console.log(result);
      resp.redirect("/users");
    })
  }
  catch (e) {
    resp.send(`Some error occured`);
    console.log(`Error : ${e}`);
  }
});

app.get("/users/:id/delete", (req, resp) => {
  let userId = req.params.id;
  let q = `select id,email,username from users where id ='${userId}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      resp.render("delete.ejs", { user });
    })
  }
  catch (e) {
    resp.send(`Error in deleting`);
  }
})



app.delete("/users/:id/", (req, resp) => {
  let userId = req.params.id;
  let newUsername = req.body.username;
  let pw = req.body.password;
  console.log(userId)
  let q = `select username,password from users where id ='${userId}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user = result[0];
      console.log(`userPass: ${user['password']}`)
      console.log(`pw: ${pw}`)
      if (user['password'] === pw) {
        let q2 = `delete from users where username='${user['username']}'`;
        try {
          connection.query(q2, (err, result) => {
            if (err) throw err;
            console.log(result);
            resp.send(`Deleted Successfully`);
            setTimeout(()=>{
              resp.redirect("/users");
            },4000);
          });
        }
        catch (e) {
          resp.send(`Error occured in DB`)
        }
      }
      else {
        resp.send("Incorrect Password ");
      }
    })
  }
  catch (e) {
    resp.send(`Some error occured`);
    console.log(`Error : ${e}`);
  }
});


function getRandomUser() {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password()
  ];
}







// try{
//   connection.query(q2,[bulkUsers],(err,result)=>{
//     if(err) throw err;
//     console.log(result);
//     connection.end()
//   })
// }
// catch(e){
// console.log("error : ",e);
// }





