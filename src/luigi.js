class Luigi {
    constructor(spritesheet, baseSpritesheet, scaleFactor) {
        this.position = createVector(0, 0);
        this.gridUnit = 0;

        this.pixelsPerGridUnit = 16;

        this.defaultAnimationFrame = spritesheet.get(11, 100, 16, 36);
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
        this.barrelingRight = false;

        this.scaleFactor = scaleFactor;

        this.firstDownAnimationFrame = 0;
        this.walkingDown = false;

        this.firstUpAnimationFrame = 0;
        this.walkingUp = false;

        this.slider = new Slider();
        this.loadSliderAnimationFrames(baseSpritesheet);
        for (let i = 0; i < this.slider.animationFrames.length; i++) {
            this.slider.animationFrames[i].resize(this.slider.animationFrames[i].width * scaleFactor, 0);
        }
        this.slider.currentAnimationFrame = this.slider.animationFrames[0];
        this.sliderIndex = 0;
    }

    loadWalkingAnimationFrames(spritesheet) {
        this.walkingAnimationFrames.push(spritesheet.get(11, 9, 16, 36));
        this.walkingAnimationFrames.push(spritesheet.get(32, 9, 16, 36));
        this.walkingAnimationFrames.push(spritesheet.get(53, 9, 16, 36));
        this.walkingAnimationFrames.push(spritesheet.get(73, 9, 16, 36));

        this.walkingAnimationFrames.push(spritesheet.get(11, 191, 16, 36));
        this.walkingAnimationFrames.push(spritesheet.get(30, 191, 16, 36));
        this.walkingAnimationFrames.push(spritesheet.get(49, 191, 16, 36));
        this.walkingAnimationFrames.push(spritesheet.get(68, 191, 16, 36));
    }

    loadBarrelAnimationFrames(spritesheet) {
        this.barrelAnimationFrames.push(spritesheet.get(1034, 1335, 20, 36));
        this.barrelAnimationFrames.push(spritesheet.get(1058, 1335, 20, 36));
        this.barrelAnimationFrames.push(spritesheet.get(1083, 1335, 20, 36));
    }

    loadSliderAnimationFrames(spritesheet) {
        this.slider.animationFrames.push(spritesheet.get(81, 149, 96, 14));
        this.slider.animationFrames.push(spritesheet.get(81, 167, 96, 14));
        this.slider.animationFrames.push(spritesheet.get(81, 186, 96, 14));
    }

    draw(overworld) {
        imageMode(CENTER);
        this.sliderIndex = 0;
        if (this.walkingDown) {
            let framesElapsed = frameCount - this.firstDownAnimationFrame;
            image(this.walkingAnimationFrames[Math.floor(framesElapsed / 3)], this.position.x, this.position.y);

            this.position.y += this.pixelsPerGridUnit/10 * this.scaleFactor;

            if (framesElapsed >= 10) {
                this.gridUnit++;
                this.walkingDown = false;
            }
        }
        else if (this.walkingUp) {
            let framesElapsed = frameCount - this.firstUpAnimationFrame;
            image(this.walkingAnimationFrames[Math.floor(framesElapsed / 3) + 4], this.position.x, this.position.y);

            this.position.y -= this.pixelsPerGridUnit/10 * this.scaleFactor;

            if (framesElapsed >= 10) {
                this.gridUnit--;
                this.walkingUp = false;
            }
        }
        else if (this.barreling) {
            let framesElapsed = frameCount - this.firstBarrelAnimationFrame;
            let additive = 0;
            let index = Math.floor(framesElapsed / 7);
            if (this.barrelingRight == true) index = index * -1 + 2;

            if (index == 0) additive = 5 * this.scaleFactor;
            else if (index == 1) additive = 3 * this.scaleFactor;
            else additive = this.scaleFactor;

            image(this.barrelAnimationFrames[index], this.position.x + additive, this.position.y);

            if (framesElapsed >= 20) {
                this.barreling = false;
                gameGrid.checkColumnsCompleted();
            }
        }
        else {
            this.position.x = overworld.position.x - 72 * this.scaleFactor;
            this.position.y = overworld.position.y + this.scaleFactor * (this.pixelsPerGridUnit * this.gridUnit - 38);
    
            image(this.defaultAnimationFrame, this.position.x, this.position.y);
        }

        if (this.barreling || mario.barreling) {
            this.sliderIndex = Math.abs(Math.floor(frameCount / 6) % 4 - 2);
        }
        this.slider.position.x = this.position.x + (14 * this.scaleFactor);
        this.slider.position.y = this.position.y + (6 * this.scaleFactor);
        imageMode(CORNER);
        image(this.slider.animationFrames[this.sliderIndex], this.slider.position.x, this.slider.position.y);
    }
}