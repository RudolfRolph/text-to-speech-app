// --- FIND ALL HTML ELEMENTS ---
const modeTtsBtn = document.getElementById('mode-tts');
const modeSttBtn = document.getElementById('mode-stt');
const ttsPanel = document.getElementById('tts-panel');
const sttPanel = document.getElementById('stt-panel');

const textInput = document.getElementById('text-input');
const speakButton = document.getElementById('speak-btn');
const emotionSelect = document.getElementById('emotion-select'); // NEW

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
    
    // NEW: Get the selected emotion from the dropdown
    const emotion = emotionSelect.value;
    
    const utterance = new SpeechSynthesisUtterance(text);

    // NEW: Apply different pitch and rate values based on emotion
    if (emotion === 'happy') {
        utterance.pitch = 1.4;  // Higher pitch
        utterance.rate = 1.1;   // Slightly faster
    } else if (emotion === 'excited') {
        utterance.pitch = 1.8;  // Much higher pitch
        utterance.rate = 1.3;   // Faster speed
    } else if (emotion === 'sad') {
        utterance.pitch = 0.7;  // Lower pitch
        utterance.rate = 0.8;   // Slower speed
    } else if (emotion === 'tired') {
        utterance.pitch = 0.6;  // Very low pitch
        utterance.rate = 0.6;   // Very slow speed
    } else if (emotion === 'monotone') {
        utterance.pitch = 1.0;  // Flat, normal pitch
        utterance.rate = 0.9;   // Slightly slow, robotic
    } else {
        // Neutral (Default)
        utterance.pitch = 1.0;
        utterance.rate = 1.0;
    }
    
    // Clear the text box when done speaking
    utterance.onend = () => {
        textInput.value = ''; 
    };
    
    window.speechSynthesis.speak(utterance);
}

speakButton.addEventListener('click', speakText);

textInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        if (event.shiftKey) {
            return; 
        } else {
            event.preventDefault(); 
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