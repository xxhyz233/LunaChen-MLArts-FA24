// Classifier Variable
let classifier;
// Model URL
let imageModelURL = "https://teachablemachine.withgoogle.com/models/Klm6yE4Bx/";
let video;
// To store the classification
let label = "";
let emojiArr = ["(^///^)", "(≧﹏ ≦)", "(●'◡'●)", "(*^▽^*)"];

// Load the model first
function preload() {
  // Referencing the model Teachable Machine URL online
  classifier = ml5.imageClassifier(imageModelURL + "model.json", {
    flipped: true,
  });
}

function setup() {
  createCanvas(320, 260);
  // Create the video
  video = createCapture(VIDEO, { flipped: true });
  video.size(320, 240);
  video.hide();
  classifier.classifyStart(video, gotResult);
}

function draw() {
  background(0);
  // Draw the video
  image(video, 0, 0);

  fill(255);
  stroke(0,0,0, 100);
  strokeWeight(1);
  textSize(64);
  textAlign(CENTER);
  
  if(label == 'Bad Hand'){
    filter(POSTERIZE, int(random(1,4)));
    filter(INVERT);
    textSize(200);
    text("🤬", width/2, height-60);
    
  }
  else {
    for(let i = 0; i < 6; i++)  {
      textSize(int(random(12,48)));
      text(emojiArr[int(random(0,3))], random(0, width), random(0,height));
    }
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(results) {
  // The results are in an array ordered by confidence.
  console.log(results[0]);
  label = results[0].label;
}
