const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

let openai;

document.addEventListener('DOMContentLoaded', () => {
    const enhanceButton = document.getElementById('enhanceButton');
    const inputText = document.getElementById('inputText');
    const responsesDiv = document.getElementById('responses');

    enhanceButton.addEventListener('click', async () => {
        const config = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });

        openai = new OpenAIApi(config);

        const response = await enhance(inputText.value);
        displayResponses(response.choices, responsesDiv);
    });
});

function displayResponses(choices, responsesDiv) {
    responsesDiv.innerHTML = '';

    choices.forEach(choice => {
        const responseDiv = document.createElement('div');
        responseDiv.className = 'response';
        responseDiv.textContent = choice.text.trim();
        responseDiv.addEventListener('click', () => {
            copyToClipboard(choice.text.trim());
            alert('Text copied to clipboard!');
        });
        responsesDiv.appendChild(responseDiv);
    });
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
}

async function enhance(text) {
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Enhance the following text in 5 different ways and return the responses in an only JSON Array format without anything else like this: ["text1", "text2", "text3", "text4", "text5"]\n\nInput text:  ${text}`,
        max_tokens: 4000
    });
    return completion.data;
}

window.onload = function() {
    const placeholderText = ["Hello my friend!", "Welcome on WordEx world", "Type or paste your text here...", "Make your writing stand out."];
    const input = document.getElementById('inputText');

    let wordIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < placeholderText[wordIndex].length) {
            if(!input.value){
                input.setAttribute('placeholder', input.getAttribute('placeholder') + placeholderText[wordIndex].charAt(charIndex));
                charIndex++;
                setTimeout(type, 40);
            }
        } else {
            setTimeout(erase, 500);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if(!input.value){
                input.setAttribute('placeholder', input.getAttribute('placeholder').slice(0, input.getAttribute('placeholder').length - 1));
                charIndex--;
                setTimeout(erase, 100);
            }
        } else {
            wordIndex++;
            if(wordIndex >= placeholderText.length) wordIndex=0;
            setTimeout(type, 200);
        }
    }

    setTimeout(type, 200);
}