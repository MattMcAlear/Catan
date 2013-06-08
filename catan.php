<!--
// Purpose: To digitalize the Catan experience for all. (Idea to build Catan goes to Ben Mercurio!)
// By: 		Matt M.
// Date:	07-01-2012
// † By The Grace God
-->
<!DOCTYPE HTML>
<html manifest="http://localhost/demo.appcache">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Catan</title>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="/socket.io/socket.io.js"></script>
<style type="text/css">
	body{
		margin: 10px 10px 10px 10px;
		background-image: url(http://localhost/images/ocean2.jpeg);
		background-size: 100px 100px;
	}
	#diceFrame{
		z-index: 4;
		width: auto;
		position: fixed;
		left: 10px;
		top: 70px;
		border: 1px solid black;
	}
	canvas{
		position: absolute;
		z-index: 0;
	}
	.menu{
		border: 0px solid black;
		position: absolute;
		margin-left: 8%;
		top: 45px;
		width: 84%;
		height: 90%;
		z-index: 3;
		background-color: none;
		/*box-shadow: 5px 5px 12px #333;*/
		/*display: none;*/
	}
	.scroll{
		position: fixed;
		margin-left: 20%;
		top: 60px;
		width: 70%;
		height: 90%;
		z-index: 2;
		background-color: none;
		background-image: url(http://localhost/images/menu4.png);
		background-size: 100% 100%;
		display: none;
	}
	#menuToggle{
		border: 5px outset #b6936a;
		background-color: #e0c9a4;
		position: fixed;
		left: 10px;
		top: 60px;
		width: auto;
		height: auto;
		z-index: 2;
		font-size:28px;
		border-radius: 5px;
	}
	#menuToggle:active{
		border: 5px inset #b6936a;
		background-color: #e0c9a4;
		position: fixed;
		left: 10px;
		top: 60px;
		width: auto;
		height: auto;
		z-index: 2;
		font-size:28px;
		border-radius: 5px;
	}
	#diceButton{
		border: 5px outset #b6936a;
		background-color: #e0c9a4;
		position: fixed;
		left: 50px;
		top: 120px;
		width: auto;
		height: auto;
		z-index: 0;
		font-size:28px;
		border-radius: 5px;
		font-style: bold;
	}
	#diceButton:active{
		border: 5px inset #b6936a;
		background-color: #e0c9a4;
		position: fixed;
		left: 50px;
		top: 120px;
		width: auto;
		height: auto;
		z-index: 0;
		font-size:28px;
		border-radius: 5px;
		font-style: bold;
	}
	canvas#dice{
		top: 90px;
		width: 200px;	
	}
	#messaging{
		border: 0px solid black;
		position: absolute;
		right: 10px;
		top: 50px;	
	}
	#buildMap{
		position: absolute;
		width: 40%;
		height: 80%;
		left: 30%;
		top: 10%;
		border: 0px solid black;
		background-color: #FC6;
		border-radius: 50px;
		font-size: 36px;
		text-decoration: none;
		text-align: center;
	}
	#infoBlock{
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
		height: 50px;
		background-color: #000;
		background-image: url(http://localhost/images/menu.jpeg);
		border-bottom: 3px solid black;
		font-size: 36px;
		color: white;
		z-index: 5;
		text-align: center;
	}
	#fader{
		position: fixed;
		top: 0px;
		left: 0px;
		height: 100%;
		width: 100%;
		z-index: 1;
		background-color: black;
		opacity: .6;	
	}
	#audioControls{
		position: fixed;
		bottom: 10px;
		left: 10px;	
	}
	.rec{
		border: 10px outset #b6936a;
		background-color: #e0c9a4;
		border-radius: 5px;
		padding: 20px 10px 20px 10px;
	}
	.rec:active{
		border: 10px inset #b6936a;
		background-color: #e0c9a4;
		border-radius: 5px;
		padding: 20px 10px 20px 10px;
	}
	.recImg{
		border-radius: 5px;
		border-style: double;
		border-width: thick;
		background-color: #FFFFF4;
	}
	#logoPos{
		position: fixed;
		left: 10px;
		top: -47px;
		z-index: 6;
	}
	#score{
		position: absolute;
		left: 10px;
		top: 10px;	
	}
	#endTurn{
		position: absolute;
		right: 10px;
		top: 10px;
		font-weight: bold;
		border: 5px outset #b6936a;
		background-color: #e0c9a4;
		border-radius: 5px;
		padding: 10px;
	}
	#endTurn:active{
		position: absolute;
		right: 10px;
		top: 10px;
		font-weight: bold;
		border: 5px inset #b6936a;
		background-color: #e0c9a4;
		border-radius: 5px;
		padding: 10px;
	}
	.resourceNum{
		font-size: 20px;
		font-weight: bold;
		color: black;
	}
	#menuBody{
		overflow: auto;
		height: 165px;
		border: 3px dashed #624f39;
	}
</style>
</head>
<body onload="goto();">
	<div id="logoPos"><canvas id="logo" width="100" height="100"></canvas></div>
	<div id="infoBlock"></div>
	<canvas id="catan" width="1330px" height="1200px">Your browser does not support HTML5 Canvas</canvas>
    <div id="fader"></div><!-- fades background when menu pops up -->
        
    <div id="menuToggle">
   		Show Menu
    </div>
    <div class="scroll">
        <div class="menu">
            <span id="score">Your Score: </span>
            <span id="endTurn" onClick="changeOrder()" style="display: none;">End Turn</span>
            
            <h1 align="center">Menu</h1>
            <hr width="80%" />
                <table align="center">
                    <tr>
                        <th align="center" width="35%">Players</th>
                        <th align="center" width="45%">Action</th>
                        <th align="center" width="15%">Trade</th>
                        <th align="center" width="5%">Turn</th>
                    </tr>
                </table>
           	<div id="menuBody">
                <table align="center">
                    <tr id="rw1">
                        <td width="25%" id="player1" align="center" style="font-weight: bold; font-size: 24px;"></td>
                        <td width="45%" id="p1Action" align="center"><div id="actions" style="display: none;"><img src="http://localhost/images/road.png" width="100px" height="75px" id="road1" onclick='setAction("road", "1");' />
                                        <img src="http://localhost/images/settlement.png" width="100px" height="75px" id="settlement1" onclick='setAction("settlement", "1");' />
                                        <img src="http://localhost/images/city.png" width="100px" height="75px" id="city1" onclick='setAction("city", "1");' /></div></td>
                        <td width="25%" id="p1Trade" align="center">
                        	<img src="http://localhost/images/thumbsUp.png" width="65px" height="75px" id="thumbsUp1" onclick='setAction("thumbsUp", "1");' />
                            <img src="http://localhost/images/thumbsDown.png" width="65px" height="75px" id="thumbsDown1" onclick='setAction("thumbsDown", "1");' />
                        </td>
                        <td width="5%" id="p1Turn" align="center"><img src="http://localhost/images/whiteArrow.svg" width="50px" height"50px" id="turnArrow1" style="display: none;" /></td>
                    </tr>
                    <tr id="rw2">
                        <td id="player2" align="center" style="font-weight: bold; font-size: 24px;"></td>
                        <td id="p2Action" align="center"></td>
                        <td id="p2Trade" align="center"><img src="http://localhost/images/twoWayArrow.png" width="65px" height="75px" id="trade2" onclick='setAction("trade", "2");' /></td>
                        <td id="p2Turn" align="center"><img src="http://localhost/images/whiteArrow.svg" width="50px" height"50px" id="turnArrow2" style="display: none;" /></td>
                    </tr>
                    <tr id="rw3">
                        <td id="player3" align="center" style="font-weight: bold; font-size: 24px;"></td>
                        <td id="p3Action" align="center"></td>
                        <td id="p3Trade" align="center"><img src="http://localhost/images/twoWayArrow.png" width="65px" height="75px" id="trade3" onclick='setAction("trade", "3");' /></td>
                        <td id="p3Turn" align="center"><img src="http://localhost/images/whiteArrow.svg" width="50px" height"50px" id="turnArrow3" style="display: none;" /></td>
                    </tr>
                    <tr id="rw4">
                        <td id="player4" align="center" style="font-weight: bold; font-size: 24px;"></td>
                        <td id="p4Action" align="center"></td>
                        <td id="p4Trade" align="center"><img src="http://localhost/images/twoWayArrow.png" width="65px" height="75px" id="trade4" onclick='setAction("trade", "4");' /></td>
                        <td id="p4Turn" align="center"><img src="http://localhost/images/whiteArrow.svg" width="50px" height"50px" id="turnArrow4" style="display: none;" /></td>
                    </tr>
                </table>
            </div>
            <table width="100%" id="colorSelection">
                 <tr id="rw5">
                    <td align="center" colspan="6"><hr width="80%" /><h2>Choose your color</h2></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr id="rw5">
                    <td align="center" width="16.6%" id="blue" style="background-color: #39F; color: white;" onclick='setColor("#39F")'>BLUE</td>
                    <td align="center" width="16.6%" id="green" style="background-color: #6C6;" onclick='setColor("#6C6")'>GREEN</td>
                    <td align="center" width="16.6%" id="orange" style="background-color: #FC3;" onclick='setColor("#FC3")'>ORANGE</td>
                    <td align="center" width="16.6%" id="brown" style="background-color: #C96; color: white;" onclick='setColor("#C96")'>BROWN</td>
                    <td align="center" width="16.6%" id="white" style="background-color: white;" onclick='setColor("white")'>WHITE</td>
                    <td align="center" width="16.6%" id="red" style="background-color: #F33;" onclick='setColor("#F33")'>RED</td>
                </tr>
            </table>
            <table width="100%" id="rollDisplay" align="center">
                <tr>
                    <td id="roll1" align="center" style="font-size:24px"></td>
                </tr>
            </table>
            <table width="100%" id="resources">
                <tr>
                    <td colspan="5" align="center"><hr width="80%" /></td>
                </tr>
                <tr>
                    <td class="rec" align="center"><img src="http://localhost/images/bundleOwood.png" class="recImg" width="90%" /></td>
                    <td class="rec" align="center"><img src="http://localhost/images/ironOre.png" class="recImg" width="90%" /></td>
                    <td class="rec" align="center"><img src="http://localhost/images/wheat.png" class="recImg" width="90%" /></td>
                    <td class="rec" align="center"><img src="http://localhost/images/brick.png" class="recImg" width="90%" /></td>
                    <td class="rec" align="center"><img src="http://localhost/images/sheep.png" class="recImg" width="90%" /></td>
                </tr>
                <tr>
                    <td class="resourceNum" id="woodRecCount" align="center">0</td>
                    <td class="resourceNum" id="oreRecCount" align="center">0</td>
                    <td class="resourceNum" id="wheatRecCount" align="center">0</td>
                    <td class="resourceNum" id="brickRecCount" align="center">0</td>
                    <td class="resourceNum" id="sheepRecCount" align="center">0</td>
                </tr>
            </table>
        </div>
   </div>
   <div id="messaging">
        <div align="right"><b>*</b> <span id="status" style="font-style: italic;">Waiting to connect</span></div>
        <!--
        <input type="text" style="border-color: #000; background-color: white; border-radius: 5px;"id="message" />
        <button id="send" onclick="send()">Send Message</button><br/>
        <p align="center" style="font-size: 24px;">Messages:</p><hr />
        <div id="messages"></div>
        -->
    </div>
    <div id="diceFrame">
        <div id="diceButton">
        Roll
        </div>
    	<canvas id="dice"></canvas>
    </div>
    
    <audio controls="controls" id="audioControls">
    	<source src="http://localhost/audio/catanMusic1.mp3" type="audio/mpeg" />
        Your browser doesn't support this audio feature :(
    </audio>
