#include <DHT.h>
#include <SoftwareSerial.h>

//dht DHT;
SoftwareSerial Raspi(8, 9); // RX/TX

#define DHTPIN 13
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

int clock = 0;
String command;
String speedString;
int fanPin = 2;

int chk;
String hum;
String temp;

// the setup function runs once when you press reset or power the board
void setup() {
  clock = 0;
  command = "";
  speedString = "";
  Serial.begin(9600);
  Raspi.begin(9600);
  delay(100);
  pinMode(fanPin, OUTPUT);
}

// the loop function runs over and over again forever
void loop() {
  hum = String(dht.readHumidity());
  temp = String(dht.readTemperature());

  while(Raspi.available()) {
    char c = Raspi.read();
    if (isDigit(c)) {
      speedString += c;
    } 
    else {
      command += c;
    }
    digitalWrite(LED_BUILTIN, HIGH);
    Serial.println(command);
    Serial.println(speedString);
  }

  if (command == "fanon") {
    digitalWrite(fanPin, 255);
    digitalWrite(LED_BUILTIN, LOW);
  }

  if (command == "fanoff") {
    digitalWrite(fanPin, 0);
    digitalWrite(LED_BUILTIN, LOW);
  }
  command = "";
  speedString = "";

  if (clock == 50) {
    Serial.print("Temp:");
    Serial.print(temp);
    Serial.print(" Humidity:");
    Serial.print(hum);
    Serial.print("\n");
    delay(100);
    clock = 0;
  }

  clock++;
  delay(100);
}
