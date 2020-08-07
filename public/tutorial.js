// The tutorial system is taken from another project of mine
const phrases = {
    move: ['Use WASD to move around.', 'Use the mouse to aim and click to fire.'],
    // aim: ['Use the mouse to aim and click to fire.'],
    ready: ['The clock is green.', 'This means that when you are hit, you will rewind.'],
    rewind: ['You have been hit and are about to rewind...', 'Remember what enemy killed you, and pay attention to where they spawned from!', 'You are going to travel to the past and kill that enemy, saving yourself.'],
    ghost: ['You are the ghost (the blue player).', 'Save your past self by killing the enemy before it kills the yellow player (your past self)!', 'If you fail to stop your past self from dying, it\'s game over.', 'TIP: Find where the enemy is or spawned from, and fire there to kill it as soon as possible.'],
    // afterrewind: ['Congratulations, you saved yourself!', 'The ghost is no longer needed and you control the yellow player again.', 'Look at the clock - there is a cooldown before you can rewind again.'],
    saved: ['Congratulations, you saved yourself!', 'The ghost is no longer needed and you control the yellow player again.'],
    goodluck: ['Look at the clock - there is a cooldown before you can rewind again.', 'If you die before the clock turns green, the game is over.', 'Good luck!'],
    diedearly: ['Oops! You died!\n\nFeel free to try again and complete the tutorial.']
}

let used = {};

let tutorial, endTutorial, tutorialCallback;

function startTutorial() {
    let used = {};
    let tutorialEnded = false;
    let totalPhrases = -1;
    for (let key in phrases) {
        used[key] = false;
        totalPhrases++;
    }

    tutorial = (key, callback) => {
        if (!tutorialEnded && !used[key]) {
            used[key] = true;

            for (let i = 0; i < phrases[key].length; i++) {
                setTimeout(() => {
                    if (!tutorialEnded) addTutorial(phrases[key][i]);
                }, 2000 * i)
            }

            game.paused = true;
            game.readyToUnpause = false;
            tutorialCallback = callback;

            setTimeout(() => game.readyToUnpause = true, phrases[key].length * 2000);

            totalPhrases--;

        }
    }

    endTutorial = () => {
        if (totalPhrases > 0) {
            // tutorial('diedearly');
            addTutorial(phrases.diedearly[0]);
        }

        tutorialEnded = true;
    }
}

// Game messages that popup on the screen and fade out after 180 frames (3 seconds)
let tutorialLines = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
let nextTutorial = 0;

function resetTutorial() {
    tutorialLines = ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''];
    nextTutorial = 0;
}

function addTutorial(msg) {
    let lines = wrapText(msg, 30, 750);
    // Each message is separated by an empty line
    lines.push('');

    // If the new message goes over the message line limit (fills the whole screen)
    if (nextTutorial + lines.length > tutorialLines.length) {
        let count = nextTutorial + lines.length - tutorialLines.length;
        // Remove messages from the top as needed, to make the new message fit
        for (let i = 0; i < count; i++) {
            tutorialLines.splice(0, 1);
            tutorialLines.push('');
            nextTutorial--;
        }
    }

    // Add the message lines
    for (let line of lines) {
        tutorialLines[nextTutorial] = line;
        nextTutorial++;
    }
}

function drawTutorials() {
    push();
    textSize(30);
    textAlign(CENTER);
    noStroke();

    for (let i = 0; i < tutorialLines.length; i++) {
        if (tutorialLines[i] == '') continue;

        // Draw a partially transparent rectangle around the text to make it more visible
        let y = 100 + i * 40;
        fill(0, 0, 30, game.gameover ? 255: 100);
        rect(800, y, textWidth(tutorialLines[i]) + 10, 40);

        fill(255, 255, 0, 255);
        text(tutorialLines[i], 800, y + 10);
    }

    pop();
}

// Wrap text around a maximum line width
// Returns an array of strings, each representing one line of text
function wrapText(txt, tSize, lineWidth) {
    function wrapTextNoNewLines(txt, tSize, lineWidth) {
        // Work out how much of the word can fit in one line
        function resizeWord(word, lineWidth) {
            if (textWidth(word) <= lineWidth) return [word, ''];
        
            // Keep adding characters until the word no longer fits
            let i = 0, partialWord = '';
            while (i < word.length && textWidth(partialWord + word[i]) <= lineWidth) {
                partialWord += word[i];
                i++;
            }
        
            return [partialWord, word.substring(i)];
        }
        
        push();
        textSize(tSize);
        let words = txt.split(' ');
        let line = '', lines = [], testLine = '', testWidth;
        while (words.length > 0) {
            let word = words.splice(0, 1)[0];
            testLine = line + word;
            // If this isn't the last word, add a space
            if (words.length > 0) testLine += ' ';
            testWidth = textWidth(testLine);
    
            // If this word can't fit on this line
            if (testWidth > lineWidth) {
                // If this is the first word on the line (i.e. the word is longer than the whole line)
                if (line == '') {
                    // Work out how much of the word fits and add it
                    let [wordToAdd, remainingWord] = resizeWord(word, lineWidth);
                    lines.push(wordToAdd);
                    // Add the left over word back to the words array
                    if (remainingWord.length > 0) {
                        words.unshift(remainingWord);
                    }
                } else {
                    // Start a new line
                    lines.push(line);
                    line = '';
                    words.unshift(word);
                }
            } else {
                line = testLine;
            }
        }
        lines.push(line);
        pop();
        return lines;
    }
    
    let newlineSplit = txt.split('\n');
    let totalLines = [];

    for (let partialText of newlineSplit) {
        let lines = wrapTextNoNewLines(partialText, tSize, lineWidth);

        for (let line of lines) {
            totalLines.push(line);
        }
    }

    return totalLines;
}