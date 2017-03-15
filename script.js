countryArray = ["west-australia","east-australia","new-guinea","indonesia","sian","india","china","mongolia",
					"japan","irkutsk","kamchatka","yakutsk","middle-east","afghanistan","ural","siberia","south-africa",
					"madagascar","congo","east-africa","north-africa","egypt","argentina","brazil","peru","venizuela",
					"ukraine","southern-europe","northern-europe","scandinavia","western-europe","great-britain","iceland",
					"central-america","eastern-united-states","quebec","greenland","western-united-states","ontario",
					"alberta","northwest-territory","alaska"];

countryGraph = [
					["east-australia", "new-guinea", "indonesia"],
					["west-australia", "new-guinea"],
					["west-australia", "east-australia", "indonesia"],
					["west-australia", "new-guinea"],
					
					["indonesia", "china", "india"],
					["sian", "china", "afghanistan", "middle-east"],
					["sian", "mongolia", "siberia", "ural", "afghanistan", "india"],
					["japan", "kamchatka", "irkutsk", "siberia", "china"],
					["mongolia", "kamchatka"],
					["mongolia", "kamchatka", "yakutsk", "siberia"],
					["mongolia", "japan", "alaska", "yakutsk", "irkutsk"],
					["irkutsk", "kamchatka", "siberia"],
					["india", "afghanistan", "ukraine", "southern-europe", "egypt", "east-africa"],
					["india", "china", "ural", "ukraine", "middle-east"],
					["afghanistan", "china", "siberia", "ukraine"],
					["china", "mongolia", "irkutsk", "yakutsk", "ural"],
					
					["madagascar", "east-africa", "congo"], //TOP CLOCKWISE FROM NOW
					["east-africa", "south-africa"],
					["east-africa", "south-africa", "north-africa"],
					["middle-east", "madagascar", "south-africa", "congo", "north-africa", "egypt"],
					["western-europe", "southern-europe", "egypt", "east-africa", "congo", "brazil"],
					["middle-east", "east-africa", "north-africa", "southern-europe"],
					
					["peru", "brazil"],
					["venizuela", "north-africa", "argentina", "peru"],
					["venizuela", "brazil", "argentina"],
					["central-america", "brazil", "peru"],
					
					["ural", "afghanistan", "middle-east", "southern-europe", "northern-europe", "scandinavia"],
					["northern-europe", "ukraine", "middle-east", "egypt", "north-africa", "western-europe"],
					["scandinavia", "ukraine", "southern-europe", "western-europe", "great-britain"],
					["ukraine", "northern-europe", "great-britain", "iceland"],
					["great-britain", "northern-europe", "southern-europe", "north-africa"],
					["iceland", "scandinavia", "northern-europe", "western-europe"],
					["greenland", "scandinavia", "great-britain"],
					
					["western-united-states", "eastern-united-states", "venizuela"],
					["ontario", "quebec", "central-america", "western-united-states"],
					["greenland", "eastern-united-states", "ontario"],
					["northwest-territory", "iceland", "quebec", "ontario"],
					["alberta", "ontario", "eastern-united-states", "central-america"],
					["greenland", "quebec", "eastern-united-states", "western-united-states", "alberta", "northwest-territory"],
					["northwest-territory", "ontario", "western-united-states", "alaska"],
					["greenland", "ontario", "alberta", "alaska"],
					["northwest-territory", "alberta", "kamchatka"]
					]
					
blackCountries = [];
whiteCountries = [];
blueCountries = [];
redCountries = [];
yellowCountries = [];
greenCountries = [];

playerArray = [blackCountries,whiteCountries,blueCountries,redCountries,yellowCountries,greenCountries];
var numberOfPlayers;
playerTurn = 0;

