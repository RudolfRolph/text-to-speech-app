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
    
    // NEW: This tells the computer what to do when it finishes speaking
    utterance.onend = () => {
        // It clears the text box completely so it's ready for the next sentence
        textInput.value = ''; 
    };
    
    window.speechSynthesis.speak(utterance);
}

speakButton.addEventListener('click', speakText);

// Keyboard logic: Enter to speak, Shift+Enter for a new line
textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            return; // Let Shift+Enter make a new line
        } else {
            event.preventDefault(); 
            speakText(); // Enter alone speaks the text
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