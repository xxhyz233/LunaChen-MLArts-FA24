// Paint variables
let x = 0;
let y = 0;
let stepSize = 5.0;
let moduleSize = 25;
let lineModule;
let elements;
// let cursorLayer;

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

let classifier;
let handLabel = "";
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/206aX-2ft/';

function preload() {
  handPose = ml5.handPose();
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
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
  // cursorLayer = createGraphics(640, 640);
  strokeWeight(10);
  stroke(255);
}

function gotResults(results) {
  hands = results;
}

function classifyVideo() {
  classifier.classify(video, gotTrainingResult);
}

function gotTrainingResult(results) {
  handLabel = results[0].label;
  console.log(handLabel);
  if (handLabel == "Higher") {
    
  }
  else {
    brushChange(handLabel);
  }
}

function draw() {
  fill(0)
  // cursorLayer.erase();
  // cursorLayer.circle(fingerTipX, fingerTipY, 20);
  // cursorLayer.noErase();
  // image(cursorLayer, 0, 0);
  if(frameCount % 10 == 0) {
    classifyVideo();
  }
  
  
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
      fill(0);
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

function brushChange(gesture) {
  console.log(gesture);
  // Change brush type, use finger number for detection
  if (gesture == '1') lineModule = elements[0];
  if (gesture == '2') lineModule = elements[1];
  if (gesture == '3') lineModule = elements[2];
  if (gesture == '4') lineModule = elements[3];
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