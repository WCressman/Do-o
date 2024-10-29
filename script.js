let set = {}; 
let correctAnswersShort = []; 
let revealLetterOnce = 0 // easter egg revealed letter to be used only 1-3 times
let streak = 0
let shortWordSolved = false;
let longWordSolved = false;

// gets a random group from wordData.js
function getSet() { 
    let oldset = set
    set = wordGroups[Math.floor(Math.random() * 211)];
    while (set === oldset) { // Ensure not to get the same set twice
        set = wordGroups[Math.floor(Math.random() * 211)];
    }
    correctAnswersShort = set.shortword.toUpperCase().split(',').map(word => word.trim());
    //Ensure we have the correct length of the list, (containing 211 items rn)

    console.log("Selected word group:", set);
}


function displayRandomWords() {

    shortWordSolved = false;
    longWordSolved = false;

    getSet()

    InputBoxesShort()

    InputBoxesLong()

    document.getElementById("streak-number").innerText = streak;

    revealLetterOnce = 0; // reset the var for easter egg

    // Format all the words accordingly
    const word1Letters = set.word1.toUpperCase().split('');
    const word2Letters = set.word2.toUpperCase().split('');
    const word1Container = document.getElementById("word1-container");
    const word2Container = document.getElementById("word2-container");
    word1Container.innerHTML = '';
    word2Container.innerHTML = '';

    word1Letters.forEach(letter => {
        const letterDiv = document.createElement("div");
        letterDiv.textContent = letter;
        word1Container.appendChild(letterDiv);
    });

    word2Letters.forEach(letter => {
        const letterDiv = document.createElement("div");
        letterDiv.textContent = letter;
        word2Container.appendChild(letterDiv);
    });
    } 


function InputBoxesShort() {
    // get length of shortest word, to know how many boxes to gen
    const answerLength = correctAnswersShort[0].length;

    // link to parent container
    const shortwordInputsContainer = document.getElementById("shortword-inputs");
    shortwordInputsContainer.innerHTML = ''; // clear existing boxes

    // generate one box for each letter of the word
    for (let i = 0; i < answerLength; i++) {
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.maxLength = 1; // Limit each input to one character
        inputBox.classList.add("letter-box"); // Link to CSS styling
        inputBox.addEventListener("input", handleInput); // Event for moving to the next box
        inputBox.addEventListener("keydown", handleKeyDown); // Event for backspace and Enter
        shortwordInputsContainer.appendChild(inputBox);
    }
}

// When a letter is typed, it moves to the next box
function handleInput() {
    const nextBox = this.nextElementSibling;
    if (this.value && nextBox) {
        nextBox.focus();
    }
}

// if we delete it goes back, if we enter is calls and checks if we inputted the correct word
function handleKeyDown(event) {
    const inputBoxes = document.querySelectorAll("#shortword-inputs input");
    const currentBox = event.target;
    const index = Array.from(inputBoxes).indexOf(currentBox);

    if (event.key === "Backspace" && !currentBox.value && index > 0) {
        const previousBox = inputBoxes[index - 1];

        if (!previousBox.classList.contains("easter-egg-box")) {
            previousBox.focus();
            previousBox.value = "";
        }
    }

    if (event.key === "Enter") {
        checkShortWordGuess(); // Call function to validate the guess
    }
}

function checkShortWordGuess() {
    const inputBoxes = document.querySelectorAll("#shortword-inputs input");
    let userGuess = '';

    // get user input
    inputBoxes.forEach(input => {
        userGuess += input.value.toUpperCase();
    });

    // check if user input == correct answer
    if (correctAnswersShort.includes(userGuess)) {
        inputBoxes.forEach(box => {
            box.style.backgroundColor = "lightgreen";
            box.style.color = "white"; // Optional for better contrast
            box.disabled = true;
        });
        shortWordSolved = true;
        checkWinCondition();
    } else {
        showGameOverOverlay();
    }
}


function showGameOverOverlay() {
    const overlay = document.createElement("div");
    overlay.id = "game-over-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    overlay.style.color = "white";
    overlay.style.display = "flex";
    overlay.style.flexDirection = "column";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "1000";

    // "You lost" message
    const message = document.createElement("h2");
    message.textContent = "You lost!";
    overlay.appendChild(message);

    // try again
    const tryAgainButton = document.createElement("button");
    tryAgainButton.textContent = "Try Again";
    tryAgainButton.style.margin = "10px";
    tryAgainButton.addEventListener("click", () => {
        overlay.remove();
        loading();
        streak = 0
        document.getElementById("streak-number").innerText = streak;
    });
    overlay.appendChild(tryAgainButton);

    // show answers
    const showAnswersButton = document.createElement("button");
    showAnswersButton.textContent = "Show Answers";
    showAnswersButton.style.margin = "10px";
    showAnswersButton.addEventListener("click", () => {
        alert("Short Word(s): " + set.shortword + "\n" +
            "Long Word: " + set.longword
        );
    });
    overlay.appendChild(showAnswersButton);

    // Add overlay to the body
    document.body.appendChild(overlay);
}