<script type="text/javascript">
//GEO locate users=========================================================
var x=document.getElementById('dice');
function getLocation(){
	if(navigator.geolocation){
    	navigator.geolocation.getCurrentPosition(showPosition);
    }else{
		x.innerHTML="Geolocation is not supported by this browser.";
	}
	
}
function showPosition(position){
  //alert("Latitude: " + position.coords.latitude+"<br />Longitude: "+position.coords.longitude);
}
getLocation();
//GEO locate users=========================================================

//SOCKET.IO MULTIPLAYER CONNECTION=========================================
var socket;
var firstConnect = true;
var playerColors = new Array();
//counts players connected
var playerCount=0;
//variable to set turns
var playerOrder = 1;
//variable to draw map ONCE
var drawOnce = 1;

function connect(){
	if(firstConnect){
		socket = io.connect(null);	
		
		//callbacks for standard socket.io server events
		socket.on('connect',function(){ $('#status').html('connected to the game'); });
		socket.on('disconnect',function(){ $('#status').html('disconnected'); });
		socket.on('reconnecting',function(){ $('#status').html('reconnecting in '+nextRetry+' milliseconds'); });
		socket.on('reconnect_failed',function(){ $('#status').html('reconnection failed!'); });
		
		//callback for the 'chat' event defined
		socket.on('chat',function(client, message){
			var username = getUrlVars()["username"];
			if(client == username){
				$('#messages').append('You said: '+message+'<br/>');
			}else{
				$('#messages').append(client+' said: '+message+'<br/>');
			}
		});
		
		//callback for the 'player' event defined 
		socket.on('player', function(clientNum, clientID){
			var username = getUrlVars()["username"];

			socket.json.send(JSON.stringify({message: [{action: 'usersocket', username: username, socketID: clientID}]}) );
		});
		
		//callback for the 'playerJoined' event defined which is received by everyone except sender
		socket.on('playerJoined', function(player, clientNum){
			var username = getUrlVars()["username"];
						
			//Shows players connected to the game
			if(player != username){
				if($('#player2').html() == ''){
					$('#player2').html(player);
					$('#rw2').show();
					playerCount++;
				}else if($('#player2').html() != '' && $('#player3').html() == '' && $('#player2').html() != player){
					$('#player3').html(player);
					$('#rw3').show();
					playerCount++;
				}else if($('#player2').html() != '' && $('#player3').html() != '' && $('#player4').html() == '' && $('#player2').html() != player && $('#player3').html() != player){
					$('#player4').html(player);
					$('#rw4').show();
					playerCount++;
				}
			}else{
				$('#player1').html(username);
				playerCount++;	
			}
		});
		
		//if player diconnects from game
		socket.on('playerDisconnected', function(clientNum, name){
			//doesn't quite work yet
			/*
			if($('#player1').html() == name){
				$('#player1').html(name+' quit the game');
			}else if($('#player2').html() == name){
				$('#player2').html(name+' quit the game');
			}else if($('#player3').html() == name){
				$('#player3').html(name+' quit the game');
			}else if($('#player4').html() == name){
				$('#player4').html(name+' quit the game');
			}
			*/
		});
			
		socket.on('buildMap', function(socket, jsonMap){
			drawMap(jsonMap);
			
			if(sessionStorage.getItem('playerAttributes') == null){
				//Draw nothing to the screen
			}else{
				setTimeout(function(){
					//redraw all elements to the screen
					var players = JSON.parse(sessionStorage.getItem('playerAttributes'));
					
					var i=0;
					var a=1; //for roads
					var b=1; //for settlements
					while(players.player[i]){
						while(players.player[i].mapPropR[a]){
							drawRoad(players.player[i].color, players.player[i].mapPropR[a].mouseX, players.player[i].mapPropR[a].mouseY, sessionStorage.getItem('tcx'), sessionStorage.getItem('tcy'), sessionStorage.getItem('trcx'), sessionStorage.getItem('trcy'), sessionStorage.getItem('tlcx'), sessionStorage.getItem('tlcy'), sessionStorage.getItem('bcx'), sessionStorage.getItem('bcy'));
							
							a++;	
						}
						while(players.player[i].mapPropS[b]){
							drawSettlement(players.player[i].color, players.player[i].mapPropS[b].mouseX, players.player[i].mapPropS[b].mouseY, sessionStorage.getItem('tcx'), sessionStorage.getItem('tcy'), sessionStorage.getItem('trcx'), sessionStorage.getItem('trcy'), sessionStorage.getItem('brcx'), sessionStorage.getItem('brcy'), sessionStorage.getItem('bcx'), sessionStorage.getItem('bcy'), sessionStorage.getItem('blcx'), sessionStorage.getItem('blcy'), sessionStorage.getItem('tlcx'), sessionStorage.getItem('tlcy'));
							
							b++;	
						}
						i++
						a=1;
						b=1;
					}
					
					//Set color again
					var username = getUrlVars()["username"];
					var c=0;
					while(players.player[c]){
						if(players.player[c].username == username){
							var theirColor = players.player[c].color;
							$('#rw1').css('background-color', theirColor);
							//resends current players color to all clients
							setColor(theirColor);
						}
						c++;
					}
					
					//Sets header status and actions (if it's their turn) and turn arrow indicator
					var d=0;
					while(players.player[d].order){
						$('#turnArrow'+(d+1)).hide();
						if(players.player[d].order == playerOrder){
							if(players.player[d].username == username){
								$('#infoBlock').html(username+'-- It\s your turn.');
								
								//Shows only for the player that's their turn and no one else
								$('#actions').show();
								$('#diceButton').show();
								$('#endTurn').show();					
							}else{
								$('#infoBlock').html(username+'-- It\s '+players.player[d].username+'s turn.');
								$('#diceButton').hide();
								$('#actions').hide();
							}
							
							//Need to determine where players are in a table and show the value for the certain player in that table.
							var e=0;
							while(players.player[e]){
								if($('#player'+(e+1)).html() == players.player[d].username){
									$('#turnArrow'+(e+1)).show();
									//If script doesn't work... try to put in a break; after completion
								}
								e++;
							}
						}
						d++;
					}
					
					//Sets score
					var i=0;
					while(players.player[i]){
						if(players.player[i].username == username){
							$('#score').html('Your Score: <font size="5" color="red"><b>'+players.player[i].score+'</b></font>');
						}
						i++;
					}

				}, 80); //takes around 50ms for the map to load. So there is a 20ms padding
			}
		});
		
		socket.on('buildRoad', function(socket, color, mouseX, mouseY, tcx, tcy, trcx, trcy, tlcx, tlcy, bcx, bcy, players){
			sessionStorage.setItem('playerAttributes', players);
			var playerAttributes = sessionStorage.getItem('playerAttributes');
			
			var players = JSON.parse(playerAttributes);
			
			drawRoad(color, mouseX, mouseY, tcx, tcy, trcx, trcy, tlcx, tlcy, bcx, bcy);
		});
		
		socket.on('buildSettlement', function(socket, color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, players){
			sessionStorage.setItem('playerAttributes', players);
			var playerAttributes = sessionStorage.getItem('playerAttributes');
			
			var username = getUrlVars()["username"];
			var players = JSON.parse(players);
			
			//Update score and resources
			var i=0;
			while(players.player[i]){
				if(players.player[i].username == username){
					$('#score').html('Your Score: <font size="5" color="red"><b>'+players.player[i].score+'</b></font>');
					
					$('#woodRecCount').html(players.player[i].cards.wood);
					$('#oreRecCount').html(players.player[i].cards.oar);
					$('#brickRecCount').html(players.player[i].cards.brick);
					$('#sheepRecCount').html(players.player[i].cards.sheep);
					$('#wheatRecCount').html(players.player[i].cards.wheat);
				}
				i++;
			}
			
			drawSettlement(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy);
		});
		
		socket.on('buildCity', function(socket, color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, players){
			sessionStorage.setItem('playerAttributes', players);
			var playerAttributes = sessionStorage.getItem('playerAttributes');
			
			var username = getUrlVars()["username"];
			var players = JSON.parse(players);
			
			//Update score and resources
			var i=0;
			while(players.player[i]){
				if(players.player[i].username == username){
					$('#score').html('Your Score: <font size="5" color="red"><b>'+players.player[i].score+'</b></font>');
					
					$('#woodRecCount').html(players.player[i].cards.wood);
					$('#oreRecCount').html(players.player[i].cards.oar);
					$('#brickRecCount').html(players.player[i].cards.brick);
					$('#sheepRecCount').html(players.player[i].cards.sheep);
					$('#wheatRecCount').html(players.player[i].cards.wheat);
				}
				i++;
			}
			
			drawCity(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy);
		});
		
		socket.on('playerColor', function(playerColor, player, players){
			if($('#player1').html() == player){
				$('#rw1').css('background-color', playerColor);	
			}else if($('#player2').html() == player){
				$('#rw2').css('background-color', playerColor);	
			}else if($('#player3').html() == player){
				$('#rw3').css('background-color', playerColor);	
			}else if($('#player4').html() == player){
				$('#rw4').css('background-color', playerColor);	
			}
			
			//Stores all game attribues as a JSON object for a session
			sessionStorage.setItem('playerAttributes', players);
			var playerAttributes = sessionStorage.getItem('playerAttributes');
			
			var players = JSON.parse(playerAttributes);
		});
		
		socket.on('drawDice', function(num1, num2, rollScores, type, badRollPlayer, playerAttributes){
			sessionStorage.setItem('playerAttributes', playerAttributes);
			
			var players = JSON.parse(playerAttributes);
			var username = getUrlVars()["username"];
			var rollScores = JSON.parse(rollScores);
			
			drawDice(num1, num2);
			
			var allPlayersRolled = true;
			var i=0;
			while(players.player[i].username){
				if(players.player[i].score <= 0){
					allPlayersRolled = false;
				}
				i++
			}

			if(allPlayersRolled == true){
				var i=0;
				while(players.player[i].username){
					$('#infoBlock').html(username+'-- '+rollScores.players[rollScores.players.length-1].username+' rolled a '+(parseInt(num1)+parseInt(num2)));
					if((rollScores.players[rollScores.players.length-1].username).replace(' ', '') == username.replace(' ', '')){
						$('#infoBlock').html(username+'-- You rolled a '+(parseInt(num1)+parseInt(num2)));

						$('#woodRecCount').html(players.player[i].cards.wood);
						$('#oreRecCount').html(players.player[i].cards.oar);
						$('#brickRecCount').html(players.player[i].cards.brick);
						$('#sheepRecCount').html(players.player[i].cards.sheep);
						$('#wheatRecCount').html(players.player[i].cards.wheat);
					}

					i++;
				}
			}else{
				//if index was deleted to re-roll
				if(type == 1){
					if(badRollPlayer == username){
						$('#infoBlock').html(username+'-- same number, re-roll');
					}
				}else{
					var a=1; // don't want the first index "0"
				
					$('#roll1').html('');
					while(rollScores.players[a].username){				
						$('#roll1').append('<b>'+rollScores.players[a].username+'</b>'+' rolled a '+(rollScores.players[a].roll1+rollScores.players[a].roll2)+'<br/>');	
						
						a++;
					}//end while	
				}
			}//End else
		});
		
		socket.on('playersTurn', function(players){
			var username = getUrlVars()["username"];
			var players = JSON.parse(players);
			
			$('#diceButton').hide();
			$('#actions').hide();
			$('#endTurn').hide();
			var cnt = 0;
			while(players.player[cnt]){
				$('#turnArrow'+(cnt+1)).hide();
				cnt++;	
			}
			
			var a=0;
			while(players.player[a].order){
				if(players.player[a].order == playerOrder){
					if(players.player[a].username == username){
						$('#infoBlock').html(username+'-- It\s your turn.');
						
						//Shows only for the player that's their turn and no one else
						$('#actions').show();
						$('#diceButton').show();
						$('#endTurn').show();						
					}else{
						$('#infoBlock').html(username+'-- It\s '+players.player[a].username+'s turn.');
					}
					
					//Need to determine where players are in a table and show the value for the certain player in that table.
					var b=0;
					while(players.player[b]){
						if($('#player'+(b+1)).html() == players.player[a].username){
							$('#turnArrow'+(b+1)).show();
							//If script doesn't work... try to put in a break; after completion
						}
						b++;
					}
				}
				a++;
			}
			
			//Hides the roll results because we don't need to see them anymore
			$('#rollDisplay').hide();
		});
		
		socket.on('newTurn', function(players){
			//Store player attributes before a JSON.parse
			sessionStorage.setItem('playerAttributes', players);
			
			var username = getUrlVars()["username"];
			var players = JSON.parse(players);
						
			$('#diceButton').hide();
			$('#actions').hide();
			$('#endTurn').hide();
			var cnt = 0;
			while(players.player[cnt]){
				$('#turnArrow'+(cnt+1)).hide();
				cnt++;	
			}
						
			var a=0;
			while(players.player[a].order){
				//shows arrows but could then hide them in the next loop... need to fix :)
				
				if(players.player[a].order == players.player[0].turn){
					if(players.player[a].username == username){
						$('#infoBlock').html(username+'-- It\s your turn.');
						
						//Shows only for the player that's their turn and no one else
						$('#actions').show();
						$('#diceButton').show();
						$('#endTurn').show();						
					}else{
						$('#infoBlock').html(username+'-- It\s '+players.player[a].username+'s turn.');
					}
					
					//Need to determine where players are in a table and show the value for the certain player in that table.
					var b=0;
					while(players.player[b]){
						if($('#player'+(b+1)).html() == players.player[a].username){
							$('#turnArrow'+(b+1)).show();
							//If script doesn't work... try to put in a break; after completion
						}
						b++;
					}
				}
				a++;
			}
		});
		
		firstConnect = false;
	}else{
		socket.socket.reconnect();
	}
}

