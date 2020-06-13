# IoT-Weather-Station

Internet of Things Project

The IoT Weather Station collects temperature and humidity data from 3 different locations, stores them on a central database, and visualises them on a web interface. The system aims to give users insight into temperature and humidity trends. It also allows users to control the temperature at which the system’s fans turn on.

## Implementation Guide

### To set up the Raspberry Pi
You can use a physical Raspberry Pi or install a virtual machine on your device, either way, you need to have Raspbian set up in your Raspberry Pi. Link to install Raspbian (Raspberry Pi OS): https://www.raspberrypi.org/downloads/raspberry-pi-os/
### To set up the Arduino.
You will need an Arduino Uno board, one breadboard, at least 10 male to male jumper wires, one DHT Temperature and Humidity sensor, can be either a model of DHT11 or DHT22, one DC motor, one fan blade, one 270 Ω Resistor and a type A/B USB cable for connection to the Raspberry Pi.
### Wire up the Arduino and Raspberry Pi
Connect the motor to +5V power line, ground, and to the digital pin 2, connect the DHT11 sensor first pin on the left to 3-5V power, output signal to the digital pin 13, middle pin to the ground, or a DHT22 sensor first pin on the left to 3-5V power, the second pin to a digital pin 13, the rightmost pin to ground.
### Include DHT library
To include the library, select Sketch from the Arduino IDE menu bar, select Include library > Add .ZIP Library, and select the DHT.zip folder.

## User Manual 
Please pre-install the following on your machines: `Node.js`, `git`, `pm2`

To test our system, users need to download or clone this repository via a git command on the terminal. </br>
`$ git clone https://github.com/w0nght/IoT-Weather-Station.git`

Navigate to the backend server directory  </br>
`$ cd IoT-Weather-Station > cd BackendServer`

Install the node modules for server files  </br>
`$ npm install`

Run the server  </br>
`$ node server.js`

Run the client on Raspberry Pi device(s) (on Raspbian terminal)  </br>
`$ pm2 start client-pi.js --watch`

Use PM2 to monitor the client log (on Raspbian terminal) (optional)  </br>
`$ pm2 log`

Navigate to the frontend directory  </br>
`$ cd .. `  </br>
`$ cd Frontend`

Install the node modules for front end files  </br>
`$ npm install`

Bring up the website on localhost  </br>
`$ npm start`

On the browser go to your local host  </br>
`http://localhost:3000`

To end the Raspberry pi client (on Raspbian terminal)  </br>
`$ pm2 stop client-pi.js`

Once you are running the Temperature & Humidity Tracker website, you will be able to see the latest temperature and humidity of your Arduino’s physical location, depending on how many Arduino devices you set up.

Above the temperature information, you can configure the fan on temperature by sliding the slide bar higher or lower.
Underneath the temperature information, you can see our statistical data in 17 different graphs.
