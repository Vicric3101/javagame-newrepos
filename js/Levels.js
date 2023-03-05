import Sortie from "./Sortie.js";
import Key from "./Key.js";
import Door from "./door.js";
import ObstacleAnimeClignotant from "./ObstacleAnimeClignotant.js";
import ObstacleAnime from "./ObstacleAnime.js";
import Obstacle from "./ObstacleClass.js";
import ObstacleTexture from "./ObstacleTexture.js";
import Cat from "./cat.js";

let tabNiveaux = [];

let exitImage = new Image();
let keyImage = new Image();
let doorImage = new Image();
let catImage = new Image();

exitImage.src = '../assets/images/cheese.png';
keyImage.src = '../assets/images/key.png';
doorImage.src = '../assets/images/lockeddoor.png';
catImage.src = '../assets/images/niancat.png'



let sortieLevel1 = new Sortie(1300, 450, 65, 50, exitImage);

let level1 = {
    objetsGraphiques: [
        sortieLevel1,
        new ObstacleTexture(230,0,50,400,'../assets/images/treatedstone150x150.jpg'),
        new ObstacleTexture(230,375,900,50,'../assets/images/treatedstone150x150.jpg'),

        new ObstacleTexture(230,550,50,350,'../assets/images/treatedstone150x150.jpg'),
        new ObstacleTexture(230,550,900,50,'../assets/images/treatedstone150x150.jpg')
    ],
    temps: 60,
    sortie : sortieLevel1,
    titre : "Niveau 1",
    background: "patternwood",
}

tabNiveaux.push(level1);


let sortieLevel2 = new Sortie(1500, 200, 65, 50, exitImage);
let keylevel2 = new Key (900, 350, 150, 150, keyImage);
let doorlevel2 = new Door (1100, 600, 50, 100, doorImage);

let level2 = {
    objetsGraphiques: [
        sortieLevel2,
        
        new ObstacleTexture(230,0,50,400,'../assets/images/treatedstone150x150.jpg'),//|
        new ObstacleTexture(230,0,50,400,'../assets/images/treatedstone150x150.jpg'),//|

        new ObstacleTexture(400,0,50,300,'../assets/images/treatedstone150x150.jpg'), //|
        new ObstacleTexture(400,300,600,50,'../assets/images/treatedstone150x150.jpg'), //-
        new ObstacleTexture(1000,300,50,200,'../assets/images/treatedstone150x150.jpg'), //|
        new ObstacleTexture(550,450,450,50,'../assets/images/treatedstone150x150.jpg'), //-
        new ObstacleTexture(550,500,50,100,'../assets/images/treatedstone150x150.jpg'), //|
        new ObstacleTexture(550,550,600,50,'../assets/images/treatedstone150x150.jpg'), //-

        new ObstacleTexture(230,600,50,300,'../assets/images/treatedstone150x150.jpg'),//|
        new ObstacleTexture(230,600,150,50,'../assets/images/treatedstone150x150.jpg'),//-
        new ObstacleTexture(380,600,50,300,'../assets/images/treatedstone150x150.jpg'),//|

        new ObstacleTexture(1100,700,50,300,'../assets/images/treatedstone150x150.jpg'),//|
        keylevel2,
        doorlevel2,
        
    ],
    sortie: sortieLevel2,
    key : keylevel2,
    door : doorlevel2,
    titre : "Niveau 2",
    background: "patternwood",
}
tabNiveaux.push(level2);

let sortieLevel3 = new Sortie(1300, 450, 65, 50, exitImage);
let catLevel3 = new Cat(1000, 450, 200, 150, catImage)

let level3 = {
    objetsGraphiques: [
        sortieLevel1,
        catLevel3
    ],
    sortie : sortieLevel3,
    ennemi : catLevel3,
    titre : "Niveau 3",
    background: "patternwood",
}

tabNiveaux.push(level3);

export { tabNiveaux }