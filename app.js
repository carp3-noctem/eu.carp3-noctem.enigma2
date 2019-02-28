'use strict';
const Homey = require('homey');
var request = require('request');

// Build enigma2 Host from Config (make variables single for later use as well)
const enigma2_IP = Homey.ManagerSettings.get('enigma2_ip');
const enigma2_Port = Homey.ManagerSettings.get('enigma2_port');
var enigma2Host = enigma2_IP + ':' + enigma2_Port;

//Function to control Volume
// used variables:
// setX (X= Percentage of Volume 0-100)
// up = Volume Up
// down = Volume Down
function VolumeControl(Volume) {
	var options = {
		url: 'http://' + enigma2Host + '/web/vol?set=' + Volume,
		headers: { enigma2Host }
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200){
		}
		else {
			console.log('Volume Control Failed with Status Code: ' + response.statusCode + ' and Body: ' + response.body);
			}
	}
	request(options, callback);
}
//Function Mute Control 
// overhand
// VolumeControlMute('mute')
// or
// VolumeControlMute('unmute')
function VolumeControlMute (e2ismuted) {
	var options = {
		url: 'http://' + enigma2Host + '/web/vol',
		headers: { enigma2Host }
	  };
	  function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
		  if (e2ismuted === 'mute' && body.indexOf('False') !== -1) {
			  VolumeControl('mute')
		  }
		  if (e2ismuted === 'unmute' && body.indexOf('True') !== -1) {
			VolumeControl('down');
			VolumeControl('up')
		  }
		  else {
			console.log('Set Unmute Failed with Status Code: ' + response.statusCode + ' and Body: ' + response.body);
			}
		}
	  }
	  request(options, callback);
}
//Function Control Box
function sendCommandID(commandID) {
    var options = {
      url: 'http://' + enigma2Host + '/web/' + commandID,
      headers: { enigma2Host }
    };
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
	  }
	  else {
		this.log('Send Command ' + commandID + ' Failed with Status Code: ' + response.statusCode + ' and Body: ' + response.body);
		}
    }
    request(options, callback);
  }
// Start Power Control	
//Function to check Powerstate
// overhand
// checkPowerState('ON')
// or
// checkPowerState('OFF')
function checkPowerState(powerstate) {
    var options = {
      url: 'http://' + enigma2Host + '/web/powerstate',
      headers: { enigma2Host }
    };
    function callback(error, response, body) {
      if (!error && response.statusCode == 200) {
        if (powerstate === 'ON' && body.indexOf('true') !== -1) {
          sendCommandID('powerstate?newstate=0');
        }
        if (powerstate === 'OFF' && body.indexOf('false') !== -1) {
          sendCommandID('powerstate?newstate=0');
        }
      }
    }
    request(options, callback);
  }
//Function to send Message
// overhand msg_text, msg_type & msg_timeout as Data
function sendMessage(msg_txt, msg_type, msg_timeout) {
	var options={
		url: 'http://' + enigma2Host + '/web/message?' + 'text=' + msg_txt + '&type=' + msg_type + '&timeout=' + msg_timeout,
		headers: { enigma2Host }
	};
	function callback(error, response, body){
		if (!error && response.statusCode == 200){
		}
	}
	request(options, callback);
}

class enigma2 extends Homey.App {
	onInit() {
		this.log(Homey.__("appLogStart"));
	}
}

// then / Action Flowcards

//Power On Flow
let powerstateONAction = new Homey.FlowCardAction('powerstate_on');
powerstateONAction
  .register()
  .registerRunListener(( args, state ) => {
	checkPowerState('ON');
    return true;
});
//Power Off Flow
let powerstateOFFAction = new Homey.FlowCardAction('powerstate_off');
powerstateOFFAction
  .register()
  .registerRunListener(( args, state ) => {
	checkPowerState('OFF');
    return true;
});
//Restart enigma2 Software
let powerstateRestartE2Action = new Homey.FlowCardAction('powerstate_restart_e2');
powerstateRestartE2Action
  .register()
  .registerRunListener(( args, state ) => {
	sendCommandID('powerstate?newstate=3');
    return true;
});
//Restart Receiver
let powerstateRebootBoxAction = new Homey.FlowCardAction('powerstate_rebootBox');
powerstateRebootBoxAction
  .register()
  .registerRunListener(( args, state ) => {
	sendCommandID('powerstate?newstate=2');
    return true;
});
//Send Receiver to Deep Standby
let powerstateSendToDeepStandbyAction = new Homey.FlowCardAction('powerstate_deepStandy');
powerstateSendToDeepStandbyAction
  .register()
  .registerRunListener(( args, state ) => {
	sendCommandID('powerstate?newstate=2');
    return true;
});
//Set Mute
let setMuteAction = new Homey.FlowCardAction('vol_mute');
setMuteAction
  .register()
  .registerRunListener(( args, state ) => {
	VolumeControlMute('mute');
    return true;
});
//Set Unmute
let setUnmuteAction = new Homey.FlowCardAction('vol_unmute');
setUnmuteAction
  .register()
  .registerRunListener(( args, state ) => {
	VolumeControlMute('unmute');
    return true;
});
//Set Volume
let setVolumeAction = new Homey.FlowCardAction('vol_set');
setVolumeAction
  .register()
  .registerRunListener(( args, state ) => {
	  var Volume = 'set' + args.volume;
	VolumeControl(Volume);
    return true;
});
//Send Command ID
let sendCommandAction = new Homey.FlowCardAction('command_send');
sendCommandAction
  .register()
  .registerRunListener(( args, state ) => {
	  var commandID = 'remotecontrol?command=' + args.command;
	  sendCommandID(commandID);
    return true;
});

module.exports = enigma2;