$(document).ready(function() {
	var img = document.getElementById('game-board-image');
	$("#game-board-image").on('load',function(){
		setMapAttributes();
		assignCountries(numberOfPlayers, countryArray);
		assignTroops(numberOfPlayers);
		displayTroops(numberOfPlayers);
		updatePlayerStats(numberOfPlayers);
	});
	var getNumPlayers = true;
	var errOutput = "";
	while (getNumPlayers == true){
		numberOfPlayers = prompt("Please enter the number of players (3-6)" + errOutput, 3);
		if (numberOfPlayers >= 3 && numberOfPlayers <= 6){
			getNumPlayers = false;
			numberOfPlayers = parseInt(numberOfPlayers);
			setPlayerStats(numberOfPlayers);
		}
		else{
			errOutput = "\nPlease enter a number";
		}
	}
	$('#black-player-elements .player-headings').toggleClass('bold');
	$('#add-reinforcements-button').click(function(){
		var remainingTroops = parseInt(document.getElementById('reinforcements-remaining-number').innerHTML);
		troopsToAdd = parseInt($('#reinforcements-num-dropdown option:selected').text());
		selectedCountry = $('#selected-country').text();
		if ((troopsToAdd <= remainingTroops) && (selectedCountry != "Select Country")){
			selectedCountry = selectedCountry.replace(/\s+/g, '-').toLowerCase();
			var i, j;
			found = false;
			for (i=0; i < numberOfPlayers; i++){
				for (j=0; j < playerArray[i].length; j++){
					if (playerArray[i][j][0] == selectedCountry){
						found = true;
						break;
					}
				}
				if (found == true){
					break;
				}
			}
			if (i == playerTurn){
				playerArray[i][j][1] += troopsToAdd;
				displayTroops(numberOfPlayers);
				updatePlayerStats(numberOfPlayers);
				document.getElementById('reinforcements-remaining-number').innerHTML = remainingTroops - troopsToAdd;
				updateLowerUI();
			} else alert("Player must add troops to a country they control");
		}
	});	
	
	$('#attack-button').click(function(){
		attackingCountry = $('#selected-country').text();
		defendingCountry = String($('#defending-country-dropdown option:selected').text());
		if (attackingCountry != "Select Country" && (defendingCountry != "Select Country")){
			attackingCountry = attackingCountry.replace(/\s+/g, '-').toLowerCase();
			defendingCountry = defendingCountry.replace(/\s+/g, '-').toLowerCase();
		}
		var i, attackingTroops;
		foundAttacking = false;
		for (i=0; i < playerArray[playerTurn].length; i++){
			if (playerArray[playerTurn][i][0] == attackingCountry){
				foundAttacking = true;
				attackingTroops = playerArray[playerTurn][i][1] - 1; //one troop must stay on attacking country
				break;
			}
		}
		foundDefending = false;
		var defendingPlayer, j, defendingTroops;
		for (defendingPlayer=0; defendingPlayer < numberOfPlayers; defendingPlayer++){
			for (j=0; j < playerArray[defendingPlayer].length; j++){
				if (playerArray[defendingPlayer][j][0] == defendingCountry){
					defendingTroops = playerArray[defendingPlayer][j][1]
					foundDefending = true;
					break;
				}
			}
			if (foundDefending == true){
				break;
			}
		}
		if ((foundAttacking == true) && (foundDefending == true) && (defendingPlayer != playerTurn)){
			defendingRoll = [];
			attackingRoll = [];
			for (k=0; k < Math.min(defendingTroops,2); k++){
				defendingRoll.push(Math.floor(Math.random() * 6 + 1));
			}
			for (k=0; k < Math.min(attackingTroops,3); k++){
				attackingRoll.push(Math.floor(Math.random() * 6 + 1));
			}
			attackingRoll.sort().reverse();
			defendingRoll.sort().reverse();
			displayRoll(attackingRoll, defendingRoll);
			for (k=0; k < Math.min(attackingRoll.length, defendingRoll.length); k++){
				if (attackingRoll[0] > defendingRoll[0]){
					playerArray[defendingPlayer][j][1] -= 1;
				}
				else{
					playerArray[playerTurn][i][1] -= 1;
				}
				attackingRoll.splice(0,1);
				defendingRoll.splice(0,1);	
				if (playerArray[defendingPlayer][j][1] <= 0){
					playerArray[playerTurn].push([playerArray[defendingPlayer][j][0],attackingTroops]);
					playerArray[playerTurn][i][1] -= attackingTroops;
					playerArray[defendingPlayer].splice(j,1);
					conqueredCountry = document.getElementById(playerArray
										[playerTurn][playerArray[playerTurn].length - 1][0] + "-troops");
					conqueredCountry.style.color=getCurrentPlayerColor();
				}
				displayTroops(numberOfPlayers);
				updatePlayerStats(numberOfPlayers);
				updateLowerUI();
			}
		}
		else if (defendingPlayer == playerTurn) alert("Player must not attack a country they control");
		else alert("Current player must select a country that they control");
	});
	
	$('#fortify-button').click(function(){
		
	});
	
	$('.image').click(function(){
		document.getElementById('attackers-roll').innerHTML = "";
		document.getElementById('defenders-roll').innerHTML = "";
		updateLowerUI();
	});
	
	$('.west-australia').click(function() {
        $('.currently-selected-country').text('West Australia');
    });
	$('.east-australia').click(function() {
        $('.currently-selected-country').text('East Australia');
    });
	$('.new-guinea').click(function() {
        $('.currently-selected-country').text('New Guinea');
    });
	$('.indonesia').click(function() {
        $('.currently-selected-country').text('Indonesia');
	});
	$('.sian').click(function() {
        $('.currently-selected-country').text('Sian');
	});
	$('.india').click(function() {
        $('.currently-selected-country').text('India');
	});
	$('.china').click(function() {
        $('.currently-selected-country').text('China');
	});
	$('.mongolia').click(function() {
        $('.currently-selected-country').text('Mongolia');
	});
	$('.japan').click(function() {
        $('.currently-selected-country').text('Japan');
	});
	$('.irkutsk').click(function() {
        $('.currently-selected-country').text('Irkutsk');
	});
	$('.kamchatka').click(function() {
        $('.currently-selected-country').text('Kamchatka');
	});
	$('.yakutsk').click(function() {
        $('.currently-selected-country').text('Yakutsk');
	});
	$('.middle-east').click(function() {
        $('.currently-selected-country').text('Middle East');
	});
	$('.afghanistan').click(function() {
        $('.currently-selected-country').text('Afghanistan');
	});
	$('.ural').click(function() {
        $('.currently-selected-country').text('Ural');
	});
	$('.siberia').click(function() {
        $('.currently-selected-country').text('Siberia');
	});
	$('.south-africa').click(function() {
        $('.currently-selected-country').text('South Africa');
	});
	$('.madagascar').click(function() {
        $('.currently-selected-country').text('Madagascar');
	});
	$('.congo').click(function() {
        $('.currently-selected-country').text('Congo');
	});
	$('.east-africa').click(function() {
        $('.currently-selected-country').text('East Africa');
	});
	$('.north-africa').click(function() {
        $('.currently-selected-country').text('North Africa');
	});
	$('.egypt').click(function() {
        $('.currently-selected-country').text('Egypt');
	});
	$('.argentina').click(function() {
        $('.currently-selected-country').text('Argentina');
	});
	$('.brazil').click(function() {
        $('.currently-selected-country').text('Brazil');
	});
	$('.peru').click(function() {
        $('.currently-selected-country').text('Peru');
	});
	$('.venizuela').click(function() {
        $('.currently-selected-country').text('Venizuela');
	});
	$('.ukraine').click(function() {
        $('.currently-selected-country').text('Ukraine');
	});
	$('.southern-europe').click(function() {
        $('.currently-selected-country').text('Southern Europe');
	});
	$('.northern-europe').click(function() {
        $('.currently-selected-country').text('Northern Europe');
	});
	$('.scandinavia').click(function() {
        $('.currently-selected-country').text('Scandinavia');
	});
	$('.western-europe').click(function() {
        $('.currently-selected-country').text('Western Europe');
	});
	$('.great-britain').click(function() {
        $('.currently-selected-country').text('Great Britain');
	});
	$('.iceland').click(function() {
        $('.currently-selected-country').text('Iceland');
	});
	$('.central-america').click(function() {
        $('.currently-selected-country').text('Central America');
	});
	$('.eastern-united-states').click(function() {
        $('.currently-selected-country').text('Eastern United States');
	});
	$('.quebec').click(function() {
        $('.currently-selected-country').text('Quebec');
	});
	$('.greenland').click(function() {
        $('.currently-selected-country').text('Greenland');
	});
	$('.western-united-states').click(function() {
        $('.currently-selected-country').text('Western United States');
	});
	$('.ontario').click(function() {
        $('.currently-selected-country').text('Ontario');
	});
	$('.alberta').click(function() {
        $('.currently-selected-country').text('Alberta');
	});
	$('.northwest-territory').click(function() {
        $('.currently-selected-country').text('Northwest Territory');
	});
	$('.alaska').click(function() {
        $('.currently-selected-country').text('Alaska');
	});
	$('#next-phase-button').click(function() {
		if ($('#reinforcements').hasClass("active")){
			$('#reinforcements').toggleClass("active");
			$('#attack').toggleClass("active");
			hideReinforcementsOptions();
			showAttackOptions();
		}
		else if ($('#attack').hasClass("active")){
			$('#attack').toggleClass("active");
			$('#fortification').toggleClass("active");
			hideAttackOptions();
			showFortificationOptions();
		}
		else if ($('#fortification').hasClass("active")){
			$('#fortification').toggleClass("active");
			$('#reinforcements').toggleClass("active");
			hideFortificationOptions();
			showReinforcementsOptions();
			document.getElementById('reinforcements-remaining-number').innerHTML = calculateReinforcements();
			nextTurn(numberOfPlayers);
		}
	updateDropdowns();
	updateLowerUI();
	});
	$('#reset-button').click(function(){location.reload()});
});

