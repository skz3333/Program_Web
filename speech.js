const myOwnKey = "07e322545fa74934855ffdec711a5b89"; //Votre clé d'api ici!

const url = 'https://voicerss-text-to-speech.p.rapidapi.com/?key=' + myOwnKey;
let options = {
    method: 'POST',
    headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'X-RapidAPI-Key': 'd8766a9c54msh346d5361a34f49bp120c7cjsn25c3b48040fe',
        'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com'
    },
    // Ne spécifiez pas le texte ici, il sera ajouté dynamiquement à partir de l'élément HTML
    body: new URLSearchParams({
        hl: 'fr-fr',
        v: 'Axel',
        r: '0',
        c: 'mp3',
        f: '8khz_8bit_mono'
    })
};

let ctx;
let audio;

window.addEventListener("DOMContentLoaded", init);

function init() {
    console.log(document.getElementById("text").value)
    document.getElementById("start").addEventListener("click", start);
}



function start() {
    ctx = new AudioContext();
    // Obtenez la valeur du texte depuis l'élément HTML avec l'ID "text"
    const textToSpeak = document.getElementById("text").value;
    // Récupérer la valeur de l'option sélectionnée

    var selectElement = document.getElementById("ddlLanguage");
    console.log(selectElement.value.split(':')[0])
    console.log(selectElement.value.split(':')[1])

    options.body.delete('hl');
    options.body.delete('v');
    options.body.delete('src');

    options.body.append('hl', selectElement.value.split(':')[0]);
    options.body.append('v', selectElement.value.split(':')[1]);
    options.body.append('src', textToSpeak);

    fetch(url, options)
        .then((data) => {
            return data.arrayBuffer()
        })
        .then(arrayBuffer => {
            return ctx.decodeAudioData(arrayBuffer)
        })
        .then(decodedAudio => {
            audio = decodedAudio;
            console.log(audio.duration)
        })
        .then(playback)
        .then(() => {
            console.log("DONE")
        });
}

function playback() {
    return new Promise((resolve, reject) => {
        const playSound = ctx.createBufferSource();
        playSound.buffer = audio;
        playSound.connect(ctx.destination);
        playSound.start(ctx.currentTime);

        setTimeout(() => {
            playSound.stop();
            resolve();
        }, audio.duration * 1000);
    });
}