function disconnect(){
	socket.disconnect();	
}

function send(){
	socket.json.send(JSON.stringify({message: [{action: 'chat', message: $('#message').val() }]}) );
}

function buildMap(){
	socket.json.send(JSON.stringify({message: [{action: 'build map', message: ''}]}) );	
}

function buildRoad(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, hexNum, side){
	socket.json.send(JSON.stringify({message: [{action: 'build road', color: color, x: mouseX, y: mouseY, tcx: tcx, tcy: tcy, trcx: trcx, trcy: trcy, tlcx: tlcx, brcx: brcx, brcy: brcy, blcx: blcx, blcy: blcy, tlcy: tlcy, bcx: bcx, bcy: bcy, hexNum: hexNum, side: side}]}) );
}

function buildSettlement(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, hexNum, corner, hexGameNum, hexType){
	socket.json.send(JSON.stringify({message: [{action: 'build settlement', color: color, x: mouseX, y: mouseY, tcx: tcx, tcy: tcy, trcx: trcx, trcy: trcy, brcx: brcx, brcy: brcy, bcx: bcx, bcy: bcy, blcx: blcx, blcy: blcy, tlcx: tlcx, tlcy: tlcy, hexNum: hexNum, corner: corner, hexGameNum: hexGameNum, hexType: hexType}]}) );
}

function buildCity(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, hexNum, corner, hexGameNum, hexType){
	socket.json.send(JSON.stringify({message: [{action: 'build city', color: color, x: mouseX, y: mouseY, tcx: tcx, tcy: tcy, trcx: trcx, trcy: trcy, brcx: brcx, brcy: brcy, bcx: bcx, bcy: bcy, blcx: blcx, blcy: blcy, tlcx: tlcx, tlcy: tlcy, hexNum: hexNum, corner: corner, hexGameNum: hexGameNum, hexType: hexType}]}) );
}

