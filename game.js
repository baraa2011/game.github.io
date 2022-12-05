const container = document.querySelector(".container");
const history = document.querySelector(".history");
const score = document.querySelector(".score-points");
const lives = document.querySelector(".live-points");
const remaining = document.querySelector(".match-points");
const gameInfoBottom = document.querySelector(".game-info-bottom");
const gameInfoTop = document.querySelector(".game-info-top");
const modal = document.querySelector(".modal");
const bonus = document.querySelector(".bonus");
const modalTitle = document.querySelector(".modal-title");
const modalText = document.querySelector(".modal-text");
const backFaceImageSource = "./images/front-image.png";
const date = new Date();


//game variables
let clickedCardsArray = [];
let scorePoints = 0;
let remainingPoints = 8;
let livePoints = 6;
let hits = 0;

const imagesArray = [
   { name: "Alhamra", source: "./images/alhamra_tower.jpeg" },
   { name: "Biza", source: "./images/biza.jpeg" },
   { name: "Burj Khalifa", source: "./images/burj_khalifa.jpeg" },
   { name: "CN", source: "./images/cn_tower.jpeg" },
   { name: "Liberty", source: "./images/liberty_tower.jpeg" },
   { name: "Big Ben", source: "./images/big_ben.jpeg" },
   { name: "Eifel", source: "./images/eifel_tower.jpeg" },
   { name: "Turning Torso", source: "./images/turning_torso.jpeg" },
   { name: "Alhamra", source: "./images/alhamra_tower.jpeg" },
   { name: "Biza", source: "./images/biza.jpeg" },
   { name: "Burj Khalifa", source: "./images/burj_khalifa.jpeg" },
   { name: "CN", source: "./images/cn_tower.jpeg" },
   { name: "Liberty", source: "./images/liberty_tower.jpeg" },
   { name: "Big Ben", source: "./images/big_ben.jpeg" },
   { name: "Eifel", source: "./images/eifel_tower.jpeg" },
   { name: "Turning Torso", source: "./images/turning_torso.jpeg" }
];

const newGameButton = document.querySelectorAll(".new-game-button");

newGameButton.forEach(button => {
   button.addEventListener("click", () => {
      // scorePoints = 0;
      // remainingPoints = 8;
      // livePoints = 6;
      // hits = 0;
      // handleScore(0);
      // handleLives(6);
      // handleRemainingMatches(8);
      // resetBoard();
      // toggleElements();
      location.reload();
   });

});

const clearHistoryButon = document.querySelector(".clear-history-button");
clearHistoryButon.addEventListener("click", () => {
   const isHistoryExist = Object.keys(localStorage).filter(key => key.includes("history")).length;
   if (isHistoryExist) {
      for (const key in localStorage) {
         if (key.includes("history")) {
            localStorage.removeItem(key);
         }
      }
      history.classList.add("hidden");
   }
})

const shuffleArray = (array) => {
   array.sort(() => Math.random() - 0.5)
   return array;
}

createElementWtihAttributes = (element, attributes) => {
   const HTMLElement = document.createElement(element); //element =  div
   for (let key in attributes) {
      HTMLElement.setAttribute(key, attributes[key]);
   }
   return HTMLElement;
}

const createCards = () => {
   const cards = createElementWtihAttributes("div", { class: "cards" });
   const shuffeledCards = shuffleArray(imagesArray);

   for (let i = 0; i < shuffeledCards.length; i++) {
      const card = createElementWtihAttributes("div", { class: "card", "name": shuffeledCards[i].name });
      //face
      const cardFace = createElementWtihAttributes("div", { class: "face" });
      const faceImage = createElementWtihAttributes("img", { class: "front-face-image", src: shuffeledCards[i].source });
      cardFace.appendChild(faceImage);

      //back
      const cardBack = createElementWtihAttributes("div", { class: "back" });
      const backImage = createElementWtihAttributes("img", { class: "back-face-image", src: backFaceImageSource });
      cardBack.appendChild(backImage);

      card.appendChild(cardFace);
      card.appendChild(cardBack);

      card.addEventListener("click", (event) => {
         card.classList.toggle("show-face");
         compareTwoCards(event);
      })

      cards.appendChild(card);
      container.insertBefore(cards, gameInfoBottom); //insert cards before gemInBottom
   }
}

const handleBonus = () => {
   if (hits === 2) {
      livePoints = livePoints + 1;
      handleLives(livePoints);
      bonus.classList.remove("invisible");
      bonus.classList.add("visible");
      hits = 0;
      setTimeout(() => {
         bonus.classList.add("invisible");
         bonus.classList.remove("visible");
      }, 2000);
   }
}

const isMatch = (array) => {
   scorePoints++;
   remainingPoints--;
   hits = hits + 1;
   const cards = array[0].parentNode;
   array.forEach((card) => {
      const placeHolder = createElementWtihAttributes("div", { class: "placeholder" });
      setTimeout(() => {
         cards.replaceChild(placeHolder, card);
      }, 2000);
   });
   setTimeout(() => {
      handleScore(scorePoints);
      handleRemainingMatches(remainingPoints);
   }, 2000);
   handleBonus();
}

