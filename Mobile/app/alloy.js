// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.networkIsOnline = true;
Alloy.Globals.Results =[];

// create event listener for network connectivity status change
Ti.Network.addEventListener('change', function(e) {
  	// set global variable to current network status
  	Alloy.Globals.networkIsOnline = e.online;
});

var smsModule = require('com.omorandi');
var smsDialog = smsModule.createSMSDialog();

var Social = require('dk.napp.social');