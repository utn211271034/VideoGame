class DisparoOvni extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'disparo_ovni')
    }

    disparar(x, y)
    {
        this.body.reset(x, y);
        this.setScale(1);
        this.setActive(true);
        this.setVisible(true);
        this.scene.physics.moveToObject(this, navecita, 300);
    }
}

class GrupoDisparosOvni extends Phaser.Physics.Arcade.Group
{
    constructor(scene)
    {
        super(scene.physics.world, scene);
        this.delay = 1000;
        this.createMultiple({
            frameQuality: 30,
            key: 'disparo_ovni',
            active: false,
            visible: false,
            classType: DisparoOvni
        });
    }

    crearDisparoOvni(x, y)
    {
        const disparoOvni = this.getFirstDead(true);
        if(disparoOvni)
        {
            disparoOvni.disparar(x, y)
        }
    }
}