// Check if the title of the game has been pressed
function easterEgg() {
    const l = set.shortword.length;
    let limit;

    if (l <= 6) {
        limit = 1;
    } else if (l <= 8) {
        limit = 2;
    } else {
        limit = 3;
    }

    if (revealLetterOnce < limit) {
        const answerLength = correctAnswersShort[0].length;
        const revealIndex = Math.floor(Math.random() * answerLength);

        const inputBoxes = document.querySelectorAll("#shortword-inputs input");
        const boxToReveal = inputBoxes[revealIndex];

        boxToReveal.value = correctAnswersShort[0][revealIndex];
        boxToReveal.style.backgroundColor = "lightgreen";
        boxToReveal.style.color = "white";
        boxToReveal.disabled = true; // Make it uneditable
        boxToReveal.classList.add("easter-egg-box");

        revealLetterOnce += 1;
    }
}


function loading() {
    displayRandomWords();

    // Set up the title click event to reveal a letter once per word set
    const title = document.querySelector("h1");
    title.addEventListener("click", easterEgg);
};

function InputBoxesLong() {
    const answerLength = set.longword.length;

    const longContainer1 = document.getElementById("longword-input1");
    const longContainer2 = document.getElementById("longword-input2");
    longContainer1.innerHTML = "";
    longContainer2.innerHTML = "";

    // Create the first guessing row
    for (let i = 0; i < answerLength; i++) {
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.maxLength = 1;
        inputBox.classList.add("letter-box"); // Ensure consistent styling
        inputBox.addEventListener("input", handleInput);
        inputBox.addEventListener("keydown", handleKeyDownLong1);
        longContainer1.appendChild(inputBox);
    }

    // second row initially disabled
    for (let i = 0; i < answerLength; i++) {
        const inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.maxLength = 1;
        inputBox.classList.add("letter-box"); 
        inputBox.disabled = true; 
        inputBox.addEventListener("input", handleInput);
        inputBox.addEventListener("keydown", handleKeyDownLong2);
        longContainer2.appendChild(inputBox);
    }
}

function handleKeyDownLong1(event) {
    const inputBoxes = document.querySelectorAll("#longword-input1 input");
    const currentBox = event.target;
    const index = Array.from(inputBoxes).indexOf(currentBox);

    if (event.key === "Backspace" && !currentBox.value && index > 0) {
        const previousBox = inputBoxes[index - 1];
        previousBox.focus();
        previousBox.value = "";
    }

    if (event.key === "Enter") {
        checkLongWordGuess(1);
    }
}

function handleKeyDownLong2(event) {
    const inputBoxes = document.querySelectorAll("#longword-input2 input");
    const currentBox = event.target;
    const index = Array.from(inputBoxes).indexOf(currentBox);

    if (event.key === "Backspace" && !currentBox.value && index > 0) {
        const previousBox = inputBoxes[index - 1];
        previousBox.focus();
        previousBox.value = "";
    }

    if (event.key === "Enter") {
        checkLongWordGuess(2);
    }
}

function checkLongWordGuess(rowNumber) {
    const correctWord = set.longword.toUpperCase().split('');
    const inputBoxes = document.querySelectorAll(`#longword-input${rowNumber} input`);
    let userGuess = '';
    let allCorrect = true;

    // Check each letter and apply coloring
    inputBoxes.forEach((input, index) => {
        const guessedLetter = input.value.toUpperCase();
        userGuess += guessedLetter;

        if (guessedLetter === correctWord[index]) {
            input.style.backgroundColor = "lightgreen";
            input.style.color = "white";
        } else {
            allCorrect = false;
            input.style.backgroundColor = "";
        }
    });

    if (allCorrect) {
        longWordSolved = true;
        disableRow(inputBoxes);
        disableRow(document.querySelectorAll("#longword-input2 input"));
        checkWinCondition();
    } else if (rowNumber === 1) {
        // Lock first row and enable the second row for another attempt
        disableRow(inputBoxes);
        document.querySelectorAll("#longword-input2 input").forEach(box => box.disabled = false);
    } else {
        showGameOverOverlay();
    }
}

function disableRow(inputBoxes) {
    inputBoxes.forEach(box => box.disabled = true);
}

function checkWinCondition() {
    // Increment streak and reset game if both words are solved
    if (shortWordSolved && longWordSolved) {
        streak += 1;
        console.log("Streak: " + streak);
        document.getElementById("streak-number").innerText = streak;
        showWinAnimation();
        displayRandomWords(); // Reset the game
    }
}

function showWinAnimation() {
    const bearImage = document.createElement("img");
    bearImage.src = "Streak Flame.png"; 
    bearImage.id = "streak-bear-animation";

    document.body.appendChild(bearImage);

    // Remove the image after animation completes
    bearImage.addEventListener("animationend", () => {
        bearImage.remove();
    });
}

function resetAndRestart() {
    streak = 0; // reset
    displayRandomWords(); // Call the function to start a new game
}



window.onload = loading