class Navecita extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y)
    {
        super(scene, x, y, 'navecita');
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
        this.setVelocity(0, 0);
        this.setBounce(1, 1);
        this.setCollideWorldBounds(true);
        if (cursores.left.isDown)
        {
            this.setVelocityX(-300);
        }
        else if (cursores.right.isDown)
        {
            this.setVelocityX(300);
        }

        if (cursores.up.isDown)
        {
            this.setVelocityY(-300);
        }
        else if (cursores.down.isDown)
        {
            this.setVelocityY(300);
        }
    }
}