/***
 * App: Shake N Date
 * Author: Gerardo Renovales
 * Date: 09/02/2014 
 * Todo: functions to module
 * Todo: Use Backbone Models
 * Todo: Create Unit tests. I know I supose to do this first :(
 * Todo: Work on Apple Watch version and Apple TV
 */

var searchingResults = 0;

//todo: move this to a module
function doSearchRest() {
	if(searchingResults === 0){
		if (Alloy.Globals.networkIsOnline){
			searchingResults = 1;
			$.SharePlace.setEnabled(false);
			$.refreshButton.setEnabled(false);
			$.shakeImage.setVisible(true);
			if($.svResults.views.length >0){
				$.svResults.views =[];
			}
			
		    Alloy.Globals.Results.length=0; //empty our array
		    $.activityIndicatorView.setVisible(true);
		    $.activityIndicator.show();
		    
			getRestaurants();
		}
		else{
			alert('Please turn on internet connection');
		}
	
	}

}

//todo: move this to a module
//Show share option dialog
function doShare(){
	$.shareDialog.show();
}

//todo: move this to a module
///This is for managing share restaurant
function doShareCommand(e){
	switch (e.index){
		case 0:{
			if (!smsDialog.isSupported())
		    {
		        var a = Ti.UI.createAlertDialog({title: 'warning', message: 'The required feature is not available on your device'});
		        a.show();
		    }
		    else{
		    	smsDialog.messageBody = "Hi, I found this place: " + Alloy.Globals.Results[$.svResults.getCurrentPage()].name + " using the Shake N Date App. Wanna go?";
		    	smsDialog.open({animated: true});
		    }
		    break;
		}
		case 1:{
			var emailDialog = Ti.UI.createEmailDialog();
			emailDialog.html = true;
			emailDialog.subject = "Hey let's go to this place!";
			emailDialog.messageBody = "Hi.<br /> I found this place: " + Alloy.Globals.Results[$.svResults.getCurrentPage()].name + " using the Shake N Date App. Wanna go?";
			emailDialog.open();
			emailDialog = null;
			break;
		}
	}
}

//todo: move this to a module
function getRestaurants(){
	
	if(Ti.Geolocation.getLocationServicesAuthorization() === Ti.Geolocation.AUTHORIZATION_DENIED){
		alert('In order for this application to work, you must authorize the use of localization service');
		$.refreshButton.setEnabled(true);
		$.activityIndicator.hide();
		searchingResults = 0;
		$.shakeImage.setVisible(true);
		return;
	}
	var SearchID = getSearchID();
	var Position = Titanium.App.Properties.getObject("Position");

	//Titanium.Geolocation.purpose="We need your location to find places near you.";
	Titanium.Geolocation.getCurrentPosition(function(e){
		
		if(e.error){
			alert('We need your location to find places near you.');
			$.refreshButton.setEnabled(true);
			
			$.activityIndicatorView.setVisible(false);
			$.activityIndicator.hide();
			searchingResults = 0;
			$.shakeImage.setVisible(true);
			return;
		}
		else{

			if(Position !== null){
				
				if(getDistance(Position,e.coords) > 0){//if our position is less than 5 miles get results from out db
					SearchID = null; //null our SearchID, we need to fetch from Yelp
				}
			}
			
			Titanium.App.Properties.setObject("Position",e.coords); //Store new coordinates
			
			
			
			var url= Alloy.CFG.urls.api + '/SAD/GetRecomendations' +
		        '?Categories=restaurants' +
		        '&lat=' + e.coords.latitude +
		        '&lon=' + e.coords.longitude + ((SearchID ===  undefined || SearchID === null) ? '':'&SearchID=' + SearchID);	
			
			
			
			var client = Ti.Network.createHTTPClient({
				onload: function(e){
					Ti.API.info(this.responseText);
					var bizResults = JSON.parse(this.responseText);
					
					if(bizResults){
						if(bizResults.data){
							var bizResultCount = bizResults.data.length;
							
							if(bizResultCount > 0){
								$.SharePlace.setEnabled(true);
								$.shakeImage.setVisible(false);
							}
							else{
								$.SharePlace.setEnabled(false);
							}
							
							for (var i = 0; i < bizResultCount; i++){
								var resultDetail = Alloy.createController('resultdetail');
								setSearchID(bizResults.data[i].searchID);
								var result = JSON.parse(bizResults.data[i].yelpJSON);
								
								Alloy.Globals.Results.push(result);
								resultDetail.setValues(result);
								result = null;
							    $.svResults.addView(resultDetail.getView());
							}	
						}
					}
					$.refreshButton.setEnabled(true);
					$.activityIndicatorView.setVisible(false);
					$.activityIndicator.hide();
					
					searchingResults = 0;
				},
				onerror: function(e){
					$.refreshButton.setEnabled(true);
					$.activityIndicatorView.setVisible(false);
					$.activityIndicator.hide();
					
					searchingResults = 0;
					$.shakeImage.setVisible(true);
					alert("Ooops! Something went wrong. Please try again later.");
				}
			});
			client.open("GET",url);
			client.send();
		}
		
	});
};

//todo: move this to a module
function setSearchID(SearchID){
	Titanium.App.Properties.setString("SearchID",SearchID);
};

//todo: move this to a module
function getSearchID(){
	return Titanium.App.Properties.getString("SearchID");
};

//todo: move this to a module
function rad(x) {
  return x * Math.PI / 180;
};

//todo: move this to a module
//todo: Create Unit test for this 
function getDistance (p1, p2) {
	var R = 6378137; // Earth’s mean radius in meter
	var dLat = rad(p2.latitude - p1.latitude);
	var dLong = rad(p2.longitude - p1.longitude);
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = (R * c) + 0;
	return d * 0.00062137119; // returns the distance in miles
};

$.index.open();
Ti.Gesture.addEventListener('shake',doSearchRest);