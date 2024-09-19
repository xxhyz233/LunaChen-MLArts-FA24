let bodyPose;
let video;
let poses = [];
let connection;
let noseObj;

function preload() {
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  image(video, 0, 0, width, height);
  pose = poses[0];
  fill(255, 0, 0);
  // MUST CHECK FOR UNDEFINED FOR ARRAY
  if (poses.length > 0) {
    noseObj = pose.nose;
    circle(noseObj.x, noseObj.y, 100);
  }
}