const WAVEFORMS = {
    SINE: "sine",
    SQURE: "square",
    SAW: "saw",
    TRIANGLE: "triangle"
}
const EPS = 0.01;
const SPEED = 2;
const tetris = [
    [76, 4], [71, 8], [72, 8], [74, 4],
    [72, 8], [71, 8], [69, 4], [69, 8],
    [72, 8], [76, 4], [74, 8], [72, 8],
    [71, 4], [71, 8], [72, 8], [74, 4],
    [76, 4], [72, 4], [69, 4], [69, 4],
    [0, 4], [74, 3], [77, 8], [81, 4],
    [79, 8], [77, 8], [76, 3], [72, 8],
    [76, 4], [74, 8], [72, 8], [71, 4],
    [71, 8], [72, 8], [74, 4], [76, 4],
    [72, 4], [69, 4], [69, 4], [0, 4],
];
const winner = [
    [60, 8], [60, 8], [60, 4], [64, 8],
    [67, 8], [72, 4], [72, 32], [72, 16],
    [72, 8], [74, 8], [72, 8], [74, 8], [76, 4]
];

const looser = [
    [57, 4], [57, 4], [57, 8], [57, 4],
    [60, 8], [57, 8], [56, 8], [57, 2]
]
const tada = [
    [60, 8], [64, 16], [67, 16], [72, 4],
];
const dumdumdo = [
    [52, 16], [48, 16], [42, 4],
]

const dsl = function () {
    const ctx = new AudioContext();
    function midiNote(m) {
        return Math.pow(2, (m - 69) / 12) * 440;
    }
    function buildOscillator(type = WAVEFORMS.SINE) {
        let o = ctx.createOscillator();
        o.connect(ctx.destination);
        o.type = type;
        return o;
    }
    return {
        oscillator: buildOscillator,
        playSong: function (song, waveform = WAVEFORMS.SINE) {
            if (song.length > 0 && song[0].length === 2) {
                let o = buildOscillator(waveform);
                o.start(0);
                let time = ctx.currentTime + EPS;
                song.forEach((note, i) => {
                    let freq = midiNote(note[0]);
                    //o.frequency.setTargetAtTime(0, time - EPS, 0.001);
                    o.frequency.setTargetAtTime(freq, time, 0.001);
                    time += SPEED / note[1];
                });
                o.stop(time);
            }
        }
    }
}();