const express = require('express')
const app = express()
const path = require('path')
const iplocation = require("iplocation").default
const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')

// config
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));


var credentials
var url_token

//if(process.env.service_account != undefined){

	credentials = JSON.parse(process.env.service_account)
	url_token = JSON.parse(process.env.url_token)
	
//} else{

	//credentials = require(`../no-borrar/service-account.json`)
	//url_token = require('../no-borrar/url-token.json')

//}


// variables

var lolApiActived = false
var riotKey
var server
var partidaVivo




// listering for server
app.listen(app.get('port'), () => {
	console.log('server iniciado:', app.get('port'))
})



var rowes_respuestas;

accessSpreadsheet()

async function accessSpreadsheet(cambiar){
	const doc_respuestas = new GoogleSpreadsheet(url_token.SPREADSHEET_ID)
	await promisify(doc_respuestas.useServiceAccountAuth)(credentials)
	const info_respuestas = await promisify(doc_respuestas.getInfo)()
    const sheet_respuestas = info_respuestas.worksheets[0]
    
    doc_respuestas.getRows(1, function (err, rows) {
        if(cambiar == true){
            rows = rowes_respuestas
            rows[rows.length - 1].save()
        }

        console.log (rows)
        rowes_respuestas=rows;
        accessSpreadsheet()
    })
}




function agregarRespuesta(mensaje){

        rowes_respuestas[rowes_respuestas.length] = rowes_respuestas[rowes_respuestas.length - 1]
        rowes_respuestas[rowes_respuestas.length - 1].ip = mensaje[0]
        rowes_respuestas[rowes_respuestas.length - 1].pais = mensaje[1]
        rowes_respuestas[rowes_respuestas.length - 1].region = mensaje[2]
        rowes_respuestas[rowes_respuestas.length - 1].ciudad = mensaje[3]
        rowes_respuestas[rowes_respuestas.length - 1].latitud = mensaje[4]
        rowes_respuestas[rowes_respuestas.length - 1].longitud = mensaje[5]

        accessSpreadsheet(true)

}


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

        var datos = [res.ip, res.countryCode, res.region, res.city, res.latitude, res.longitude]

        accessSpreadsheet()
        agregarRespuesta(datos)
     
    });

     

  
  });
