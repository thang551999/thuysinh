import React, {Component} from 'react';
import {Platform, View, Text, Button} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

export default class SensorsComponent extends Component {
  constructor() {
    super();
    this.manager = new BleManager();
  }

  componentWillMount() {
    const subscription = this.manager.onStateChange((state) => {
      console.log(state);
      if (state === 'PoweredOn') {
        this.scanAndConnect();
        subscription.remove();
      }
    }, true);
  }
  scanAndConnect() {
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        // Handle error (scanning will be stopped automatically)
        return;
      }
      console.log(device.name);
      // Check if it is a device you are looking for based on advertisement data
      // or other criteria.
      if (device.name === 'TI BLE Sensor Tag' || device.name === 'SensorTag') {
        // Stop scanning as it's not necessary if you are scanning for one device.
        this.manager.stopDeviceScan();

        // Proceed with connection.
      }
    });
  }
  render() {
    return (
      <View>
        <Button
          title="ok"
          onPress={() => {
            this.scanAndConnect;
          }}
        />
      </View>
    );
  }
}
