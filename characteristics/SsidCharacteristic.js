var bleno = require('bleno');
var util = require('util');
var exec = require('child_process').exec;

var BlenoCharacteristic = bleno.Characteristic;

var SsidCharacteristic = function () {
  SsidCharacteristic.super_.call(this, {
    uuid: 'bb00',
    properties: ['write'],
    value: null
  });

  this._value = new Buffer(0);
  this._updateValueCallback = null;
};

util.inherits(SsidCharacteristic, BlenoCharacteristic);

SsidCharacteristic.prototype.onWriteRequest = function (data, offset, withoutResponse, callback) {
  this._value = data;

  console.log('SsidCharacteristic - onWriteRequest: value = ' + this._value.toString('utf8'));

  var filename = '/etc/wpa_supplicant/wpa_supplicant.conf';

  var command = "sed -i' ' '/ssid/s/ssid=.*/ssid=" + '"' + this._value.toString('utf8') + '"' + "/' " + filename;
  console.log(command);
  exec(command, function (error, stdout, stderr) {
    console.log(stdout.toString());
  });

  callback(this.RESULT_SUCCESS);
};


module.exports = SsidCharacteristic;