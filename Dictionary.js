document.addEventListener('DOMContentLoaded', function(){

    // Variables
    const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    let btn = document.getElementById('btn');
    let section = document.getElementById('section');
    btn.addEventListener('click', () => {

        // Fetch() function
        let inputValue = document.getElementById('text').value;
        fetch(`${apiUrl}${inputValue}`)
            .then(response => {
                return response.json()})
            .then((data) => {

                if(data.title){
                    section.innerHTML = "";
                    document.getElementById('secondSection').innerHTML = "";
                }

                console.log(data);

                section.innerHTML = 
                `<div class="word-pr">
                    <h2 class="h2" id="word">${inputValue}</h2>
                    <button class="button-img" id="button">
                        <img alt="sound" class="img" id="img" src="volume.png">
                    </button>
                </div>

                <p class="part-of-speech" id="partSpeech">1. ${data[0].meanings[0].partOfSpeech} <span id="transcription">${data[0].phonetic || ""}</span></p>
                <p id="definition">${data[0].meanings[0].definitions[0].definition}</p>

                <p class="example" id="example">${data[0].meanings[0].definitions[0].example || ''}</p>`


                let sound = new Audio(data[0].phonetics[0].audio);

                document.getElementById("button").addEventListener('click', play)
                function play() {
                    sound.play();
                }

                if(data[0].meanings[1].partOfSpeech){
                    document.getElementById('secondSection').innerHTML = 
                    `<p class="part-of-speech second">2. ${data[0].meanings[1].partOfSpeech}</p>
                    <p class="meaning-second">${data[0].meanings[1].definitions[0].definition}</p>
        
                    <p class="example">${data[0].meanings[1].definitions[0].example || ''}</p>`
                }
            })  
    })

    btn.addEventListener('click', () => {
        document.getElementById('text').value = "";
        section.classList.remove('hidden');
        document.getElementById('secondSection').innerHTML = "";
    })
})