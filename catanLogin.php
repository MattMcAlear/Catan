<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<script src="http://code.jquery.com/jquery-latest.js"></script>
<script type="text/javascript">
function hello(username){
	$('#header').append(' '+username+'!');	
}
</script>
<title>User Login</title>
<style type="text/css">
	body{
		background-color: #09F;
		margin: 10px 0px;
	}
	#menu{
		border: 1px solid black;
		position: absolute;
		left: 10px;
		top: 75px;
		width: 300px;
		height: auto;
		margin-bottom: 10px;
		background-color: #0FF;
		border-radius: 10px;
	}
	#login{
		border: 1px solid black;
		position: absolute;
		left: 320px;
		top: 75px;
		width: 700px;
		height: auto;
		margin-bottom: 10px;
		padding-bottom: 10px;
		background-color: #0CC;	
	}
	#games{
		border: 1px solid black;
		width: 100%;
		height: auto;
		background-color: #0CC;
		text-align: center;
		font-size: 36px;
		font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		text-shadow: 3px 3px #666;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	#business{
		border: 1px solid black;
		width: 100%;
		height: auto;
		background-color: #0CC;
		text-align: center;
		font-size: 36px;
		font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		text-shadow: 3px 3px #666;
	}
	#misc{
		border: 1px solid black;
		width: 100%;
		height: auto;
		background-color: #0CC;
		text-align: center;
		font-size: 36px;
		font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		text-shadow: 3px 3px #666;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	#games:hover{
		border: 1px solid black;
		width: 100%;
		height: auto;
		background-color: #0C9;
		text-align: center;
		font-size: 36px;
		font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		text-shadow: 3px 3px #666;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
	}
	#business:hover{
		border: 1px solid black;
		width: 100%;
		height: auto;
		background-color: #0C9;
		text-align: center;
		font-size: 36px;
		font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		text-shadow: 3px 3px #666;
	}
	#misc:hover{
		border: 1px solid black;
		width: 100%;
		height: auto;
		background-color: #0C9;
		text-align: center;
		font-size: 36px;
		font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
		text-shadow: 3px 3px #666;
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
	}
	#gameLinks{
		/*unknown yet*/			
	}
	#header{
		color: white;
		position: absolute;
		width: 100%;
		height: 50px;
		text-align: center;
		font-size: 40px;
		font-family:"Lucida Console", Monaco, monospace;
		background-color: black;
		z-index: 2;	
	}
	#logoPos{
		position: absolute;
		left: 10px;
		top: -38px;
		z-index: 5;
	}
</style>
</head>
<body>
	<div id="logoPos"><canvas id="logo" width="100" height="100"></canvas></div>
	<div id="header" >Welcome to learn to game <?php if($username = $_GET['username']){ echo $username.'!';} ?></div>
    <div id="menu">
        <div id="games">
        Games
        </div>
        <div id="gameLinks">
            <ul>
                <li><a href="http://localhost:8888/catanLobby.php?username=<?php echo $username ?>">Catan "none official"</a></li>
                <li><a href="http://localhost/canvasTests.php">Ping pong</a></li>
            </ul>
        </div>
        <div id="business">
        Business
        </div>
        <div id="businessLinks">
            <ul>
                <li><a href="http://mattphp.sscorp.com/PurchaseReq.php">Purchase Requisitions</a></li>
            </ul>
        </div>
        <div id="misc">
        Misc.
        </div>
        <div id="miscLinks">
            <ul>
                <li><a href="http://localhost/bibleRoulette">Bible Roulette</a></li>
            </ul>
        </div>
    </div>
    <div id="login">
    	<form action="loginProcess.php" method="post">
            <table align="center">
                <tr>
                    <th style="font-size: 24px;" align="left">Login Name:</th>
                    <td><input style="background-color: #FFF; border-radius: 7px; border-color: #0FF;" type="text" id="username" name="username" size="50" /></td>
                </tr>
                <tr>
                    <th style="font-size: 24px;" align="left">Password:</th>
                    <td><input style="background-color: #FFF; border-radius: 7px; border-color: #0FF;" type="password" id="password" name="password" size="50" /></td>
                </tr>
                <tr>
                    <td colspan="2" align="right" style="font-size: 24px;"><input style="background-color: #FFF; border-radius: 7px; border-color: #0FF; font-size: 14px;" type="submit" value="Login" name="login" /></td>
                </tr>
                <tr>
                    <td colspan="2"><hr /></td>
                </tr>
                <tr>
                    <td colspan="2" style="text-align: center; text-decoration: none; font-style: italic; font-size: 18px; color: #000;"><a href="http://localhost/signup.php">Sign me up</a></td>
                </tr>
             </table>
         </form>
    
    </div>
    
    <?php
		//	Secure Connection Script 
		include('../htconfig/dbconfig1.php');
		$dbSuccess = false; 
		$dbConnected = mysql_connect($db['hostname'],$db['username'],$db['password']); 
		
		if ($dbConnected) {	 
			$dbSelected = mysql_select_db($db['database'],$dbConnected); 
			if ($dbSelected) { 
				$dbSuccess = true; 
			} 
		} 
		//	END	Secure Connection Script
	?>
		
	<?php
		//Error trapping
		if($_GET['error']){
			echo '<script type="text/javascript"> alert("Invalid password"); </script>';
			setcookie('access',0,time()-3600,'/');
		}
	
	?>
    
    <?php
		//Script to do SOMETHING with the cookie that was passed
		$access = $_COOKIE['access'];
	?>
    
    <script type="text/javascript">
		//toggle for game
		$('#gameLinks').hide();
		$('#games').click(function(e){
			$('#gameLinks').toggle('slow');
		});
		
		//toggle for business
		$('#businessLinks').hide();
		$('#business').click(function(e){
			$('#businessLinks').toggle('slow');
		});
		
		//toggle for misc
		$('#miscLinks').hide();
		$('#misc').click(function(e){
			$('#miscLinks').toggle('slow');
		});
		
		$('#username').focus();
		
	</script>
    <script src="js/logo.js"></script>
</body>
</html>