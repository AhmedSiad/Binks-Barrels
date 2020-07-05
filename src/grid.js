class Grid {
    constructor(spritesheet, scaleFactor) {
        this.spritesheet = spritesheet;

        this.grid = [];
        for (let i = 0; i < 6; i++) {
            this.grid[i] = [];
            for (let j = 0; j < 6; j++) {
                this.grid[i][j] = null;
            }
        }

        this.scaleFactor = scaleFactor;
        
        this.rowsToBeFilled = [];
        this.firstRowAnimationFrame;

        this.colsToBeFilled = [];
        this.firstColAnimationFrame;

        this.colorLimit = 2;

        let count = 0;
        while (count < 24) {
            let i = Math.floor(Math.random() * 6);
            let j = Math.floor(Math.random() * 6);
            if (this.grid[i][j] == null) {
                let barrel = new Barrel(spritesheet, i, j, Math.floor(Math.random() * 2), this.scaleFactor);

                barrel.spawned = true;
                barrel.spawnedRow = true;
                barrel.position.x = overworld.position.x + this.scaleFactor * (16 * 6 - 49);
                barrel.position.y = overworld.position.y + this.scaleFactor * (16 * i - 28);
                this.grid[i][j] = barrel;
                count++;
            }
        }

        this.score = 0;
        this.highScore = 0;
    }

    draw(overworld) {
        this.updateColorLimit();

        let rowFramesElapsed = frameCount - this.firstRowAnimationFrame;
        if (rowFramesElapsed > 120 && this.rowsToBeFilled.length > 0) {
            for (let row = 0; row < this.rowsToBeFilled.length; row++) {
                for (let i = 0; i < 6; i++) {
                    let newB = new Barrel(this.spritesheet, this.rowsToBeFilled[row], i, Math.floor(Math.random() * this.colorLimit), this.scaleFactor);
                    newB.spawned = true;
                    newB.spawnedRow = true;
                    newB.position.x = overworld.position.x + this.scaleFactor * (16 * 6 - 49);
                    newB.position.y = overworld.position.y + this.scaleFactor * (16 * this.rowsToBeFilled[row] - 28);
                    this.grid[this.rowsToBeFilled[row]][i] = newB;
                }
            }
            this.rowsToBeFilled = [];
        }
        
        let colsFramesElapsed = frameCount - this.firstColAnimationFrame;
        if (colsFramesElapsed > 120 && this.colsToBeFilled.length > 0) {
            for (let col = 0; col < this.colsToBeFilled.length; col++) {
                for (let i = 0; i < 6; i++) {
                    let newB = new Barrel(this.spritesheet, i, this.colsToBeFilled[col], Math.floor(Math.random() * this.colorLimit), this.scaleFactor);
                    newB.spawned = true;
                    newB.position.x = overworld.position.x + this.scaleFactor * (16 * this.colsToBeFilled[col] - 49);
                    newB.position.y = overworld.position.y + this.scaleFactor * (16 * 6 - 28);
                    this.grid[i][this.colsToBeFilled[col]] = newB;
                }
            }
            this.colsToBeFilled = [];
        }


        for (let i = 0; i < this.grid.length; i++) {
            for (let j = 0; j < this.grid[i].length; j++) {
                if (this.grid[i][j] instanceof Barrel) {
                    this.grid[i][j].draw(overworld);
                } 
            }
        }
    }

    checkRowsCompleted() {
        let indices = [];
        Loop1:
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[i][0] == null) continue Loop1;

            let check = this.grid[i][0].colorValue;
            for (let j = 1; j < this.grid[i].length; j++) {
                if (this.grid[i][j] == null) continue Loop1;
                if (this.grid[i][j].colorValue != check) continue Loop1;
            }
            indices.push(i);
        }

        for (let row = 0; row < indices.length; row++) {
            for (let k = 0; k < this.grid[indices[row]].length; k++) {
                this.grid[indices[row]][k].completed = true;
                this.grid[indices[row]][k].completedRow = true;
            }
            this.rowsToBeFilled.push(indices[row]);
            this.firstRowAnimationFrame = frameCount;
            overworld.lockBarrelInput = true;
        }
        if (indices.length > 0) {
            this.score += Math.pow(4, (indices.length == 1 ? 0 : indices.length / 2));
        }
    }

    checkColumnsCompleted() {
        let indices = [];
        Loop1:
        for (let i = 0; i < this.grid.length; i++) {
            if (this.grid[0][i] == null) continue Loop1;

            let check = this.grid[0][i].colorValue;
            for (let j = 1; j < this.grid[i].length; j++) {
                if (this.grid[j][i] == null) continue Loop1;
                if (this.grid[j][i].colorValue != check) continue Loop1;
            }
            indices.push(i);
        }
        console.log(indices);

        for (let col = 0; col < indices.length; col++) {
            for (let k = 0; k < this.grid[indices[col]].length; k++) {
                this.grid[k][indices[col]].completed = true;
            }
            this.colsToBeFilled.push(indices[col]);
            this.firstColAnimationFrame = frameCount;
            overworld.lockBarrelInput = true;
        }
        if (indices.length > 0) {
            this.score += Math.pow(4, (indices.length == 1 ? 0 : indices.length / 2));
        }
    }

    slideRowLeft(index) {
        let empty = true;
        for (let i = 0; i < this.grid[index].length; i++) {
            if (this.grid[index][i] == null) continue;

            Loop2:
            for (let start = 0; start < i; start++) {
                if (this.grid[index][start] == null) {
                    this.grid[index][start] = this.grid[index][i];
                    this.grid[index][start].newIndexJ = start;
                    this.grid[index][start].animating = true;
                    this.grid[index][start].firstAnimationFrame = frameCount;
                    this.grid[index][i] = null;
                    empty = false;
                    break Loop2;
                }
            }
        }
        if (empty == false) {
            luigi.firstBarrelAnimationFrame = frameCount;
            luigi.barreling = true;
            luigi.barrelingRight = false;
            overworld.lockInput = true;
        }
    }

    slideRowRight(index) {
        let empty = true;
        for (let i = this.grid[index].length - 1; i >= 0; i--) {
            if (this.grid[index][i] == null) continue;

            Loop2:
            for (let start = this.grid[index].length - 1; start > i; start--) {
                if (this.grid[index][start] == null) {
                    this.grid[index][start] = this.grid[index][i];
                    this.grid[index][start].newIndexJ = start;
                    this.grid[index][start].animating = true;
                    this.grid[index][start].firstAnimationFrame = frameCount;
                    this.grid[index][i] = null;
                    empty = false;
                    break Loop2;
                }
            }
        }
        if (empty == false) {
            luigi.firstBarrelAnimationFrame = frameCount;
            luigi.barreling = true;
            luigi.barrelingRight = true;
            overworld.lockInput = true;
        }
    }

    slideColumnUp(index) {
        let empty = true;
        for (let i = 0; i < this.grid[index].length; i++) {
            if (this.grid[i][index] == null) continue;

            Loop2:
            for (let start = 0; start < i; start++) {
                if (this.grid[start][index] == null) {
                    this.grid[start][index] = this.grid[i][index];
                    this.grid[start][index].newIndexI = start;
                    this.grid[start][index].animating = true;
                    this.grid[start][index].firstAnimationFrame = frameCount;
                    this.grid[i][index] = null;
                    empty = false;
                    break Loop2;
                }
            }
        }
        if (empty == false) {
            mario.firstBarrelAnimationFrame = frameCount;
            mario.barreling = true;
            mario.barrelingUp = true;
            overworld.lockInput = true;
        }
    }

    slideColumnDown(index) {
        let empty = true;
        for (let i = this.grid[index].length - 1; i >= 0; i--) {
            if (this.grid[i][index] == null) continue;

            Loop2:
            for (let start = this.grid[index].length - 1; start > i; start--) {
                if (this.grid[start][index] == null) {
                    this.grid[start][index] = this.grid[i][index];
                    this.grid[start][index].newIndexI = start;
                    this.grid[start][index].animating = true;
                    this.grid[start][index].firstAnimationFrame = frameCount;
                    this.grid[i][index] = null;
                    empty = false;
                    break Loop2;
                }
            }
        }
        if (empty == false) {
            mario.firstBarrelAnimationFrame = frameCount;
            mario.barreling = true;
            mario.barrelingUp = false;
            overworld.lockInput = true;
        }
    }

    updateColorLimit() {
        if (this.score >= 10) {
            this.colorLimit = 3;
        }
        if (this.score >= 70) {
            this.colorLimit = 4;
        }
        if (this.score >= 100) {
            this.colorLimit = 5;
        }
    }

    removeBarrel(i, j) {
        this.grid[i][j] = null;
    }
}