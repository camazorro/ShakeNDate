var bizRecord;

exports.getBizRecord = function(){
	return	bizRecord;
};

exports.setValues = function(restValues){
	bizRecord = restValues;
	
	$.lblBizName.setText(restValues.name);
	$.lblDistance.setText((restValues.distance * 0.000621371192).toFixed(2)+ "mi");
	$.imvRating.setImage(restValues.rating_img_url);
	$.lblReviews.setText('(' + restValues.review_count +') Reviews');

	var Categories = "";
	if(restValues.categories){
	    for (var i = 0; i < restValues.categories.length; i++) {
	        Categories += restValues.categories[i][0] + " ";
	    }
   	}
    $.lblCategories.setText(Categories);
    
	var BusinessAddress = "";
    if(restValues.location.address){
	    for (var i = 0, l = restValues.location.address.length; i < l; i++) {
	        BusinessAddress += restValues.location.address[i] + " ";
	    }
		BusinessAddress += restValues.location.city + " ";
		BusinessAddress += restValues.location.state_code + " ";
		BusinessAddress += restValues.location.postal_code + "";    
    }

	
	$.lblAddress.setText(BusinessAddress.trim());
	Titanium.Geolocation.forwardGeocoder(BusinessAddress, function(evt){
		var Map = require('ti.map');
		

		if(evt.error){
			if (Alloy.Globals.networkIsOnline){
				var url= 'https://maps.googleapis.com/maps/api/geocode/json?address='+ BusinessAddress.trim().replace(' ','+');
				var client = Ti.Network.createHTTPClient({
					onload: function(e){
						var locationResult = JSON.parse(this.responseText);	
						if(locationResult){
							if(locationResult.results){
								if(locationResult.results.length >0){
									if(locationResult.results[0].geometry){
										var lon = locationResult.results[0].geometry.location.lng;
										var lat = locationResult.results[0].geometry.location.lat;
										var bizAnnotation = Map.createAnnotation({
											latitude: lat,
											longitude: lon,
											tittle: restValues.name,
											pincolor: Map.ANNOTATION_RED
										});
										
										var bizLocationMap = Map.createView({
											mapType: Map.NORMAL_TYPE,
											region:{
												latitude: lat,
												longitude: lon,
												latitudeDelta: 0.01,
												longitudeDelta: 0.01
											},
											animate:false
										});
									
										$.mapPlaceHolder.add(bizLocationMap);	
										bizLocationMap.addAnnotation(bizAnnotation);	
									}
									else{
										alert('Unable to locate the coordinates for the address ' + BusinessAddress.trim());
									}

								}
								else{
									alert('Unable to locate the coordinates for the address ' + BusinessAddress.trim());
								}
							}
							else{
								alert('Unable to locate the coordinates for the address ' + BusinessAddress.trim());
							}
						}
						else{
							alert('Unable to locate the coordinates for the address ' + BusinessAddress.trim());
						}	
					},
					onerror: function(e){
						alert('Unable to locate the coordinates for the address ' + BusinessAddress.trim());
					}
				});
				client.open("GET",url);
				client.send();
			}
			else{
				alert('Please turn on internet connection');
			}
		}
		else
		{
			var lon = evt.longitude;
			var lat = evt.latitude;
			var bizAnnotation = Map.createAnnotation({
				latitude: lat,
				longitude: lon,
				tittle: restValues.name,
				pincolor: Map.ANNOTATION_RED
			});
			
			var bizLocationMap = Map.createView({
				mapType: Map.NORMAL_TYPE,
				region:{
					latitude: lat,
					longitude: lon,
					latitudeDelta: 0.01,
					longitudeDelta: 0.01
				},
				animate:false
			});
			
			$.mapPlaceHolder.add(bizLocationMap);	
			bizLocationMap.addAnnotation(bizAnnotation);
		}
	});
};

function doBarAction(e){
	switch (e.index){
		case 0: {
			Ti.Platform.openURL("http://maps.apple.com/?q=" + $.lblAddress.getText().replace('/',' ').replace(' ','+'));
			break;
		}
		case 1: {
			bizRecord.phone = bizRecord.phone.replace("(0)", "").replace("(", "").replace(")", "").replace("-", "").replace("/", "").split(' ').join('');
			if(bizRecord.phone){
				Ti.Platform.openURL("telprompt:" + bizRecord.phone );
			}
			else{
				alert("This place did not register a phone number.");
			}
				
			break;
		}
		case 2:{ //Facebook Call	
			if (Alloy.Globals.networkIsOnline){
				if(Social.isFacebookSupported()){ //min iOS6 required
					Social.facebook({
						text:"I found this place: " + bizRecord.name + " thanks to Shake N Date App. #ShakeNDate",
						image: bizRecord.image_url,
						url:"https://www.facebook.com/outboxsoft"
					});
				} else {
					alert('Please enable Facebook support in the settings of your phone');
				}				
			}
			else{
				alert('Please turn on internet connection');
			}		

			break;
		}
		case 3 :{//Twitter Call
			if (Alloy.Globals.networkIsOnline) {
				if(Social.isTwitterSupported()){ //min iOS5 required
					Social.twitter({
						text:"I found this place: " + bizRecord.name + " thanks to Shake N Date App. #ShakeNDate",
						image: bizRecord.image_url,
						url:"https://www.facebook.com/outboxsoft"
					});
				}
				else{
					alert('Please enable Twitter support in the settings of your phone');
				}
			} 
			else {
				alert('Please turn on internet connection');
			}			
			break;
		}
		case 4: {
			if(bizRecord.mobile_url){
				Ti.Platform.openURL(bizRecord.mobile_url);
			}
			else{
				alert("This place is not currently registered on Yelp.");
			}
			break;
		}		
	}
}