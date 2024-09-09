let radius;

function setup() {
    createCanvas(400,400);
    radius = random(100);
}

function draw() {
    background(255);
    for (let x = 0; x < width; x+=20) {
        stroke(0);
        strokeWeight(1);
        line(x, 0, x, height);
    }

    fill(255,0 ,0);
    stroke(0, 0, 255);
    strokeWeight(5);
    circle(mouseX, mouseY, radius);

    radius = radius + 5;
    if (radius > 150) {
        radius = 50;
    }
}