const express = require('express')
const app = express()
const path = require('path')
const iplocation = require("iplocation").default;

// config
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


// variables

var lolApiActived = false
var riotKey
var server
var partidaVivo


// routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/views/index.html'));

    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);

     iplocation(ip, [], (error, res) => {
 
        console.log('===============================================================================')
        console.log(res.countryCode)
        console.log(res.region)
        console.log(res.city)
        console.log(res.ip)
        console.log(res.latitude+' y '+res.longitude)
        console.log('===============================================================================')
     
    });

     

  
  });


// listering for server
app.listen(app.get('port'), () => {
	console.log('server iniciado:', app.get('port'))
})





function getClientAddress(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }