// Got this code from: https://wiki.seeedstudio.com/Grove-80cm_Infrared_Proximity_Sensor/
// Datasheet: https://www.farnell.com/datasheets/1657845.pdf
// Use the above graph to calculate the distance.
// See also: https://www.seeedstudio.com/blog/2019/12/17/ir-proximity-sensor-for-easy-arduino-distance-measuring/


// A rough threshold is anything > 1.0 I would say there is someone there within range. Or maybe even 0.9
// If it's < 0.3 I would say there is no one in the room. Maybe 0.35 just to be safe. Nothing in range.

#define IR_PROXIMITY_SENSOR A7 // Analog input pin that  is attached to the sensor
// https://content.arduino.cc/assets/MachineLearningCarrierV1.0.pdf?_gl=1*ouqor7*_ga*NjU3MTIwNTY1LjE3MDU1OTQ4ODk.*_ga_NEXN8H46L5*MTcwNjc2NjcxOS4xMC4xLjE3MDY3Njg0MDcuMC4wLjA.*_fplc*T3QxSEt6TlBVN2hjQVVjUGNmWURuV3hVMUl2QllPbmFPOUI1JTJCSU0lMkJsdWFOdDk0c2t6MFpOVXclMkZVVkxONTdpeGFXUzlwMWhOc1A2VmhTaWlTTFNTJTJCT1VhaUdUenJFeFVweW9RNWprUWZJMzNNWHBVak9IWUw2bWVDNlYlMkJCZyUzRCUzRA..
// Be very careful of the pins that it is attached to! A6 and A7 is a lot of difference, the yellow wire is attached to A7 and A6 is not there so it wouldn't actually have anything to read in terms of voltage.
// We used 3.3 from the tiny machine learning shield breakout board.
#define ADC_REF 3.3//reference voltage of ADC is 5v.If the Vcc switch on the Seeeduino
                  //board switches to 3V3, the ADC_REF should be 3.3
float voltage;//the sensor voltage, you can calculate or find the distance
                // to the reflective object according to the figures
                //on page 4 or page 5 of the datasheet of the GP2Y0A21YK.

void setup()
{
  // initialise serial communications at 9600 bps:
  Serial.begin(9600);
}

void loop()
{
  voltage = getVoltage();
  Serial.print("sink-");                       
  Serial.println(voltage);
  // wait 500 milliseconds before the next loop
  delay(500);
}
/****************************************************************************/
/*Function: Get voltage from the sensor pin that is connected with analog pin*/
/*Parameter:-void                                                       */
/*Return:   -float,the voltage of the analog pin                        */
float getVoltage()
{
  int sensor_value;
  int sum;  
  // read the analog in value:
  for (int i = 0;i < 20;i ++)//Continuous sampling 20 times
  {
    sensor_value = analogRead(IR_PROXIMITY_SENSOR);
    sum += sensor_value;
  }
  sensor_value = sum / 20;
  float voltage;
  voltage = (float)sensor_value*ADC_REF/1024;
  return voltage;
}