const levelDiv = document.querySelector(".level");
const levelBtns = document.querySelector(".level__btn");
const easy = document.querySelector(".level__easy");
const medium = document.querySelector(".level__medium");
const hard = document.querySelector(".level__hard");
const guess = document.querySelector(".guess");
const check = document.querySelector(".check");
const gameDiv = document.querySelector(".game");
const wordGuessDiv = document.querySelector(".word__guess");
const wordDisplayH1 = document.querySelector(".word__guess--display");
const playAgainBtn = document.querySelector(".btn__playagain");
const keyboardDiv = document.querySelector(".keyboard");

// HANGMAN PARTS
const hangmanHead = document.querySelector(".hangman__fig-5");
const hangmanBody = document.querySelector(".hangman__fig-6");
const hangmanLeftHand = document.querySelector(".hangman__fig-7--left");
const hangmanRightHand = document.querySelector(".hangman__fig-7--right");
const hangmanLeftLeg = document.querySelector(".hangman__fig-7--left-leg");
const hangmanRightLeg = document.querySelector(".hangman__fig-7--right-leg");

let gameW;
let gameArr;
let lives = 6;
let wrdChoosenLength = 8;

const changeWrdLgn = (el) => {
  if (el.path[0].classList.contains("level__easy")) {
    wrdChoosenLength = 6;
  } else if (el.path[0].classList.contains("level__hard")) {
    wrdChoosenLength = 20;
  }
};

const goToGame = (el) => {
  changeWrdLgn(el);
  levelDiv.classList.add("hidden");
  game(wrdChoosenLength);
  gameDiv.classList.remove("hidden");
  keyboardDiv.classList.remove("hidden");
};

easy.addEventListener("click", (el) => {
  goToGame(el);
});
medium.addEventListener("click", (el) => {
  goToGame(el);
});

hard.addEventListener("click", (el) => {
  goToGame(el);
});

const randWord = async function () {
  try {
    const response = await fetch(
      `http://api.wordnik.com/v4/words.json/randomWord?api_key=rq96j6kcsov15r5sgy7zhrzcszpk1s65kp8cvvv01jhckm0aj`,
      { hasDictionaryDef: "true" }
    );
    const { word } = await response.json();
    console.log(word);
    const wordArr = [...word];
    console.log(wordArr);
    return wordArr;
  } catch (err) {
    console.log(err);
    const word = await fetch(
      `https://random-word-api.herokuapp.com/word?number=1`
    );
    const [data] = await word.json();
    console.log(word);
    const wordArr = [...data];
    console.log(wordArr);
    return wordArr;
  }
};

const game = async function (n) {
  const wrd = await randWord();
  if (wrd.length > n) game(wrdChoosenLength);
  else {
    const map1 = wrd.map((e) => (e = "__"));
    console.log(wrd, map1);
    gameW = wrd;
    gameArr = map1;
    displayGameArray();
  }
};

const displayGameArray = () => {
  let displayGameArr = gameArr.toString();
  wordDisplayH1.innerHTML = displayGameArr.replace(/,/g, " ");
  wordDisplayH1.style.animation = "none";
};

const addHangmanParts = () => {
  lives == 5 && hangmanHead.classList.remove("hidden");
  lives == 4 && hangmanBody.classList.remove("hidden");
  lives == 3 && hangmanLeftHand.classList.remove("hidden");
  lives == 2 && hangmanRightHand.classList.remove("hidden");
  lives == 1 && hangmanLeftLeg.classList.remove("hidden");
  if (lives == 0) {
    hangmanRightLeg.classList.remove("hidden");
    playAgainBtn.classList.remove("hidden");
    const lostMessage = document.createElement("h1");
    const lostMessageTetx = document.createTextNode(
      `You Lost :( ..The word was: ${gameW.join("")} `
    );
    lostMessage.appendChild(lostMessageTetx);
    lostMessage.classList.add("h1__display-lost");
    wordGuessDiv.insertBefore(lostMessage, wordGuessDiv.childNodes[0]);
    wordDisplayH1.classList.add("hidden");
    gameW = [];
    playAgainBtn.addEventListener("click", () => {
      resetGame();
      lostMessage.remove();
    });
  }
};

const resetGame = function () {
  lives = 6;
  levelDiv.classList.remove("hidden");
  keyboardDiv.classList.add("hidden");
  gameDiv.classList.add("hidden");
  hangmanHead.classList.add("hidden");
  hangmanBody.classList.add("hidden");
  hangmanLeftHand.classList.add("hidden");
  hangmanLeftLeg.classList.add("hidden");
  hangmanRightHand.classList.add("hidden");
  hangmanRightLeg.classList.add("hidden");
  playAgainBtn.classList.add("hidden");
  wordDisplayH1.classList.remove("hidden");
  wordDisplayH1.style.marginTop = "0";
  wordDisplayH1.innerHTML = "Finding a Word...";
};

const checkResult = function () {
  if (!gameArr.includes("__")) {
    const winH1 = document.createElement("h1");
    const winH1text = document.createTextNode("You Won!!");
    winH1.appendChild(winH1text);
    winH1.classList.add("h1__display-win");
    wordGuessDiv.insertBefore(winH1, wordGuessDiv.childNodes[0]);
    wordDisplayH1.style.marginTop = "15vh";
    playAgainBtn.classList.remove("hidden");
    playAgainBtn.addEventListener("click", () => {
      resetGame();
      winH1.remove();
    });
  }
};

document.addEventListener("keydown", (el) => {
  const guessKey = el.key;
  checkAnswer(guessKey);
  displayGameArray();
  console.log(gameArr, gameW);
});

keyboardDiv.childNodes.forEach((el) =>
  el.addEventListener("click", (target) => {
    console.log(target.target.id);
    checkAnswer(target.target.id);
    displayGameArray();
  })
);

const checkAnswer = function (key) {
  gameW.map((w, i) => (w == key ? (gameArr[i] = key) : 0));

  if (gameW.includes(key)) {
    console.log("right answer");
    checkResult();
  } else {
    --lives;
    addHangmanParts();
  }
};