const isDifferent = (array) => {
   scorePoints--;
   livePoints--;
   hits = 0; // empty hits
   array.forEach((card) => {
      setTimeout(() => {
         card.classList.remove("show-face");
      }, 1000);
   });
   setTimeout(() => {
      handleScore(scorePoints);
      handleLives(livePoints);
   }, 1000);
}

const compareTwoCards = (evt) => {
   const clickedCard = evt.target;
   clickedCardsArray.push(clickedCard);
   
   if (clickedCardsArray.length === 2) {
      if (clickedCardsArray[0] !== clickedCardsArray[1]) {
         if (clickedCardsArray[0].getAttribute("name") === clickedCardsArray[1].getAttribute("name")) {
            isMatch(clickedCardsArray);
         }
         else {
            isDifferent(clickedCardsArray);
         }
      }
      clickedCardsArray = []; //empty cardsArray
   }
}

const handleScore = (value) => {
   score.innerText = value;
}

const handleRemainingMatches = (value) => {
   remaining.innerText = value;
   if (value === 0) {
      handleWin();
   }
}

const handleLives = (value) => {
   lives.innerText = value;
   if (value === 6 || value === 5) {
      lives.style.background = "dodgerblue";
   }
   else if (value === 4 || value === 3) {
      lives.style.background = "rgb(255 197 0)";
   } else if (value === 2 || value === 1) {
      lives.style.background = "rgb(224, 7, 81)";
   }
   else if (value === 0) {
      handleGameOver();
   }
}

const resetBoard = () => {
   const cards = document.querySelector(".cards");
   container.removeChild(cards);
   createCards();
}

const handleGameOver = () => {
   modal.classList.remove("hidden");
   modalTitle.innerText = "The game is over";
   modalText.innerText = "You have no more lives. Start a new game to play again";
   const stats = { state: false, lives: livePoints, score: scorePoints };
   const time = date.getTime();
   localStorage.setItem("history" + time.toString(), JSON.stringify(stats)); // dont site an item in storge()
   handleHistory();
}

const handleWin = () => {
   modal.classList.remove("hidden");
   modalTitle.innerText = "Congrats. You won the game";
   modalText.innerText = "Start a new game to play again";
   gameInfoBottom.classList.add("hidden");
   gameInfoTop.classList.add("hidden");
   const stats = { state: true, lives: livePoints, score: scorePoints }; // statstic
   const time = date.getTime();
   localStorage.setItem("history" + time.toString(), JSON.stringify(stats)); //don't returen so therefore use reload
   handleHistory();
}

const toggleElements = () => {
   if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
   }
   if (gameInfoBottom.classList.contains("hidden")) {
      gameInfoBottom.classList.toggle("hidden");
   }
   if (gameInfoTop.classList.contains("hidden")) {
      gameInfoTop.classList.toggle("hidden");
   }
}

const handleStats = (array) => {
   const historyWin = document.querySelector(".history-win");
   const historyLose = document.querySelector(".history-lose");
   let nbrOfWins = 0;
   let numberOfLoses = 0;
   for (let i = 0; i < array.length; i++) {
      const state = array[i];
      if (state === true) {
         nbrOfWins = nbrOfWins + 1;
      } else {
         numberOfLoses = numberOfLoses + 1;
      }
   }
   historyWin.innerText = `Wins: ${nbrOfWins}`;
   historyLose.innerText = `Loses: ${numberOfLoses}`;
}

const handleTopScore = (array) => {
   const scoreSpan = document.querySelector(".top-score");
   let topScore = -6; 
   let temp = 0;
   for (let i = 0; i < array.length; i++) {
      const score = array[i];
      temp = score;
      if (temp > topScore) {
         topScore = temp;
      }
      
      
   }
   scoreSpan.innerText = `Top score: ${topScore}`;
}

const handleTopLives = (array) => {
   const livesSpan = document.querySelector(".top-lives");
   let topLives = 0;
   let temp = 0;
   for (let i = 0; i < array.length; i++) {
      const live = array[i];
      temp = live;
      if (temp > topLives) {
         topLives = temp;
      }
   }
   livesSpan.innerText = `Top lives: ${topLives}`;
}


const handleHistory = () => {
   const isHistoryExist = Object.keys(localStorage).filter(key => key.includes("history")).length;
   if (isHistoryExist) {
      if (history.classList.contains("hidden")) {
         history.classList.remove("hidden");
      }
      const statsArray = [];
      const scoresArray = [];
      const livesArray = [];

      for (const key in localStorage) {
         if (key.includes("history")) {
            const historyObject = JSON.parse(localStorage[key]);
            const { state, score, lives } = historyObject;
            statsArray.push(state);
            scoresArray.push(score);
            livesArray.push(lives);
         }
      }
      handleStats(statsArray);
      handleTopScore(scoresArray);
      handleTopLives(livesArray);
   }
}

createCards();
handleHistory();
