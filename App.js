import React, {Component} from 'react';
import {PermissionsAndroid, View, Text, Button} from 'react-native';
import {BleManager} from 'react-native-ble-plx';

const SensorsComponent = () => {
  const manager = new BleManager();

  const scanAndConnect = async () => {
    const permission = await requestLocationPermission();
    if (permission) {
      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('error', error);
          // Handle error (scanning will be stopped automatically)
          return;
        }
        console.log(device.name);
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (
          device.name === 'TI BLE Sensor Tag' ||
          device.name === 'SensorTag'
        ) {
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager.stopDeviceScan();

          // Proceed with connection.
        }
      });
    }
  };
  return (
    <View>
      <Button
        title="ok"
        onPress={() => {
          scanAndConnect();
        }}
      />
    </View>
  );
};

export default SensorsComponent;

export async function requestLocationPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location permission for bluetooth scanning',
        message: 'wahtever',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('Location permission for bluetooth scanning granted');
      return true;
    } else {
      console.log('Location permission for bluetooth scanning revoked');
      return false;
    }
  } catch (err) {
    console.warn(err);
    return false;
  }
}