$(window).resize(function () {
	setMapAttributes();
});

function nextTurn(numberOfPlayers){
	previousTurn = playerTurn;
	playerTurn += 1;
	playerTurn = playerTurn % numberOfPlayers;
	toggleBold(previousTurn);
	toggleBold(playerTurn);
}

function toggleBold(playerNumber){
	switch(playerNumber){
		case(0):
			$('#black-player-elements .player-headings').toggleClass('bold');
			break;
		case(1):
			$('#white-player-elements .player-headings').toggleClass('bold');
			break;
		case(2):
			$('#blue-player-elements .player-headings').toggleClass('bold');
			break;
		case(3):
			$('#red-player-elements .player-headings').toggleClass('bold');
			break;
		case(4):
			$('#yellow-player-elements .player-headings').toggleClass('bold');
			break;
		case(5):
			$('#green-player-elements .player-headings').toggleClass('bold');
			break;
		}
}

function updateLowerUI(){
	selectedCountry = $('#selected-country').text();
	if (selectedCountry != "Select Country"){
		selectedCountry = selectedCountry.replace(/\s+/g, '-').toLowerCase();
		var i, j;
			found = false;
			for (i=0; i < numberOfPlayers; i++){
				for (j=0; j < playerArray[i].length; j++){
					if (playerArray[i][j][0] == selectedCountry){
						found = true;
						break;
					}
				}
				if (found == true){
					break;
				}
			}
		activeTroops = playerArray[i][j][1] - 1; //-1 as one troop in country must stay
		updateDropdowns(activeTroops);
	}
}
function updateDropdowns(activeTroops){
	var prevSelectedNum;
	if (!$('#reinforcements-lower-UI').hasClass('hidden')){
		if ($('#reinforcements-num-dropdown option').length > 1){
			prevSelectedNum = Number($('#reinforcements-num-dropdown option:selected').text());
		} else prevSelectedNum = 1;
		activeTroops = $('#reinforcements-remaining-number').text();
		updateNumDropdown($('#reinforcements-num-dropdown'), activeTroops, prevSelectedNum);		
	
	
	} else if (!$('#attack-lower-UI').hasClass('hidden')){
		console.log($('#attack-force-num-dropdown option').length);
		if ($('#attack-force-num-dropdown option').length > 1){
			prevSelectedNum = Number($('#attack-force-num-dropdown option:selected').text());
		} else prevSelectedNum = 1;
		updateNumDropdown($('#attack-force-num-dropdown'), activeTroops, prevSelectedNum);
		$('#defending-country-dropdown').empty();
		selectedCountry = $('#selected-country').text();
		if (selectedCountry != "Select Country"){
			selectedCountry = selectedCountry.replace(/\s+/g, '-').toLowerCase();
			j = findCountryIndex(selectedCountry);
			for (k=0; k<countryGraph[j].length; k++){
				neighbour = countryGraph[j][k];
				neighbour = neighbour.replace(/-+/g, ' ');			
				neighbour = neighbour.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				var neighbourCountry = $('<option></option>').attr("value", "option value").text(neighbour);
				$('#defending-country-dropdown').append(neighbourCountry);
			}
		}
	
	
	} else if (!$('#fortification-lower-UI').hasClass('hidden')){
		if ($('#fortify-num-dropdown option').length > 1){
			prevSelectedNum = Number($('#fortify-num-dropdown option:selected').text());
		} else prevSelectedNum = 1;
		updateNumDropdown($('#fortify-num-dropdown'), activeTroops, prevSelectedNum);
		$('#fortify-country-dropdown').empty();
		if (selectedCountry != "Select Country"){
			selectedCountry = selectedCountry.replace(/\s+/g, '-').toLowerCase();
			j = findCountryIndex(selectedCountry);
			for (k=0; k  <countryGraph[j].length; k++){
				neighbour = countryGraph[j][k];
				neighbour = neighbour.replace(/-+/g, ' ');			
				neighbour = neighbour.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				var neighbourCountry = $('<option></option>').attr("value", "option value").text(neighbour);
				$('#fortify-country-dropdown').append(neighbourCountry);
			}
		}
	}
}

