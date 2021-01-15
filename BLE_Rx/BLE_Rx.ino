/*https://www.youtube.com/watch?v=NZi7ykalZhc&feature=youtu.be   */
/*https://dl.espressif.com/dl/package_esp32_index.json*/

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
int txValue = 0;

#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID_RX "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_UUID_TX "ee13d745-a35f-4f5b-ab23-a7aa8472b16b"

class MyServerCallbacks: public BLEServerCallbacks{
  void onConnect(BLEServer* pServer){
    deviceConnected = true;
  };
  
  void onDisconnect(BLEServer* pServer){
    deviceConnected = false;
  }   
  
};

class MyCallbacks: public BLECharacteristicCallbacks{
  void onWrite(BLECharacteristic* pCharacteristic){
    std::string rxValue = pCharacteristic->getValue();
    
    if(rxValue.length() > 0){
      Serial.println("-------Start Recive----------");
      Serial.println("Recive value: ");
    
    for(int i=0; i < rxValue.length(); i++){
      Serial.print(rxValue[i]);
    }
    Serial.println();
    
    if(rxValue.find("08:30") != -1){
      Serial.println("LED ON ");
    }
    else if(rxValue.find("09:30") != -1){
      Serial.println("LED OFF");
    }
    Serial.println();
    Serial.println("-------End Recive----------");
    
    }
    
  }
  
};
 
void setup() {
  Serial.begin(9600);

  BLEDevice::init("Test_TX_RX_ESP32");
  
  BLEServer *pServer = BLEDevice::createServer();
  pServer->setCallbacks(new MyServerCallbacks());
  
  BLEService *pService = pServer->createService(SERVICE_UUID);
  
  pCharacteristic = pService->createCharacteristic(
              CHARACTERISTIC_UUID_TX,
              BLECharacteristic::PROPERTY_NOTIFY
 
                         );
  
  pCharacteristic->addDescriptor(new BLE2902());
  
  pCharacteristic = pService->createCharacteristic(
              CHARACTERISTIC_UUID_RX,
              BLECharacteristic::PROPERTY_WRITE
 
                         );
  
  pCharacteristic->setCallbacks(new MyCallbacks());  
  pService->start();
  
  pServer->getAdvertising()->start();
  
  Serial.println("Waiting for a client...");
}
 
void loop() {
  if(deviceConnected){
    txValue = random(-10,20);   
  }
  
  char txString[8];
  dtostrf(txValue,1,2,txString);
  
  pCharacteristic->setValue(txString);
  
  pCharacteristic->notify();
  
  Serial.println("Sent value: " + String(txString));
  delay(1500);
    

}