function sendColor(playerColor){
	socket.json.send(JSON.stringify({message: [{action: 'set color', playerColor: playerColor}]}) );	
}

function sendDice(num1, num2, username, player){
	socket.json.send(JSON.stringify({message: [{action: 'roll dice', num1: num1, num2: num2, player: username}]}) );
}

function sendNewTurn(newTurn){
	socket.json.send(JSON.stringify({message: [{action: 'new turn', newTurn: newTurn}]}) );
}

//============================================================================

//============================================================================
//dice rolling script
var canvas = document.getElementById('dice');
var ctx = canvas.getContext('2d');

var dice1 = {
	width: 100,
	height: 100,
	x: 5,
	y: 5,
	hole: 8
};

var dice2 = {
	width: 100,
	height: 100,
	x: 115,
	y: 5,
	hole: 8
};
ctx.beginPath();
ctx.rect(dice1.x,dice1.y,dice1.width,dice1.height);
ctx.fillStyle="white";
ctx.fill();
ctx.lineWidth=3;
ctx.stroke();

ctx.beginPath();
ctx.rect(dice2.x,dice2.y,dice2.width,dice2.height);
ctx.fillStyle="white";
ctx.fill();
ctx.lineWidth=3;
ctx.stroke();

var rollDice = document.getElementById('diceButton');

rollDice.addEventListener('click',function(){
	var username = getUrlVars()["username"];
	
	var diceRoll1 = Math.floor((Math.random()*6)+1);
	var diceRoll2 = Math.floor((Math.random()*6)+1);
	
	sendDice(diceRoll1, diceRoll2, username);			
}, true);

</script>
    
<script type="text/javascript">
//MISC jQuery / JS code ================================================
window.onload=function(){
	var canvas = document.getElementById('catan');
	var ctx = canvas.getContext('2d');
	
	connect();
	buildMap();
	
	//Draws the bottom layer island first
	var island = new Image();
	
	island.onload=function(){
		ctx.drawImage(island, canvas.width/2-(((1646/1)/2)-150), canvas.height/2-(((1224/.84)/2)-100), 1646/1, 1224/.84);	
	}
	island.src="http://localhost/images/island.png";
}

var inMenu = false;

$('#menuToggle').click(function(){
	$('.scroll').toggle('slow');
	$('#fader').show();
	if(document.getElementById('menuToggle').innerHTML == "Hide Menu"){
		inMenu = false;
		$('#menuToggle').html("Show Menu");
		$('#fader').hide();
		return false;
	}
	$('#menuToggle').html('Hide Menu');	
	inMenu = true;
});

var username = getUrlVars()["username"];

$('#infoBlock').html(username+' -- choose a color!');

$('#player1').html(username);
$('#rw2').hide();
$('#rw3').hide();
$('#rw4').hide();

$('#fader').hide();


//MISC jQuery / JS code ================================================

//CANVAS ======================== CANVAS ======================== CANVAS ======================== CANVAS ========================

var canvas = document.getElementById('catan');
var ctx = canvas.getContext('2d');

