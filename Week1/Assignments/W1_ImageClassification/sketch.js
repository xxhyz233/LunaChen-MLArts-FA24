let mobilenet;
let liger

// MobileNet is loaded from the cloud, this function runs when the model is loaded
function modelReady() {
  console.log('Model is ready!!!');
  mobilenet.classify(liger, gotResults);
}

// Error first callback, must include error msg as 1st arg
function gotResults(error, results) {
  if (error) {
    console.error(error);
    let label = "Label: " + error[0].label;
    let confidence = 'Confidence: ' + nf(error[0].confidence, 0, 4)
    fill(0);
    textSize(32);
    fill('white');
    text(label, 10, height - 100);
    text(confidence, 10, height - 50);
  }
  else {
    console.log(results);
    results[0].label
    let label = "Label: " + results[0].label;
    fill(0);
    textSize(64);
    text(label, 10, height - 100);
  }
}

function imageReady() {
  image(liger, 0, 0, width, height);
}

function setup() {
  createCanvas(640, 480);
  background(220);
  mobilenet = ml5.imageClassifier('MobileNet', modelReady);
  liger = createImg('media/liger.jpg', imageReady);
  liger.hide();
}
