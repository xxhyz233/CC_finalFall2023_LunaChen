let milliSec;
let bandWidth = 32;
let song;
let spectrum = [bandWidth];

let textSong = [bandWidth];
let fontSizes = [bandWidth];
let minFontSize = 2;
let maxFontSize = 10;
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

let blue;
let white;

let isFeedback = false;

function preload()
{
    song = loadSound('media/Presudeos.mp3');
}

function setup()
{
    createCanvas(1280,720);
    angleMode(DEGREES);
    background(20);
    font = 'Arial';
    song.play();
    // Analyzes the song with fft
    fft = new p5.FFT(0.8, bandWidth);
    populateText(characters);
    blue = color(0,0,255, 80);
    white = color(255, 255, 255, 60);
}

function draw()
{   
    stroke(white);
    strokeWeight(1)
    // If feedback effet is off, clear the screen and refresh like normal
    if (isFeedback === false)
    {
        background(20);
    }
    noFill();
    textAlign(CENTER, CENTER);

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
        push();
        noStroke();
        fill(255);
        textSize(20);
        text('I really cant do it.', width/2, height/2);
        let interval = milliSec - cut2;
        
        scaleValue = map(interval, 0, 10000, 1, 0.1);
        scale(scaleValue);
        pop();
    }

    else if (cutIndex === 3)
    {
        amp = fft.getEnergy('highMid');
        let flicker = map(amp, 0, 255, 20, 60);
        background(flicker);

        auSpectrum(spectrum, width/2, height/2, 20, blue, 10);
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
                populateText('I really cant do it.');
            }
            // Spectrum in the center
        }
    }

    else if(cutIndex === 4)
    {
        // White layer on bottom
        auSpectrum(spectrum, width/2, height/2, 500, color(255,255,255, 100), 45);
        // Blue layer on top
        auSpectrum(spectrum, width/2, height/2, 200, color(blue), 0);
        // Another blue layer
        auSpectrum(spectrum, width/2, height/2, 800, color(blue), 90);
        // getEnergy returns the 'energy' of the song from the lowMid frequencies of the music
        // Returns a value from 0-255
        amp = fft.getEnergy('lowMid');

        // Once the music energy reaches the 250 peek,
        if(amp > 250)
        {
            maxFontSize = floor(random(100,600));
            
            // Adjust the remainder values makes the text populating more frequent
            if(floor(milliSec) % 5 === 0)
            {
                populateText('I really cant do it.');
            }
            // Generate more spectrums
        
            
        }
        // 2nd condition to control the feedback interval
        if(amp > 254 && floor(milliSec) % 200 < random(120,160))
        {
            isFeedback = true;
        }
        else
        {
            isFeedback = false;
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
function populateText(char)
{   
    let index = round(random(0,1));
    if (index === 0)
    {
        for(let i = 0; i < bandWidth; i = i+2)
        {
            fontSizes[i] = floor(random(minFontSize, maxFontSize));
            textSong[i] = char.charAt(floor(random(0, char.length)));
        }
    }
    else
    {
        for(let i = 1; i < bandWidth; i = i+3)
        {
            fontSizes[i] = floor(random(minFontSize, maxFontSize));
            textSong[i] = char.charAt(floor(random(0, char.length)));
        }
    }
    
}

// Generates a graphic spectrum based on the audio spectrum parameter
function auSpectrum(spec, posX, posY, radius, color, rotXOffset)
{
    push();
    stroke(color);
    for (let i = 0; i< spec.length; i++){
        fontSize = fontSizes[i];
        textFont(font, fontSize);
        let letter = textSong[i];
        // Circle Loop
        for (let j = 0; j < 360; j+=30)
        {
            // Radius of the circle
            let r = map(spec[i], 0, 255, 0, radius);
            // Random wiggle on x,y for intensity
            // cos and sin corresponds to xy coordinates of a circle
            let x = posX + (r * cos(j+rotXOffset)) + random(5,8);
            let y = posY + (r * sin(j+rotXOffset)) + random(5,8);
            text(letter, x, y);
        }
    }
    pop();
}
