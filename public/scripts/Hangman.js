/** Hangman */
(function () {
    let scr;
    let word;
    let correct = "";
    let guesses;
    let alphabeth = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z', 'æ', 'ø', 'å'
    ];
    fetch("/api/word")
        .then(res => res.text())
        .then(w => {
            word = w.toLowerCase();
            correct = Array(word.length);
            setup();
        });

    function drawGallow() {
        let baseY = scr.height - 100;
        let baseX = 100;
        let topY = 100;
        let ropeX = 300;
        let ropeLength = 120;
        dcl.line(baseX, baseY, baseX, topY, 5, WHITE);
        dcl.line(baseX, topY, ropeX, topY, 5, WHITE);
        dcl.line(baseX, 200, 200, topY, 5, WHITE);
        dcl.line(50, baseY, topY+ropeLength, baseY, 5, WHITE);
        dcl.line(ropeX, topY, ropeX, topY+ropeLength, 5, WHITE);
    }

    function drawLetterLines(word, correct) {
        let n = word.length;
        let x = 400;
        let spacing = 30;
        let y = scr.height / 2;
        let w = (scr.width - 450 - n * spacing) / n;
        let m = w + spacing;
        for (let i = 0; i < n; i++) {
            dcl.line(x, y, x + w, y, 5, YELLOW);
            if (correct[i] === word[i]) {
                dcl.text(word[i].toUpperCase(), x + w / 2, y - spacing / 2, GREEN, "Arial", w);
            }
            x += m;
        }
    }

    function drawAlphabet(guesses) {
        let maxX = scr.width - 600;
        let lettersPerLine = 10;
        let x = 400;
        let w = maxX / lettersPerLine;
        let basey = scr.height / 2 + 10;
        let y = basey;
        let spacing = w + 10;
        let line = 0;
        for (let i = 0; i < alphabeth.length; i++) {
            if (i % lettersPerLine === 0) {
                line++;
                y += w;
                x = 400;
            }
            let color = guesses[i] === alphabeth[i] ? GRAY : BLUE;
            dcl.text(alphabeth[i].toUpperCase(), x + w / 2, y, color, "Arial", w);
            x += spacing;
        }
    }

    function drawHangman(level) {
        if (level > 0) {
            dcl.circle(300, 190, 30, BLACK, 5, WHITE);
        }
        if (level > 1) {
            dcl.line(300, 220, 300, 350, 5, WHITE);
        }
        if (level > 2) {
            dcl.line(300, 270, 220, 200, 5, WHITE);
        }
        if (level > 3) {
            dcl.line(300, 270, 370, 200, 5, WHITE);
        }
        if (level > 4) {
            dcl.line(300, 350, 220, 450, 5, WHITE);
        }
        if (level > 5) {
            dcl.line(300, 350, 380, 450, 5, WHITE);
        }
    }
    function drawGameOver() {
        dcl.rect(0, 0, scr.width, scr.height, dcl.color(0, 0, 0, .8));
        dcl.text("GAME OVER", scr.width / 2, scr.height / 2, RED, "ARIAL", 150);
    }
    function drawWin(){
        dcl.rect(0, 0, scr.width, scr.height, dcl.color(0, 0, 0, .8));
        dcl.text("CORRECT!", scr.width / 2, scr.height / 2, GREEN, "ARIAL", 150);
    
    }
    function setup() {
        let gameOver = false;
        scr = dcl.setupScreen(window.innerWidth, window.innerHeight);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        drawGallow();
        drawLetterLines(word, correct);
        guesses = Array(alphabeth.length);
        drawAlphabet(guesses);
        let wrong = 0;
        document.addEventListener("keyup", (e) => {
            if (gameOver) {
                return;
            }
            if (guesses.indexOf(e.key) > 01) {
                return;
            }
            if (alphabeth.indexOf(e.key) > -1) {
                guesses[alphabeth.indexOf(e.key)] = e.key;
                let indices = word.allIndexesOf(e.key);
                if (indices.length > 0) {
                    indices.forEach(i => {
                        correct[i] = word[i];
                        dsl.playSong(tada, WAVEFORMS.SINE);
                    });
                } else {
                    dsl.playSong(dumdumdo, WAVEFORMS.SAW)
                    wrong++;
                }
                dcl.clear();
                drawGallow();
                drawLetterLines(word, correct);
                drawAlphabet(guesses);
                drawHangman(wrong);
                if (wrong > 5) {
                    gameOver = true;
                    drawGameOver();
                    dsl.playSong(looser);
                }
                if(correct.join("") === word){
                    gameOver = true;
                    drawWin();
                    dsl.playSong(winner);
                }
            }
        });
    }

})();

String.prototype.allIndexesOf = function (c) {
    let indices = [];
    for (let i = 0; i < this.length; i++) {
        if (this[i] === c) {
            indices.push(i);
        }
    }
    return indices;
}