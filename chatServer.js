// Purpose: Handle all sockets and data to pass back to clients including (build map, roads, settlement cities, set colors, names, etc...)
// By: 		Matt M.
// Date:	07-01-2012
// † By The Grace Of God 
var http = require('http'),
	url = require('url'),
	fs = require('fs');
	
var server = http.createServer(function(request, response){
	// Parsing the URL path
	var path = url.parse(request.url).pathname;
	
	switch(path){
		case '/':
			fs.readFile(__dirname + '/catanLobby.php', function(error,data){
				if(error) return send404(response, path, error);
				response.writeHead(200, {'content-type': 'text/html'});
				response.write(data, 'utf8');
				response.end();	
			});
		break;
		
		case '/MyProjects/Catan/catan.php':
			fs.readFile(__dirname + '/catan.php', function(error,data){
				if(error) return send404(response, path, error);
				response.writeHead(200, {'content-type': 'text/html'});
				response.write(data, 'utf8');
				response.end();	
			});
		break;
		
		case '/MyProjects/Catan/catanLobby.php':
			fs.readFile(__dirname + '/catanLobby.php', function(error,data){
				if(error) return send404(response, path, error);
				response.writeHead(200, {'content-type': 'text/html'});
				response.write(data, 'utf8');
				response.end();	
			});
		break;
		
		default: send404(response, path+'default')
	}
});

send404 = function(response, path, error){
	response.writeHead(404);
	response.write('404\r\n');
	response.end();
	console.log(path, error)
}

server.listen(8888);

console.log('server started');

var io = require('socket.io').listen(server);

var clientNum = 0;

var color = ''; // Gives player a color when they join

//JSON object to store mapping data
var hexProp = { hexs: [
	{hexType: "resource", hexNumber: "number"}
]};

//JSON object to store user roll results
var rollScores = {players: [
	{username: "player", roll1: "num1", roll2: "num2"}	
]};

/*	=============	=============	PLAYER ATTRIBUTES MATRIX	=============	=============	

Players = All players in the game.
player[i] = the individual player in the game.
username: = the players name.
count: = counts the particular players function call for all actions.
color: = the players color.
turn: = is either 1, 2, 3, or 4 which represents the current players turn.
roads: = number of roads a player has on the map.
settlements: = number of settlements a player has on the map.
cities: = number of cities a player has on the map.
score: = the players current score.
cards. = the superlayer to the count to all resources	ex: cards.brick = 1
mapPropR[i] = road properties on the map such as what hex that road is on, the road side it's on, the 2 points of the road and current mouse position.
mapPropS[i] = settlement properties on the map such as what hex(s) the settlement is on, the resource type, and the number that is on the resource.

	=============	=============	PLAYER ATTRIBUTES MATRIX	=============	=============	*/

