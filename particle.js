function pldistance(p1, p2, x, y) {
    const num = abs((p2.y - p1.y) * x - (p2.x - p1.x) * y + p2.x * p1.y - p2.y * p1.x);
    const den = p5.Vector.dist(p1, p2);
    return num / den;
}

class Particle {
    constructor(brain) {
        this.dead = false;
        this.finished = false;
        this.fitness = 0;
        this.pos = createVector(start.x, start.y);
        this.vel = createVector();
        this.acc = createVector();
        this.maxspeed = 4;
        this.maxforce = 0.5;
        this.sight = 50;
        this.rays = [];
        this.index = 0;
        this.counter = 0;
        this.trip = 0;
        for (let i = -45; i < 45; i += 5) {
            this.rays.push(new Ray(this.pos, radians(i)));
        }
        if (brain) {
            this.brain = brain.copy();
        }
        else {
            this.brain = new NeuralNetwork(this.rays.length, this.rays.length, 1);
        }
    }

    dispose() {
        this.brain.dispose();
    }

    mutate() {
        this.brain.mutate(MUTATIONS_RATE);
    }



    applyForce(force) {
        this.acc.add(force);
    }

    update() {
        if (!this.dead && !this.finished) {
            this.pos.add(this.vel);
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.acc.set(0, 0);
            this.counter++;
            if (this.counter > LIFESPAN) {
                this.dead = true;
            }
        }

        for (let i = 0; i < this.rays.length; i++) {
            this.rays[i].rotate(this.vel.heading());
        }
    }

    check(checkpoints) {
        if (!this.finished) {
            const goal = checkpoints[this.index];
            // const goal = checkpoints[this.index].middle();
            const d = pldistance(goal.a, goal.b, this.pos.x, this.pos.y);
            // console.log(d);
            if (d < 5) {
                if (this.index == checkpoints.length - 1) {
                    this.trip++;
                }
                this.index = (this.index + 1) % checkpoints.length;
                this.fitness++;
                this.counter = 0;
                if (this.trip >= 3) {
                    this.dead = true;
                    this.finished = true;
                }
            }
            return this.trip;
            // goal.show();
        }
    }

    calculateFitness() {
        this.fitness = pow(2, this.fitness);
        // if (this.finished) this.fitness = 1;
        // else {
        //     const d = p5.Vector.dist(this.pos, target);
        //     this.fitness = constrain(1 / d, 0, 1);
        // }
    }

    look(walls) {
        const inputs = [];
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i];
            let closest = null;
            let record = this.sight;
            for (let wall of walls) {
                const pt = ray.cast(wall);
                if (pt) {
                    const d = p5.Vector.dist(this.pos, pt);
                    if (d < record && d < this.sight) {
                        record = d;
                        closest = pt;
                    }
                }
            }

            if (record < 5) {
                this.dead = true;
            }

            inputs[i] = map(record, 0, 50, 1, 0);

            // if (closest) {
            //     // stroke(255, 100);
            //     // line(this.pos.x, this.pos.y, closest.x, closest.y);
            // }
        }

        const output = this.brain.predict(inputs);
        let angle = map(output[0], 0, 1, -PI, PI);
        angle += this.vel.heading();
        const steering = p5.Vector.fromAngle(angle);

        steering.setMag(this.maxspeed);
        steering.sub(this.vel);
        steering.limit(this.maxforce);
        this.applyForce(steering);
        // console.log(output);
    }

    bounds() {
        if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
            this.dead = true;
        }
    }

    show() {
        push();
        translate(this.pos.x, this.pos.y);
        const heading = this.vel.heading();
        rotate(heading);
        fill(255, 65, 77);
        rectMode(CENTER);
        rect(0, 0, 15, 7);
        pop();
        // ellipse(this.pos.x, this.pos.y, 4);
        // for (ray of this.rays) {
        //     ray.show();
        // }
    }
}