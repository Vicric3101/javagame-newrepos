import Joueur from './JoueurClasse.js';
import Obstacle from './ObstacleClass.js';
import ObstacleAnime from './ObstacleAnime.js';
import ObstacleAnimeClignotant from './ObstacleAnimeClignotant.js';
import ObstacleTexture from './ObstacleTexture.js';
import { ajouteEcouteurSouris, ajouteEcouteursClavier, inputState, mousePos } from './ecouteurs.js';
import { circRectsOverlap, rectsOverlap, rectsOverlapWithDirection} from './collisions.js';
import { loadAssets } from './assets.js';
import Sortie from './Sortie.js';

import { tabNiveaux } from './Levels.js';
import Key from './Key.js';
import ObjetGraphique from './ObjetGraphique.js';
import Cat from './cat.js';
import { getPlayerPos } from './utils.js'


let canvas, ctx;
let gameState = 'menuStart';
let joueur, sortie, clef, porte, ennemi, vitesseJoueur = 20;
let niveau = 0;
let tableauDesObjetsGraphiques = [];
let assets;
// Variables pour le chronomètre
let debutChrono; // Temps auquel le chronomètre démarre
let tempsEcoule = 0; // Temps écoulé depuis le début du jeu
let etatChrono = false;

var playerpos = { x: 0, y: 0 };



