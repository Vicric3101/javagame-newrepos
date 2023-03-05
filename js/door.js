import Obstacle from "./ObstacleClass.js";

export default class Door extends Obstacle {
    constructor(x, y, l, h, image) {
        super(x, y, l, h, "yellow");
        this.image = image;
        this.l = l;
        this.h = h;
    }

    draw(ctx) {
   ctx.save();
    ctx.translate(this.x, this.y);
    if (!this.isUnlocked) { // vérifier si la porte est déverrouillée
      ctx.drawImage(this.image, 0, 0, this.l, this.h); 
    }
    ctx.restore();
    }


    drawBoundingBox(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        // voir mooc html5 coding essentials and best practices
        // module 3 sur graphics
        ctx.beginPath();
        ctx.strokeRect(0,0, this.l, this.h);
        ctx.strokeStyle="red    ";
        ctx.lineWidth=2;
        ctx.stroke();
        ctx.restore();
    }
}
