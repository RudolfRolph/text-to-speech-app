// --- FIND ALL HTML ELEMENTS ---
const modeTtsBtn = document.getElementById('mode-tts');
const modeSttBtn = document.getElementById('mode-stt');
const ttsPanel = document.getElementById('tts-panel');
const sttPanel = document.getElementById('stt-panel');

const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-btn');

const listenButton = document.getElementById('listen-btn');
const statusText = document.getElementById('status');
const equalizer = document.getElementById('equalizer');
const transcriptOutput = document.getElementById('transcript-output');

// --- MODE SWITCHING LOGIC ---
modeTtsBtn.addEventListener('click', () => {
    modeTtsBtn.classList.add('active');
    modeSttBtn.classList.remove('active');
    ttsPanel.classList.add('active');
    sttPanel.classList.remove('active');
    if (recognition) { recognition.stop(); }
});

modeSttBtn.addEventListener('click', () => {
    modeSttBtn.classList.add('active');
    modeTtsBtn.classList.remove('active');
    sttPanel.classList.add('active');
    ttsPanel.classList.remove('active');
});

// --- PART 1: TEXT TO SPEECH (MUTE MODE) ---
function speakText() {
    const text = textInput.value;
    if (text.trim() === '') {
        alert('Please enter some text.');
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
}

speakButton.addEventListener('click', speakText);

// NEW: This is the updated keyboard logic
textInput.addEventListener('keydown', (event) => {
    // Check if the key pressed was the "Enter" key
    if (event.key === 'Enter') {
        
        // Check if the SHIFT key was ALSO held down
        if (event.shiftKey) {
            // If Shift + Enter was pressed, we do NOTHING special.
            // We let the browser do its normal thing: create a new line.
            return; 
        } else {
            // If Enter was pressed ALONE:
            // 1. Stop the browser from making a new line
            event.preventDefault(); 
            // 2. Speak the text
            speakText();
        }
    }
});

// --- PART 2: SPEECH TO TEXT (DEAF MODE) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (!SpeechRecognition) {
    listenButton.style.display = 'none';
    statusText.textContent = "Your browser does not support the Microphone. Please use Google Chrome or Microsoft Edge.";
} else {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    listenButton.addEventListener('click', () => {
        statusText.textContent = "Listening... Please speak now.";
        transcriptOutput.textContent = "..."; 
        equalizer.classList.add('active'); 
        recognition.start(); 
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        transcriptOutput.textContent = transcript;
    };

    recognition.onerror = (event) => {
        statusText.textContent = "Error: " + event.error + ". Please allow microphone access.";
        equalizer.classList.remove('active'); 
    };

    recognition.onend = () => {
        statusText.textContent = ""; 
        equalizer.classList.remove('active'); 
    };
}