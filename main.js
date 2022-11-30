const express = require('express');
const fs = require('fs');
const session = require('express-session');
const { request } = require('http');
const app = express();
const port = 3000;

app.use(express.static('publicabc'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}))

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.post('/login', (req, res) => {
    //if validation holds true in this case(login-case) then respond with home page 
    // console.log(req.body);
    let users;
    fs.readFile('./data.txt', 'utf-8', (err, data) => {
        if (req.body.username == "" || req.body.password == "") {
            res.send("<h1 style='text-align:center'>Invalid username:<br><br> Don't be smart, The developer is more than you ;)</h1>");
        }

        if (data.length === 0) {
            res.sendFile(__dirname + '/createAccount/notexist.html');
        }

        else {
            users = JSON.parse(data);

            console.log(users);
            console.log(req.body);


            for (key in users) {
                if (users[key].username == req.body.username && users[key].password == req.body.password) {
                    // res.sendFile(__dirname + '/home/homepage.html')
                    req.session.authorization = true;
                    req.session.activeuser = users[key];
                    res.redirect('/');
                    return;
                }
            }
            res.sendFile(__dirname + '/createAccount/notexist.html');
        }

    });

    // res.sendFile('/index.html');
});

app.get('/', (req, res) => {
    if (req.session.authorization)
        res.sendFile(__dirname + '/home/homepage.html');
    else
        res.redirect('/login');
});

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/createAccount/signup.html');
});

app.post('/signup', (req, res) => {
    // console.log(req.body);
    let users;
    let flag = 0;
    fs.readFile('./data.txt', 'utf-8', (err, data) => {
        if(req.body.username.length<=1||req.body.password.length<8)
        {
            return;
        }
        if (data.length === 0) {
            users = [];
        }
        else {
            users = JSON.parse(data);
        }
        for (key in users) {
            if (users[key].username == req.body.username) {
                flag = 1;
            }
        }
        if (!flag) {
            users.push(req.body);
            fs.writeFile('./data.txt', JSON.stringify(users), function (error) {
                res.sendFile(__dirname + '/public/index.html');
            })
            // console.log(users); 
        }
        else {
            res.sendFile(__dirname + '/createAccount/duplicate.html');
        }
    })
    // console.log(users, "in")

})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');

});

app.get('/profile', (req, res) => {
    let obj = {
        username: req.session.activeuser.username
    }
    res.json(obj);

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