function updateNumDropdown(dropdown, activeTroops, prevSelectedNum){
	console.log(activeTroops, prevSelectedNum);
	dropdown.empty();
	for (i=1; i <= activeTroops; i++){
		var option = $('<option></option>').attr("value", "option value").text(i);
		if (i == Math.min(prevSelectedNum, activeTroops)){
			option.attr("selected", "selected");
		}
		dropdown.append(option);
	}
}

function findCountryIndex(country){
	selectedCountry = selectedCountry.replace(/\s+/g, '-').toLowerCase();
	var i;
		for (i=0; j<countryArray.length; i++){
			if (countryArray[i] == selectedCountry){
				break;
		}
			}
	return i;
}

function setMapAttributes(){
	var xCoord, yCoord,
	gameBoardHeight = $("#game-board-image").height(),
	gameBoardWidth = $("#game-board-image").width(),
	imageHeight = 892,
	imageWidth = 1407,
	mapArea = Math.round(30 / imageHeight * gameBoardHeight);	
	
	xCoord = Math.round((1365 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((780 / imageHeight) * gameBoardHeight);
	$('.east-australia').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#east-australia-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1220 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((760 / imageHeight) * gameBoardHeight);
	$('.west-australia').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#west-australia-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1286 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((606 / imageHeight) * gameBoardHeight);
	$('.new-guinea').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#new-guinea-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1172 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((630 / imageHeight) * gameBoardHeight);
	$('.indonesia').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#indonesia-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1138 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((482 / imageHeight) * gameBoardHeight);
	$('.sian').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#sian-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1030 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((449 / imageHeight) * gameBoardHeight);
	$('.india').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#india-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1104 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((378 / imageHeight) * gameBoardHeight);
	$('.china').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#china-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1140 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((292 / imageHeight) * gameBoardHeight);
	$('.mongolia').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#mongolia-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1287 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((292 / imageHeight) * gameBoardHeight);
	$('.japan').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#japan-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1120 / imageWidth) * gameBoardWidth);
	
	yCoord = Math.round((209 / imageHeight) * gameBoardHeight);
	$('.irkutsk').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#irkutsk-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1232 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((103 / imageHeight) * gameBoardHeight);
	$('.kamchatka').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#kamchatka-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1134 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((92 / imageHeight) * gameBoardHeight);
	$('.yakutsk').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#yakutsk-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((868 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((456 / imageHeight) * gameBoardHeight);
	$('.middle-east').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#middle-east-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((942 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((317 / imageHeight) * gameBoardHeight);
	$('.afghanistan').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#afghanistan-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((962 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((200 / imageHeight) * gameBoardHeight);
	$('.ural').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#ural-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((1032 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((138 / imageHeight) * gameBoardHeight);
	$('.siberia').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#siberia-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((782 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((789 / imageHeight) * gameBoardHeight);
	$('.south-africa').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#south-africa-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((907 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((782 / imageHeight) * gameBoardHeight);
	$('.madagascar').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#madagascar-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((771 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((657 / imageHeight) * gameBoardHeight);
	$('.congo').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#congo-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((855 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((615 / imageHeight) * gameBoardHeight);
	$('.east-africa').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#east-africa-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((655 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((540 / imageHeight) * gameBoardHeight);
	$('.north-africa').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#north-africa-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((770 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((500 / imageHeight) * gameBoardHeight);
	$('.egypt').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#egypt-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((364 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((729 / imageHeight) * gameBoardHeight);
	$('.argentina').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#argentina-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((453 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((588 / imageHeight) * gameBoardHeight);
	$('.brazil').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#brazil-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((325 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((594 / imageHeight) * gameBoardHeight);
	$('.peru').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#peru-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((328 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((494 / imageHeight) * gameBoardHeight);
	$('.venizuela').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#venizuela-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((825 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((227 / imageHeight) * gameBoardHeight);
	$('.ukraine').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#ukraine-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((718 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((355 / imageHeight) * gameBoardHeight);
	$('.southern-europe').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#southern-europe-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((702 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((284 / imageHeight) * gameBoardHeight);
	$('.northern-europe').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#northern-europe-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((705 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((155 / imageHeight) * gameBoardHeight);
	$('.scandinavia').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#scandinavia-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((607 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((384 / imageHeight) * gameBoardHeight);
	$('.western-europe').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#western-europe-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((576 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((272 / imageHeight) * gameBoardHeight);
	$('.great-britain').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#great-britain-troops').css({
		"left": Math.round(xCoord-(mapArea/2) + 15)+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((596 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((162 / imageHeight) * gameBoardHeight);
	$('.iceland').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#iceland-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((228 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((406 / imageHeight) * gameBoardHeight);
	$('.central-america').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#central-america-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2) - 15)+"px"
	})
	
	xCoord = Math.round((323 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((322 / imageHeight) * gameBoardHeight);
	$('.eastern-united-states').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#eastern-united-states-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((390 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((212 / imageHeight) * gameBoardHeight);
	$('.quebec').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#quebec-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((481 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((69 / imageHeight) * gameBoardHeight);
	$('.greenland').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#greenland-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((216 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((290 / imageHeight) * gameBoardHeight);
	$('.western-united-states').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#western-united-states-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((306 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((205 / imageHeight) * gameBoardHeight);
	$('.ontario').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#ontario-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((206 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((185 / imageHeight) * gameBoardHeight);
	$('.alberta').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#alberta-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((231 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((110 / imageHeight) * gameBoardHeight);
	$('.northwest-territory').attr('coords', xCoord + "," + yCoord + "," + mapArea);
	$('#northwest-territory-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
	
	xCoord = Math.round((82 / imageWidth) * gameBoardWidth);
	yCoord = Math.round((114 / imageHeight) * gameBoardHeight);
	$('.alaska').attr('coords', xCoord + "," + yCoord + "," + mapArea);	
	$('#alaska-troops').css({
		"left": Math.round(xCoord-(mapArea/2))+"px",
		"top" : Math.round(yCoord-(mapArea/2))+"px"
	})
}

function assignCountries(numberOfPlayers){
	localCountryArray = countryArray.slice();
	countriesPerPlayer = Math.floor((42 / numberOfPlayers));
	leftOverCountries = 42 % numberOfPlayers;
	remainingCountries = 42;
	for (i = 0; i < numberOfPlayers; i++){
		for (j = 0; j < countriesPerPlayer; j++){
			randomNum = Math.floor(Math.random() * remainingCountries);
			remainingCountries--;
			playerArray[i].push([[localCountryArray[randomNum]][0],0]);
			localCountryArray.splice(randomNum,1);
		}
	}
	for (i = 0; i < remainingCountries; i++){
		randomNum = Math.floor(Math.random() * remainingCountries)
		playerArray[i].push([[localCountryArray[randomNum]][0],0]);
	}
	for (i=0; i < numberOfPlayers; i++){
		for (j=0; j < playerArray[i].length; j++){
			currentCountry = document.getElementById(playerArray[i][j][0] + "-troops");
			switch(i){
				case 0:
					currentCountry.style.color="black";
					break;
				case 1:
					currentCountry.style.color="white";
					break;
				case 2:
					currentCountry.style.color="blue";
					break;
				case 3:
					currentCountry.style.color="red";
					break;
				case 4:
					currentCountry.style.color="yellow";
					break;
				case 5:
					currentCountry.style.color="green";
					break;
			}
		}
	}
}

function assignTroops(numberOfPlayers){
	var troopsPerPlayer;
	switch(numberOfPlayers){
		case 3:
			troopsPerPlayer = 35;
			break;
		case 4:
			troopsPerPlayer = 30;
			break;
		case 5:
			troopsPerPlayer = 25;
			break;
		case 6:
			troopsPerPlayer = 20;
			break;
		default:
			console.log("t");
			break;
	}
	for (i=0; i < numberOfPlayers; i++){
		numControlledCountries = playerArray[i].length;
		troopsPerCountry = Math.floor(troopsPerPlayer / numControlledCountries);
		leftOverTroops = troopsPerPlayer % numControlledCountries;
		for (j=0; j < leftOverTroops; j++){
			playerArray[i][j][1] += 1;
		}
		for (j=0; j < numControlledCountries; j++){
			playerArray[i][j][1] += troopsPerCountry;
		}
	}
}

function displayTroops(numberOfPlayers){
	for (i=0; i < numberOfPlayers; i++){
		for (j=0; j < playerArray[i].length; j++){
			currentCountry = playerArray[i][j][0];
			document.getElementById(currentCountry + "-troops").innerHTML = playerArray[i][j][1];
		}
	}
}

function hideReinforcementsOptions(){
	$('#reinforcements-lower-UI').toggleClass("hidden");
}

function hideAttackOptions(){
	$('#attack-lower-UI').toggleClass("hidden");
}

function hideFortificationOptions(){
	$('#fortification-lower-UI').toggleClass("hidden");
}

function showReinforcementsOptions(){
	$('#reinforcements-lower-UI').toggleClass("hidden");
}

function showAttackOptions(){
	$('#attack-lower-UI').toggleClass("hidden");
}

function showFortificationOptions(){
	$('#fortification-lower-UI').toggleClass("hidden");
}

function setPlayerStats(numberOfPlayers){
	if (numberOfPlayers >= 3){
		$("#blue-player-elements").toggleClass("hidden");
	}
	if (numberOfPlayers >= 4){
		$("#red-player-elements").toggleClass("hidden");
	}
	if (numberOfPlayers >= 5){
		$("#yellow-player-elements").toggleClass("hidden");
	}
	if (numberOfPlayers == 6){
		$("#green-player-elements").toggleClass("hidden");
	}
}

function updatePlayerStats(numberOfPlayers){
	for (i=0; i < numberOfPlayers; i++){
		currentPlayerCountries = playerArray[i].length;
		currentPlayerTroops = 0;
		for (j=0; j < currentPlayerCountries; j++){
			currentPlayerTroops += playerArray[i][j][1];
		}
		switch(i){
			case 0:
				statsCountryID = document.getElementById("black-countries");
				statsTroopsID = document.getElementById("black-troops");
				break;
			case 1:
				statsCountryID = document.getElementById("white-countries");
				statsTroopsID = document.getElementById("white-troops");
				break;
			case 2:
				statsCountryID = document.getElementById("blue-countries");
				statsTroopsID = document.getElementById("blue-troops");
				break;
			case 3:
				statsCountryID = document.getElementById("red-countries");
				statsTroopsID = document.getElementById("red-troops");
				break;
			case 4:
				statsCountryID = document.getElementById("yellow-countries");
				statsTroopsID = document.getElementById("yellow-troops");
				break;
			case 5:
				statsCountryID = document.getElementById("green-countries");
				statsTroopsID = document.getElementById("green-troops");
				break;
		}
		statsCountryID.innerHTML = currentPlayerCountries;
		statsTroopsID.innerHTML = currentPlayerTroops;
	}
}

function calculateReinforcements(){
	return 10;
}

function getCurrentPlayerColor(){
	switch(playerTurn){
		case 0:
			return "black";
		case 1:
			return "white";
		case 2:
			return "blue";
		case 3:
			return "red";
		case 4:
			return "yellow";
		case 5:
			return "green";
	}
}
	
function displayRoll(attackingRoll, defendingRoll){
	var attackingRollDisplay = document.getElementById("attackers-roll");
	var defendingRollDisplay = document.getElementById("defenders-roll");
	attackingRollDisplay.innerHTML = attackingRoll;
	defendingRollDisplay.innerHTML = defendingRoll;
}



