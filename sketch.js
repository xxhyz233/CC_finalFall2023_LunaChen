let milliSec;
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
//* Change char to array of poems
let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

let cut1 = 0;
let cut2 = 9800;
let cut3 = 12000;
let cut4 = 19000;
let cut5 = 64000;
// cut6 is the end 
let cut6 = 75000;
let cutIndex = 1;
let overlayIndex = 0;

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
    // Analyzes the song with fft
    fft = new p5.FFT(0.8, bandWidth);
    populateText();
    
}

function draw()
{   
    stroke(255);
    background(20);
    noFill(255);

    milliSec = millis();
    spectrum = fft.analyze(bandWidth);
    // Setting cutIndex from timestamps
    if (milliSec > 0 && milliSec < cut2)
    {
        cutIndex = 1;
    }
    else if (milliSec > cut2 && milliSec < cut3)
    {
        cutIndex = 2;
    }
    else if (milliSec > cut3 && milliSec < cut4)
    {
        cutIndex = 3;
        overlayIndex = 1;
    }
    else if (milliSec > cut4 && milliSec < cut5)
    {
        cutIndex = 4;
    }
    else if (milliSec > cut5 && milliSec < cut6)
    {
        cutIndex = 5;
    }

    if (overlayIndex === 1)
    {

    }

    // Things to be generated at different cuts
    if (cutIndex === 1)
    {
        amp = fft.getEnergy('highMid');
        let flicker = map(amp, 0, 255, 20, 60);
        background(flicker);
    }
    else if (cutIndex === 2)
    {   
        noStroke();
        fill(255);
        textAlign(CENTER);
        textSize(20);
        text('I really cant do it.', width/2, height/2);
        let interval = milliSec - cut2;
        
        scaleValue = map(interval, 0, 10000, 1, 0.1);
        scale(scaleValue);
    }

    else if (cutIndex === 3)
    {
        amp = fft.getEnergy('highMid');
        let flicker = map(amp, 0, 255, 20, 60);
        background(flicker);
    }

    else if(cutIndex === 4)
    {
        auSpectrum(spectrum, 0, 0, width, height);
        // getEnergy returns the 'energy' of the song from the lowMid frequencies of the music
        // Returns a value from 0-255
        amp = fft.getEnergy('lowMid');
        // Once the music reaches a certain peek,
        if(amp > 250)
        {
            maxFontSize = floor(random(200,500));
            
            // Adjusting the remainder values makes the text populating more frequent
            if(floor(milliSec) % 5 === 0)
            {
                populateText();
            }
            // 2nd spectrum to be generated
            auSpectrum(spectrum, 0, height/2, 2*width, height/2+100);
            auSpectrum(spectrum, width, height, 0, 0);
            
        }
    }

    else if (cutIndex === 5)
    {
        amp = fft.getEnergy('highMid');
        let flicker = map(amp, 0, 255, 20, 60);
        background(flicker);
    }
}

function keyReleased()
{   
    // When space is pressed, pause the song
    if (key === ' ')
    {
        if (song.isPlaying())
        {
            // .isPlaying() returns a boolean
            song.stop();
            background(255);
        } 
        else
        {
            song.play();
            background(20);
        }  
    }
 
}

// Populates the fontSizes[] and textSong[] with random integers and strings
function populateText()
{   
    let index = round(random(0,1));
    if (index === 0)
    {
        for(let i = 0; i < bandWidth; i = i+2)
        {
            fontSizes[i] = floor(random(minFontSize, maxFontSize));
            textSong[i] = characters.charAt(floor(random(0, characters.length)));
        }
    }
    else
    {
        for(let i = 1; i < bandWidth; i = i+3)
        {
            fontSizes[i] = floor(random(minFontSize, maxFontSize));
            textSong[i] = characters.charAt(floor(random(0, characters.length)));
        }
    }
    
}

// Generates a graphic spectrum based on the audio spectrum parameter
function auSpectrum(spec, startWidth, startHeight, endWidth, endHeight)
{
    for (let i = 0; i< spec.length; i++){
        fontSize = fontSizes[i];
        textFont(font, fontSize);
        let letter = textSong[i];
        let x = map(i, 0, spec.length, startWidth, endWidth);
        let h = -height + map(spec[i], 0, 255, startHeight, endHeight);
        text(letter, x, -h);
    }
}
