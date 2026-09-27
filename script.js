// Creates a variable pointing to the text box on the page
const textInput = document.getElementById('text-input');
// Creates a variable pointing to the button on the page
const speakButton = document.getElementById('speak-btn');

// Tells the button to wait for a 'click', and then run the function inside the parentheses
speakButton.addEventListener('click', () => {
    // Grabs whatever text the user typed into the input box
    const text = textInput.value;

    // Checks if the user typed nothing (or only spaces)
    if (text.trim() === '') {
        // If they typed nothing, show a pop-up warning
        alert('Please enter some text.');
        // Stop the code here so it doesn't try to speak empty text
        return;
    }

    // Creates a new "SpeechSynthesisUtterance" object, which holds the text to be spoken
    const utterance = new SpeechSynthesisUtterance(text);

    // Tells the browser's built-in speech engine to speak our utterance
    window.speechSynthesis.speak(utterance);
});