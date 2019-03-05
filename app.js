'use strict';
const Homey = require('homey');
var request = require('request');

// Build enigma2 Host from Config (make variables single for later use as well)
const enigma2_IP = Homey.ManagerSettings.get('enigma2_ip');
const enigma2_Port = Homey.ManagerSettings.get('enigma2_port');
var enigma2Host = enigma2_IP + ':' + enigma2_Port;

//Homey Requirement
class enigma2 extends Homey.App {
	onInit() {
		this.log(Homey.__("appLogStart"));
	}
}


// Start Volume
// Function Volume Control
function VolumeControl(Volume) {
	var options = {
		url: 'http://' + enigma2Host + '/web/vol?set=' + Volume,
		headers: { enigma2Host }
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200){
		}
		else {
			console.log('Following Error occured when Fuction VolumeControl was called: \n Call used: http://'+enigma2Host+'/web/vol?set='+Volume+'\nError:' +!error+ '\nResponse Status Code: '+response.statusCode+ '\nBody: \n'+body+'\n');
			}
	}
	request(options, callback);
}
// Function Mute Control 
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
				console.log('Following Error occured when Fuction VolumeControlMute was called: \nError:' +!error+ '\nResponse Status Code: '+response.statusCode+ '\nBody: \n'+body+'\n');
			}
		}
	  }
	  request(options, callback);
}


// then / action Flowcards Volume
//Set Mute Flowcard
let setMuteAction = new Homey.FlowCardAction('vol_mute');
setMuteAction
  .register()
  .registerRunListener(() => {
	VolumeControlMute('mute');
    return true;
});
//Set Unmute Flowcard
let setUnmuteAction = new Homey.FlowCardAction('vol_unmute');
setUnmuteAction
  .register()
  .registerRunListener(() => {
	VolumeControlMute('unmute');
    return true;
});
//Set Volume Flowcard
let setVolumeAction = new Homey.FlowCardAction('vol_set');
setVolumeAction
  .register()
  .registerRunListener(( args) => {
	  var Volume = 'set' + args.volume;
	VolumeControl(Volume);
    return true;
});
// End Volume


// Start Power Control
// Function Power On / Off decision
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
		else {
			console.log('Following Error occured when Fuction checkPowerState was called: \n Call used: http://'+enigma2Host+'/web/'+sendCommandID+'\nError:' +!error+ '\nResponse Status Code: '+response.statusCode+ '\nBody: \n'+body+'\n');
		}
	}
	request(options, callback);
}


// then / action Flowcards Power
//Power On Flowcard
let powerstateONAction = new Homey.FlowCardAction('powerstate_on');
powerstateONAction
	.register()
	.registerRunListener(() => {
		checkPowerState('ON');
		return true;
	});
//Power Off Flowcard
let powerstateOFFAction = new Homey.FlowCardAction('powerstate_off');
powerstateOFFAction
	.register()
	.registerRunListener(() => {
		checkPowerState('OFF');
		return true;
	});
//Restart enigma2 Software Flowcard
let powerstateRestartE2Action = new Homey.FlowCardAction('powerstate_restart_e2');
powerstateRestartE2Action
	.register()
	.registerRunListener(() => {
		sendCommandID('powerstate?newstate=3');
		return true;
	});
//Restart Receiver Flowcard
let powerstateRebootBoxAction = new Homey.FlowCardAction('powerstate_rebootBox');
powerstateRebootBoxAction
	.register()
	.registerRunListener(() => {
		sendCommandID('powerstate?newstate=2');
		return true;
	});
//Send Receiver to Deep Standby Flowcard
let powerstateSendToDeepStandbyAction = new Homey.FlowCardAction('powerstate_deepStandy');
powerstateSendToDeepStandbyAction
	.register()
	.registerRunListener(() => {
		sendCommandID('powerstate?newstate=1');
		return true;
	});
// End Power Control


// Command ID Send Start
// Function Command ID
function sendCommandID(commandID) {
	var options = {
		url: 'http://' + enigma2Host + '/web/' + commandID,
		headers: { enigma2Host }
	};
	function callback(error, response, body) {
		if (!error && response.statusCode == 200) {
			}
	else {
		console.log('Following Error occured when Fuction sendCommandID was called: \n Call used: http://'+enigma2Host+'/web/'+commandID+'\nError:' +!error+ '\nResponse Status Code: '+response.statusCode+ '\nBody: \n'+body+'\n');
		}
	}
	request(options, callback);
}
// then / action Flowcards Command ID
//Send Command ID Flowcard
let sendCommandAction = new Homey.FlowCardAction('command_send');
sendCommandAction
  .register()
  .registerRunListener((args) => {
	  var commandID = 'remotecontrol?command=' + args.command;
	  sendCommandID(commandID);
    return true;
});
// Command ID Send End

// Send Message Start
// Function send Message
function sendMessage(msg_txt, msg_type, msg_timeout) {
	var msg_code = "http://"+ enigma2Host + "/web/message?text=" + msg_txt + "&type=" + msg_type + "&timeout=" + msg_timeout;
	var options={
		url: 'http://' + enigma2Host + '/wb/message?text=' + msg_txt + '&type=' + msg_type + '&timeout=' + msg_timeout,
		headers: { enigma2Host }
	};
	function callback(error, response, body){
		if (!error && response.statusCode == 200){
		}
		else {
			console.log('Following Error occured when Fuction senMessage was called: \n Call used: http://'+ enigma2Host + '/web/message?text=' + msg_txt + '&type=' + msg_type + '&timeout=' + msg_timeout+'\nError:' +!error+ '\nResponse Status Code: '+response.statusCode+ '\nBody: \n'+body+'\n');
		}
	}
	request(options, callback);
}
// then / action Flowcards send Message
let sendMessageAction = new Homey.FlowCardAction('message_send');
sendMessageAction
  .register()
  .registerRunListener((args) => {
		var message_complete = args.msg_text_full;
		var message_split = message_complete.split("|");
		var msg_type = message_split[0];
		var timeout = message_split[1];
		var msg_txt = message_split[2];
	  if (timeout == 0) {
			var msg_timeout = "";
		} else {
			var msg_timeout = timeout;
		}
	  sendMessage(msg_txt,msg_type, msg_timeout);
    return true;
});

// Send Message End

module.exports = enigma2;