#include <Servo.h>
#include <Massenger.h>

Servo myservo;
int angle = 0;

Massenger massenger = Massenger( &Serial , massageReceived);

void setup()
{
        myservo.attach(9);
        Serial.begin(57600);
}

void loop() {        
        massenger.update();
        myservo.writeMicroseconds(angle);
}

void massageReceived() {
        // Le code a executer lorsq'un massage est recu.
        // Le massage peut etre decode avec les fonctions:
        // .checkAddr() et .getInt().
        if( massenger.checkAddr("angle")){
          angle = (massenger.getInt());
        }
}
