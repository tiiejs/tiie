const express = require('express')
const app = express()
const datausers = require('./data.users.js');

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', (request, res) => {
    res.send('Hello World!')
});

// https://expressjs.com/en/api.html#req
// Do obslugi body trzeba doinstalowac bibliotkei.
app.get('/mirror', (request, res) => {
    res.send({
        method : request.method,
        params : request.params,
        cookies : request.cookies,
        body : request.body,
        path : request.path,
        query : request.query,
        secure : request.secure,
    });
});

app.post('/mirror', (request, res) => {
    res.send({
        method : request.method,
        params : request.params,
        cookies : request.cookies,
        body : request.body,
        path : request.path,
        query : request.query,
        secure : request.secure,
    });
});

app.get('/users/:id', (request, res) => {
    res.send(datausers.find(user => user._id == request.param("id")));
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))
