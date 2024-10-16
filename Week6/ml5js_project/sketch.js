// Paint variables
let x = 0;
let y = 0;
let stepSize = 5.0;
let moduleSize = 25;
let lineModule;
let elements;

// ml5 variables
let video;
let handPose;
let hands = [];
let hand;
let fingerTipX = 0;
let fingerTipY = 0;
let thumbTipX = 0;
let thumbTipY = 0;
let handPinch = false;

function preload() {
  handPose = ml5.handPose();
  // Preload each svg into our elements array
  elements = [];
  elements[0] = loadImage('media/01.svg');
  elements[1] = loadImage('media/02.svg');
  elements[2] = loadImage('media/03.svg');
  elements[3] = loadImage('media/04.svg');
  elements[4] = loadImage('media/05.svg');
  elements[5] = loadImage('media/06.svg');
  elements[6] = loadImage('media/07.svg');
  elements[7] = loadImage('media/08.svg');
  elements[8] = loadImage('media/09.svg');
}

function setup() {
  createCanvas(640, 1280);
  video = createCapture(VIDEO, { flipped : false });
  video.size(width, height/2);
  video.hide();
  handPose.detectStart(video, gotResults);

  background(255);
  cursor(CROSS);
  // Replace with remapped hand xy
  x = fingerTipX;
  y = fingerTipY;
  lineModule = elements[0];
  strokeWeight(10);
  stroke(255);
}

function gotResults(results) {
  hands = results;
}

function draw() {
  image(video, 0, height/2, width, height/2);
  if (hands.length >= 1) {
    hand = hands[0];
    fingerTipX = map(hand.index_finger_tip.x, 0, video.width, 0, width);
    fingerTipY = map(hand.index_finger_tip.y, 0, video.height, 0, height/2);
    thumbTipX = map(hand.thumb_tip.x, 0, video.width, 0, width);
    thumbTipY = map(hand.thumb_tip.y, 0, video.width, 0, height/2);
  }
  
  // Changes hand pinch state
  if (hand && isPinched()) {
    // Set XY when pinch is detected
    if (!handPinch) {
      x = fingerTipX;
      y = fingerTipY;
    }
    handPinch = true;
  } else {
    handPinch = false;
  }

  // If hand is pinching, then draw our brush shape
  if (handPinch) {
    let d = dist(x ,y, fingerTipX, fingerTipY);
    if (d > stepSize) {
      let angle = atan2(fingerTipY - y, fingerTipX - x);
      push();
      translate(fingerTipX, fingerTipY);
      rotate(angle + PI);
      image(lineModule, 0, 0, d, moduleSize);
      pop();
      x = x + cos(angle) * stepSize;
      y = y + sin(angle) * stepSize;
    }
  }
  
}

// Detects hand pinch state by comparing distance btwn. Index and Thumb tip
function isPinched () {
  let distance = dist(thumbTipX, thumbTipY, fingerTipX, fingerTipY);
  return distance < 30;
}

function keyReleased() {
  // Print screen on s key
  if (key == 's' || key == 'S') {
    saveCanvas(gd.timeStamp(), 'png');
  }
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    background(255);
  }
  // Change brush type, use swipe action for detection
  if (key == '1') lineModule = elements[0];
  if (key == '2') lineModule = elements[1];
  if (key == '3') lineModule = elements[2];
  if (key == '4') lineModule = elements[3];
  if (key == '5') lineModule = elements[4];
  if (key == '6') lineModule = elements[5];
  if (key == '7') lineModule = elements[6];
  if (key == '8') lineModule = elements[7];
  if (key == '9') lineModule = elements[8];
}

function keyPressed() {
  // Maybe try opening hand / wave hand to up or lower size?
  if (keyCode == UP_ARROW) moduleSize += 5;
  if (keyCode == DOWN_ARROW) moduleSize -= 5;
  // stepSize arrowkeys left/right
  stepSize = max(stepSize, 0.5);
  if (keyCode == LEFT_ARROW) stepSize -= 0.5;
  if (keyCode == RIGHT_ARROW) stepSize += 0.5;
  print('moduleSize:', moduleSize, 'stepSize:', stepSize);
}