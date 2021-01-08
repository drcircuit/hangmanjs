/** Hangman */
let resetcount = 0;
(function () {
    let score = 0;
    let teacher = 0;
    let scr;
    let word;
    let correct = "";
    let guesses;
    let oldword = "";
    let alphabeth = [
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
        'y', 'z', 'æ', 'ø', 'å'
    ];
    function getMode(skipPrompt) {
        let qs = window.location.href.split("#");
        if (qs.length > 1) {
            if (qs[1] === "/single" || qs[1] === "/enkel") {
                let w = prompt("Skriv inn ordet du vil bruke", localStorage.getItem("hangmanWord"));
                localStorage.setItem("hangmanWord", w);
                return "single";
            } else if (qs[1] === "/customlist" || qs[1] === "/egenliste") {
                if (!skipPrompt) {
                    let wl = prompt("Skriv inn ordene du vil bruke, skill med komma", localStorage.getItem("hangmanWordList"));
                    localStorage.setItem("hangmanWordList", wl);
                    console.log(wl);
                }
                return "custom";
            }
        }
        return "api";
    }
    function start(w) {
        word = w.toLowerCase();
        correct = Array(word.length);
        setup();
    }
    function reset(skipPrompt) {
        let mode = getMode(skipPrompt);
        if (mode === "api") {
            fetch("/api/word")
                .then(res => res.text())
                .then(w => {
                    start(w);
                });
        } else if (mode === "single") {
            start(localStorage.getItem("hangmanWord"));
        } else {
            let list = localStorage.getItem("hangmanWordList").split(",");
            document.body.style.color = "#FFF";
            console.log("hei");
            if (word && word.length > 0) {
                console.log(word);
                console.log(list.indexOf(word));
                list.splice(list.indexOf(word), 1);
                console.log(list);
                localStorage.setItem("hangmanWordList", list.join(","));
                if (list.length < 1) {
                    getMode();
                    list = localStorage.getItem("hangmanWordList").split(",");
                    word = "";
                }
                oldword = word;
                word = "";
            }
            start(list[dcl.randomi(0, list.length)]);
        }
    }
    reset();
    function drawGallow() {
        let baseY = scr.height - 100;
        let baseX = 100;
        let topY = 100;
        let ropeX = 300;
        let ropeLength = 120;
        dcl.line(baseX, baseY, baseX, topY, 5, WHITE);
        dcl.line(baseX, topY, ropeX, topY, 5, WHITE);
        dcl.line(baseX, 200, 200, topY, 5, WHITE);
        dcl.line(50, baseY, topY + ropeLength, baseY, 5, WHITE);
        dcl.line(ropeX, topY, ropeX, topY + ropeLength, 5, WHITE);
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
    function drawRestartMessage(){
        dcl.text("Trykk ALT+s for å starte neste ny runde.", scr.width/2, scr.height/2+320, GREEN, "Arial",25);
    }
    function drawScore(){
        dcl.text("LÆRER: "+teacher, 20, 40, dcl.color(255,160,0),"Arial", 40, null,"left");
        dcl.text("ELEVER: "+score, scr.width-20,40,CYAN,"Arial",40, null, "right");
    }
    function drawGameOver() {
        dcl.rect(0, 0, scr.width, scr.height, dcl.color(0, 0, 0, .8));
        dcl.text("GAME OVER", scr.width / 2, scr.height / 2, RED, "ARIAL", 150);
        dcl.text(word, scr.width / 2, scr.height / 2 + 160, YELLOW, "Arial", 40);
    }
    function drawWin() {
        dcl.rect(0, 0, scr.width, scr.height, dcl.color(0, 0, 0, .8));
        dcl.text("CORRECT!", scr.width / 2, scr.height / 2, GREEN, "ARIAL", 150);
    }
    function setup() {
        let gameOver = false;
        scr = dcl.setupScreen(window.innerWidth - 10, window.innerHeight - 100);
        scr.setBgColor('black');
        document.body.style.backgroundColor = 'black';
        drawGallow();
        drawLetterLines(word, correct);
        drawScore();
        guesses = Array(alphabeth.length);
        drawAlphabet(guesses);
        let wrong = 0;
        let handleKeys = function (e) {
            if (gameOver) {
                if (e.key === "s" && e.altKey) {
                    resetcount++;
                    reset(true);
                    document.removeEventListener("keyup", handleKeys);
                    e.preventDefault();
                    console.log("Resetcount is ", resetcount);
                    return false;
                }
                return;
            }
            if (guesses.indexOf(e.key) > -1) {
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
                drawScore();
                drawGallow();
                drawLetterLines(word, correct);
                drawAlphabet(guesses);
                drawHangman(wrong);
                if (wrong > 5) {
                    gameOver = true;
                    drawGameOver(word);
                    dsl.playSong(looser);
                    teacher++;
                }
                if (correct.join("") === word) {
                    gameOver = true;
                    drawWin();
                    dsl.playSong(winner);
                    score++;
                }
                if(gameOver){
                    drawRestartMessage();
                }
                
            }
        }
        
        document.addEventListener("keyup", handleKeys);
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