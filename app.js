'use strict';
const Homey = require('homey');
var request = require('request');

// Build enigma2 Host from Config (make variables single for later use as well)
const enigma2_ip = Homey.ManagerSettings.get('enigma2_ip');
const enigma2_port = Homey.ManagerSettings.get('enigma2_port');
var enigma2_host = enigma2_ip + ':' + enigma2_port;

// Homey Requirement
class enigma2 extends Homey.App {
	onInit() {
		this.log(Homey.__("appLogStart"));
	}
}

// Call Function action Flowcards
async function call_enigma2 (call_spec){
	var call_adress = ('http://'+enigma2_host+'/web/'+call_spec);
	var options ={
		url: call_adress,
		headers: enigma2_host
	};
	console.log('Following Call was send: '+call_adress+' to '+enigma2_host);
	function callback(error, response, body){
		if (!error && response.statusCode == 200){
			console.log('Previous Call was made successfully.');
			console.log(':::::::::::::::::'+response.statusCode);
		}
		else {
			console.log('Previous Call Failed! Maybe wrong Configuration?');
		};
	};
	request(options, callback);	
};
// Control Flowcards
// then / action Flowcards
let sendCommandAction = new Homey.FlowCardAction('command_send');
sendCommandAction
  .register()
  .registerRunListener((args) => {
	  var call_spec = ('remotecontrol?command=' + args.command);
	  call_enigma2(call_spec);
    return true;
});

// Message Flowcards
// then / action Flowcards
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
		var call_spec = ('message?text='+msg_txt+'&type='+msg_type+'&timeout='+msg_timeout)
	  call_enigma2(call_spec);
    return true;
});

// then / action Flowcards
// Deepstandby
let powerstateONAction = new Homey.FlowCardAction('powerstate_deepstandby');
powerstateONAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('powerstate?newstate=1');
		call_enigma2(call_spec);
		return true;
});
// Reboot
let powerstateRebootAction = new Homey.FlowCardAction('powerstate_reboot');
powerstateRebootAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('powerstate?newstate=2');
		call_enigma2(call_spec);
		return true;
});
// Restart Enigma2
let powerstateReboot_e2Action = new Homey.FlowCardAction('powerstate_restart_enigma2');
powerstateReboot_e2Action
	.register()
	.registerRunListener((args) => {
		var call_spec = ('powerstate?newstate=3');
		call_enigma2(call_spec);
		return true;
});
// Wakeup from Standby
let powerstateWakeupAction = new Homey.FlowCardAction('powerstate_on');
powerstateWakeupAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('powerstate?newstate=4');
		call_enigma2(call_spec);
		return true;
});
// standby
let powerstateStandbyAction = new Homey.FlowCardAction('powerstate_off');
powerstateStandbyAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('powerstate?newstate=5');
		call_enigma2(call_spec);
		return true;
});

// Volume Flowcards
// then / action Flowcards
// set Volume to X
let volSetAction = new Homey.FlowCardAction('vol_set');
volSetAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('vol?set=set'+args.volume);
		call_enigma2(call_spec);
		return true;
});
// Volume mute
let volMuteAction = new Homey.FlowCardAction('vol_mute');
volMuteAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('vol?set=mute');
		call_enigma2(call_spec);
		return true;
	});
// Volume unmute
let volUnmuteAction = new Homey.FlowCardAction('vol_unmute');
volUnmuteAction
	.register()
	.registerRunListener((args) => {
		var call_spec = ('vol?set=down');
		call_enigma2(call_spec);
		var call_spec = ('vol?set=up');
		call_enigma2(call_spec);
		return true;
});

module.exports = enigma2;