<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Catan Lobby</title>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script src="/socket.io/socket.io.js"></script>
<style type="text/css">
	body{
		/*background-image: url(http://localhost/images/PlayCatan.jpeg);*/
		background-position: 0px 900px;
		background-size: 100% 700%;
		background-color: #F33;
	}
	#messaging{
		border: 0px solid black;
		position: absolute;
		right: 10px;	
	}
</style>
</head>
<body>

<!-- HTML -->
	<h1 align="center">Catan Lobby</h1>
    
    <table align="center">
    	<tr>
        	<td><input type="button" value="Connect to a game" id="connect" onclick="connect()" /></td>
            <td><input type="button" value="Leave Lobby" id="disconnect" onclick="disconnect()" /></td>
        </tr>
        <tr>
        	<td colspan="2" align="center"><input style="font-size:18px; font-weight: bold; background-color: #F90;" type="button" value="Start game" id="startGame" onclick="goToCatan()" /></td>
        </tr>
    </table>
    <table align="left">
    	<tr>
        	<td id="playerCount" style="font-size: 18px; font-style: italic;"><b>0</b> of 3 players needed for a game</td>
        </tr>
        <tr>
            <td id="thisPlayer" style="color: #FFF; font-size: 24px; font-weight: bold;"></td>
        </tr>
        <tr>
            <td id="players"></td>
        </tr>
    </table>
    
     <div id="messaging">
        <div align="right"><p id="status" style="font-style: italic;">Waiting to connect</p></div>
        <input type="text" style="border-color: #000; background-color: white; border-radius: 5px;"id="message" />
        <button id="send" onclick="send()">Send Message</button><br/>
        <p align="center" style="font-size: 24px;">Messages:</p><hr />
        <div id="messages"></div>
    </div>
<!-- END HTML -->

<script type="text/javascript">
	
	var username = getUrlVars()["username"];
	
	$('#thisPlayer').html('Welcome ' + username+"!");
	$('#startGame').hide();
	 	
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
</script>

<script type="text/javascript">
	//SOCKET.IO MULTIPLAYER CONNECTION=========================================
	var playerCount = 0;
	var socket;
	var firstConnect = true;
	var num = 1;
	
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
				$('#playerCount').html(clientNum+' of 3 players needed for a game');

				if(clientNum >= 3){
					$('#startGame').show();	
				}else{
					$('#startGame').hide();	
				}
				var username = getUrlVars()["username"];

				socket.json.send(JSON.stringify({message: [{action: 'usersocket', username: username, socketID: clientID}]}) );
			});
			
			//callback for the 'playerJoined' event defined which is received by everyone except sender
			socket.on('playerJoined', function(player, clientNum){
				var username = getUrlVars()["username"];
				
				// EXTERMELY CONFUSING player joining display script. Took me about 4 hours to figure out!!!!!!								
				if(clientNum == 1){//ENDS for 1
					if(player != username){
						$('#players').append(player+' has connected to the game<br/>');
					}
					num = 1;
				}else if(clientNum == 2){
					if(player != username){
						$('#players').append(player+' has connected to the game<br/>');
					}
					num = 1;
				}else if(clientNum == 3){
					if(num == 1){
						$('#players').html('');
						
						num++
					}
					if(player != username){
						$('#players').append(player+' has connected to the game<br/>');
					}
				}else if(clientNum == 4){
					if(num == 2){
						$('#players').html('');
						
						num++
					}
					if(player != username){
						$('#players').append(player+' has connected to the game<br/>');
					}
				}
					
			});
			
			socket.on('playerDisconnected', function(clientNum){
				$('#playerCount').html(clientNum+' of 3 players needed for a game');

				if(clientNum >= 3){
					$('#startGame').show();	
				}else{
					$('#startGame').hide();	
				}
			});
			
			socket.on('goToCatan', function(senderUsername){
				var username = getUrlVars()["username"];
				window.location="http://localhost:8888/catan.php?username="+username;
			});
			
			firstConnect = false;
		}else{
			socket.socket.reconnect();
		}
	}
	
	function disconnect(){
		socket.disconnect();
		num--;
	}
	
	function send(){
		socket.json.send(JSON.stringify({message: [{action: 'chat', message: $('#message').val() }]}) );
		$('#message').val('');
	}
	
	function goToCatan(){
		var username = getUrlVars()["username"];
		socket.json.send(JSON.stringify({message: [{action: 'goToCatan', username: username}]}) );	
	}
	//============================================================================
</script>
</body>
</html>