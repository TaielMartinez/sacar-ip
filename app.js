const express = require('express')
const app = express()
const path = require('path')
const request = require('request');

// config
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


// variables

var lolApiActived = false
var riotRequest
var riotKey
var server
var partidaVivo


// routes
app.get('/', (req, res) => {
	res.render('index')
})

app.get('/res', async function(req, res) {

    //===========================================================

    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
     console.log('ip client: '+ip)

    //===========================================================

	server = req.query.servidor

	console.log('jugado: '+req.query.jugador+' || servidor: '+server)

	var summonerData = await nombre_a_id(req.query.jugador, server)
	var cuentaID = summonerData.accountId
	var jugadorID = summonerData.id

	console.log('ID del jugador: '+jugadorID)
	console.log('ID de la cuenta: '+cuentaID)
	//console.log('partidaVivo: '+summonerData)

	//var jugadorHistorial = await historial(jugadorID, server)
	//console.log(jugadorHistorial)

	var partidaVivo = await partidaActual(jugadorID, server)

    res.send(partidaVivo);

})





app.get('/champ', function(req, res) {

		res.send('hola');
})






// listering for server
app.listen(app.get('port'), () => {
	console.log('server iniciado:', app.get('port'))
})





function getClientAddress(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }