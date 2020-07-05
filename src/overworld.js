class Overworld {
    constructor(spritesheet, scaleFactor, x, y) {
        this.img = spritesheet.get(266, 320, 240, 160);
        this.secondary = spritesheet.get(7, 320, 240, 160);
        this.tertiary = spritesheet.get(266, 154, 240, 160);

        this.img.resize(this.img.width * scaleFactor, 0);
        this.secondary.resize(this.secondary.width * scaleFactor, 0);
        this.tertiary.resize(this.tertiary.width * scaleFactor, 0);

        this.position = createVector(x, y);

        this.lockInput = false;
        this.lockBarrelInput = true;
    }
}