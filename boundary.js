class Boundary {
    constructor(x1, x2, y1, y2) {
        this.a = createVector(x1, x2);
        this.b = createVector(y1, y2);
    }

    middle() {
        return createVector((this.a.x + this.b.x) * 0.5, (this.a.y + this.b.y) * 0.5);
    }

    show() {
        stroke(0);
        line(this.a.x, this.a.y, this.b.x, this.b.y);
    }
}