class Ovni extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'ovni');
        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.setInteractive();
    }

    preUpdate ()
    {
        this.update();
    }

    update(time, delta)
    {
        this.x -= velocidadOvni;
        if(this.x == ANCHO-50 || this.x == ANCHO-150) {
            grupoDisparosOvni.crearDisparoOvni(this.x, this.y);
        }
        if(this.x < (-50)) {
            this.removeInteractive();
            this.removedFromScene();
            this.destroy();
            puntos -= 100; // Se te fue vivo, papu...!
        }
    }
}