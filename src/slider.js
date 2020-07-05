class Slider {
    constructor() {
        this.position = createVector(0, 0);
        this.animationFrames = [];

        this.firstAnimationFrame;
        this.currentAnimationFrame;
    }

    draw() {


        imageMode(CENTER);
        image(this.animationFramees[0], this.position.x, this.position.y);
    }
}