let bandWidth = 32;
let song;
let spectrum = [bandWidth];
let textSong = [bandWidth];
let fontSizes = [bandWidth];

let minFontSize = 15;
let maxFontSize = 200;

let spacing = 2;
let tracking = 0;
let font;

let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function preload()
{
    song = loadSound('media/Presudeos.mp3');
}

function setup()
{
    createCanvas(960,540);
    background(20);
    font = 'Arial';
    song.play();
    fft = new p5.FFT(0.8, bandWidth);
    // Populates the fontSizes[] and textSong[] with random integers and strings
    for(let i = 0; i < bandWidth; i++)
    {
        fontSizes[i] = floor(random(minFontSize, maxFontSize));
        textSong[i] = characters.charAt(Math.floor(random(0, characters.length)));
    }
}

function draw()
{
    spectrum = fft.analyze(bandWidth);

    noStroke();
    background(20);
    fill(255);
    
    for (let i = 0; i< spectrum.length; i++){
        fontSize = fontSizes[i];
        textFont(font, fontSize);
        let letter = textSong[i];
        let x = map(i, 0, spectrum.length, 0, width);
        let h = -height + map(spectrum[i], 0, 255, 0, height);
        text(letter, x, -h);
        print(fontSizes.length + ' ' + textSong.length);
    }

}

function mousePressed() {
    if (song.isPlaying()) {
      // .isPlaying() returns a boolean
      song.stop();
      background(255);
    } else {
      song.play();
      background(20);
    }
}

function keyPressed()
{
   
}