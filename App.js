import React, {useState} from 'react';
import {PermissionsAndroid, View, Text, Button} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import base64 from 'react-native-base64';

const SensorsComponent = () => {
  const manager = new BleManager();
  const [deviceBle, setDeviceBle] = useState('');

  const sendMessage = (message) => {
    manager
      .writeCharacteristicWithResponseForDevice(
        deviceBle,
        '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
        'beb5483e-36e1-4688-b7f5-ea07361b26a8',
        base64.encode(message),
      )

      .then((characteristic) => {
        console.log(characteristic);

        return;
      })
      .catch((error) => {
        // this.createTAlert('writing', error.message);
        console.log('error', error);
      });
  };

  const scanAndConnect = async () => {
    const permission = await requestLocationPermission();
    if (permission) {
      manager.startDeviceScan(null, null, (error, deviceConnect) => {
        if (error) {
          console.log('error', error);
          // Handle error (scanning will be stopped automatically)
          return;
        }
        console.log(deviceConnect.name);
        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (deviceConnect.name === 'Test_TX_RX_ESP32') {
          setDeviceBle(deviceConnect.id);
          // Stop scanning as it's not necessary if you are scanning for one device.
          manager.stopDeviceScan();
          manager
            .connectToDevice(deviceConnect.id)
            .then((connectedDevice) => {
              connectedDevice
                .readCharacteristicForService(
                  '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
                  'beb5483e-36e1-4688-b7f5-ea07361b26a8',
                )
                .then((characteristic) => {
                  console.log(base64.decode(characteristic.value));
                  console.log(characteristic);

                  return;
                })
                .catch((error) => {
                  // Handle errors
                  console.error('error', error);
                });
              return connectedDevice.discoverAllServicesAndCharacteristics();
            })
            .then((connectedDevice2) => {
              console.log('222', connectedDevice2);
              return connectedDevice2.services();
            })
            .then(async (services) => {
              manager
                .readCharacteristicForDevice(
                  deviceConnect.id,
                  '4fafc201-1fb5-459e-8fcc-c5c9c331914b',
                  'beb5483e-36e1-4688-b7f5-ea07361b26a8',
                  null,
                )
                .then((characteristic) => {
                  console.log(base64.decode(characteristic.value));
                  console.log(characteristic);

                  return;
                })
                .catch((error) => {
                  // Handle errors
                  console.log('error', error);
                });
            });
        }
      });
    }
  };
  return (
    <View>
      <Button
        title="Connect"
        onPress={() => {
          scanAndConnect();
        }}
      />
      <Button
        title="Send"
        onPress={() => {
          sendMessage('tesssst');
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
