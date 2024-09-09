let classifier;
let img;

function preload() {
  classifier = ml5.imageClassifier();
  img = loadImage('bunny.png');
}

function setup() {
  createCanvas(500, 500);
  // Declare a callback function when classify starts
  classifier.classify(img, gotResults);

}

// Callback function when classify starts
function gotResults(results) {
  console.log(results)
}

function draw() {
  background(220);
  image(img, 0, 0);
}