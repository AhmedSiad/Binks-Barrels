class Bink {
    constructor(spritesheet, scaleFactor) {
        this.generalAnimationFrames = [];
        this.throwingAnimationFrames = [];

        this.loadGeneralAnimationFrames(spritesheet);

        for (let i = 0; i < this.generalAnimationFrames.length; i++) {
            this.generalAnimationFrames[i].resize(this.generalAnimationFrames[i].width * scaleFactor, 0);
        }
    }

    loadGeneralAnimationFrames(spritesheet) {
        this.generalAnimationFrames.push(spritesheet.get(7, 12, 32, 41));
        this.generalAnimationFrames.push(spritesheet.get(43, 12, 34, 41));
        this.generalAnimationFrames.push(spritesheet.get(82, 12, 36, 41));
    }
}