var fieldSize = {
  width: 6,
  height: 5,
};
var field = document.getElementById("game-field");
var score = document.getElementById("moves");
var newGameBtn = document.getElementById("new-game");
var checkedFirst = null;
var checkedSecond = null;
var allowClick = true;
var moves = 0;

function initCardArray(width, height) {
  var values = new Array((width * height) / 2);
  for (var i = 0; i < values.length; i++) {
    values[i] = i % 10;
  }
  values = values.concat(values);
  values.sort(function () {
    return Math.random() - 0.5;
  });
  var cards = document.getElementsByClassName("back");
  for (var i = 0; i < cards.length; i++) {
    cards[i].innerText = values[i];
  }
}

function resetCheckedCards() {
  checkedFirst = null;
  checkedSecond = null;
}

function endGame() {
  var wickedCards = document.getElementsByClassName("wicked");
  if (wickedCards.length == fieldSize.width * fieldSize.height) return true;
  return false;
}

function flipOnClick() {
  if (!checkedFirst && allowClick && !this.classList.contains("wicked")) {
    checkedFirst = this;
    this.classList.add("flip");
  } else if (!checkedSecond && !this.classList.contains("wicked")) {
    checkedSecond = this;
    score.innerHTML = ++moves;
    this.classList.add("flip");
    if (
      checkedFirst.innerHTML == checkedSecond.innerHTML &&
      checkedFirst != checkedSecond
    ) {
      checkedFirst.classList.add("wicked");
      checkedSecond.classList.add("wicked");
      resetCheckedCards();
      if (endGame()) {
        setTimeout(function () {
          alert("You won in " + moves + " moves");
        }, 500);
      }
    } else {
      allowClick = false;
      setTimeout(function () {
        checkedFirst.classList.remove("flip");
        checkedSecond.classList.remove("flip");
        resetCheckedCards();
        allowClick = true;
      }, 1000);
    }
  }
}

function initField(width, height) {
  var centeringDiv = document.createElement("div");
  for (var i = 0; i < height; i++) {
    var itemsRow = document.createElement("div");
    itemsRow.className = "items-row";
    for (var j = 0; j < width; j++) {
      var fieldItem = document.createElement("div");
      fieldItem.className = "item";
      fieldItem.onclick = flipOnClick;

      fieldItem.appendChild(document.createElement("div")).className = "front";

      fieldItem.appendChild(document.createElement("div")).className = "back";

      itemsRow.appendChild(fieldItem);
    }
    centeringDiv.appendChild(itemsRow);
  }
  field.appendChild(centeringDiv);
}

function initFieldSize() {
  var xhr = new XMLHttpRequest();
  try {
    xhr.open("GET", "https://kde.link/test/get_field_size.php", false);
    xhr.send();
    if (xhr.status != 200) {
      fieldSize = {
        width: 5,
        height: 6,
      };
    } else {
      fieldSize = JSON.parse(xhr.responseText);
    }
  } catch (err) {
    fieldSize = {
      width: 5,
      height: 6,
    };
  }
}

function startGame() {
  checkedFirst = null;
  checkedSecond = null;
  allowClick = true;
  moves = 0;
  score.innerHTML = "0";
  field.innerHTML = "";
  newGameBtn.onclick = startGame;
  initFieldSize();
  initField(fieldSize.width, fieldSize.height);
  initCardArray(fieldSize.width, fieldSize.height);
}

startGame();
