document.addEventListener('DOMContentLoaded', function () {
    
    // Declare Variables
    const apiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    let section = document.getElementById('section');
    let currentFont = 'Lora';

    // Perform searchFunction when "Enter" is pressed or "searchIcon" is clicked
    document.getElementById('searchIcon').addEventListener('click', searchFunction);
    document.getElementById('input').addEventListener('keyup', function (event) {
        if (event.key === "Enter") {
            searchFunction();
        }
    });

    // fetch() Function
    function searchFunction() {
        let inputValue = document.getElementById('input').value;
        if (inputValue === '') return;
        removeHidden();

        fetch(`${apiUrl}${inputValue}`)
            // Return response
            .then(response => {
                if (response.status === 404) {
                    throw new Error('Word not found (404)');
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
                section.innerHTML = "";

                // Check for audio
                let findAudio = data[0].phonetics.find(phonetic => phonetic.audio && phonetic.audio !== "");
                let audioUrl = findAudio ? findAudio.audio : '';

                // Check for transcription
                let findPhonetics = data[0].phonetics.find(phonetic => phonetic.text && phonetic.text !== "");
                let phonetics = findPhonetics ? findPhonetics.text : '';

                // Display the word and its transcription
                section.innerHTML = `
                    <div class="word-pr">
                        <div class="word-transcription">
                            <h2 class="h2" id="word">${inputValue.toLowerCase()}</h2>
                            <span id="transcription">${phonetics}</span>
                        </div>
                    </div>
                `;

                // Check if there is an audio URL and create the button
                if (audioUrl) {
                    document.querySelector('.word-pr').innerHTML += `
                        <button class="button-img" id="buttonAudio">
                            <img alt="sound" class="img" src="assets/icon-play.svg">
                        </button>
                    `;
                }

                let numberOfLoops = 0;
                for(let i = 0; i < data.length; i++) {
                    for(let j = 0; j < data[i].meanings.length; j++) {
                        numberOfLoops += 1;

                        // Display part of speech
                        section.innerHTML += `
                            <div class="definitions">
                                <div class="part-of-speech-hr">
                                    <p class="part-of-speech">${data[i].meanings[j].partOfSpeech || ''}</p>
                                    <hr class="hr">
                                </div>
                    
                                <p class="meaning">Meaning</p>
                    
                                <ul class="ul" id="ulDef${numberOfLoops}">
                        `;
                    
                        // Display definitions
                        for(let k = 0; k < data[i].meanings[j].definitions.length; k++) {
                            document.getElementById(`ulDef${numberOfLoops}`).innerHTML += `
                                <li class="li ${currentFont}">${data[i].meanings[j].definitions[k].definition || ''}</li>
                            `;
                            if(data[i].meanings[j].definitions[k].example) {
                                document.getElementById(`ulDef${numberOfLoops}`).innerHTML += `
                                    <p class="example ${currentFont}">${data[i].meanings[j].definitions[k].example}</p>
                                `
                            }
                        }
                    
                        section.innerHTML += `</ul>`;
                    
                        // Display synonyms, if there are any
                        if(data[i].meanings[j].synonyms && data[i].meanings[j].synonyms.length > 0) {
                            section.innerHTML += `<p class="synonyms-antonyms">Synonyms &nbsp;&nbsp;<span class="spanSynonymsAntonyms" id="spanSynonyms${numberOfLoops}"></span></p>`;
                            for(let k = 0; k < data[i].meanings[j].synonyms.length; k++) {
                                if(data[i].meanings[j].synonyms.length > 1 && data[i].meanings[j].synonyms.length !== k + 1) {
                                    document.getElementById(`spanSynonyms${numberOfLoops}`).innerText += ` ${data[i].meanings[j].synonyms[k]},`;
                                } else {
                                    document.getElementById(`spanSynonyms${numberOfLoops}`).innerText += ` ${data[i].meanings[j].synonyms[k]}`;
                                }
                            }
                        }

                        // Display antonyms, if there are any
                        if(data[i].meanings[j].antonyms && data[i].meanings[j].antonyms.length > 0) {
                            section.innerHTML += `<p class="synonyms-antonyms">Antonyms &nbsp;&nbsp;<span class="spanSynonymsAntonyms" id="spanAntonyms${numberOfLoops}"></span></p>`;
                            for(let k = 0; k < data[i].meanings[j].antonyms.length; k++) {
                                if(data[i].meanings[j].antonyms.length > 1 && data[i].meanings[j].antonyms.length !== k + 1) {
                                    document.getElementById(`spanAntonyms${numberOfLoops}`).innerText += ` ${data[i].meanings[j].antonyms[k]},`;
                                } else {
                                    document.getElementById(`spanAntonyms${numberOfLoops}`).innerText += ` ${data[i].meanings[j].antonyms[k]}`;
                                }
                            }
                        }
                    }
                }

                // Display the source of information
                section.innerHTML += `
                    <hr class="hr">
                    <a href="${data[0].sourceUrls[0]}" class="sourceUrls" target="_blank">
                        <div class="linkHolder">
                            <p class="linkSrc">Source</p>
                            <div class="link-img">
                                <a href="${data[0].sourceUrls[0]}" class="link" target="_blank">${data[0].sourceUrls[0]}<img src="assets/icon-new-window.svg" alt="Icon New Window" class="iconNewWindow"></a>
                            </div>
                        </div>
                    </a>
                `

                // Play audio, if there is any and play it only once at a time
                if (audioUrl) {
                    const buttonAudio = document.getElementById("buttonAudio");
                    let audio = new Audio(audioUrl);

                    buttonAudio.addEventListener('click', function () {                        
                        buttonAudio.disabled = true;
                        audio.play();

                        // Re-enable button
                        audio.onended = function () {
                            buttonAudio.disabled = false;
                        };
                    });
                }
            })

            // Catch errors => if the word doesn't exist or the server returns other errors
            .catch((error) => {
                if (!error.message.includes('404')) {
                    section.innerHTML = `<p class="error">An unexpected error has occurred. Please try again later.</p>`;
                } else {
                    section.innerHTML = `<p class="error404">No definitions found for <span class="inputValueError404">"${inputValue.toLowerCase()}"</span></p>`;
                }
            });
    }

    function removeHidden() {
        document.getElementById('input').value = '';
        section.classList.remove('hidden');
    }

    document.getElementById('logo').addEventListener('click', resetValues);
    function resetValues() {
        section.innerHTML = '';
    }

    document.querySelectorAll('.fontButton').forEach(function(el) {
        el.addEventListener('click', function(ev){
            currentFontHandler(ev);
            changeFontFamily(ev);
        })
    })

    // Display correct font name
    function currentFontHandler(element) {
        document.getElementById('currentFont').innerText = element.target.innerText;
    }

    // Change the font-family of .li and .example
    function changeFontFamily(element) {
        document.querySelectorAll('.li, .example').forEach(function(el) {
            el.style.fontFamily = `${element.target.dataset.font}`;
            currentFont = `${element.target.dataset.font}`;
        })
    }
})
