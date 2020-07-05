class NumberManager {
    constructor(spritesheet, scaleFactor) {
        this.spritesheet = spritesheet;
        this.scaleFactor = scaleFactor;


    }

    drawScore(score, overworld, highScore = false) {
        let hundreds = this.getDigitSprite(Math.floor(score / 100));
        let tens = this.getDigitSprite(Math.floor(score % 100 / 10));
        let units = this.getDigitSprite(score % 10);

        let scorePosition;
        if (highScore) {
            scorePosition = createVector(overworld.position.x - this.scaleFactor * 100, overworld.position.y + this.scaleFactor * 48);
        }
        else {
            scorePosition = createVector(overworld.position.x - this.scaleFactor * 100, overworld.position.y - this.scaleFactor * 32);
        }

        hundreds.resize(hundreds.width * this.scaleFactor, 0);
        image(hundreds, scorePosition.x, scorePosition.y);

        tens.resize(tens.width * this.scaleFactor, 0);
        image(tens, scorePosition.x + tens.width, scorePosition.y);

        units.resize(units.width * this.scaleFactor, 0);
        image(units, scorePosition.x + units.width * 2, scorePosition.y);
    }

    getDigitSprite(val) {
        switch (val) {
            case 0:
                return this.spritesheet.get(82, 207, 8, 13);
            case 1:
                return this.spritesheet.get(93, 207, 8, 13);
            case 2:
                return this.spritesheet.get(103, 207, 8, 13);
            case 3:
                return this.spritesheet.get(114, 207, 8, 13);
            case 4:
                return this.spritesheet.get(125, 207, 8, 13);
            case 5:
                return this.spritesheet.get(136, 207, 8, 13);
            case 6:
                return this.spritesheet.get(148, 207, 8, 13);
            case 7:
                return this.spritesheet.get(160, 207, 8, 13);
            case 8:
                return this.spritesheet.get(172, 207, 8, 13);
            case 9:
                return this.spritesheet.get(184, 207, 8, 13);
        }
    }
}