import ObjetGraphique from "./ObjetGraphique.js";

export default class Cat extends ObjetGraphique {


    constructor(x, y, l, h, sprite) {
        // on appelle le constructeur de la classe mère
        // pour initialiser les propriétés héritées
        super(x, y, l, h, 'black');
        this.sprite = sprite;
        // on initialise les propriétés propres à la classe Joueur
        this.vx = 0;
        this.vy = 0;
        this.ay = 0.1;
    }
    // on redefinit la méthode héritée draw(ctx)
    draw(ctx) {

        // bonne pratique : si on change le contexte (position du repère, couleur, ombre, etc.)
        // on sauvegarde le contexte avant de le modifier et
        // on le restaure à la fin de la fonction

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.sprite, 0, 0, this.l, this.h); 
        ctx.restore();
    }


    move(joueurPos) {
    // let dx = this.x - joueurPos.x;
    // let dy = this.y - joueurPos.y;
    // this.angle = Math.atan2(dy, dx);
    
    // if (distance(this.x, this.y, joueurPos.x, joueurPos.y) >= 10) {
    //     this.x -= this.v * Math.cos(this.angle);
    //     this.y -= this.v * Math.sin(this.angle);
    // }

    this.x += this.vx;
    this.y += this.vy;
  }


    testeCollisionAvecBordsDuCanvas(largeurCanvas, hauteurCanvas) {
        if (this.x + this.l > largeurCanvas) {
            // On positionne le joueur à la limite du canvas, au point de contact
            this.x = largeurCanvas - this.l;
            this.vitesse = -this.vitesse;
        }
        if (this.x < 0) {
            // On positionne le joueur à la limite du canvas, au point de contact
            this.x = 0;
            this.vitesse = -this.vitesse;
        }

        if (this.x + this.l > hauteurCanvas) {
            // On positionne le joueur à la limite du canvas, au point de contact
            this.y = hauteurCanvas - this.l;
            this.vitesse = -this.vitesse;
        }
        if (this.x < 0) {
            // On positionne le joueur à la limite du canvas, au point de contact
            this.y = 0;
            this.vitesse = -this.vitesse;
        }
    }
}