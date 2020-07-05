class Barrel {
    constructor(spritesheet, indexI, indexJ, colorValue, scaleFactor) {
        this.indexI = indexI;
        this.indexJ = indexJ;

        this.position = createVector(0, 0);

        this.pixelsPerGridUnit = 16;

        this.sprite;
        this.setBarrelColor(colorValue, spritesheet);
        this.sprite.resize(this.sprite.width * scaleFactor, 0);
        this.colorValue = colorValue;

        this.scaleFactor = scaleFactor;

        this.firstAnimationFrame;
        this.animating = false;

        this.newIndexI = this.indexI;
        this.newIndexJ = this.indexJ;

        this.completed = false;
        this.completedRow = false;
        this.spawned = false;
        this.spawnedRow = false;

        this.spritesheet = spritesheet;
    }

    draw(overworld) {
        if (this.animating) {
            let framesElapsed = frameCount - this.firstAnimationFrame;

            let newPosition = createVector(overworld.position.x + this.scaleFactor * (this.pixelsPerGridUnit * this.newIndexJ - 49), overworld.position.y + this.scaleFactor * (this.pixelsPerGridUnit * this.newIndexI - 28));
            let oldPosition = createVector(overworld.position.x + this.scaleFactor * (this.pixelsPerGridUnit * this.indexJ - 49), overworld.position.y + this.scaleFactor * (this.pixelsPerGridUnit * this.indexI - 28));
            let difference = p5.Vector.sub(newPosition, oldPosition);
            difference.div(20);

            this.position.add(difference);

            overworld.lockInput = true;
            if (framesElapsed >= 20) {
                this.animating = false;
                this.position = newPosition;
                this.indexI = this.newIndexI;
                this.indexJ = this.newIndexJ;
                overworld.lockInput = false;
            }
            imageMode(CENTER);
            image(this.sprite, this.position.x, this.position.y);
        }
        else if (this.completed) {
            if (this.completedRow) {
                this.position.x += this.pixelsPerGridUnit * this.scaleFactor / 20;
            }
            else {
                this.position.y += this.pixelsPerGridUnit * this.scaleFactor / 20;
            }

            this.setBarrelColor(Math.floor(frameCount / 4) % 5, this.spritesheet);
            this.sprite.resize(this.sprite.width * this.scaleFactor, 0);

            let flag = false;
            if (this.completedRow) {
                flag = this.position.x > overworld.position.x + this.scaleFactor * (this.pixelsPerGridUnit * 6 - 49);
            }
            else {
                flag = this.position.y > overworld.position.y + this.scaleFactor * (this.pixelsPerGridUnit * 6 - 28);
            }
            
            if (flag) {
                gameGrid.removeBarrel(this.indexI, this.indexJ);
            }
            imageMode(CENTER);
            image(this.sprite, this.position.x, this.position.y);
        }
        else if (this.spawned) {
            if (this.spawnedRow) {
                this.position.x -= this.pixelsPerGridUnit * this.scaleFactor / 20;
            }
            else {
                this.position.y -= this.pixelsPerGridUnit * this.scaleFactor / 20;
            }

            this.setBarrelColor(Math.floor(frameCount / 4) % 5, this.spritesheet);
            this.sprite.resize(this.sprite.width * this.scaleFactor, 0);

            let flag = false;
            if (this.spawnedRow) {
                flag = this.position.x < overworld.position.x + this.scaleFactor * (this.pixelsPerGridUnit * this.indexJ - 49);
            }
            else {
                flag = this.position.y < overworld.position.y + this.scaleFactor * (this.pixelsPerGridUnit * this.indexI - 28);
            }

            if (flag) {
                if ((this.indexI == 0 && !this.spawnedRow) || (this.indexJ == 0 && this.spawnedRow)) overworld.lockBarrelInput = false;
                
                this.spawned = false;
                this.spawnedRow = false;
                this.setBarrelColor(this.colorValue, this.spritesheet);
                this.sprite.resize(this.sprite.width * this.scaleFactor, 0);
            }
            imageMode(CENTER);
            image(this.sprite, this.position.x, this.position.y);
        }
        else {
            this.position.x = overworld.position.x + this.scaleFactor * (this.pixelsPerGridUnit * this.indexJ - 49);
            this.position.y = overworld.position.y + this.scaleFactor * (this.pixelsPerGridUnit * this.indexI - 28);

            imageMode(CENTER);
            image(this.sprite, this.position.x, this.position.y);
        }
    }

    setBarrelColor(val, spritesheet) {
        switch (val) {
            case 0:
                this.sprite = spritesheet.get(276, 31, 20, 21);
                break;
            case 1:
                this.sprite = spritesheet.get(299, 31, 20, 21);
                break;
            case 2:
                this.sprite = spritesheet.get(323, 31, 20, 21);
                break;
            case 3:
                this.sprite = spritesheet.get(348, 31, 20, 21);
                break;
            case 4:
                this.sprite = spritesheet.get(375, 31, 20, 21);
                break;
        }
    }
}