var assetsToLoadURLs = {
    patternwood: { url: '../assets/images/wood200x200.jpg', pattern: true },
    joueur: { url: '../assets/images/mouse.png' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
    bgn1: { url: '../assets/images/bgn1.jpg' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
    bgn2: { url: '../assets/images/bgn2.jpg' },
    //backgroundImage: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/images/background.png' }, // http://www.clipartlord.com/category/weather-clip-art/winter-clip-art/
    //logo1: { url: "https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/images/SkywardWithoutBalls.png" },
    //logo2: { url: "https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/images/BoundsWithoutBalls.png" },
    //bell: { url: "https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/images/bells.png" },
    //spriteSheetBunny: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/images/bunnySpriteSheet.png' },
    plop: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/plop.mp3', buffer: false, loop: false, volume: 1.0 },
    victory: { url: '../assets/audio/victory.wav', buffer: false, loop: false, volume: 1.0 },
    humbug: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/humbug.mp3', buffer: true, loop: true, volume: 0.5 },
    concertino: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/christmas_concertino.mp3', buffer: true, loop: true, volume: 1.0 },
    xmas: { url: 'https://mainline.i3s.unice.fr/mooc/SkywardBound/assets/sounds/xmas.mp3', buffer: true, loop: true, volume: 0.6 },
    backinblack: { url: '../assets/audio/backinblack.m4a', buffer: true, loop: true, volume: 0.5 },
    opendoor: { url: '../assets/audio/opendoor.wav', buffer: false, loop: false, volume: 1.0 },
    ding: { url: '../assets/audio/ding.wav', buffer: false, loop: false, volume: 1.0 },
    success: { url: '../assets/audio/sucess.wav', buffer: false, loop: false, volume: 1.0 },
};
// Bonne pratique : on attend que la page soit chargée
// avant de faire quoi que ce soit
window.onload = init;

function init(event) {

    console.log("Page chargée et les éléments HTML sont prêts à être manipulés");
    canvas = document.querySelector('#myCanvas');
    //console.log(canvas);
    // pour dessiner, on utilise le contexte 2D
    ctx = canvas.getContext('2d');

    // On définit les écouteurs sur les input HTML
    let champVitesse = document.querySelector("#inputVitesse");
    champVitesse.oninput = (event) => {
        setVitesseJoueur(champVitesse.value);
        // et on met à jour le span
        document.querySelector("#vitesseSpan").innerHTML = champVitesse.value;
    }

    // chargement des assets (musique,  images, sons)
    loadAssets(assetsToLoadURLs, startGame);
}
function startGame(assetsLoaded) {
    assets = assetsLoaded;

    // appelée quand tous les assets sont chargés
    console.log("StartGame : tous les assets sont chargés");
    //assets.backinblack.play();

    // On va prendre en compte le clavier
    ajouteEcouteursClavier();
    ajouteEcouteurSouris();

    demarreNiveau(niveau);

    requestAnimationFrame(animationLoop);
}
function setVitesseJoueur(vitesse) {
    vitesseJoueur = vitesse;
}
function demarreNiveau(niveau) {

    if (niveau > tabNiveaux.length - 1) {
        console.log("PLUS DE NIVEAUX !!!!!");
        niveau--;
        gameState = 'endGame';
        return;
    }
    // sinon on passe au niveau suivant

    // On initialise les objets graphiques qu'on va utiliser pour le niveau
    // courant avec les objets graphiques dans tabNiveaux[niveau]   
    tableauDesObjetsGraphiques = [...tabNiveaux[niveau].objetsGraphiques];
    // On crée le joueur   
    joueur = new Joueur(100, 450, 65, 50, assets.joueur);
    sortie = tabNiveaux[niveau].sortie;
    clef = tabNiveaux[niveau].key;
    porte = tabNiveaux[niveau].door;
    ennemi = tabNiveaux[niveau].ennemi;
    // et on l'ajoute au tableau des objets graphiques
    tableauDesObjetsGraphiques.push(joueur);

    // on démarre la musique du niveau
    let nomMusique = tabNiveaux[niveau].musique;
    //assets[nomMusique].play();
}
function animationLoop() {
    // On va exécuter cette fonction 60 fois par seconde
    // pour créer l'illusion d'un mouvement fluide
    // 1 - On efface le contenu du canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    switch (gameState) {
        case 'menuStart':
            afficheMenuStart(ctx);
            break;
        case 'ecranDebutNiveau':
            afficheEcranDebutNiveau(ctx);
            break;
        case 'jeuEnCours':

            let backgroundImageName = tabNiveaux[niveau].background;
            let imgBackGround = assets[backgroundImageName];
            let pattern = ctx.createPattern(imgBackGround, 'repeat');

            ctx.save();
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.restore();

            tableauDesObjetsGraphiques.forEach(o => {
                o.draw(ctx);
            });

            // 3 - on déplace les objets
            testeEtatClavierPourJoueur();

            joueur.move();
            joueur.testeCollisionAvecBordsDuCanvas(canvas.width, canvas.height);
            detecteCollisionJoueurAvecObstacles();
            detecteCollisionJoueurAvecSortie();

            // Gestion de la présence d'une clé ou pas dans le niveau
            if (contientClef(tabNiveaux[niveau])) 
            {
                // Boucle sur tous les éléments du tableau d'éléments
                detecter_collision_avec_clef(joueur, clef, porte);
            }

            // Gestion de la présence d'une clé ou pas dans le niveau
            if (contientChat(tabNiveaux[niveau])) 
            {
                // Boucle sur tous les éléments du tableau d'éléments
                suivreJoueur(ennemi, joueur);
                ennemi.move(joueur)
                detecter_collision_avec_ennemi(joueur, ennemi);
            }

            //Gestion du chrono
            // Appeler la fonction toutes les secondes
            if (etatChrono == false)
            {
                debutChrono = Date.now()
                etatChrono = true;
            }
            mettreAJourChrono();

            break;

            case 'endGame':
                afficheFinDeJeu(ctx);
                break;

            case 'gameOver':
                ecranGameOver();

            break;


    }

    // 4 - On rappelle la fonction d'animation
    requestAnimationFrame(animationLoop);
}
// Fonction pour mettre à jour le chronomètre
function mettreAJourChrono() {
    tempsEcoule = Math.floor((Date.now() - debutChrono) / 1000); // Temps en secondes
    // Afficher le temps écoulé dans le canvas
    ctx.font = "24px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Temps écoulé : " + tempsEcoule + " s", 10, 30);
    //console.log("chrono mis à jour : " + tempsEcoule)
}
function contientClef(tabNiveau) {

//Pas réussio à faire fonctionner mais propre

    // for (const element in tabNiveau) {
    //     console.log("pssage dans la boucle");
    //     if (element == Key) {
    //         console.log("Il ya une clé");
    //             return true;
    //         }
    //     else {
    //         console.log("Pas de clé");
    //     return false;
    //     }
    //   }


//Marche mais vraiment pourri (detecte quel niveau est entré auy lieu de la présence d'une clé)

    if (niveau == 1) {
        return true;
      }
      else{
        return false;
      }
     


}
function contientChat(tabNiveau) {

    //Pas réussio à faire fonctionner mais propre
    
        // for (const element in tabNiveau) {
        //     console.log("pssage dans la boucle");
        //     if (element == Cat) {
        //         console.log("Il ya un chat");
        //             return true;
        //         }
        //     else {
        //         console.log("Pas de chat");
        //     return false;
        //     }
        //   }
    
    
    //Marche mais vraiment pourri (detecte quel niveau est entré auy lieu de la présence d'une clé)
    
        if (niveau == 2) {
            return true;
          }
          else{
            return false;
          }
         
    
    
}
function afficheEcranDebutNiveau(ctx) {
    ctx.save();
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "40px Arial";
    ctx.fillText("Bienvenue au niveau " + niveau, 190, 100);
    ctx.restore();
}
function afficheFinDeJeu(ctx) {
    ctx.save();
    let pattern = ctx.createPattern(assets.patternwood, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "60px Arial";
    ctx.fillText("Félicitations ! Vous avez terminé le jeu en " + tempsEcoule + " s", 190, 100);
    ctx.strokeText("Félicitations ! Vous avez terminé le jeu en " + tempsEcoule + " s", 190, 100);
    ctx.restore();
}
function afficheMenuStart(ctx) {

    ctx.save()
    let pattern = ctx.createPattern(assets.patternwood, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "130px Arial";
    ctx.fillText("Press space to start", 190, 100);
    ctx.strokeText("Press space to start", 190, 100);
    if (inputState.space) {
        gameState = 'jeuEnCours';
    }
    ctx.restore();
}
function testeEtatClavierPourJoueur() {
    if (inputState.space) {
        // on saute
        //joueur.saute();
    } else {
        joueur.vx = 0;
        if (inputState.left) {
            joueur.vx = -vitesseJoueur;
        } else {
            if (inputState.right) joueur.vx = vitesseJoueur;
        }
        joueur.vy = 0;
        if (inputState.up) {
            joueur.vy = -vitesseJoueur;
        } else {
            if (inputState.down) joueur.vy = vitesseJoueur ;
        }
    }
}
function detecteCollisionJoueurAvecObstacles() {
    // On va tester si le joueur est en collision avec un des obstacles
    tableauDesObjetsGraphiques.forEach(o => {


         if (o instanceof Obstacle) {
            if (rectsOverlapWithDirection(joueur.x, joueur.y, joueur.l, joueur.h, o.x, o.y, o.l, o.h) == "top") {
                assets.plop.play();
                joueur.y += 25;
                console.log("collision top");
            }
            if (rectsOverlapWithDirection(joueur.x, joueur.y, joueur.l, joueur.h, o.x, o.y, o.l, o.h) == "bottom") {
                assets.plop.play();
                joueur.y -= 25;
                console.log("collision bottom");
            }
            if (rectsOverlapWithDirection(joueur.x, joueur.y, joueur.l, joueur.h, o.x, o.y, o.l, o.h) == "left") {
                assets.plop.play();
                joueur.x += 25;
                console.log("collision left");
            }
            if (rectsOverlapWithDirection(joueur.x, joueur.y, joueur.l, joueur.h, o.x, o.y, o.l, o.h) == "right") {
                assets.plop.play();
                joueur.x -= 25;
                console.log("collision right");
            }

        }
    }
    );
}
function detecteCollisionJoueurAvecSortie() {
    // joueur.drawBoundingBox(ctx);
    //sortie.drawBoundingBox(ctx);
    if (rectsOverlap(joueur.x, joueur.y, joueur.l, joueur.h, sortie.x, sortie.y, sortie.l, sortie.h)) {
        joueur.x = 10;
        joueur.y = 10;
        //gameState = 'ecranDebutNiveau';
        niveauSuivant();
        sortie.couleur = 'lightgreen';
        assets.ding.play();
    }
}
function detecter_collision_avec_clef(joueur, clef, porte) {
    if (rectsOverlap(joueur.x, joueur.y, joueur.l, joueur.h, clef.x, clef.y, clef.l, clef.h)) {

        clef.disparaitre(); // Fait disparaître la clef
        porte.disparaitre(); // Fait disparaître la porte
        assets.opendoor.play();
    }
}
function suivreJoueur(ennemi, joueur) {
    const vitesse = 2; // ajuster la vitesse de l'ennemi en fonction de la difficulté du jeu
    const dx = joueur.x - ennemi.x;
    const dy = joueur.y - ennemi.y;
    const angle = Math.atan2(dy, dx);
    ennemi.vx = Math.cos(angle) * vitesse;
    ennemi.vy = Math.sin(angle) * vitesse;
    console.log('Ennemi déplacé');
  }
function detecter_collision_avec_ennemi(joueur, ennemi) {
    if (rectsOverlap(joueur.x, joueur.y, joueur.l, joueur.h, ennemi.x, ennemi.y, ennemi.l, ennemi.h)) {
        niveau = 0;
        gameState = 'gameOver';
    }
}
function niveauSuivant() {
    // Passe au niveau suivant....
    // todo.....
    console.log("Niveau suivant !");
    // on arre^te la musique du niveau courant
    let nomMusique = tabNiveaux[niveau].musique;
    //assets[nomMusique].stop();
    // et on passe au niveau suivant
    niveau++;
    demarreNiveau(niveau);
}
function ecranGameOver(ctx){
    ctx.save()
    let pattern = ctx.createPattern(assets.patternwood, 'repeat');
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = "130px Arial";
    //ctx.fillText("Press space to start", 190, 100);
    ctx.strokeText("Gem Over !", 190, 100);
    ctx.restore();
}