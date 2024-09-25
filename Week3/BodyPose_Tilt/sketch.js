let trolleyImg_L;
let trolleyImg_R;
let peopleImg;
let didPeopleCrash;
let personImg;
let didPersonCrash;
let bloodImg;

let bodyPose;
let video;
let poses = [];
let connection;
let r_ear;
let l_ear;

let pos_x;
let vel_x;
let acc_x;
let terminalVel;
let degree;

function preload() {
  trolleyImg_L = loadImage('media/trolley_L.png');
  trolleyImg_R = loadImage('media/trolley_R.png');
  peopleImg = loadImage('media/people.png');
  didPeopleCrash = false;
  personImg = loadImage('media/person.png');
  didPersonCrash = false;
  bloodImg = loadImage('media/blood.png');
  bodyPose = ml5.bodyPose();
}

function setup() {
  createCanvas(640, 480);
  pos_x = width/2 - 85;
  vel_x = 0;
  acc_x = 0;
  terminalVel = 3;
  degree = 0;
  angleMode(DEGREES);
  imageMode(CENTER);
  textAlign(CENTER);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  bodyPose.detectStart(video, gotPoses);
  
}

function gotPoses(results) {
  poses = results;
}

function draw() {
  // Video initialization
  image(video, width/2, height/2, width, height);
  // Accelerate / Decelerate based on diff. of Y position btwn. the two ears
  pose = poses[0];
  // MUST CHECK FOR UNDEFINED IN ARRAY
  if (poses.length > 0) {
    // The image is mirrored, so r_ear = left_ear
    r_ear = pose.left_ear;
    l_ear = pose.right_ear;
    circle(r_ear.x, r_ear.y, 60);
    circle(l_ear.x, l_ear.y, 60);
    // If right ear higher than left
    if(l_ear.y > r_ear.y) {
      acc_x = -0.1;
      fill(0, 255, 0);
    }
    // If left ear higher than right
    else if (r_ear.y > l_ear.y){
      acc_x = 0.1;
      fill(255, 0, 0);
    }
    else {
      acc_x = 0;
    }
  }

  // Images of people 
  image(peopleImg, 30, height/2);
  image(personImg, width-30, height/2)
  
  // Detects crash state 
  if (pos_x >= width-30) {
    didPersonCrash = true;
    
  }
  else if (pos_x <= 30) {
    didPeopleCrash = true;
  }
  
   // Physics stuff
   pos_x = pos_x + vel_x;
   // Terminal velocity
   if(vel_x >= terminalVel) {
     vel_x = terminalVel - 0.05;
   }
   else if (vel_x <= -terminalVel) {
     vel_x = -terminalVel + 0.05;
   }
   else {
     vel_x = vel_x + acc_x;;
   }
   // Terminal Position (bound)
   if (pos_x >= width) {
     pos_x = width - 5;
   }
   else if (pos_x <= 0) {
     pos_x = 5;
   }
 
   // console.log('Pos = ' + pos_x);
   // console.log('Vel = ' + vel_x);
   // console.log('Acc = ' + acc_x);
 
   // Trolley rotation + flip
   push();
   // Move the origin to the center of the image
   translate(pos_x, height / 2);
   degree = random(-6, 6);
   rotate(degree);
   // Determine which image to display based on acceleration direction
   if (acc_x >= 0) {
     image(trolleyImg_R, 0, 0);
   } 
   else {
     image(trolleyImg_L, 0, 0);
   }
   pop();

  // Show blood image 
  if (didPersonCrash) {
    push()
    translate(width-30, height/2)
    scale(0.4, 0.4);
    image(bloodImg, 0, 0);
    
    pop()
  }
  if (didPeopleCrash) {
    image(bloodImg, 30, height/2);
  }
  if (didPersonCrash && didPeopleCrash) {
    textSize(32);
    text('Great job! You killed everyone!', width/2, height/2);
  }
  

}