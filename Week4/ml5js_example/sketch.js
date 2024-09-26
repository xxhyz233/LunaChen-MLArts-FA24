let video;
let faceMesh;
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };
let results;
let faces = [];

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO, {flipped: true});
  video.hide();
  faceMesh.detectStart(video, gotFaces);

}

function gotFaces(results) {
  faces = results;
}

function draw() {
  image(video, 0, 0);
  if (faces.length > 0) {
    let face = faces[0];
    let leb = face.leftEyebrow;
    let lips = face.lips
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(leb.x, leb.y, leb.width, leb.height);
    // For every keypoint p of lips, draw a circle on it
    for (let p of lips.keypoints) {
      ellipse(p.x, p.y, 4);
    }
  }
}

function mousePressed() {
  console.log(faces);
}