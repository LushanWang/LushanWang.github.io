const BAUD_RATE = 9600; // This should match the baud rate in your Arduino sketch

let port, connectBtn; // Declare global variables


function setup() { // set up the canvas
  setupSerial(); // Run our serial setup function (below)

  createCanvas(windowWidth, windowHeight); // Create a canvas that is the size of our browser window
  background("black"); // set the background color to black
}

function draw() {
  const portIsOpen = checkPort(); // Check whether the port is open (see checkPort function below)
  if (!portIsOpen) return; // If the port is not open, exit the draw loop

  let str = port.readUntil("\n"); // Read from the port until the newline
  if (str.length == 0) return; // If we didn't read anything, return


  
  let array1 = str.trim().split(","); // store x and y values in array1 as str

  let valx = map(Number(array1[0]), 0, 1023, 0, windowWidth); // turns the x value str to a Number and map it to the window width, and store it to valx
  let valy = map(Number(array1[1]), 0, 1023, 0, windowHeight); // turns the y value str to a Number and map it to the window height, and store it to valy

  if (valx < windowWidth/2) { // if valx is less than half of the window width (on the left hand side of the screen)
    let c = color(255, 0, 0); // set c to red RGB code
    fill(c); // use red to fill shape
    circle(valx, valy, 50); // draw a circle where it's located at (valx, valy) and has a diameter of 50
    port.write(0); // send 0 to arduino
  } else {
    let c = color(0, 255, 0); // set c to green RGB code
    fill(c); // use green to fill shape
    circle(valx, valy, 50);  // draw a circle where it's located at (valx, valy) and has a diameter of 50
    port.write(1);  // send 1 to arduino
  }

}


// The three functions below are from the class example code.
// Three helper functions for managing the serial connection.

function setupSerial() {
  port = createSerial();

  // Check to see if there are any ports we have used previously
  let usedPorts = usedSerialPorts();
  if (usedPorts.length > 0) {
    // If there are ports we've used, open the first one
    port.open(usedPorts[0], BAUD_RATE);
  }

  // create a connect button
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(5, 5); // Position the button in the top left of the screen.
  connectBtn.mouseClicked(onConnectButtonClicked); // When the button is clicked, run the onConnectButtonClicked function
}

function checkPort() {
  if (!port.opened()) {
    // If the port is not open, change button text
    connectBtn.html("Connect to Arduino");
    // Set background to gray
    background("gray");
    return false;
  } else {
    // Otherwise we are connected
    connectBtn.html("Disconnect");
    return true;
  }
}

function onConnectButtonClicked() {
  // When the connect button is clicked
  if (!port.opened()) {
    // If the port is not opened, we open it
    port.open(BAUD_RATE);
  } else {
    // Otherwise, we close it!
    port.close();
  }
}