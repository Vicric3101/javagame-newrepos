import ObjetGraphique from "./ObjetGraphique.js";

export default class Joueur extends ObjetGraphique {


    constructor(x, y, l, h, sprite) {
        // on appelle le constructeur de la classe mère
        // pour initialiser les propriétés héritées
        super(x, y, l, h, 'black');
        this.sprite = sprite;
        // on initialise les propriétés propres à la classe Joueur
        this.vx = 0;
        this.vy = 0;
        this.vysaut = 5;
        this.ay = 0.1;
        this.etat = "deplacementNormal";
    }
    // on redefinit la méthode héritée draw(ctx)
    draw(ctx) {

        // bonne pratique : si on change le contexte (position du repère, couleur, ombre, etc.)
        // on sauvegarde le contexte avant de le modifier et
        // on le restaure à la fin de la fonction
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.drawImage(this.sprite, 0, 0, 65, 50);


        ctx.restore();
    }
    dessineCorps(ctx) {
        ctx.save();
        ctx.translate(0, 50);
        ctx.fillStyle = 'blue';
        ctx.fillRect(12, 0, 25, 30);
        ctx.restore();
    }
    move() {
        switch (this.etat) {
            case "sautEnCours":
                this.hauteurSaut += this.vysaut;
                this.y -= this.vysaut;
                this.vysaut -= this.ay;

                if (this.y > this.yAvantSaut) {
                    this.etat = 'deplacementNormal';
                    // Fin du saut on remet les valeurs initiales
                    this.y = this.yAvantSaut;
                    this.vysaut = 5;
                    this.ay = 0.1;
                }

                break;

            case "deplacementNormal":
                this.x += this.vx;
                this.y += this.vy;
                break
        }
    }

    saute() {
        if (this.etat !== 'sautEnCours') {
            this.yAvantSaut = this.y;
            this.hauteurSaut = 0;
            this.y = this.yAvantSaut;
            this.vysaut = 5;
            this.ay = 0.1;
            this.etat = 'sautEnCours';
        }
    }

    followMouse(mousePos) {
        this.x = mousePos.x - this.l / 2;
        this.y = mousePos.y - this.h / 2;
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

        if (this.y + this.l > hauteurCanvas) {
            // On positionne le joueur à la limite du canvas, au point de contact
            this.y = hauteurCanvas - this.l;
            this.vitesse = -this.vitesse;
        }
        if (this.y < 0) {
            // On positionne le joueur à la limite du canvas, au point de contact
            this.y = 0;
            this.vitesse = -this.vitesse;
        }
    }
}