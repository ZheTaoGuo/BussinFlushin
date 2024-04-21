#include <ArduinoBLE.h>
#include <ArduinoMqttClient.h>
#include <WiFi.h>
#include "arduino_secrets.h" // created from arduino_secrets_example.h

char ssid[] = SECRET_SSID;
char pass[] = SECRET_PASS;
char broker[] = BROKER_IP;

WiFiClient wifiClient;
MqttClient mqttClient(wifiClient);

int        port     = 1883;
const char topic[]  = "beacon";

//set interval for sending messages (milliseconds)
const long interval = 8000;
unsigned long previousMillis = 0;

int count = 0;

void setup_serial() {
  Serial.begin(9600);
  while (!Serial);
}

void setup_wifi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, pass);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  Serial.println("You're connected to the network");
  Serial.println();
}

void setup_ble() {
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");
  }
  Serial.println("Bluetooth® Low Energy Central scan");
  BLE.scan();
}

void setup_mqtt(String mqtt_user, String mqtt_pass) {
  Serial.print("Attempting to connect to the MQTT broker: ");
  Serial.println(broker);
  mqttClient.setUsernamePassword(mqtt_user, mqtt_pass);
  if (!mqttClient.connect(broker, port)) {
    Serial.print("MQTT connection failed! Error code = ");
    Serial.println(mqttClient.connectError());
  }
  Serial.println("You're connected to the MQTT broker!");
  Serial.println();
}

void setup() {
  setup_serial();
  Serial.println("setup started: ...");
  setup_wifi();
  setup_ble();
  setup_mqtt("admin", "public");
  Serial.println("setup ended: ...");
}

void loop() {
  mqttClient.poll(); // prevent disconnects
  unsigned long currentMillis = millis(); // current time

  // check if a peripheral has been discovered
  // Serial.println("scanning for devices ...");
  BLE.scanForAddress("ac:23:3f:63:21:24");
  BLEDevice peripheral = BLE.available();
  if (peripheral) {
    Serial.print("Address: ");
    Serial.println(peripheral.address());

    // print the advertised service UUIDs, if present
    if (peripheral.hasAdvertisedServiceUuid()) {
      Serial.print("Service UUIDs: ");
      for (int i = 0; i < peripheral.advertisedServiceUuidCount(); i++) {
        Serial.print(peripheral.advertisedServiceUuid(i));
        Serial.print(" ");
      }
      Serial.println();
    }

    // print the RSSI
    Serial.print("RSSI: ");
    Serial.println(peripheral.rssi());

    Serial.println();

    // send the message with mqtt
    if (currentMillis - previousMillis >= interval) {
      // save the last time a message was sent
      previousMillis = currentMillis;

      // send message, the Print interface can be used to set the message contents
      mqttClient.beginMessage(topic);
      mqttClient.print("hello");
      mqttClient.endMessage();

      Serial.println();
      }
  } else {
    // Serial.println("No devices found");
  }
}
