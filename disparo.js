class Disparo extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'disparo')
    }

    disparar(x, y)
    {
        this.body.reset(x, y);
        this.setScale(0.4);
        this.setActive(true);
        this.setVisible(true);
        this.setVelocityX(400);
    }
}

class GrupoDisparos extends Phaser.Physics.Arcade.Group
{
    constructor(scene)
    {
        super(scene.physics.world, scene);
        this.delay = 1000;
        this.createMultiple({
            frameQuality: 30,
            key: 'disparo',
            active: false,
            visible: false,
            classType: Disparo
        });
    }

    crearDisparo(x, y)
    {
        const disparo = this.getFirstDead(true);
        if(disparo)
        {
            disparo.disparar(x, y)
        }
    }
}