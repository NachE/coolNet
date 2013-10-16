var dgram = require('dgram');
 
var answerMessage = new Buffer("who is there");
// TODO:
// sometimes one phisical machine can 
// have two or more IP use UID on future
var responseMessage = new Buffer("hi"); 

var broadcastAddress = '255.255.255.255';
var broadcastPort = 2598;
 
var nsocket = dgram.createSocket('udp4');
nsocket.bind(broadcastPort, '0.0.0.0');

nsocket.on("message", function ( data, rinfo ) {

	console.log("<-- "+rinfo.address +" say: " + data.toString());

	if(data.toString() == answerMessage.toString()){
	
		nsocket.setBroadcast(true);
		console.log("--> Sending "+responseMessage.toString());
		nsocket.send(responseMessage, 0, responseMessage.length, broadcastPort, broadcastAddress, sendDelivered);
		
	}else if(data.toString() == "hi"){
	
		console.log("New nodeh identified with ip: "+rinfo.address);
		//TODO:
		//here we look for services in this ip
		
	}
});

nsocket.on("listening", function () {

	nsocket.setBroadcast(true);
	console.log("--> Sending "+answerMessage.toString())
	nsocket.send(answerMessage, 0, answerMessage.length, broadcastPort, broadcastAddress, sendDelivered);
	
});

function sendDelivered(err,bytes){
	if (err)
		console.log(err);
	else
		console.log("\tOK ", bytes, " bytes sent");
}

 
 

