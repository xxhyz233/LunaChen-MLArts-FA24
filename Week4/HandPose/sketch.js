let handPose;
let myVideo;
let hands = [];

function preload() {
  handPose = ml5.handPose({ flipped : true });
  
}

function setup() {
  createCanvas(400, 400);
  myVideo = createCapture(VIDEO, { flipped : true});
  myVideo.size(width, height);
  myVideo.hide();
  handPose.detectStart(myVideo, gotResults);
}

function gotResults(results) {
  hands = results; 
}

function draw() {
  
  background(220);
  image(myVideo, 0, 0, width, height);
  // if (hands > 0) {
  //   print(hands);
  // }
  print(hands);
  for (let hand of hands) {
    let index = hand.index_finger_tip;
  }
}