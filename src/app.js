let SCALE_FACTOR = 5;

let baseSpritesheet;
let marioSpritesheet;
let luigiSpritesheet;
let bink;
let overworld;
let numberManager;

let gameGrid;
function preload() {
    baseSpritesheet = loadImage("sprites/base2.png");
    marioSpritesheet = loadImage("sprites/mario.png");
    luigiSpritesheet = loadImage("sprites/luigi.png");
}

function setup() {
    let cnv = createCanvas(window.innerWidth - 100, window.innerHeight - 100);
    bink = new Bink(baseSpritesheet, SCALE_FACTOR);
    overworld = new Overworld(baseSpritesheet, SCALE_FACTOR, window.innerWidth / 2, window.innerHeight / 2);
    mario = new Mario(marioSpritesheet, baseSpritesheet, SCALE_FACTOR);
    luigi = new Luigi(luigiSpritesheet, baseSpritesheet, SCALE_FACTOR);

    gameGrid = new Grid(baseSpritesheet, SCALE_FACTOR);
    console.log(gameGrid);

    numberManager = new NumberManager(baseSpritesheet, SCALE_FACTOR);

    //frameRate(5);
}

function draw() {
    background(255);
    imageMode(CENTER);
    image(overworld.img, overworld.position.x, overworld.position.y);
    image(overworld.tertiary, overworld.position.x, overworld.position.y);

    image(bink.generalAnimationFrames[Math.floor(frameCount / 5) % 3], overworld.position.x + SCALE_FACTOR * 90, overworld.position.y - 25 * SCALE_FACTOR);

    gameGrid.draw(overworld);
    numberManager.drawScore(gameGrid.score, overworld);
    numberManager.drawScore(gameGrid.highScore, overworld, true);

    imageMode(CENTER);
    image(overworld.secondary, overworld.position.x, overworld.position.y);
    
    luigi.draw(overworld);
    mario.draw(overworld);
    if (overworld.lockInput == false && overworld.lockBarrelInput == false) {
        if (luigi.walkingDown == false && luigi.walkingUp == false && mario.walkingRight == false && mario.walkingLeft == false) {
            if (keyIsDown(LEFT_ARROW)) {
                gameGrid.slideRowLeft(luigi.gridUnit);
            }
            if (keyIsDown(RIGHT_ARROW)) {
                gameGrid.slideRowRight(luigi.gridUnit);
            }
            if (keyIsDown(UP_ARROW)) {
                gameGrid.slideColumnUp(mario.gridUnit);
            }
            if (keyIsDown(DOWN_ARROW)) {
                gameGrid.slideColumnDown(mario.gridUnit);
            }
        }
    }

    if (overworld.lockInput == false) {
        if (luigi.walkingDown == false && luigi.walkingUp == false) {
            if (keyIsDown(83) && luigi.gridUnit < 5) {
                luigi.firstDownAnimationFrame = frameCount;
                luigi.walkingDown = true;
            }
            else if (keyIsDown(87) && luigi.gridUnit > 0) {
                luigi.firstUpAnimationFrame = frameCount;
                luigi.walkingUp = true;
            }
        }

        if (mario.walkingRight == false && mario.walkingLeft == false) {
            if (keyIsDown(68) && mario.gridUnit < 5) {
                mario.firstRightAnimationFrame = frameCount;
                mario.walkingRight = true;
            }
            else if (keyIsDown(65) && mario.gridUnit > 0) {
                mario.firstLeftAnimationFrame = frameCount;
                mario.walkingLeft = true;
            }
        }
    }
}

function keyPressed() {

}