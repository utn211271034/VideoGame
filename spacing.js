const ANCHO = 960;
const ALTO  = 540;
let velocidadFondo = 1;
let velocidadOvni = 5;
let puntos = 0;
let vidas = 3;
let estoyVivo = true;
let navecita;
let cursores;
let grupoOvnis;
let grupoDisparos;
let grupoDisparosOvni;
let sonidoDisparo;
let sonidoExplosion;
let sonidoFondo;
let sonidoGameOver;
let temporizadorOvnis;
let textoPuntaje = null;
let deltaOvni = 1500;
let deltaDisparo = 500;
let ultimoDisparo = 0;

class Spacing extends Phaser.Scene
{
        constructor()
        {
                super('Spacing');
        }

        preload()
        {
                this.load.setBaseURL('https://www.antonio.com.mx');
                this.load.image('fondo_espacio', 'imagenes/fondo_espacio.jpg'); 
                this.load.image('fondo_estrellitas', 'imagenes/estrellitas.png');
                this.load.image('navecita', 'imagenes/destructor.png'); 
                this.load.image('disparo', 'imagenes/disparo.png');
                this.load.image('ovni', 'imagenes/ovni_negro.png');
                this.load.image('disparo_ovni', 'imagenes/disparo_ovni.png');
                //sonidos:
                this.load.audio('sonido_disparo', 'sonidos/disparo.wav');  
                this.load.audio('sonido_explosion', 'sonidos/impacto.wav');
                this.load.audio('sonido_fondo', 'sonidos/fondo.wav');
                this.load.audio('sonido_gameover', 'sonidos/game_over.wav');  
        }

        create()
        {
                this.crearFondos();
                this.crearNave();
                this.crearOvni();
                this.chismosos();
                this.colisiones();
                this.textoPuntaje = this.add.text((ANCHO/2)-50, 10, 'Puntos\n0', { fontFamily: 'Arial', fontSize: '24px', fill: '#FFFFFF', align: 'center' }); 
        }
                

        update(tiempo, delta)
        {
                this.fondo.tilePositionX += velocidadFondo;
                this.fondo_estrellitas.tilePositionX += (velocidadFondo*2);
                this.inputKeys.forEach(key => {
                        if(Phaser.Input.Keyboard.JustDown(key) && (tiempo > ultimoDisparo) && estoyVivo) {
                                grupoDisparos.crearDisparo(navecita.x+30, navecita.y);
                                sonidoDisparo.play();
                                ultimoDisparo = tiempo + deltaDisparo;
                        }
                });
                temporizadorOvnis += delta;
                this.crearOleada(tiempo, delta);
        }

        crearFondos()
        {
                this.fondo = this.add.tileSprite(0, 0, ANCHO, ALTO, 'fondo_espacio')
                .setOrigin(0)
                .setScrollFactor(0, 1);
                this.fondo_estrellitas = this.add.tileSprite(0, 0, ANCHO, ALTO, 'fondo_estrellitas')
                .setOrigin(0)
                .setScrollFactor(0, 1);
                this.fondo.displayWidth = this.sys.canvas.width;
                sonidoFondo = this.sound.add('sonido_fondo', {volumen:1, loop:true} );
                sonidoGameOver = this.sound.add('sonido_gameover', {volumen:1, loop:false} );
                sonidoFondo.play();
        }

        crearNave()
        {
                cursores = this.input.keyboard.createCursorKeys();
                navecita = new Navecita(this, 60, ALTO/2).setScale(0.2);
                grupoDisparos = new GrupoDisparos(this); //, {maxSize: 10}
                sonidoDisparo = this.sound.add('sonido_disparo', {volumen:1, loop:false} );
        }

        crearOvni()
        {
                temporizadorOvnis = 0;
                grupoOvnis = this.physics.add.group({maxSize: 10});
                grupoDisparosOvni = new GrupoDisparosOvni(this); //, {maxSize: 10}
                sonidoExplosion = this.sound.add('sonido_explosion', {volumen:1, loop:false} );
        }

        crearOleada(tiempo, delta)
        {
                while( (temporizadorOvnis > deltaOvni) && estoyVivo) {
                        temporizadorOvnis -= deltaOvni;
                        let y = Math.floor(Math.random() * ALTO);
                        let ovni = new Ovni(this, ANCHO+60, y).setScale(1.2);
                        grupoOvnis.add(ovni);
                        if(estoyVivo) {
                                puntos++;
                        }
                        this.textoPuntaje.setText('Puntos\n' + puntos);
                }
        }
    
        chismosos()
        {
                this.inputKeys = [
                        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
                        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
                ];
        }

        colisiones()
        {
                // Mi Disparo VS Los Ovnis:
                this.physics.add.collider(grupoOvnis, grupoDisparos, function(ovnicito, disparito){
                        if(ovnicito.body.touching && disparito.body.touching) {
                                // Le di al ovni:
                                ovnicito.removeInteractive();
                                ovnicito.removedFromScene();
                                ovnicito.destroy();
                                disparito.removeInteractive();
                                disparito.removedFromScene();
                                disparito.destroy();
                                sonidoExplosion.play();
                                puntos += 100;
                        }
                });
                // los disparos del Ovni VS Navecita
                this.physics.add.collider(navecita, grupoDisparosOvni, function(miNave, disparito){
                        if(miNave.body.touching && disparito.body.touching) {
                                // Me dieron:
                                vidas--;
                                disparito.removeInteractive();
                                disparito.removedFromScene();
                                disparito.destroy();
                                sonidoExplosion.play();
                                console.log('Vidas: ' + vidas);
                                terminar();
                        }
                });
                // Los Ovnis VS Navecita
                this.physics.add.collider(navecita, grupoOvnis, function(miNave, ovnicito){
                        if(miNave.body.touching && ovnicito.body.touching) {
                                // Me dieron:
                                vidas--;
                                ovnicito.removeInteractive();
                                ovnicito.removedFromScene();
                                ovnicito.destroy();
                                sonidoExplosion.play();
                                console.log('Vidas: ' + vidas);
                                terminar();
                        }
                });
                function terminar() {
                        if(vidas < 0){
                                navecita.removeInteractive();
                                navecita.removedFromScene();
                                navecita.destroy();
                                sonidoFondo.stop();
                                sonidoGameOver.play();
                                estoyVivo = false;
                                //
                                juego.scene.remove('Spacing');
                                juego.scene.start('GameOver');
                        }
                }
        }

}

const configuracion =
{
        type: Phaser.AUTO,
        width: ANCHO,
        height: ALTO,
        backgroundColor: '#000000',
        pixelArt: true,
        physics: {
                default: 'arcade',
                arcade: {
                        debug: false
                }
        },
        scene: [Spacing, GameOver]
};

const juego = new Phaser.Game(configuracion);
