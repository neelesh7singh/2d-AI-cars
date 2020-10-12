const TOTAL = 100;
const MUTATIONS_RATE = 0.05;
const LIFESPAN = 100;
let gen = 1;
let lapsLeft = 3;

let walls = [];
let ray;
// let particle;
let xoff = 0;
let yoff = 10000;
let population = [];
let savedParticles = [];

let start, end;

let speedSlider;

let inside = [];
let outside = [];
let checkpoints = [];

function buildTrack() {
    checkpoints = [];
    inside = [];
    outside = [];

    let noiseMax = 5;
    const total = 30;
    const pathWidth = 30;
    let startX = random(1000);
    let startY = random(1000);

    for (let i = 0; i < total; i++) {
        let a = map(i, 0, total, 0, TWO_PI);
        let xoff = map(cos(a), -1, 1, 0, noiseMax) + startX;
        let yoff = map(sin(a), -1, 1, 0, noiseMax) + startY;
        let r = map(noise(xoff, yoff), 0, 1, 100, height / 2);
        // let x = width / 2 + r * cos(a);
        // let y = height / 2 + r * sin(a);
        let x1 = width / 2 + (r - pathWidth) * cos(a);
        let y1 = height / 2 + (r - pathWidth) * sin(a);
        let x2 = width / 2 + (r + pathWidth) * cos(a);
        let y2 = height / 2 + (r + pathWidth) * sin(a);
        checkpoints.push(new Boundary(x1, y1, x2, y2));
        inside.push(createVector(x1, y1));
        outside.push(createVector(x2, y2));
        // point(x1, y1);
        // point(x2, y2);
    }

    walls = [];

    for (let i = 0; i < checkpoints.length; i++) {
        let a1 = inside[i];
        let b1 = inside[(i + 1) % checkpoints.length];
        let a2 = outside[i];
        let b2 = outside[(i + 1) % checkpoints.length];
        walls.push(new Boundary(a1.x, a1.y, b1.x, b1.y));
        walls.push(new Boundary(a2.x, a2.y, b2.x, b2.y));

    }

    // let a = inside[inside.length - 1];
    // let b = outside[outside.length - 1];
    // walls.push(new Boundary(a.x, a.y, b.x, b.y));

    start = checkpoints[0].middle();
    end = checkpoints[checkpoints.length - 1].middle();

}

function colorTrack() {
    push();
    stroke(33, 33, 33);
    fill(33, 33, 33);
    for (let i = 0; i < inside.length - 1; i++) {
        beginShape();
        vertex(inside[i].x, inside[i].y);
        vertex(inside[i + 1].x, inside[i + 1].y);
        vertex(outside[i + 1].x, outside[i + 1].y);
        vertex(outside[i].x, outside[i].y);
        endShape(CLOSE);
        if (i == inside.length - 2) {
            beginShape();
            vertex(inside[i + 1].x, inside[i + 1].y);
            vertex(inside[0].x, inside[0].y);
            vertex(outside[0].x, outside[0].y);
            vertex(outside[i + 1].x, outside[i + 1].y);
            endShape(CLOSE);
        }
    }
    pop();
}

function setup() {
    canvas = createCanvas(900, 700);
    canvas.parent('canvascontainer');
    background(51, 93, 45);
    tf.setBackend('cpu');
    buildTrack();
    colorTrack();
    stroke(0);
    strokeWeight(2);
    noFill();

    for (let i = 0; i < TOTAL; i++) {
        population[i] = new Particle();
    }

    generation = select('#gen');
    alive = select('#alive');
    laps = select('#ll');
    speedSlider = createSlider(1, 10, 1);
}

function draw() {


    background(129, 178, 20);
    colorTrack();

    const cycles = speedSlider.value();

    let m = 0;
    for (let n = 0; n < cycles; n++) {

        for (particle of population) {
            // particle.applyForce(createVector(0, -0.01));
            particle.look(walls);
            m = max(m, particle.check(checkpoints));
            particle.bounds();
            particle.update(mouseX, mouseY);
            particle.show();
        }

        for (let i = population.length - 1; i >= 0; i--) {
            const particle = population[i];
            if (particle.dead || particle.finished) {
                savedParticles.push(population.splice(i, 1)[0]);
            }
        }

        if (population.length === 0) {
            buildTrack();
            nextGeneration();
            gen++;
        }
    }

    // for (let cp of checkpoints) {
    //     cp.show();
    // }
    for (let wall of walls) {
        wall.show();
    }

    for (particle of population) {
        particle.show();
    }
    generation.html(gen);
    alive.html(population.length + `/ ${TOTAL}`);
    laps.html(lapsLeft - m);

    // ellipse(start.x, start.y, 20);
    checkpoints[checkpoints.length - 1].show();
    // ellipse(end.x, end.y, 20);
}