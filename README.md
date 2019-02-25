# enigma2 Support for Homey

This Project allows Control of Enigma2 devices via Homey over TCP/IP

## Requirements

1) openWebif needs to be available on the enigma2 device
2) Setup of enigma2 App via Homey required.
   Start Homey App, open the More section, select Apps Menu, open enigma2 entry and Click on "Configure app"

## Currently Supported

- then (Action) Cards:
  - Powerstates:
    Power ON
    Power OFF
    Reboot Enigma2 Software
    Reboot Receiver
    Deep Standby (DANGER: after Triggering, no more Software Control possible)

  - Volume:
    Mute
    Unmute
    Set Volume to Level (0-100)

## Currently planned

- When (Trigger) Cards
  - currently i decide to get these integrated, as these needs Polling, this must me considered

- and (Condition) Cards
  - there are a few Ideas that will be considered (THX to Athom Community)

- then (Action) Cards:
  - Volume: Increase Volume by x Times, decrease Volume by x Times
  - Messages: Support of Messages
  - Commands: Send of Command ID's

## For Supported Devices check the following

Due to limited access to all enigma2 enabled devices, i was only able to test the functions at an Dreambox 800HDse and a few less on an VU+ duo2, if any Issues are observed, please file an Issue on GitHub.

1. Check Google Spreadsheet: [Google Spreadsheet](https://docs.google.com/spreadsheets/d/1DlcXXRLvs-AKHAxlF2KolwLmICR3OC4liS-9Cn0K48c/edit?usp=sharing)
   Green = Fully Supported  
   empty Green = Not Programmed in this Device
2. Pictures of the Boxes can be found here: [OpenWebif Box Pictures](https://github.com/E2OpenPlugins/e2openplugin-OpenWebif/tree/master/plugin/public/images/boxes)
3. Pictures of the Remotes can be found here: [OpenWebif Remote Pictures](https://github.com/E2OpenPlugins/e2openplugin-OpenWebif/tree/master/plugin/public/images/remotes)

## Changelog

## Version 0.1.0

- Initial Release