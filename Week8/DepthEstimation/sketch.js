let video;
let depthResult;
let depthEstimation;
let results;

let bodySegmentation;
let segmentation;
let options = {
    maskType: "background",
    runtime: "tfjs"
};
let segMaskImg;

let ashBabyImg;
let babyPosition;

let opacity = 0;
let fadeIn = true;
let holdTime = 120;
let fadeOut = false;
let holdCounter = 0;


function preload() {
    bodySegmentation = ml5.bodySegmentation("BodyPix", options);
    ashBabyImg = loadImage("ashbaby0.png");
}

async function setup() {
    createCanvas(640, 480);
    video = createCapture();
    video.size(320, 240);

    let pipeline = await loadTransformers();

    depthEstimation = await pipeline(
        "depth-estimation",
        "onnx-community/depth-anything-v2-small",
        { device: "webgpu" }
    );
    processVideo();

    // bodySegmentation.detectStart(video, bodyGotResults);
}

function draw() {
    image(video, 0, 0);

    if (results) {
        const { depth } = results;
        let depthImg = createImage(depth.width, depth.height);
        depthImg.loadPixels();

        let minDepth = 255;
        babyPosition = null; // Resets baby position for each frame

        for (let y = 0; y < depth.height; y++) {
            for (let x = 0; x < depth.width; x++) {
                let index = x + y * depth.width; 
                let depthValue = depth.data[index];
                let pixelIndex = index * 4;

                depthImg.pixels[pixelIndex] = depthValue;
                depthImg.pixels[pixelIndex + 1] = depthValue;
                depthImg.pixels[pixelIndex + 2] = depthValue;
                depthImg.pixels[pixelIndex + 3] = 255;
                
                if (depthValue < minDepth) {
                    minDepth = depthValue;
                    babyPosition = { x , y };
                }
            }
        }
        depthImg.updatePixels();
        image(depthImg, 0, 0, width, height);
    }

    // Masking out the ash baby with our person
    // if (segmentation) {
    //     image(segmentation.mask, 0, 0, width, height);
    //     segMaskImg = segmentation.mask;
    //     segMaskImg.resize(320, 240);
    //     ashBabyImg.mask(segMaskImg);
    // }

    if (babyPosition) {
        if (fadeIn) {
            opacity += 5;
            if (opacity >= 255) {
                opacity = 255;
                fadeIn = false;
                holdCounter = holdTime;
            }
        } else if (holdCounter > 0) {
            holdCounter--;
            if (holdCounter === 0) fadeOut = true;
        } else if (fadeOut) {
            opacity -= 5;
            if (opacity <= 0) {
                opacity = 0;
                fadeOut= false;
                fadeIn = true;
            }
        }
        // Set tint for the baby image
        tint(255, opacity);
        image(ashBabyImg, babyPosition.x, babyPosition.y, 200, 192);
        // Reset tint for the rest of the layers
        noTint();
    }
    
}

async function processVideo() {
    results = await depthEstimation(video.canvas.toDataURL());
    // Recursively call processVideo() to keep processingframes 
    await processVideo();
}

// function bodyGotResults(result) {
//     segmentation = result;
// }