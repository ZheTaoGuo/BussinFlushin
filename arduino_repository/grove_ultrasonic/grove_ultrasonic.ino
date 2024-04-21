// With reference to: https://wiki.seeedstudio.com/Grove-Ultrasonic_Ranger/


#include "Ultrasonic.h"

Ultrasonic ultrasonic(11);
void setup()
{
  Serial.begin(9600);
}

void loop()
{
  // long RangeInCentimeters;
  // RangeInCentimeters = ultrasonic.MeasureInCentimeters(); // two measurements should keep an interval
  // Serial.print(RangeInCentimeters);//0~400cm
  // Serial.println(" cm\t");

  // long RangeInInches;
  // RangeInInches = ultrasonic.MeasureInInches();
  // Serial.print(RangeInInches);//0~157 inches
  // Serial.print(" inch\t");

  long RangeInCentimeters;
  RangeInCentimeters = ultrasonic.MeasureInCentimeters();
  Serial.print("toilet-");
  Serial.println(RangeInCentimeters);//0~400cm

  delay(250);
}