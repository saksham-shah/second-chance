let sounds = {};
let filter;
let filterToggle = true;

function setFilter(bool) {
    if (filterToggle == bool) return;
    filter.toggle();
    filterToggle = !filterToggle;
}
const soundsToLoad = [
    {
        name: 'music',
        file: 'secondchance.wav'
    }, {
        name: 'click',
        file: 'buttonclick.wav'
    }, {
        name: 'hover',
        file: 'buttonhover.mp3'
    }, {
        name: 'playershoot',
        file: 'playershoot.wav'
    }, {
        name: 'enemyshoot',
        file: 'enemyshoot.wav'
    }, {
        name: 'rewind',
        file: 'rewind.wav'
    }, {
        name: 'gameover',
        file: 'gameover.wav'
    }, {
        name: 'enemydeath',
        file: 'enemydeath.wav'
    }, {
        name: 'enemyspawn',
        file: 'enemyspawn.wav'
    }, {
        name: 'shootyrage',
        file: 'shootyrage.wav'
    }, {
        name: 'bulletreverse',
        file: 'bulletreverse.wav'
    },
];

const volumes = {
    music: 0.7,
    hover: 2,
    playershoot: 0.5,
    gameover: 2,
    enemyspawn: 0.5,
    bulletreverse: 0.3
}

const fontToLoad = '/assets/ShareTechMono-Regular.ttf';
let font = null;

let soundsLoaded = 0;

function addLoadScreen() {
    let loading = false;

    // Loads all sounds and the font
    function loadAssets() {
        loading = true;
        for (let soundToLoad of soundsToLoad) {
            loadSound('/assets/' + soundToLoad.file, soundLoaded);

            function soundLoaded(sound) {
                // Set the volume of the sound
                let vol = volumes[soundToLoad.name];
                if (vol == undefined) vol = 1;
                sound.setVolume(vol);
                if (soundToLoad.name == 'music') {

                    // Create the low pass filter to dampen/muffle music when not playing
                    filter = new p5.LowPass();
                    filter.freq(600);
                    sound.disconnect();
                    sound.connect(filter);
                }

                sound.setVolume(vol);
                sounds[soundToLoad.name] = sound;
                soundsLoaded++;
            }
        }

        loadFont(fontToLoad, fontLoaded);

        function fontLoaded(loadedFont) {
            setFont(loadedFont);
            font = loadedFont;
        }
    }

    addScreen('loading', {
        update: () => {
            if (!loading) {
                if (!font) {
                    loadAssets();
                } else {
                    // Go to the main menu
                    setScreen('menu');
                    // Start the music
                    sounds.music.loop();

                    setInterval(() => {
                        titleColour = (titleColour + 1) % titleColours.length;
                    }, 500);
                }
                
            } else {
                // Once all the assets have loaded
                if ((soundsLoaded == soundsToLoad.length) && font) {
                    loading = false;

                    // Add sounds to p5ui (for UI clicks and hovers)
                    setSounds({
                        click: sounds.click,
                        hover: sounds.hover
                    });
                }
            }
        },
        getCursorState: state => {
            if (loading) return 'wait';
        },
        // changeScreen: leaving => {
        //   if (!leaving && musicPlaying) {
        //     musicPlaying = false;
        //     sounds.music.stop();
        //   }
        // },
        draw: () => {
            if (loading) {
                noStroke();
                fill(255);
        
                // Three circles growing and shrinking
                let numCircles = 2, r = 30, gap = 100;
                for (let i = -numCircles; i <= numCircles; i++) {
                    let size = 0.5 * (Math.sin(frameCount / 20 + i * Math.PI / (numCircles * 2 + 1)) + 1)
                    ellipse(800 - i * gap, 450, 2 * r * size);
                }
            }
        }
    });
}

// screens.push(addLoadScreen);