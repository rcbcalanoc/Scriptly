const sampleText =
  "Typing fast is a skill that improves with consistent practice and focus.";

let startTime;
let interval;
let currentWordIndex = 0;
let correctWords = 0;
let totalWordsTyped = 0;
let gameFinished = false;

const textDisplay = document.getElementById("textDisplay");
const input = document.getElementById("input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");

function renderWords() {
  const words = sampleText.split(" ");

  textDisplay.innerHTML = words
    .map((word, index) => {
      if (index < currentWordIndex) {
        return `<span class="correct-word">${word}</span>`;
      }

      if (index === currentWordIndex) {
        return `<span class="current-word">${word}</span>`;
      }

      return `<span>${word}</span>`;
    })
    .join(" ");
}

function startTest() {

  gameFinished = false;
  
  currentWordIndex = 0;
  correctWords = 0;
  totalWordsTyped = 0;

  input.disabled = false;
  input.value = "";
  input.focus();

  startTime = null;

  clearInterval(interval);
  interval = setInterval(updateStats, 500);

  wpmEl.innerText = 0;
  accuracyEl.innerText = 100;

  renderWords();
}

function stopGame() {

  gameFinished = true;

  clearInterval(interval);
  input.disabled = true;

  updateStats();

  const finalWpm = wpmEl.innerText;
  const finalAccuracy = accuracyEl.innerText;

  document.querySelector(".container").innerHTML = `
    <div class="results-screen">
      <h1>🎉 You Finished!</h1>

      <div class="result-card">
        <h2>Results</h2>

        <p><strong>WPM:</strong> ${finalWpm}</p>
        <p><strong>Accuracy:</strong> ${finalAccuracy}%</p>

        <button onclick="location.reload()">
          Play Again
        </button>
      </div>
    </div>
  `;
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter") return;

  e.preventDefault();

  // Start game
  if (input.disabled && !gameFinished) {
    startTest();
  }

  // Restart after finish
  if (gameFinished) {
    location.reload();
  }
});

input.addEventListener("input", () => {
  const words = sampleText.split(" ");
  const currentWord = words[currentWordIndex];

  let html = "";

  words.forEach((word, index) => {
    if (index < currentWordIndex) {
      html += `<span class="correct-word">${word}</span> `;
      return;
    }

    if (index === currentWordIndex) {
      let chars = "";

      word.split("").forEach((char, charIndex) => {
        const typedChar = input.value[charIndex];

        let cls = "";

        if (typedChar !== undefined) {
          cls =
            typedChar === char
              ? "correct-char"
              : "wrong-char";
        }

        chars += `<span class="${cls}">${char}</span>`;
      });

      html += `<span class="current-word">${chars}</span> `;
      return;
    }

    html += `<span>${word}</span> `;
  });

  textDisplay.innerHTML = html.trim();

  if (!startTime && input.value.length > 0) {
    startTime = new Date();
  }

  if (
  currentWordIndex === words.length - 1 &&
  input.value === currentWord
) {
  correctWords++;
  totalWordsTyped++;

  stopGame();
}
});

input.addEventListener("keydown", (e) => {
  if (e.key !== " ") return;

  e.preventDefault();

  const words = sampleText.split(" ");
  const currentWord = words[currentWordIndex];

  totalWordsTyped++;

  // CASE SENSITIVE CHECK
  if (input.value === currentWord) {
    correctWords++;
    currentWordIndex++;

    input.value = "";

    renderWords();

    if (currentWordIndex >= words.length) {
      stopGame();
    }
  }

  
});

function updateStats() {
  if (!startTime) return;

  const timeInMinutes =
    (new Date() - startTime) / 1000 / 60;

  const charsTyped = correctWords * 5;

  const wpm =
    Math.round((charsTyped / 5) / timeInMinutes) || 0;

  wpmEl.innerText = wpm;

  const accuracy =
    totalWordsTyped === 0
      ? 100
      : Math.round(
          (correctWords / totalWordsTyped) * 100
        );

  accuracyEl.innerText = accuracy;
}

renderWords();