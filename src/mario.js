class Mario {
    constructor(spritesheet, baseSpritesheet, scaleFactor) {
        this.position = createVector(0, 0);
        this.gridUnit = 0;

        this.pixelsPerGridUnit = 16;

        this.defaultAnimationFrame = spritesheet.get(10, 12, 16, 32);
        this.defaultAnimationFrame.resize(this.defaultAnimationFrame.width * scaleFactor, 0);

        this.walkingAnimationFrames = [];
        this.loadWalkingAnimationFrames(spritesheet);
        for (let i = 0; i < this.walkingAnimationFrames.length; i++) {
            this.walkingAnimationFrames[i].resize(this.walkingAnimationFrames[i].width * scaleFactor, 0);
        }

        this.barrelAnimationFrames = [];
        this.loadBarrelAnimationFrames(spritesheet);
        for (let i = 0; i < this.barrelAnimationFrames.length; i++) {
            this.barrelAnimationFrames[i].resize(this.barrelAnimationFrames[i].width * scaleFactor, 0);
        }
        this.firstBarrelAnimationFrame = 0;
        this.barreling = false;
        this.barrelingUp = false;

        this.scaleFactor = scaleFactor;

        this.firstLeftAnimationFrame = 0;
        this.walkingLeft = false;

        this.firstRightAnimationFrame = 0;
        this.walkingRight = false;


        this.slider = new Slider();
        this.loadSliderAnimationFrames(baseSpritesheet);
        for (let i = 0; i < this.slider.animationFrames.length; i++) {
            this.slider.animationFrames[i].resize(this.slider.animationFrames[i].width * scaleFactor, 0);
        }
        this.slider.currentAnimationFrame = this.slider.animationFrames[0];
        this.sliderIndex = 0;
    }

    loadWalkingAnimationFrames(spritesheet) {
        this.walkingAnimationFrames.push(spritesheet.get(10, 90, 16, 32));
        this.walkingAnimationFrames.push(spritesheet.get(31, 90, 16, 32));
        this.walkingAnimationFrames.push(spritesheet.get(52, 90, 16, 32));
        this.walkingAnimationFrames.push(spritesheet.get(73, 90, 16, 32));
    }

    loadBarrelAnimationFrames(spritesheet) {
        this.barrelAnimationFrames.push(spritesheet.get(731, 232, 16, 27));
        this.barrelAnimationFrames.push(spritesheet.get(668, 232, 16, 27));
        this.barrelAnimationFrames.push(spritesheet.get(710, 232, 16, 27));
        this.barrelAnimationFrames.push(spritesheet.get(689, 232, 16, 27));
    }

    loadSliderAnimationFrames(spritesheet) {
        this.slider.animationFrames.push(spritesheet.get(15, 147, 14, 96));
        this.slider.animationFrames.push(spritesheet.get(38, 147, 14, 96));
        this.slider.animationFrames.push(spritesheet.get(61, 147, 14, 96));
    }

    draw(overworld) {
        imageMode(CENTER);

        this.sliderIndex = 0;
        if (this.walkingRight) {
            let framesElapsed = frameCount - this.firstRightAnimationFrame;
            image(this.walkingAnimationFrames[Math.floor(framesElapsed / 3)], this.position.x, this.position.y);

            this.position.x += this.pixelsPerGridUnit / 10 * this.scaleFactor;

            if (framesElapsed >= 10) {
                this.gridUnit++;
                this.walkingRight = false;
            }
        }
        else if (this.walkingLeft) {
            let framesElapsed = frameCount - this.firstLeftAnimationFrame;
            push();
            translate(this.position.x, this.position.y);
            scale(-1, 1);
            image(this.walkingAnimationFrames[Math.floor(framesElapsed / 3)], 0, 0);
            pop();

            this.position.x -= this.pixelsPerGridUnit / 10 * this.scaleFactor;

            if (framesElapsed >= 10) {
                this.gridUnit--;
                this.walkingLeft = false;
            }
        }
        else if (this.barreling) {
            let framesElapsed = frameCount - this.firstBarrelAnimationFrame;
            let additive = 0;
            let index = Math.floor(framesElapsed / 5.1);
            if (this.barrelingUp == true) index = index * -1 + 3;

            if (index == 3) additive = 6 * this.scaleFactor;
            else if (index == 2) additive = 5 * this.scaleFactor;
            else if (index == 1) additive = 4 * this.scaleFactor;
            else additive = 3 * this.scaleFactor;

            image(this.barrelAnimationFrames[index], this.position.x, this.position.y + additive);

            if (framesElapsed >= 20) {
                this.barreling = false;
                gameGrid.checkRowsCompleted();
            }
        }
        else {
            this.position.x = overworld.position.x - 48 * this.scaleFactor + this.scaleFactor * this.gridUnit * this.pixelsPerGridUnit;
            this.position.y = overworld.position.y - 60 * this.scaleFactor;

            image(this.defaultAnimationFrame, this.position.x, this.position.y);
        }

        if (this.barreling || luigi.barreling) {
            this.sliderIndex = Math.abs(Math.floor(frameCount / 6) % 4 - 2);
        }
        this.slider.position.x = this.position.x - (7 * this.scaleFactor);
        this.slider.position.y = this.position.y + (24 * this.scaleFactor);
        imageMode(CORNER);
        image(this.slider.animationFrames[this.sliderIndex], this.slider.position.x, this.slider.position.y);
    }
}