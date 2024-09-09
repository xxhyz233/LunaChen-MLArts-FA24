let classifier;
let capture;
let label;
let confidence;

function preload() {
  // 2nd arg = continous image source being classified
  capture = createCapture(VIDEO);
  classifier = ml5.imageClassifier('MobileNet', capture, modelReady);
}

// Declare a callback function when classifier is loaded
function modelReady() {
  console.log('Model ready!!!');
  classifier.classifyStart(capture, 3, gotResults);
}

// Callback function when classify starts
function gotResults(results, error) {
  if (error) {
    console.error('ERROR');
  }
  else {
    label = results[0].label;
    confidence = nf(results[0].confidence, 0, 4);
  }
}

function setup() {
  createCanvas(960, 540);
  capture.hide();
  capture.size(960, 540);
  background(0);
  fill('white');
  textSize(32);
}

function draw() {
  background(0);
  image(capture, 0, 0);
  text(label, 10, height - 100);
  text(confidence, 10, height - 50);
}