//Player attributes
var players = {player: //0
	[
		{
			username: '', count: 0, color: '', order: 0, turn: 1, roads: 0, settlements: 0, cities: 0, score: 0, cards: {brick: 0, wood: 0, oar: 0, sheep: 0, wheat: 0}, mapPropR: 
			[
				{hexNum: 0, roadSide: '', p1x: 0, p1y: 0, p2x: 0, p2y: 0, mouseX: 0, mouseY: 0}
			], mapPropS: 
			[
				{hexNum: 0, corner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			], mapPropC:
			[
				{hexNum: 0, cityCorner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			]
		}
	]
};
players.player.push(//1
		{
			username: '', count: 0, color: '', order: 0, turn: 1, roads: 0, settlements: 0, cities: 0, score: 0, cards: {brick: 0, wood: 0, oar: 0, sheep: 0, wheat: 0}, mapPropR: 
			[
				{hexNum: 0, roadSide: '', p1x: 0, p1y: 0, p2x: 0, p2y: 0, mouseX: 0, mouseY: 0}
			], mapPropS: 
			[
				{hexNum: 0, corner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			], mapPropC:
			[
				{hexNum: 0, cityCorner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			]
		}
);
players.player.push(//2
		{
			username: '', count: 0, color: '', order: 0, turn: 1, roads: 0, settlements: 0, cities: 0, score: 0, cards: {brick: 0, wood: 0, oar: 0, sheep: 0, wheat: 0}, mapPropR: 
			[
				{hexNum: 0, roadSide: '', p1x: 0, p1y: 0, p2x: 0, p2y: 0, mouseX: 0, mouseY: 0}
			], mapPropS: 
			[
				{hexNum: 0, corner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			], mapPropC:
			[
				{hexNum: 0, cityCorner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			]
		}
);
players.player.push(//3
		{
			username: '', count: 0, color: '', order: 0, turn: 1, roads: 0, settlements: 0, cities: 0, score: 0, cards: {brick: 0, wood: 0, oar: 0, sheep: 0, wheat: 0}, mapPropR: 
			[
				{hexNum: 0, roadSide: '', p1x: 0, p1y: 0, p2x: 0, p2y: 0, mouseX: 0, mouseY: 0}
			], mapPropS: 
			[
				{hexNum: 0, corner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			], mapPropC:
			[
				{hexNum: 0, cityCorner: '', mouseX: 0, mouseY: 0, hexType: '', hexGameNum: 0}
			]
		}
);

//on a connection event
io.sockets.on('connection',function(socket){
	console.log('connection '+socket.id+' accepted');
	clientNum++;
	
	//Counts how many players are connected and the player socket id that's connected
	io.sockets.emit('player', clientNum, socket.id);
	
	socket.on('disconnect',function(){
		socket.get('nickname', function (err, name) {
		 	console.log('connection from '+name+' terminated');
			clientNum--;
			io.sockets.emit('playerDisconnected', clientNum, name);
		});
	});
	
	//when we receive a message, send it to all the clients
	socket.on('message', function(message){
		var jsonMessage = JSON.parse(message);
		
		console.log('Received message: '+message+' from client: '+socket.id);
		
		if(jsonMessage.message[0].action == 'build map'){
			//Build map on server and serve to clients
			if(hexProp.hexs.length > 2){
					
			}else{
				var x = 100;
				var y = 100;
				
				hexW = 200;
				hexR = hexW / 2;
				hexH = 2 * hexR * Math.sin(Math.PI/180 * 60);
				hexS = 3 / 2 * hexR;
				
				var threeToOneCount = 4;
				
				var oceanCount = 9;
				
				var woodCount = 4;
				var oarCount = 3;
				var wheatCount = 4;
				var brickCount = 3;
				var sheepCount = 4;
				var desertCount = 1;
				
				var twoCount = 1;
				var threeCount = 2;
				var fourCount = 2;
				var fiveCount = 2;
				var sixCount = 2;
				var eightCount = 2;
				var nineCount = 2;
				var tenCount = 2;
				var elevenCount = 2;
				var twelveCount = 1;
				
				//====================================================================
				
				//======================================================================
				// the X
				var tcx = new Array(); // top corner of hex
				var trcx = new Array(); // top right corner of hex
				var brcx = new Array(); // bottom right corner of hex
				var bcx = new Array(); // bottom corner of hex
				var blcx = new Array(); // bottom left corner of hex
				var tlcx = new Array(); // top left corner of hex
				
				// the Y
				var tcy = new Array(); // top corner of hex
				var trcy = new Array(); // top right corner of hex
				var brcy = new Array(); // bottom right corner of hex
				var bcy = new Array(); // bottom corner of hex
				var blcy = new Array(); // bottom left corner of hex
				var tlcy = new Array(); // top left corner of hex
				
				//4 random boolean indicators for 8 different hex spaces for numbers 6&8
				var spot1 = Math.floor((Math.random()*2)+1);
				var spot2 = Math.floor((Math.random()*2)+1);
				var spot3 = Math.floor((Math.random()*2)+1);
				var spot4 = Math.floor((Math.random()*2)+1);
				
				//Counters
				var hexNum = 4;
				var cascade = 0; //sets the hex's to reverse from 5 to 3 if value = 1
				var hexCount = 1; //Counts all of the hex's
				//======================================================================
				
				for(var a=0; a<7; a++){	// 37 hex's total
					if(hexNum == 8){
						hexNum--;
						hexNum--;
						cascade = 1;
						x += hexH; //moves the first hex over one once
					}
					if(hexNum >= 4){
						for(var b=0; b<hexNum; b++){
							//top
							tcx[hexCount] = x;
							tcy[hexCount] = y;
							
							x+=(hexH/2);
							y+=(hexW-hexS);
							//top right
							trcx[hexCount] = x;
							trcy[hexCount] = y;
							
							//x
							y+=hexR;
							//bottom right
							brcx[hexCount] = x;
							brcy[hexCount] = y;
							
							x-=(hexH/2);
							y+=(hexW-hexS);
							//bottom
							bcx[hexCount] = x;
							bcy[hexCount] = y;
							
							x-=(hexH/2);
							y-=(hexW-hexS);
							//bottom left
							blcx[hexCount] = x;
							blcy[hexCount] = y;
							
							//x
							y-=hexR;
							//top left
							tlcx[hexCount] = x;
							tlcy[hexCount] = y;
							
							x+=(hexH/2);
							y-=(hexW-hexS);
													
							if(hexCount == 1){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 2){
								hexProp.hexs.push({hexType: "3/1", hexNumber: ""});
								
							}else if(hexCount == 3){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 4){
								hexProp.hexs.push({hexType: "2/1 WOOD", hexNumber: ""});
								
							}else if(hexCount == 9){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 15){
								hexProp.hexs.push({hexType: "3/1", hexNumber: ""});
								
							}else if(hexCount == 22){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 28){
								hexProp.hexs.push({hexType: "2/1 OAR", hexNumber: ""});
								
							}else if(hexCount == 33){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 37){
								hexProp.hexs.push({hexType: "3/1", hexNumber: ""});
								
							}else if(hexCount == 36){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 35){
								hexProp.hexs.push({hexType: "2/1 WHEAT", hexNumber: ""});
								
							}else if(hexCount == 34){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 29){
								hexProp.hexs.push({hexType: "3/1", hexNumber: ""});
								
							}else if(hexCount == 23){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 16){
								hexProp.hexs.push({hexType: "2/1 BRICK", hexNumber: ""});
								
							}else if(hexCount == 10){
								hexProp.hexs.push({hexType: "ocean", hexNumber: ""});
								
							}else if(hexCount == 5){
								hexProp.hexs.push({hexType: "2/1 SHEEP", hexNumber: ""});
								
							}else if(hexCount == 6){
								//======================================================================
								//======================================================================
								if(spot1 == 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number not 1
								//======================================================================
								//======================================================================
								
							}else if(hexCount == 8){
								//======================================================================
								//======================================================================
								if(spot2 == 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number not 1
								//======================================================================
								//======================================================================
							}else if(hexCount == 12){
								//======================================================================
								//======================================================================
								if(spot1 != 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number 1
								//======================================================================
								//======================================================================
							}else if(hexCount == 14){
								//======================================================================
								//======================================================================
								if(spot2 != 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number 1
								//======================================================================
								//======================================================================
							}else if(hexCount == 24){
								//======================================================================
								//======================================================================
								if(spot3 == 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number not 1
								//======================================================================
								//======================================================================
							}else if(hexCount == 26){
								//======================================================================
								//======================================================================
								if(spot4 == 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number not 1
								//======================================================================
								//======================================================================
							}else if(hexCount == 30){
								//======================================================================
								//======================================================================
								if(spot3 != 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number 1
								//======================================================================
								//======================================================================
							}else if(hexCount == 32){
								//======================================================================
								//======================================================================
								if(spot4 != 1){
									//Make number 6 or 8
									
									//Random number between 1 and 5 -- no desert
									var rndNum = Math.floor((Math.random()*5)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0){
											rndNum = Math.floor((Math.random()*5)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random either 6 or 8									
										var rn = Math.floor((Math.random()*2)+1);
										if(rn == 1){
											var randNum = 6;	
										}else{
											var randNum = 8;	
										}
											
										while(randNum == 1 || randNum == 2 || randNum == 3 || randNum == 4 || randNum == 5 || randNum == 7 || randNum == 6 && sixCount == 0 || randNum == 8 && eightCount == 0){
											randNum = Math.floor((Math.random()*8)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 6){
											sixCount--;	
										}else if(randNum == 8){
											eightCount--;	
										}
										
										sheepCount--;
									}
								}else{								
									//Random number between 1 and 6
									var rndNum = Math.floor((Math.random()*6)+1);
									
									//if the same number comes up more then the allotted time, it will generate another number
									if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
									}else{
										while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
											rndNum = Math.floor((Math.random()*6)+1);
										}
									}
									
									if(rndNum == 1 && woodCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										woodCount--;
									}else if(rndNum == 2 && oarCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										oarCount--;
									}else if(rndNum == 3 && wheatCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										wheatCount--;
									}else if(rndNum == 4 && brickCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
								
										brickCount--;
									}else if(rndNum == 5 && sheepCount != 0){
										
										//Center Random Number between 1 - 12
										var randNum = Math.floor((Math.random()*12)+1);
										
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
											randNum = Math.floor((Math.random()*12)+1);
										}
										while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
											
											randNum = Math.floor((Math.random()*12)+1);
										}
										
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
						
										if(randNum == 2){
											twoCount--;	
										}else if(randNum == 3){
											threeCount--;	
										}else if(randNum == 4){
											fourCount--;	
										}else if(randNum == 5){
											fiveCount--;	
										}else if(randNum == 9){
											nineCount--;	
										}else if(randNum == 10){
											tenCount--;	
										}else if(randNum == 11){
											elevenCount--;	
										}else if(randNum == 12){
											twelveCount--;	
										}
										
										sheepCount--;
									}else if(rndNum == 6 && desertCount != 0){
										//Add hex block arrayed index
										hexProp.hexs.push({hexType: "desert", hexNumber: ""});
										
										desertCount--;
									}
								}//end if number 1
								//======================================================================
								//======================================================================
							}else{
								
								//Random number between 1 and 6
								var rndNum = Math.floor((Math.random()*6)+1);
								
								//if the same number comes up more then the allotted time, it will generate another number
								if(woodCount == 0 && oarCount == 0 && wheatCount == 0 && brickCount == 0 && sheepCount == 0 && desertCount == 0){
								}else{
									while(rndNum == 1 && woodCount == 0 || rndNum == 2 && oarCount == 0 || rndNum == 3 && wheatCount == 0 || rndNum == 4 && brickCount == 0 || rndNum == 5 && sheepCount == 0 || rndNum == 6 && desertCount == 0){
										rndNum = Math.floor((Math.random()*6)+1);
									}
								}
								
								if(rndNum == 1 && woodCount != 0){
									
									//Center Random Number between 1 - 12
									var randNum = Math.floor((Math.random()*12)+1);
									
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
										randNum = Math.floor((Math.random()*12)+1);
									}
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
										
										randNum = Math.floor((Math.random()*12)+1);
									}
									
									//Add hex block arrayed index
									hexProp.hexs.push({hexType: "wood", hexNumber: randNum});
					
									if(randNum == 2){
										twoCount--;	
									}else if(randNum == 3){
										threeCount--;	
									}else if(randNum == 4){
										fourCount--;	
									}else if(randNum == 5){
										fiveCount--;	
									}else if(randNum == 9){
										nineCount--;	
									}else if(randNum == 10){
										tenCount--;	
									}else if(randNum == 11){
										elevenCount--;	
									}else if(randNum == 12){
										twelveCount--;	
									}
									
									woodCount--;
								}else if(rndNum == 2 && oarCount != 0){
									
									//Center Random Number between 1 - 12
									var randNum = Math.floor((Math.random()*12)+1);
									
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
										randNum = Math.floor((Math.random()*12)+1);
									}
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
										
										randNum = Math.floor((Math.random()*12)+1);
									}
									
									//Add hex block arrayed index
									hexProp.hexs.push({hexType: "oar", hexNumber: randNum});
					
									if(randNum == 2){
										twoCount--;	
									}else if(randNum == 3){
										threeCount--;	
									}else if(randNum == 4){
										fourCount--;	
									}else if(randNum == 5){
										fiveCount--;	
									}else if(randNum == 9){
										nineCount--;	
									}else if(randNum == 10){
										tenCount--;	
									}else if(randNum == 11){
										elevenCount--;	
									}else if(randNum == 12){
										twelveCount--;	
									}
									
									oarCount--;
								}else if(rndNum == 3 && wheatCount != 0){
									
									//Center Random Number between 1 - 12
									var randNum = Math.floor((Math.random()*12)+1);
									
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
										randNum = Math.floor((Math.random()*12)+1);
									}
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
										
										randNum = Math.floor((Math.random()*12)+1);
									}
									
									//Add hex block arrayed index
									hexProp.hexs.push({hexType: "wheat", hexNumber: randNum});
					
									if(randNum == 2){
										twoCount--;	
									}else if(randNum == 3){
										threeCount--;	
									}else if(randNum == 4){
										fourCount--;	
									}else if(randNum == 5){
										fiveCount--;	
									}else if(randNum == 9){
										nineCount--;	
									}else if(randNum == 10){
										tenCount--;	
									}else if(randNum == 11){
										elevenCount--;	
									}else if(randNum == 12){
										twelveCount--;	
									}
									
									wheatCount--;
								}else if(rndNum == 4 && brickCount != 0){
									
									//Center Random Number between 1 - 12
									var randNum = Math.floor((Math.random()*12)+1);
									
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
										randNum = Math.floor((Math.random()*12)+1);
									}
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
										
										randNum = Math.floor((Math.random()*12)+1);
									}
									
									//Add hex block arrayed index
									hexProp.hexs.push({hexType: "brick", hexNumber: randNum});
					
									if(randNum == 2){
										twoCount--;	
									}else if(randNum == 3){
										threeCount--;	
									}else if(randNum == 4){
										fourCount--;	
									}else if(randNum == 5){
										fiveCount--;	
									}else if(randNum == 9){
										nineCount--;	
									}else if(randNum == 10){
										tenCount--;	
									}else if(randNum == 11){
										elevenCount--;	
									}else if(randNum == 12){
										twelveCount--;	
									}
							
									brickCount--;
								}else if(rndNum == 5 && sheepCount != 0){
									
									//Center Random Number between 1 - 12
									var randNum = Math.floor((Math.random()*12)+1);
									
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8){
										randNum = Math.floor((Math.random()*12)+1);
									}
									while(randNum == 1 || randNum == 7 || randNum == 6 || randNum == 8 || randNum == 2 && twoCount == 0 || randNum == 3 && threeCount == 0 || randNum == 4 && fourCount == 0 || randNum == 5 && fiveCount == 0 || randNum == 9 && nineCount == 0 || randNum == 10 && tenCount == 0 || randNum == 11 && elevenCount == 0 || randNum == 12 && twelveCount == 0){
										
										randNum = Math.floor((Math.random()*12)+1);
									}
									
									//Add hex block arrayed index
									hexProp.hexs.push({hexType: "sheep", hexNumber: randNum});
					
									if(randNum == 2){
										twoCount--;	
									}else if(randNum == 3){
										threeCount--;	
									}else if(randNum == 4){
										fourCount--;	
									}else if(randNum == 5){
										fiveCount--;	
									}else if(randNum == 9){
										nineCount--;	
									}else if(randNum == 10){
										tenCount--;	
									}else if(randNum == 11){
										elevenCount--;	
									}else if(randNum == 12){
										twelveCount--;	
									}
									
									sheepCount--;
								}else if(rndNum == 6 && desertCount != 0){
									//Add hex block arrayed index
									hexProp.hexs.push({hexType: "desert", hexNumber: ""});
									
									desertCount--;
								}
							
							}
							
							x += hexH;
							hexCount++;
						}
					}
					
					if(cascade == 1){
						y += hexW-(hexW-hexS);
						x -= hexH*(hexNum-1)+(hexH/2);
						hexNum--;
					}else{
						y += hexW-(hexW-hexS);
						x -= hexH*hexNum+(hexH/2);
						hexNum++;
					}
				}
			}
			//emit mapping information to all clients
			io.sockets.emit('buildMap', socket.id, JSON.stringify(hexProp));	
		}else if(jsonMessage.message[0].action == 'chat'){
			//gets username from paired socketID
			socket.get('nickname', function (err, name) {
				console.log('Chat message by ', name);
				io.sockets.emit('chat', name, jsonMessage.message[0].message);
			});
			
		}else if(jsonMessage.message[0].action == 'build road'){
			//put JSON data to variables
			var color = jsonMessage.message[0].color;
			var mouseX = jsonMessage.message[0].x;
			var mouseY = jsonMessage.message[0].y;
			var tcx = jsonMessage.message[0].tcx;
			var tcy = jsonMessage.message[0].tcy;
			var trcx = jsonMessage.message[0].trcx;
			var trcy = jsonMessage.message[0].trcy;
			var brcx = jsonMessage.message[0].brcx;
			var brcy = jsonMessage.message[0].brcy;
			var blcx = jsonMessage.message[0].blcx;
			var blcy = jsonMessage.message[0].blcy;
			var tlcx = jsonMessage.message[0].tlcx;
			var tlcy = jsonMessage.message[0].tlcy;
			var bcx = jsonMessage.message[0].bcx;
			var bcy = jsonMessage.message[0].bcy;
			var hexNum = jsonMessage.message[0].hexNum;
			var side = jsonMessage.message[0].side
						
			//gets username from paired socketID
			socket.get('nickname', function (err, name) {
								
				var i = 0; //Var to set player array number
				var ii = 1; //Var to increment through all the selected players roads
				var build = false; //By default, the player cannot build a road (it needs to be built in searies with others
				var sendToClients = false; //says if ok to send socket to all clients if all conditions are met.
				while(players.player[i]){
					if(players.player[i].username == name){
						//NOTE: this will perform for every side of a hexagon that it touches. Could perform 1 or 2 times
						
						//Checks the stored roads points for the player and see if any touch the road attempted to be built
						while(players.player[i].mapPropR[ii]){
							if(side == 'tr'){
								//first point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((tcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((tcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((tcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((tcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = tc
									console.log(players.player[i].mapPropR[ii].p1x+' == '+tcx[hexNum]+' && '+players.player[i].mapPropR[ii].p1y+' == '+tcy[hexNum]+' || '+players.player[i].mapPropR[ii].p2x+' == '+tcx[hexNum]+' && '+players.player[i].mapPropR[ii].p2y+' == '+tcy[hexNum]);
									build = true;
								}
								//second point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((trcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((trcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((trcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((trcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = trc
									build = true;
								}
							}else if(side == 'tl'){
								//first point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((tcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((tcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((tcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((tcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = tc
									build = true;
								}
								//second point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((tlcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((tlcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((tlcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((tlcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = tlc
									console.log('build = true');
									build = true;
								}
							}else if(side == 'r'){
								//fist point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((trcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((trcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((trcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((trcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = trc
									build = true;
								}
								//second point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((brcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((brcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((brcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((brcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = brc
									build = true;
								}
							}else if(side == 'l'){
								//first point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((tlcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((tlcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((tlcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((tlcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = tlc
									build = true;
								}
								//second point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((blcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((blcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((blcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((blcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = blc
									build = true;
								}
							}else if(side == 'br'){
								//first point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((bcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((bcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((bcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((bcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = bc
									build = true;
								}
								//second point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((brcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((brcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((brcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((brcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = brc
									build = true;
								}
							}else if(side == 'bl'){
								//first point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((bcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((bcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((bcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((bcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = bc
									build = true;
								}
								//second point
								if(players.player[i].mapPropR[ii].p1x == (Math.round((blcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p1y == (Math.round((blcy[hexNum])*100)/100) || players.player[i].mapPropR[ii].p2x == (Math.round((blcx[hexNum])*100)/100) && players.player[i].mapPropR[ii].p2y == (Math.round((blcy[hexNum])*100)/100)){
									//If stored roads point 1 or 2 = blc
									build = true;
								}
								
							}
							
							ii++;	
						}
						
						if(build == true || players.player[i].roads < 2){
							//Variable used to send the socket.
							sendToClients = true;
							
							//sets the roads two points
							if(side == 'tr'){
								var p1x = Math.round((tcx[hexNum])*100)/100
								var p1y = Math.round((tcy[hexNum])*100)/100
								
								var p2x = Math.round((trcx[hexNum])*100)/100
								var p2y = Math.round((trcy[hexNum])*100)/100
							}else if(side == 'tl'){
								var p1x = Math.round((tcx[hexNum])*100)/100
								var p1y = Math.round((tcy[hexNum])*100)/100
								
								var p2x = Math.round((tlcx[hexNum])*100)/100
								var p2y = Math.round((tlcy[hexNum])*100)/100
							}else if(side == 'r'){
								var p1x = Math.round((trcx[hexNum])*100)/100
								var p1y = Math.round((trcy[hexNum])*100)/100
								
								var p2x = Math.round((brcx[hexNum])*100)/100
								var p2y = Math.round((brcy[hexNum])*100)/100
							}else if(side == 'l'){
								var p1x = Math.round((tlcx[hexNum])*100)/100
								var p1y = Math.round((tlcy[hexNum])*100)/100
								
								var p2x = Math.round((blcx[hexNum])*100)/100
								var p2y = Math.round((blcy[hexNum])*100)/100
							}else if(side == 'br'){
								var p1x = Math.round((bcx[hexNum])*100)/100
								var p1y = Math.round((bcy[hexNum])*100)/100
								
								var p2x = Math.round((brcx[hexNum])*100)/100
								var p2y = Math.round((brcy[hexNum])*100)/100
							}else if(side == 'bl'){
								var p1x = Math.round((bcx[hexNum])*100)/100
								var p1y = Math.round((bcy[hexNum])*100)/100
								
								var p2x = Math.round((blcx[hexNum])*100)/100
								var p2y = Math.round((blcy[hexNum])*100)/100
							}
							//Counts the quantity on this function call if I ever want to use for some reason
							players.player[i].count++;
							
							console.log('Road hexNum for '+players.player[i].username+': '+hexNum+' side: '+side);
							if(players.player[i].mapPropR[players.player[i].mapPropR.length-1].mouseX == mouseX && players.player[i].mapPropR[players.player[i].mapPropR.length-1].mouseY == mouseY){
								//don't add the road count because this is just the second function call from the first click
								
								players.player[i].mapPropR.push({hexNum: hexNum, roadSide: side, p1x: p1x, p1y: p1y, p2x: p2x, p2y: p2y, mouseX: mouseX, mouseY: mouseY});
							}else{
								//Add road because this is the first function call
								players.player[i].roads++;
								players.player[i].mapPropR.push({hexNum: hexNum, roadSide: side, p1x: p1x, p1y: p1y, p2x: p2x, p2y: p2y, mouseX: mouseX, mouseY: mouseY});
							}
							console.log(players.player[i].username+'\s road(s) is hitting '+(players.player[i].mapPropR.length-1)+' hex(s)'+' and has '+players.player[i].roads+' roads');
						
						}//ENDS the if that says: only if the road build is true or if they've build less than 3 roads.
					}
					
					i++;
				}
				if(sendToClients == true){
					//emit mouse positions and arrayed hex corners			
					io.sockets.emit('buildRoad', socket.id, color, mouseX, mouseY, tcx, tcy, trcx, trcy, tlcx, tlcy, bcx, bcy, JSON.stringify(players));
				}
			});
				
		}else if(jsonMessage.message[0].action == 'build settlement'){
			//put JSON data to variables
			var color = jsonMessage.message[0].color;
			var mouseX = jsonMessage.message[0].x;
			var mouseY = jsonMessage.message[0].y;
			var tcx = jsonMessage.message[0].tcx;
			var tcy = jsonMessage.message[0].tcy;
			var trcx = jsonMessage.message[0].trcx;
			var trcy = jsonMessage.message[0].trcy;
			var brcx = jsonMessage.message[0].brcx;
			var brcy = jsonMessage.message[0].brcy;
			var bcx = jsonMessage.message[0].bcx;
			var bcy = jsonMessage.message[0].bcy;
			var blcx = jsonMessage.message[0].blcx;
			var blcy = jsonMessage.message[0].blcy;
			var tlcx = jsonMessage.message[0].tlcx;
			var tlcy = jsonMessage.message[0].tlcy;
			var hexNum = jsonMessage.message[0].hexNum;
			var corner = jsonMessage.message[0].corner;
			var hexType = jsonMessage.message[0].hexType;
			var hexGameNum = jsonMessage.message[0].hexGameNum;

			//gets username from paired socketID
			socket.get('nickname', function (err, name) {
				
				//sets the current corner x and y settlement build attempt instead of the mouseX/Y which isn't as accurate.
				if(corner == 'tc'){
					var currentX = tcx[hexNum];
					var currentY = tcy[hexNum];	
				}else if(corner == 'trc'){
					var currentX = trcx[hexNum];
					var currentY = trcy[hexNum];
				}else if(corner == 'tlc'){
					var currentX = tlcx[hexNum];
					var currentY = tlcy[hexNum];
				}else if(corner == 'brc'){
					var currentX = brcx[hexNum];
					var currentY = brcy[hexNum];
				}else if(corner == 'blc'){
					var currentX = blcx[hexNum];
					var currentY = blcy[hexNum];
				}else if(corner == 'bc'){
					var currentX = bcx[hexNum];
					var currentY = bcy[hexNum];
				}
				
				var i = 0;
				var ii = 1; //Var to increment through all the selected players settlements
				var build = true; //By default, the player CAN build a settlement unless any condition is met.
				while(players.player[i]){
					//Loop through all players settlement attributes to make sure you remain at least 120 px away from any other settlement.
					while(players.player[i].mapPropS[ii]){
						if(players.player[i].mapPropS[ii].mouseX >= (currentX-120) && players.player[i].mapPropS[ii].mouseX <= (currentX+120) && players.player[i].mapPropS[ii].mouseY >= (currentY-120) && players.player[i].mapPropS[ii].mouseY <= (currentY+120)){
							if(players.player[i].mapPropS[ii].mouseX == mouseX && players.player[i].mapPropS[ii].mouseY == mouseY){
								//if the selected player mouseX/mouseY == the mouseX/MouseY, means they are repeats which value needs to be stored	
							}else{
								build=false;
							}
						}
						ii++;
					}
					ii=1;
					i++;
				}
				
				if(build == true){
					var a = 0;
					while(players.player[a]){
						if(players.player[a].username == name){
							//NOTE: this will perform for every corner of a hexigon that it touches. Could perform 1 or 2 or 3 times
							
							//Counts the quantity on this function call
							players.player[a].count++;
							if(players.player[a].mapPropS[players.player[a].mapPropS.length-1].mouseX == mouseX && players.player[a].mapPropS[players.player[a].mapPropS.length-1].mouseY == mouseY){
								
								if(players.player[a].mapPropS[players.player[a].mapPropS.length-1].corner == corner){
									//Don't add any resource or add another array element.
								}else{
									//Add resource to player
									//Want to make this condition based on points NOT settlements because you can upgrade to a city
									if(players.player[a].score == 2){
										switch(hexType){
											case 'wood':
												players.player[a].cards.wood = (players.player[a].cards.wood+1);
												break;
											case 'brick':
												players.player[a].cards.brick = (players.player[a].cards.brick+1);
												break;
											case 'oar':
												players.player[a].cards.oar = (players.player[a].cards.oar+1);
												break;
											case 'sheep':
												players.player[a].cards.sheep = (players.player[a].cards.sheep+1);
												break;
											case 'wheat':
												players.player[a].cards.wheat = (players.player[a].cards.wheat+1);
												break;
										}
									}
									
									//don't add the settlement count and score count because this is the second or third function call from the first click
									players.player[a].mapPropS.push({hexNum: hexNum, corner: corner, mouseX: mouseX, mouseY: mouseY, hexType: hexType, hexGameNum: hexGameNum});
								}
							}else{
								//Add settlement because this is the first function call
								players.player[a].settlements++;
								//Add a point to the players score
								players.player[a].score++;
								//Add resource to player
								//Want to make this condition based on points NOT settlements because you can upgrade to a city
								if(players.player[a].score == 2){
									switch(hexType){
										case 'wood':
											players.player[a].cards.wood = (players.player[a].cards.wood+1);
											break;
										case 'brick':
											players.player[a].cards.brick = (players.player[a].cards.brick+1);
											break;
										case 'oar':
											players.player[a].cards.oar = (players.player[a].cards.oar+1);
											break;
										case 'sheep':
											players.player[a].cards.sheep = (players.player[a].cards.sheep+1);
											break;
										case 'wheat':
											players.player[a].cards.wheat = (players.player[a].cards.wheat+1);
											break;
									}
								}
								
								players.player[a].mapPropS.push({hexNum: hexNum, corner: corner, mouseX: mouseX, mouseY: mouseY, hexType: hexType, hexGameNum: hexGameNum});
							}
							console.log(players.player[a].username+'\s settlement(s) is hitting '+(players.player[a].mapPropS.length-1)+' hex(s)'+' and has '+players.player[a].settlements+' settlements');
							console.log(players.player[a].username+' has '+players.player[a].cards.wood+' wood, '+players.player[a].cards.brick+' brick, '+players.player[a].cards.oar+' oar, '+players.player[a].cards.sheep+' sheep, '+players.player[a].cards.wheat+' wheat');
						}
						a++;
					}
					
					//emit mouse positions and arrayed hex corners			
					io.sockets.emit('buildSettlement', socket.id, color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, JSON.stringify(players));
				}//END if build is true
			});		
			
		}else if(jsonMessage.message[0].action == 'build city'){
			//put JSON data to variables
			var color = jsonMessage.message[0].color;
			var mouseX = jsonMessage.message[0].x;
			var mouseY = jsonMessage.message[0].y;
			var tcx = jsonMessage.message[0].tcx;
			var tcy = jsonMessage.message[0].tcy;
			var trcx = jsonMessage.message[0].trcx;
			var trcy = jsonMessage.message[0].trcy;
			var brcx = jsonMessage.message[0].brcx;
			var brcy = jsonMessage.message[0].brcy;
			var bcx = jsonMessage.message[0].bcx;
			var bcy = jsonMessage.message[0].bcy;
			var blcx = jsonMessage.message[0].blcx;
			var blcy = jsonMessage.message[0].blcy;
			var tlcx = jsonMessage.message[0].tlcx;
			var tlcy = jsonMessage.message[0].tlcy;
			var hexNum = jsonMessage.message[0].hexNum;
			var corner = jsonMessage.message[0].corner;
			var hexType = jsonMessage.message[0].hexType;
			var hexGameNum = jsonMessage.message[0].hexGameNum;

			//gets username from paired socketID
			socket.get('nickname', function (err, name) {
				
				//sets the current corner x and y settlement build attempt instead of the mouseX/Y which isn't as accurate.
				if(corner == 'tc'){
					var currentX = tcx[hexNum];
					var currentY = tcy[hexNum];	
				}else if(corner == 'trc'){
					var currentX = trcx[hexNum];
					var currentY = trcy[hexNum];
				}else if(corner == 'tlc'){
					var currentX = tlcx[hexNum];
					var currentY = tlcy[hexNum];
				}else if(corner == 'brc'){
					var currentX = brcx[hexNum];
					var currentY = brcy[hexNum];
				}else if(corner == 'blc'){
					var currentX = blcx[hexNum];
					var currentY = blcy[hexNum];
				}else if(corner == 'bc'){
					var currentX = bcx[hexNum];
					var currentY = bcy[hexNum];
				}
				
				var i = 0;
				var ii = 1; //Var to increment through all the selected players settlements
				var build = false; //By default, the player CAN build a settlement unless any condition is met.
				while(players.player[i]){
					//Loop through all players settlement attributes to make sure you remain at least 120 px away from any other settlement.
					while(players.player[i].mapPropS[ii]){
						if(players.player[i].mapPropS[ii].mouseX >= (currentX-120) && players.player[i].mapPropS[ii].mouseX <= (currentX+120) && players.player[i].mapPropS[ii].mouseY >= (currentY-120) && players.player[i].mapPropS[ii].mouseY <= (currentY+120)){
							if(players.player[i].mapPropS[ii].mouseX == mouseX && players.player[i].mapPropS[ii].mouseY == mouseY){
								build=true;
							}else{
								//if the selected player mouseX/mouseY == the mouseX/MouseY, means they are repeats which value needs to be stored
							}
						}
						ii++;
					}
					ii=1;
					i++;
				}
				
				if(build == true){
					var a = 0;
					while(players.player[a]){
						if(players.player[a].username == name){
							//NOTE: this will perform for every corner of a hexigon that it touches. Could perform 1 or 2 or 3 times
							
							//Counts the quantity on this function call
							players.player[a].count++;
							if(players.player[a].mapPropS[players.player[a].mapPropS.length-1].mouseX == mouseX && players.player[a].mapPropS[players.player[a].mapPropS.length-1].mouseY == mouseY){
								
								if(players.player[a].mapPropS[players.player[a].mapPropS.length-1].corner == corner){
									//Don't add any resource or add another array element.
								}else{
									//Add resource to player
									//Want to make this condition based on points NOT settlements because you can upgrade to a city
									if(players.player[a].score == 2){
										switch(hexType){
											case 'wood':
												players.player[a].cards.wood = (players.player[a].cards.wood+2);
												break;
											case 'brick':
												players.player[a].cards.brick = (players.player[a].cards.brick+2);
												break;
											case 'oar':
												players.player[a].cards.oar = (players.player[a].cards.oar+2);
												break;
											case 'sheep':
												players.player[a].cards.sheep = (players.player[a].cards.sheep+2);
												break;
											case 'wheat':
												players.player[a].cards.wheat = (players.player[a].cards.wheat+2);
												break;
										}
									}
									
									//don't add the settlement count and score count because this is the second or third function call from the first click
									players.player[a].mapPropS.push({hexNum: hexNum, corner: corner, mouseX: mouseX, mouseY: mouseY, hexType: hexType, hexGameNum: hexGameNum});
								}
							}else{
								//Add settlement because this is the first function call
								players.player[a].settlements++;
								//Add a point to the players score
								players.player[a].score++;
								//Add resource to player
								//Want to make this condition based on points NOT settlements because you can upgrade to a city
								if(players.player[a].score == 2){
									switch(hexType){
										case 'wood':
											players.player[a].cards.wood = (players.player[a].cards.wood+2);
											break;
										case 'brick':
											players.player[a].cards.brick = (players.player[a].cards.brick+2);
											break;
										case 'oar':
											players.player[a].cards.oar = (players.player[a].cards.oar+2);
											break;
										case 'sheep':
											players.player[a].cards.sheep = (players.player[a].cards.sheep+2);
											break;
										case 'wheat':
											players.player[a].cards.wheat = (players.player[a].cards.wheat+2);
											break;
									}
								}
								
								players.player[a].mapPropS.push({hexNum: hexNum, corner: corner, mouseX: mouseX, mouseY: mouseY, hexType: hexType, hexGameNum: hexGameNum});
							}
							console.log(players.player[a].username+'\s city(ies) is hitting '+(players.player[a].mapPropS.length-1)+' hex(s)'+' and has '+players.player[a].settlements+' settlements');
							console.log(players.player[a].username+' has '+players.player[a].cards.wood+' wood, '+players.player[a].cards.brick+' brick, '+players.player[a].cards.oar+' oar, '+players.player[a].cards.sheep+' sheep, '+players.player[a].cards.wheat+' wheat');
						}
						a++;
					}
					
					//emit mouse positions and arrayed hex corners			
					io.sockets.emit('buildCity', socket.id, color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, JSON.stringify(players));
				}//END if build is true
			});		
			
		}else if(jsonMessage.message[0].action == 'usersocket'){
			//get JSON username and paired socket id
			var username = jsonMessage.message[0].username;
			var socketID = jsonMessage.message[0].socketID;
			
			//sets the current socketID with the paired username			
			socket.set('nickname', username, function () {
				socket.emit('ready');
				if(clientNum-1 == 0){
					players.player[clientNum-1].username=username;
					console.log(players.player[clientNum-1].username);
					console.log(clientNum-1);
				}else if(clientNum-1 == 1 && players.player[0].username != username){
					players.player[clientNum-1].username=username;
					console.log(players.player[clientNum-1].username);
					console.log(clientNum-1);
				}else if(clientNum-1 == 2 && players.player[0].username != username && players.player[1].username != username){
					players.player[clientNum-1].username=username;
					console.log(players.player[clientNum-1].username);
					console.log(clientNum-1);
				}else if(clientNum-1 == 3 && players.player[0].username != username && players.player[1].username != username && players.player[2].username != username){
					players.player[clientNum-1].username=username;
					console.log(players.player[clientNum-1].username);
					console.log(clientNum-1);
				}
			});
						
			//sets the player color and user name associated in the browser
			io.sockets.emit('playerJoined', username, clientNum);
		}else if(jsonMessage.message[0].action == 'goToCatan'){
			var username = jsonMessage.message[0].username;
			io.sockets.emit('goToCatan', username);
			
			console.log(clientNum); //One player goes to the page, connects and then builds the map, (this repeats for number of players). This will reverse count.
		}else if(jsonMessage.message[0].action == 'set color'){
			var playerColor = jsonMessage.message[0].playerColor;
			
			socket.get('nickname', function (err, name) {
				var b=0;
				while(players.player[b]){
					if(players.player[b].username == name){
						players.player[b].color = playerColor;
						
						io.sockets.emit('playerColor', playerColor, name, JSON.stringify(players));
						console.log(players.player[b].username+'s color is '+playerColor);
					}
					b++;
				}
			});
		}else if(jsonMessage.message[0].action == 'roll dice'){
			var num1 = jsonMessage.message[0].num1;
			var num2 = jsonMessage.message[0].num2;
			var player = jsonMessage.message[0].player;
			
			//Once the dice is rolled for the first time (for all players), we don't need to prevent it from rolling duplicates
			var i=0;
			var allPlayersRolled = true;
			while(players.player[i].username){
				console.log(players.player[i].username+' = '+players.player[i].score);
				if(players.player[i].score <= 0){
					allPlayersRolled = false; 
				}
				i++;
			}
			if(allPlayersRolled == true){
				console.log('All players have rolled');
				//This adds new json array element result
				rollScores.players.push({username: player, roll1: num1, roll2: num2});

				var sumRoll = parseInt(num1)+parseInt(num2);
				var i=0;
				while(players.player[i].username){

					var ii=1; //Because it pushes more elements from here not from 0
					while(players.player[i].mapPropS[ii]){
						console.log(players.player[i].username+'\s game num is = '+players.player[i].mapPropS[ii].hexGameNum+' == '+sumRoll);
						if(players.player[i].mapPropS[ii].hexGameNum == sumRoll){
							console.log('add resource: '+players.player[i].mapPropS[ii].hexType);
							switch(players.player[i].mapPropS[ii].hexType){
								case 'wood':
									players.player[i].cards.wood = (players.player[i].cards.wood+1);
									break;
								case 'brick':
									players.player[i].cards.brick = (players.player[i].cards.brick+1);
									break;
								case 'oar':
									players.player[i].cards.oar = (players.player[i].cards.oar+1);
									break;
								case 'sheep':
									players.player[i].cards.sheep = (players.player[i].cards.sheep+1);
									break;
								case 'wheat':
									players.player[i].cards.wheat = (players.player[i].cards.wheat+1);
									break;
							}
						}
					
						ii++;	
					}
					i++;
				}
			}else{
				//This adds new json array element result
				rollScores.players.push({username: player, roll1: num1, roll2: num2});
				
				var a=1; // don't want the first index "0"
				var indx=1;
				var type = 0; //good roll
				while(rollScores.players[a]){
					if(a==1){
					}else{
						while(indx < a){
							console.log(rollScores.players[a].roll1);
							if((parseInt(rollScores.players[a].roll1)+parseInt(rollScores.players[a].roll2)) == (parseInt(rollScores.players[a-indx].roll1)+parseInt(rollScores.players[a-indx].roll2))){
								//removes duplicate number for json index
								rollScores.players.splice(a,1);
								type=1; //bad roll
								a--;
							}
							indx++;
						}//end while
						indx=1; //resets the indx
					}//end else
					a++;
				}//end while
			}//end else
			
			//Draw dice to all players screen
			io.sockets.emit('drawDice', num1, num2, JSON.stringify(rollScores), type, player, JSON.stringify(players));
			
			if(allPlayersRolled){
				//Don't need to set player turn after 
			}else{
				if(a > clientNum){ //client num can be 3 or 4
											
					//Removes the initial json array index so sort function will work.
					rollScores.players.splice(0,1);
					
					//Sorts the json array from highest number to smallest
					rollScores.players.sort(function(a,b){return (parseInt(b.roll1)+parseInt(b.roll2))-(parseInt(a.roll1)+parseInt(a.roll2))});
					
					var c=0;
					while(rollScores.players[c]){
						for(var d=0; d<4; d++){
							if(rollScores.players[c].username == players.player[d].username){
								players.player[d].order=(parseInt(c)+1);
								
								console.log(players.player[d].username+' order: '+(parseInt(c)+1)+'num: '+players.player[d].order);
								
								io.sockets.emit('playersTurn', JSON.stringify(players));
							}
						}
						
						c++;
					}
				}//end if
			}//end else
		}else if(jsonMessage.message[0].action == 'new turn'){
			var newTurn = jsonMessage.message[0].newTurn;
			
			console.log('username = '+players.player[0].username+' and turn = '+newTurn);
			var i=0;
			while(players.player[i].username){
				console.log(i+' Logged');
				players.player[i].turn = newTurn;
				
				i++;
			}
			
			io.sockets.emit('newTurn', JSON.stringify(players));
		}
		
	});
});