function drawMap(jsonMap){
	if(drawOnce > 1){
		//Don't draw map more than once or resource counts will be wrong
	}else{
		//Increment map draw from 1 to 2 so it doesn't draw again
		drawOnce++;
		
		//serverside generated mapping data into JSON
		var map = JSON.parse(jsonMap);
		//===================================================================
			
		//====================================================================
		var wood,oar,wheat,brick,sheep,desert;
		
		wood = "brown";
		oar = "grey";
		wheat = "gold";
		brick = "orange";
		sheep = "green";
		desert = "black";
		
		var woodPort,oarPort,wheatPort,brickPort,sheepPort;
		
		woodPort = "teal";
		oarPort = "teal";
		wheatPort = "teal";
		brickPort = "teal";
		sheepPort = "teal";
		
		var threeToOnePort = "purple";
		var threeToOneCount = 4;
		
		var ocean = "none";
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
		
		// 2=.  3=..  4= ...  5=....  6=..... 8=.....  9=....  10=...  11=..  12=.
		
		//====================================================================
		ctx.save(); //saves the current state before any image clipping
		
		//====================================================================
		var hexW, hexH, hexR, hexS; //hex width, height, radius, side
		
		var x, y; //x and y of the first hex
		
		hexW = 200;
		hexR = hexW / 2;
		hexH = 2 * hexR * Math.sin(Math.PI/180 * 60);
		hexS = 3 / 2 * hexR;
		
		x = canvas.width/2-hexH*1.5;
		y = canvas.height/2-(hexR*5)-hexR/2;
		//======================================================================
		
		//======================================================================
		var bhexW, bhexH, bhexR, bhexS; //Big hex width, height, radius, side
		
		var bx, by; //Big hex x and y
		
		//originally * 1.25
		bhexW = (hexH*6)*.95;
		bhexR = bhexW / 2;
		bhexH = 2 * bhexR * Math.sin(Math.PI/180 * 60);
		bhexS = 3 / 2 * bhexR;
		
		bx = canvas.width/2-bhexR/2;
		by = canvas.height/2-bhexH/2;
		
		ctx.beginPath();
		ctx.moveTo(bx,by);
		ctx.lineTo(bx+=bhexR,by);
		ctx.lineTo(bx+=(bhexW-bhexS),by+=(bhexH/2));
		ctx.lineTo(bx-=(bhexW-bhexS),by+=(bhexH/2));
		ctx.lineTo(bx-=bhexR,by);
		ctx.lineTo(bx-=(bhexW-bhexS),by-=(bhexH/2));
		ctx.lineTo(bx+=(bhexW-bhexS),by-=(bhexH/2));
		ctx.closePath();
		
		// create radial gradient
		var grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 350, canvas.width/2, canvas.height/2, 470);
		// light blue
		grd.addColorStop(0, "#963");
		// dark blue
		grd.addColorStop(1, "tan");
		//ctx.fillStyle = grd;
		//ctx.fill();
		ctx.lineWidth=0;
		//ctx.stroke();	
		
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
		
		// the center hex number
		var hexGameNum = new Array();
		//======================================================================
		
		var hexNum = 4;
		var cascade = 0; //sets the hex's to reverse from 5 to 3 if value = 1
		var hexCount = 1; //Counts all of the hex's
		
		for(var a=0; a<7; a++){	// 30 hex's total
			if(hexNum == 8){
				hexNum--;
				hexNum--;
				cascade = 1;
				x += hexH; //moves the first hex over one once
			}
			if(hexNum >= 4){
				for(var b=0; b<hexNum; b++){
					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x,y);
					//top
					tcx[hexCount] = x;
					tcy[hexCount] = y;
					
					ctx.lineTo(x+=(hexH/2),y+=(hexW-hexS));
					//top right
					trcx[hexCount] = x;
					trcy[hexCount] = y;
					
					ctx.lineTo(x,y+=hexR);
					//bottom right
					brcx[hexCount] = x;
					brcy[hexCount] = y;
					
					ctx.lineTo(x-=(hexH/2),y+=(hexW-hexS));
					//bottom
					bcx[hexCount] = x;
					bcy[hexCount] = y;
					
					ctx.lineTo(x-=(hexH/2),y-=(hexW-hexS));
					//bottom left
					blcx[hexCount] = x;
					blcy[hexCount] = y;
					
					ctx.lineTo(x,y-=hexR);
					//top left
					tlcx[hexCount] = x;
					tlcy[hexCount] = y;
					
					ctx.lineTo(x+=(hexH/2),y-=(hexW-hexS));
	
					if(hexCount == 1){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 2){
						/*
						// add linear gradient
						var grd = ctx.createLinearGradient(x, y, x, y+hexW);
						// light blue
						grd.addColorStop(0, "#2985B8");
						// dark blue
						grd.addColorStop(1, "tan");	
						ctx.fillStyle=ocean;
						ctx.fill();	
						*/
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("3/1");
							ctx.fillText('3/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/questionMark.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
						
					}else if(hexCount == 3){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 4){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("2/1");
							ctx.fillText('2/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/bundleOwood.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
						
					}else if(hexCount == 9){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';			
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 15){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("3/1");
							ctx.fillText('3/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/questionMark.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else if(hexCount == 22){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 28){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("2/1");
							ctx.fillText('2/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/ironOre.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else if(hexCount == 33){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 37){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("3/1");
							ctx.fillText('3/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/questionMark.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else if(hexCount == 36){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 35){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("2/1");
							ctx.fillText('2/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/wheat.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else if(hexCount == 34){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 29){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("3/1");
							ctx.fillText('3/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/questionMark.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else if(hexCount == 23){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 16){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("2/1");
							ctx.fillText('2/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/brick.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else if(hexCount == 10){
						ctx.font = "20pt Arial";
						ctx.textBaseline = 'middle';
						ctx.fillStyle=ocean;
						ctx.fill();	
						ctx.fillStyle="white";
						var tw = ctx.measureText("");
						ctx.fillText('',(x-hexH/2)+(hexH-tw.width)/2,y+hexR,hexH);
					}else if(hexCount == 5){
						img = new Image();
						img.onload = function imageLoaded(){
							var canvas = document.getElementById('catan');
							var ctx = canvas.getContext('2d');
							
							//draw port
							ctx.drawImage(this, this.setAtX-((612/4)/2), this.setAtY, 612/4, 698/4);
							ctx.font = "20pt Arial";
							ctx.textBaseline = 'middle';
							ctx.fillStyle="white";
							var tw = ctx.measureText("2/1");
							ctx.fillText('2/1',(this.setAtX-hexH/2)+(hexH-tw.width),this.setAtY+100,hexH);
													
							img2 = new Image();
							img2.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.drawImage(this, this.setAtX-(hexH-50)+40, this.setAtY+75, 50, 50);
								
							};
							img2.src = "http://localhost/images/sheep.png"; // code assumes this image is 200x200
							img2.setAtX = this.setAtX;
							img2.setAtY = this.setAtY;
						};
						img.src = "http://localhost/images/shipPort3.png"; // code assumes this image is 200x200
						img.setAtX = x;
						img.setAtY = y;
					}else{
						if(map.hexs[hexCount].hexType == 'wood'){
							if(map.hexs[hexCount].hexNumber == 6 || map.hexs[hexCount].hexNumber == 8){
								var textColor = "red";	
							}else{
								var textColor = "black";	
							}
							
							ctx.font = "18pt Arial";
							ctx.textBaseline = "middle";
							var text = ctx.measureText(map.hexs[hexCount].hexNumber);
							var textWidth = text.width;
							var number = map.hexs[hexCount].hexNumber;
							
							img = new Image();
							img.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.clip();
								
								//draw port
								ctx.drawImage(this, this.setAtX-((612/2)/2), this.setAtY, 612/2, 698/2);
								
								ctx.closePath();
								ctx.restore();
								
								//center number
								ctx.save();
								ctx.beginPath();
								ctx.arc(this.setAtX,this.setAtY+hexR,30,0,Math.PI*2,true);
								ctx.globalAlpha=.5;
								ctx.fillStyle = "white";
								ctx.fill();
								ctx.lineWidth=3;
								ctx.stroke();
								ctx.restore();
								
								ctx.font = "18pt Arial";
								ctx.textBaseline = "middle";
								ctx.fillStyle=this.setNumColor;
								ctx.fillText(this.setNum,(this.setAtX-hexH/2)+(hexH-this.setNumWidth)/2,this.setAtY+hexR,hexH);
								
								//REDRAW FOR BORDER
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.closePath();
								ctx.restore();
								ctx.lineWidth=3;
								ctx.stroke();
							};
							img.src = "http://localhost/images/woodHex.jpeg"; // code assumes this image is 200x200
							//Each of these attributes to img are set to pass to this function when loaded the correct value
							img.setAtX = x;
							img.setAtY = y;
							img.setNum = number;
							img.setNumWidth = textWidth;
							img.setNumColor = textColor;
			
						}else if(map.hexs[hexCount].hexType == 'oar'){
							
							if(map.hexs[hexCount].hexNumber == 6 || map.hexs[hexCount].hexNumber == 8){
								var textColor = "red";	
							}else{
								var textColor = "black";	
							}
							
							ctx.font = "18pt Arial";
							ctx.textBaseline = "middle";
							var text = ctx.measureText(map.hexs[hexCount].hexNumber);
							var textWidth = text.width;
							var number = map.hexs[hexCount].hexNumber;
							
							img = new Image();
							img.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.clip();
								
								//draw port
								ctx.drawImage(this, this.setAtX-((612/3)/2), this.setAtY-30, 612/3, 698/3);
								
								ctx.closePath();
								ctx.restore();
								
								//center number
								ctx.save();
								ctx.beginPath();
								ctx.arc(this.setAtX,this.setAtY+hexR,30,0,Math.PI*2,true);
								ctx.globalAlpha=.5;
								ctx.fillStyle = "white";
								ctx.fill();
								ctx.lineWidth=3;
								ctx.stroke();
								ctx.restore();
								
								ctx.font = "18pt Arial";
								ctx.textBaseline = "middle";
								ctx.fillStyle=this.setNumColor;
								ctx.fillText(this.setNum,(this.setAtX-hexH/2)+(hexH-this.setNumWidth)/2,this.setAtY+hexR,hexH);
								
								//REDRAW FOR BORDER
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.closePath();
								ctx.restore();
								ctx.lineWidth=3;
								ctx.stroke();
							};
							img.src = "http://localhost/images/oreHex.jpeg"; // code assumes this image is 200x200
							//Each of these attributes to img are set to pass to this function when loaded the correct value
							img.setAtX = x;
							img.setAtY = y;
							img.setNum = number;
							img.setNumWidth = textWidth;
							img.setNumColor = textColor;
							
						}else if(map.hexs[hexCount].hexType == 'wheat'){
							
							if(map.hexs[hexCount].hexNumber == 6 || map.hexs[hexCount].hexNumber == 8){
								var textColor = "red";	
							}else{
								var textColor = "black";	
							}
							
							ctx.font = "18pt Arial";
							ctx.textBaseline = "middle";
							var text = ctx.measureText(map.hexs[hexCount].hexNumber);
							var textWidth = text.width;
							var number = map.hexs[hexCount].hexNumber;
							
							img = new Image();
							img.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.clip();
								
								//draw port
								ctx.drawImage(this, this.setAtX-((612/2)/3), this.setAtY, 612/3, 698/3);
								
								ctx.closePath();
								ctx.restore();
								
								//center number
								ctx.save();
								ctx.beginPath();
								ctx.arc(this.setAtX,this.setAtY+hexR,30,0,Math.PI*2,true);
								ctx.globalAlpha=.5;
								ctx.fillStyle = "white";
								ctx.fill();
								ctx.lineWidth=3;
								ctx.stroke();
								ctx.restore();
								
								ctx.font = "18pt Arial";
								ctx.textBaseline = "middle";
								ctx.fillStyle=this.setNumColor;
								ctx.fillText(this.setNum,(this.setAtX-hexH/2)+(hexH-this.setNumWidth)/2,this.setAtY+hexR,hexH);
								
								//REDRAW FOR BORDER
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.closePath();
								ctx.restore();
								ctx.lineWidth=3;
								ctx.stroke();
							};
							img.src = "http://localhost/images/wheatHex.jpeg"; // code assumes this image is 200x200
							//Each of these attributes to img are set to pass to this function when loaded the correct value
							img.setAtX = x;
							img.setAtY = y;
							img.setNum = number;
							img.setNumWidth = textWidth;
							img.setNumColor = textColor;
							
						}else if(map.hexs[hexCount].hexType == 'brick'){
							
							if(map.hexs[hexCount].hexNumber == 6 || map.hexs[hexCount].hexNumber == 8){
								var textColor = "red";	
							}else{
								var textColor = "black";	
							}
							
							ctx.font = "18pt Arial";
							ctx.textBaseline = "middle";
							var text = ctx.measureText(map.hexs[hexCount].hexNumber);
							var textWidth = text.width;
							var number = map.hexs[hexCount].hexNumber;
							
							img = new Image();
							img.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.clip();
								
								//draw port
								ctx.drawImage(this, this.setAtX-((612/3.5)/2), this.setAtY, 612/3.5, 698/3.5);
								
								ctx.closePath();
								ctx.restore();
								
								//center number
								ctx.save();
								ctx.beginPath();
								ctx.arc(this.setAtX,this.setAtY+hexR,30,0,Math.PI*2,true);
								ctx.globalAlpha=.5;
								ctx.fillStyle = "white";
								ctx.fill();
								ctx.lineWidth=3;
								ctx.stroke();
								ctx.restore();
								
								ctx.font = "18pt Arial";
								ctx.textBaseline = "middle";
								ctx.fillStyle=this.setNumColor;
								ctx.fillText(this.setNum,(this.setAtX-hexH/2)+(hexH-this.setNumWidth)/2,this.setAtY+hexR,hexH);
								
								//REDRAW FOR BORDER
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.closePath();
								ctx.restore();
								ctx.lineWidth=3;
								ctx.stroke();
							};
							img.src = "http://localhost/images/brickHex.jpeg"; // code assumes this image is 200x200
							//Each of these attributes to img are set to pass to this function when loaded the correct value
							img.setAtX = x;
							img.setAtY = y;
							img.setNum = number;
							img.setNumWidth = textWidth;
							img.setNumColor = textColor;
							
						}else if(map.hexs[hexCount].hexType == 'sheep'){
							
							if(map.hexs[hexCount].hexNumber == 6 || map.hexs[hexCount].hexNumber == 8){
								var textColor = "red";	
							}else{
								var textColor = "black";	
							}
							
							ctx.font = "18pt Arial";
							ctx.textBaseline = "middle";
							var text = ctx.measureText(map.hexs[hexCount].hexNumber);
							var textWidth = text.width;
							var number = map.hexs[hexCount].hexNumber;
							
							img = new Image();
							img.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.clip();
								
								//draw port
								ctx.drawImage(this, this.setAtX-((612/3)/2), this.setAtY-30, 612/3, 698/3);
								
								ctx.closePath();
								ctx.restore();
								
								//center number
								ctx.save();
								ctx.beginPath();
								ctx.arc(this.setAtX,this.setAtY+hexR,30,0,Math.PI*2,true);
								ctx.globalAlpha=.5;
								ctx.fillStyle = "white";
								ctx.fill();
								ctx.lineWidth=3;
								ctx.stroke();
								ctx.restore();
								
								ctx.font = "18pt Arial";
								ctx.textBaseline = "middle";
								ctx.fillStyle=this.setNumColor;
								ctx.fillText(this.setNum,(this.setAtX-hexH/2)+(hexH-this.setNumWidth)/2,this.setAtY+hexR,hexH);
								
								//REDRAW FOR BORDER
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.closePath();
								ctx.restore();
								ctx.lineWidth=3;
								ctx.stroke();
							};
							img.src = "http://localhost/images/sheepHex.jpeg"; // code assumes this image is 200x200
							//Each of these attributes to img are set to pass to this function when loaded the correct value
							img.setAtX = x;
							img.setAtY = y;
							img.setNum = number;
							img.setNumWidth = textWidth;
							img.setNumColor = textColor;
							
						}else if(map.hexs[hexCount].hexType == 'desert'){
							
							img = new Image();
							img.onload = function imageLoaded(){
								var canvas = document.getElementById('catan');
								var ctx = canvas.getContext('2d');
								
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.clip();
								
								//draw port
								ctx.drawImage(this, this.setAtX-((612/2)/2), this.setAtY, 612/2, 698/2);
								
								ctx.closePath();
								ctx.restore();
								
								//REDRAW FOR BORDER
								ctx.save();
								ctx.beginPath();
								//top
								ctx.moveTo(this.setAtX,this.setAtY); 
								//top right
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom right
								ctx.lineTo(this.setAtX,this.setAtY+=hexR);
								//bottom
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY+=(hexW-hexS));
								//bottom left
								ctx.lineTo(this.setAtX-=(hexH/2),this.setAtY-=(hexW-hexS));
								//top left
								ctx.lineTo(this.setAtX,this.setAtY-=hexR);
								//returns to the begining
								ctx.lineTo(this.setAtX+=(hexH/2),this.setAtY-=(hexW-hexS));
								ctx.closePath();
								ctx.restore();
								ctx.lineWidth=3;
								ctx.stroke();
							};
							img.src = "http://localhost/images/desertHex.jpeg"; // code assumes this image is 200x200
							//Each of these attributes to img are set to pass to this function when loaded the correct value
							img.setAtX = x;
							img.setAtY = y;
							
						}
					
					}
					ctx.restore();
					
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
			
			sessionStorage.setItem('tcx', tcx);
			sessionStorage.setItem('tcy', tcy);
			sessionStorage.setItem('trcx', trcx);
			sessionStorage.setItem('trcy', trcy);
			sessionStorage.setItem('brcx', brcx);
			sessionStorage.setItem('brcy', brcy);
			sessionStorage.setItem('bcx', bcx);
			sessionStorage.setItem('bcy', bcy);
			sessionStorage.setItem('blcx', blcx);
			sessionStorage.setItem('blcy', blcy);
			sessionStorage.setItem('tlcx', tlcx);
			sessionStorage.setItem('tlcy', tlcy);
		}
	}
	
function getRelativePosition(e){
	var t = document.getElementById('catan');
	var x = e.clientX+(window.pageXOffset||0);
	var y = e.clientY+(window.pageYOffset||0);
	do
		x-=t.offsetLeft+parseInt(t.style.borderLeftWidth||0),
		y-=t.offsetTop+parseInt(t.style.borderTopWidth||0);
	while (t=t.offsetParent);
	return {
		x: x,
		y: y
	};
}
	
	var count = 1;
	document.addEventListener('click',function(e){
		var ctx = document.getElementById('catan').getContext('2d');
		var position = getRelativePosition(e);
		
		//var playerColors = document.getElementById('playerColors');
		//var playerColor = playerColors.options[playerColors.selectedIndex].value;
		
		//var actions = document.getElementById('actions');
		//var action = actions.options[actions.selectedIndex].value;
	
		 if(playerColor == ''){
			 playerColor = 'red';
		 }else{
			 playerColor = playerColor;
		 }
		if(action == 'settlement' && set == 1 && inMenu == false){
			while(count < hexCount){
				if(count == 1 || count == 2 || count == 3 || count == 4 || count == 5 || count == 9 || count == 10 || count == 15 || count == 16 || count == 22 || count == 23 || count == 28 || count == 29 || count == 33 || count == 34 || count == 35 || count == 36 || count == 37){
					
				}else{
					if(position.x < tcx[count]+10 && position.x > tcx[count]-10 && position.y < tcy[count]+10 && position.y > tcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildSettlement(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'tc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < trcx[count]+10 && position.x > trcx[count]-10 && position.y < trcy[count]+10 && position.y > trcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildSettlement(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'trc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < brcx[count]+10 && position.x > brcx[count]-10 && position.y < brcy[count]+10 && position.y > brcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildSettlement(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'brc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < bcx[count]+10 && position.x > bcx[count]-10 && position.y < bcy[count]+10 && position.y > bcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildSettlement(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'bc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < blcx[count]+10 && position.x > blcx[count]-10 && position.y < blcy[count]+10 && position.y > blcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildSettlement(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'blc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < tlcx[count]+10 && position.x > tlcx[count]-10 && position.y < tlcy[count]+10 && position.y > tlcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildSettlement(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'tlc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}
				}
				count++;
			}
			count = 1;
		}else if(action == 'city' && set == 1 && inMenu == false){
			while(count < hexCount){
				if(count == 1 || count == 2 || count == 3 || count == 4 || count == 5 || count == 9 || count == 10 || count == 15 || count == 16 || count == 22 || count == 23 || count == 28 || count == 29 || count == 33 || count == 34 || count == 35 || count == 36 || count == 37){
					
				}else{
					if(position.x < tcx[count]+10 && position.x > tcx[count]-10 && position.y < tcy[count]+10 && position.y > tcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildCity(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'tc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < trcx[count]+10 && position.x > trcx[count]-10 && position.y < trcy[count]+10 && position.y > trcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildCity(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'trc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < brcx[count]+10 && position.x > brcx[count]-10 && position.y < brcy[count]+10 && position.y > brcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildCity(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'brc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < bcx[count]+10 && position.x > bcx[count]-10 && position.y < bcy[count]+10 && position.y > bcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildCity(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'bc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < blcx[count]+10 && position.x > blcx[count]-10 && position.y < blcy[count]+10 && position.y > blcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildCity(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'blc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}else if(position.x < tlcx[count]+10 && position.x > tlcx[count]-10 && position.y < tlcy[count]+10 && position.y > tlcy[count]-10){
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildCity(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy, count, 'tlc', map.hexs[count].hexNumber, map.hexs[count].hexType);
					}
				}
				count++;
			}
			count = 1;
		}else if(action == "road" && set == 1 && inMenu == false){
			while(count < hexCount){
				if(count == 1 || count == 2 || count == 3 || count == 4 || count == 5 || count == 9 || count == 10 || count == 15 || count == 16 || count == 22 || count == 23 || count == 28 || count == 29 || count == 33 || count == 34 || count == 35 || count == 36 || count == 37){
					
				}else{
					//Road top right
					if(position.x > tcx[count] && position.x < tcx[count]+hexH/2 && position.y > tcy[count] && position.y < tcy[count]+(hexW-hexS)){
						
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildRoad(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, count, 'tr');
					}	
					//Road top left
					if(position.x < tcx[count] && position.x > tcx[count]-hexH/2 && position.y > tcy[count] && position.y < tcy[count]+(hexW-hexS)){
						
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildRoad(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, count, 'tl');
					}
					//Road right
					if(position.x < trcx[count]+10 && position.x > trcx[count]-10 && position.y > trcy[count] && position.y < trcy[count]+hexR){
						
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildRoad(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, count, 'r');
					}		
					//Road left
					if(position.x < tlcx[count]+10 && position.x > tlcx[count]-10 && position.y > tlcy[count] && position.y < tlcy[count]+hexR){
						
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildRoad(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, count, 'l');
					}	
					//Road bottom right
					if(position.x > bcx[count] && position.x < bcx[count]+hexH/2 && position.y < bcy[count] && position.y > bcy[count]-(hexW-hexS)){
						
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildRoad(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, count, 'br');
					}	
					//Road bottom left
					if(position.x < bcx[count] && position.x > bcx[count]-hexH/2 && position.y < bcy[count] && position.y > bcy[count]-(hexW-hexS)){
						
						//sends mouse mouse coordinates and arrayed corners to server to send to all clients
						buildRoad(playerColor, position.x, position.y, tcx, tcy, trcx, trcy, brcx, brcy, blcx, blcy, tlcx, tlcy, bcx, bcy, count, 'bl');
					}	
				}
				count++;
			}
			count = 1;
		}
		
	},true);
}// end drawRoad function

// CANVAS ======================== CANVAS ======================== CANVAS ======================== CANVAS ========================

function drawRoad(color, mouseX, mouseY, tcx, tcy, trcx, trcy, tlcx, tlcy, bcx, bcy){
	if(tcx instanceof Array){
		//Do nothing	
	}else{
		//Make arrays by splitting strings
		var tcx = tcx.split(",");
		var tcy = tcy.split(",");
		var trcx = trcx.split(",");
		var trcy = trcy.split(",");
		var tlcx = tlcx.split(",");
		var tlcy = tlcy.split(",");
		var bcx = bcx.split(",");
		var bcy = bcy.split(",");
		
		for(var a=0; a<37; a++){
			tcx[a] = parseFloat(tcx[a]);
			tcy[a] = parseFloat(tcy[a]);
			trcx[a] = parseFloat(trcx[a]);
			trcy[a] = parseFloat(trcy[a]);
			tlcx[a] = parseFloat(tlcx[a]);
			tlcy[a] = parseFloat(tlcy[a]);
			bcx[a] = parseFloat(bcx[a]);
			bcy[a] = parseFloat(bcy[a]);	
		}
	}
	
	var ctx = document.getElementById('catan').getContext('2d');
	
	var hexW, hexR, hexH, hexS;
	
	hexW = 200;
	hexR = hexW / 2;
	hexH = 2 * hexR * Math.sin(Math.PI/180 * 60);
	hexS = 3 / 2 * hexR;
	
	var count = 1;
	
	while(count < 37){ //<< which is the hex count
		if(count == 1 || count == 2 || count == 3 || count == 4 || count == 5 || count == 9 || count == 10 || count == 15 || count == 16 || count == 22 || count == 23 || count == 28 || count == 29 || count == 33 || count == 34 || count == 35 || count == 36 || count == 37){
			
		}else{
			//Road top right
			if(mouseX > tcx[count] && mouseX < tcx[count]+hexH/2 && mouseY > tcy[count] && mouseY < tcy[count]+(hexW-hexS)){
				//Border
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=18;
				ctx.moveTo(tcx[count],tcy[count]);
				ctx.lineTo(tcx[count]+=(hexH/2),tcy[count]+=(hexW-hexS));
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				tcx[count]-=(hexH/2);
				tcy[count]-=(hexW-hexS);
				
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=12;
				ctx.moveTo(tcx[count],tcy[count]);
				ctx.lineTo(tcx[count]+=(hexH/2),tcy[count]+=(hexW-hexS));
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				tcx[count]-=(hexH/2);
				tcy[count]-=(hexW-hexS);
				
			}	
			//Road top left
			if(mouseX < tcx[count] && mouseX > tcx[count]-hexH/2 && mouseY > tcy[count] && mouseY < tcy[count]+(hexW-hexS)){
				//Border
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=18;
				ctx.moveTo(tcx[count],tcy[count]);
				ctx.lineTo(tcx[count]-=(hexH/2),tcy[count]+=(hexW-hexS));
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				tcx[count]+=(hexH/2);
				tcy[count]-=(hexW-hexS);
				
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=12;
				ctx.moveTo(tcx[count],tcy[count]);
				ctx.lineTo(tcx[count]-=(hexH/2),tcy[count]+=(hexW-hexS));
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				tcx[count]+=(hexH/2);
				tcy[count]-=(hexW-hexS);
				
			}
			//Road right
			if(mouseX < trcx[count]+10 && mouseX > trcx[count]-10 && mouseY > trcy[count] && mouseY < trcy[count]+hexR){
				//Border
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=18;
				ctx.moveTo(trcx[count],trcy[count]);
				ctx.lineTo(trcx[count],trcy[count]+=hexR);
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				trcy[count]-=hexR;
				
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=12;
				ctx.moveTo(trcx[count],trcy[count]);
				ctx.lineTo(trcx[count],trcy[count]+=hexR);
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				trcy[count]-=hexR;
				
			}		
			//Road left
			if(mouseX < tlcx[count]+10 && mouseX > tlcx[count]-10 && mouseY > tlcy[count] && mouseY < tlcy[count]+hexR){
				//Border
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=18;
				ctx.moveTo(tlcx[count],tlcy[count]);
				ctx.lineTo(tlcx[count],tlcy[count]+=hexR);
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				tlcy[count]-=hexR;
				
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=12;
				ctx.moveTo(tlcx[count],tlcy[count]);
				ctx.lineTo(tlcx[count],tlcy[count]+=hexR);
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				tlcy[count]-=hexR;
				
			}	
			//Road bottom right
			if(mouseX > bcx[count] && mouseX < bcx[count]+hexH/2 && mouseY < bcy[count] && mouseY > bcy[count]-(hexW-hexS)){
				//Border
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=18;
				ctx.moveTo(bcx[count],bcy[count]);
				ctx.lineTo(bcx[count]+=(hexH/2),bcy[count]-=(hexW-hexS));
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				bcx[count]-=(hexH/2);
				bcy[count]+=(hexW-hexS);
				
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=12;
				ctx.moveTo(bcx[count],bcy[count]);
				ctx.lineTo(bcx[count]+=(hexH/2),bcy[count]-=(hexW-hexS));
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				bcx[count]-=(hexH/2);
				bcy[count]+=(hexW-hexS);
				
			}	
			//Road bottom left
			if(mouseX < bcx[count] && mouseX > bcx[count]-hexH/2 && mouseY < bcy[count] && mouseY > bcy[count]-(hexW-hexS)){
				//Border
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=18;
				ctx.moveTo(bcx[count],bcy[count]);
				ctx.lineTo(bcx[count]-=(hexH/2),bcy[count]-=(hexW-hexS));
				ctx.strokeStyle = "black";
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				bcx[count]+=(hexH/2);
				bcy[count]+=(hexW-hexS);
				
				ctx.save();
				ctx.beginPath();
				ctx.lineWidth=12;
				ctx.moveTo(bcx[count],bcy[count]);
				ctx.lineTo(bcx[count]-=(hexH/2),bcy[count]-=(hexW-hexS));
				ctx.strokeStyle = color;
				ctx.stroke();
				ctx.restore();
				
				//reset line position
				bcx[count]+=(hexH/2);
				bcy[count]+=(hexW-hexS);
				
			}// end if
		}//end else
		count++;
	}// end while
	count = 1;
}//end build road function

function drawSettlement(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy){
	if(tcx instanceof Array){
		//Do nothing
	}else{
		//Make arrays by splitting strings
		var tcx = tcx.split(",");
		var tcy = tcy.split(",");
		var trcx = trcx.split(",");
		var trcy = trcy.split(",");
		var brcx = brcx.split(",");
		var brcy = brcy.split(",");
		var bcx = bcx.split(",");
		var bcy = bcy.split(",");
		var blcx = blcx.split(",");
		var blcy = blcy.split(",");
		var tlcx = tlcx.split(",");
		var tlcy = tlcy.split(",");
	}
	
	var ctx = document.getElementById('catan').getContext('2d');
		
	var hexW, hexR, hexH, hexS;
	
	hexW = 200;
	hexR = hexW / 2;
	hexH = 2 * hexR * Math.sin(Math.PI/180 * 60);
	hexS = 3 / 2 * hexR;
	
	var count = 1;
		
	while(count < 37/* << which is the hex count*/){
		if(count == 1 || count == 2 || count == 3 || count == 4 || count == 5 || count == 9 || count == 10 || count == 15 || count == 16 || count == 22 || count == 23 || count == 28 || count == 29 || count == 33 || count == 34 || count == 35 || count == 36 || count == 37){
			//skip
		}else{
			if(mouseX < parseFloat(tcx[count])+10 && mouseX > parseFloat(tcx[count])-10 && mouseY < parseFloat(tcy[count])+10 && mouseY > parseFloat(tcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(tcx[count])-15,parseFloat(tcy[count])-10,30,20);
				ctx.lineTo(parseFloat(tcx[count]),parseFloat(tcy[count])-30);
				ctx.lineTo(parseFloat(tcx[count])+15,parseFloat(tcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(trcx[count])+10 && mouseX > parseFloat(trcx[count])-10 && mouseY < parseFloat(trcy[count])+10 && mouseY > parseFloat(trcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(trcx[count])-15,parseFloat(trcy[count])-10,30,20);
				ctx.lineTo(parseFloat(trcx[count]),parseFloat(trcy[count])-30);
				ctx.lineTo(parseFloat(trcx[count])+15,parseFloat(trcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(brcx[count])+10 && mouseX > parseFloat(brcx[count])-10 && mouseY < parseFloat(brcy[count])+10 && mouseY > parseFloat(brcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(brcx[count])-15,parseFloat(brcy[count])-10,30,20);
				ctx.lineTo(parseFloat(brcx[count]),parseFloat(brcy[count])-30);
				ctx.lineTo(parseFloat(brcx[count])+15,parseFloat(brcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(bcx[count])+10 && mouseX > parseFloat(bcx[count])-10 && mouseY < parseFloat(bcy[count])+10 && mouseY > parseFloat(bcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(bcx[count])-15,parseFloat(bcy[count])-10,30,20);
				ctx.lineTo(parseFloat(bcx[count]),parseFloat(bcy[count])-30);
				ctx.lineTo(parseFloat(bcx[count])+15,parseFloat(bcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(blcx[count])+10 && mouseX > parseFloat(blcx[count])-10 && mouseY < parseFloat(blcy[count])+10 && mouseY > parseFloat(blcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(blcx[count])-15,parseFloat(blcy[count])-10,30,20);
				ctx.lineTo(parseFloat(blcx[count]),parseFloat(blcy[count])-30);
				ctx.lineTo(parseFloat(blcx[count])+15,parseFloat(blcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(tlcx[count])+10 && mouseX > parseFloat(tlcx[count])-10 && mouseY < parseFloat(tlcy[count])+10 && mouseY > parseFloat(tlcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(tlcx[count])-15,parseFloat(tlcy[count])-10,30,20);
				ctx.lineTo(parseFloat(tlcx[count]),parseFloat(tlcy[count])-30);
				ctx.lineTo(parseFloat(tlcx[count])+15,parseFloat(tlcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}//end else if
		}//end else
		count++;
	}//end while
	count = 1;
}//end buildSettlement

function drawCity(color, mouseX, mouseY, tcx, tcy, trcx, trcy, brcx, brcy, bcx, bcy, blcx, blcy, tlcx, tlcy){
	if(tcx instanceof Array){
		//Do nothing
	}else{
		//Make arrays by splitting strings
		var tcx = tcx.split(",");
		var tcy = tcy.split(",");
		var trcx = trcx.split(",");
		var trcy = trcy.split(",");
		var brcx = brcx.split(",");
		var brcy = brcy.split(",");
		var bcx = bcx.split(",");
		var bcy = bcy.split(",");
		var blcx = blcx.split(",");
		var blcy = blcy.split(",");
		var tlcx = tlcx.split(",");
		var tlcy = tlcy.split(",");
	}
	
	var ctx = document.getElementById('catan').getContext('2d');
		
	var hexW, hexR, hexH, hexS;
	
	hexW = 200;
	hexR = hexW / 2;
	hexH = 2 * hexR * Math.sin(Math.PI/180 * 60);
	hexS = 3 / 2 * hexR;
	
	var count = 1;
		
	while(count < 37/* << which is the hex count*/){
		if(count == 1 || count == 2 || count == 3 || count == 4 || count == 5 || count == 9 || count == 10 || count == 15 || count == 16 || count == 22 || count == 23 || count == 28 || count == 29 || count == 33 || count == 34 || count == 35 || count == 36 || count == 37){
			//skip
		}else{
			if(mouseX < parseFloat(tcx[count])+10 && mouseX > parseFloat(tcx[count])-10 && mouseY < parseFloat(tcy[count])+10 && mouseY > parseFloat(tcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(tcx[count])-15,parseFloat(tcy[count])-10,30,20);
				ctx.lineTo(parseFloat(tcx[count]),parseFloat(tcy[count])-30);
				ctx.lineTo(parseFloat(tcx[count])+15,parseFloat(tcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(trcx[count])+10 && mouseX > parseFloat(trcx[count])-10 && mouseY < parseFloat(trcy[count])+10 && mouseY > parseFloat(trcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(trcx[count])-15,parseFloat(trcy[count])-10,30,20);
				ctx.lineTo(parseFloat(trcx[count]),parseFloat(trcy[count])-30);
				ctx.lineTo(parseFloat(trcx[count])+15,parseFloat(trcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(brcx[count])+10 && mouseX > parseFloat(brcx[count])-10 && mouseY < parseFloat(brcy[count])+10 && mouseY > parseFloat(brcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(brcx[count])-15,parseFloat(brcy[count])-10,30,20);
				ctx.lineTo(parseFloat(brcx[count]),parseFloat(brcy[count])-30);
				ctx.lineTo(parseFloat(brcx[count])+15,parseFloat(brcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(bcx[count])+10 && mouseX > parseFloat(bcx[count])-10 && mouseY < parseFloat(bcy[count])+10 && mouseY > parseFloat(bcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(bcx[count])-15,parseFloat(bcy[count])-10,30,20);
				ctx.lineTo(parseFloat(bcx[count]),parseFloat(bcy[count])-30);
				ctx.lineTo(parseFloat(bcx[count])+15,parseFloat(bcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(blcx[count])+10 && mouseX > parseFloat(blcx[count])-10 && mouseY < parseFloat(blcy[count])+10 && mouseY > parseFloat(blcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(blcx[count])-15,parseFloat(blcy[count])-10,30,20);
				ctx.lineTo(parseFloat(blcx[count]),parseFloat(blcy[count])-30);
				ctx.lineTo(parseFloat(blcx[count])+15,parseFloat(blcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}else if(mouseX < parseFloat(tlcx[count])+10 && mouseX > parseFloat(tlcx[count])-10 && mouseY < parseFloat(tlcy[count])+10 && mouseY > parseFloat(tlcy[count])-10){
				ctx.beginPath();
				ctx.lineWidth=5;
				ctx.rect(parseFloat(tlcx[count])-15,parseFloat(tlcy[count])-10,30,20);
				ctx.lineTo(parseFloat(tlcx[count]),parseFloat(tlcy[count])-30);
				ctx.lineTo(parseFloat(tlcx[count])+15,parseFloat(tlcy[count])-10);
				ctx.stroke();
				ctx.fillStyle = color;
				ctx.fill();
			}//end else if
		}//end else
		count++;
	}//end while
	count = 1;
}//end buildSettlement

function drawDice(num1, num2){
	var canvas = document.getElementById('dice');
	var ctx = canvas.getContext('2d');
	
	var dice1 = {
		width: 100,
		height: 100,
		x: 5,
		y: 5,
		hole: 8
	};
	
	var dice2 = {
		width: 100,
		height: 100,
		x: 115,
		y: 5,
		hole: 8
	};
	
	ctx.beginPath();
	ctx.rect(dice1.x,dice1.y,dice1.width,dice1.height);
	ctx.fillStyle="white";
	ctx.fill();
	ctx.lineWidth=3;
	ctx.stroke();
	
	ctx.beginPath();
	ctx.rect(dice2.x,dice2.y,dice2.width,dice2.height);
	ctx.fillStyle="white";
	ctx.fill();
	ctx.lineWidth=3;
	ctx.stroke();
	
	if(num1 == 1){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num1 == 2){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num1 == 3){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num1 == 4){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num1 == 5){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*3+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num1 == 6){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*1+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*2+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*1+dice1.x,(dice1.height/4)*3+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice1.width/3)*2+dice1.x,(dice1.height/4)*3+dice1.y,dice1.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}
	
	if(num2 == 1){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num2 == 2){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num2 == 3){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num2 == 4){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num2 == 5){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*3+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}else if(num2 == 6){
		ctx.beginPath();
		ctx.fillStyle="black";
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*1+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*2+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*1+dice2.x,(dice2.height/4)*3+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
		ctx.beginPath();
		ctx.arc((dice2.width/3)*2+dice2.x,(dice2.height/4)*3+dice2.y,dice2.hole,0,Math.PI*2,true);
		ctx.stroke();
		ctx.fill();
	}	
}//END dice roll function

//function to get url variable values in javascript
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
		vars[key] = value;
	});
	return vars;
}

//removes duplicate array elements
function rmvDup(array){
	array.sort();
	for(var i=1; i<array.length; i++){
		if(array[i] == array[i-1]){
			array.splice(i--, 1);	
		}
	}
	return array;
}

var set = 0; //This is not set
var action = ''; //Tells on click event what function to call
var type = ''; //makes sure the action = the action so only one is selected
//sets action to client to build
function setAction(actions, num){
	var move = document.getElementById(actions+num);
	
	if(set == 0 && action == '' && type == ''){
		move.style.opacity = .5;
		move.style.border = "3px solid red";
		
		action = actions;
		type = actions+num;
		set = 1;
	}else if(type == (actions+num)){
		move.style.opacity = 1;
		move.style.border = "0px solid black";
		
		action = '';
		type = '';
		set = 0;
	}
}
var playerColor=''; //initializes playercolor variable
// sets client color
function setColor(color){
		
		playerColor = color;
		
		//sends color to all clients
		sendColor(color);
		
		//gets urls string username
		var username = getUrlVars()["username"];
		
		//Changes the infoblock promt
		$('#infoBlock').html(username+'-- Thanks! Now roll the dice to determine the order.');
		
		$('#colorSelection').hide();
}

var drawShipPorts = function(){
    for(i = 0; i < ports; i++){
        thisWidth = letters[i][0];
        thisHeight = letters[i][1];
        imgSrc = letters[i][2];
        letterImg = new Image();
        letterImg.onload = function(){
            context.drawImage(this,thisWidth,thisHeight);
        }
        letterImg.src = imgSrc;
    }
};
function changeOrder(){
	//get player attributes
	var players = JSON.parse(sessionStorage.getItem('playerAttributes'));
	
	//need to catch player count for correct turn number
	var playerCount = 0;
	while(players.player[playerCount]){
		playerCount++;	
	}
	
	if(players.player[0].turn == (playerCount-1)){
		var turn = 1;
		
		//restart count
		sendNewTurn(turn);
	}else{
		var turn = (players.player[0].turn+1);
		
		//add one
		sendNewTurn(turn);	
	}
}

</script>
<script src="http://localhost/js/logo.js"></script>
</body>
</html>