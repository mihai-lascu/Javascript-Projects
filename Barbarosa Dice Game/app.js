/*
Barbarosa GAME RULES:
- The game has 2 players, playing in rounds
- In each turn, a player rolls the dice as many times as he whishes. Each result gets added to his ROUND score
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 1000 points exactly on GLOBAL score wins the game
- You have to get 100 points to enter the game and to be able to hold your score
- There will be 2 challenges, 1 between 200 and 300 points and 1 between 700 and 800 points, where you will be able to hold your score only once
*/
var scores, roundScore, activePlayer, gamePlaying, winScore;
var diceRolls = [0, 0, 0, 0, 0, 0, 0];

var Dice = function(image, disabled = false, value = 0) {
  this.value = value;
  this.disabled = disabled;
  this.image = image;
};

Dice.prototype.roll = function() {
  if (this.disabled) {
    this.value = 0;
    this.hide();
  } else {
    this.value = Math.floor(Math.random() * 6) + 1;
    document.getElementById(this.image).style.display = 'block';
    document.getElementById(this.image).src = `dice-${this.value}.png`;
  }
};

Dice.prototype.hide = function () {
  document.getElementById(this.image).style.display = 'none';
};

Dice.prototype.reset = function () {
  this.value = 0;
  this.disabled = false;
};

var dice1 = new Dice('dice-1');
var dice2 = new Dice('dice-2');
var dice3 = new Dice('dice-3');
var dice4 = new Dice('dice-4');
var dice5 = new Dice('dice-5');
var dices = [dice1, dice2, dice3, dice4, dice5];

//start round
init();

function rollDice(dice) {
  dice.forEach(current => current.roll());
}

function hideDice(dice) {
  dice.forEach(current => current.hide());
}

function enableDice(dice) {
  dice.forEach(current => current.disabled = false);
}

function allDiceDisabled(dice) {
  for (current of dice) {
    if (current.disabled === false) {
      return false;
    }
  }
  return true;
}

function disableDice(diceBlock, value) {
  diceBlock.forEach(current => {
    if (current.value === value) {
      current.disabled = true;
    }
  });
}

function checkRolls(rolls) {
  var score = 0;
  rolls.forEach(current => diceRolls[current.value]++);

  for (var i = 1; i < diceRolls.length; i++) {
    switch (i) {
      case 1:
        if (diceRolls[i] <= 2) {
          score += 10 * diceRolls[i];
          disableDice(rolls, i);
        } else if (diceRolls[i] > 2 && diceRolls[i] <= 4) {
          score += 10 * 10 * (diceRolls[i] - 2);
          disableDice(rolls, i);
        } else {
          score += 10 * 10 * 4;
        }
        break;
      case 5:
        if (diceRolls[i] <= 2) {
          score += i * diceRolls[i];
          disableDice(rolls, i);
        } else if (diceRolls[i] > 2 && diceRolls[i] <= 4) {
          score += i * 10 * (diceRolls[i] - 2);
          disableDice(rolls, i);
        } else {
          score += i * 10 * 4;
        }
        break;
      default:
        if (diceRolls[i] <= 2) {
          score += 0;
        } else if (diceRolls[i] > 2 && diceRolls[i] <= 4) {
          score += i * 10 * (diceRolls[i] - 2);
          disableDice(rolls, i);
        } else {
          score += i * 10 * 4;
        }
        break;
    }
  }
  return score;
}

function resetRolls() {
  for (var i = 1; i < diceRolls.length; i++) {
    diceRolls[i] = 0;
  }
}

function checkScore(currentScore) {
  switch (true) {
    case currentScore === 0:
      document.querySelector('.btn-hold').style.display = 'none';
      break;
    case (currentScore + scores[activePlayer]) < 100:
      document.querySelector('.btn-hold').style.display = 'none';
      break;
    case (scores[activePlayer] > 300 && scores[activePlayer] < 400) && ((scores[activePlayer] + currentScore) < 400):
      document.querySelector('.btn-hold').style.display = 'none';
      break;
    case (scores[activePlayer] > 700 && scores[activePlayer] < 800) && ((scores[activePlayer] + currentScore) < 800):
      document.querySelector('.btn-hold').style.display = 'none';
      break;
    case (currentScore + scores[activePlayer]) > winScore:
      nextPlayer();
      break;
    default:
      document.querySelector('.btn-hold').style.display = 'block';
  }
}

document.querySelector('.btn-roll').addEventListener('click', function() {
  if (gamePlaying) {
    //roll dice
    var currentRoll = 0;

    rollDice(dices);
    currentRoll= checkRolls(dices);
    resetRolls();
    //check if one dice is 1
    if (currentRoll !== 0) {
      //add the score and display it
      roundScore += currentRoll;
      document.getElementById('current-' + activePlayer).textContent = roundScore;
      if (allDiceDisabled(dices)) {
        enableDice(dices);
      }
      checkScore(roundScore);

    } else {
      //nextPlayer
      nextPlayer();
    }
  }
});

document.querySelector('.btn-hold').addEventListener('click', function() {
  if (gamePlaying) {
    //add current score to global score and update UI
    if (scores[activePlayer] + roundScore <= winScore) {
      scores[activePlayer] += roundScore;
      document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

      //check if player won the game with score 100
      if (scores[activePlayer] === winScore) {
        hideDice(dices);
        document.getElementById('name-' + activePlayer).textContent = 'Winner!';
        document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner');
        document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active');
        gamePlaying = false;
      }else {
        //nextPlayer
        nextPlayer();
      }
    } else {
      nextPlayer();
    }
  }
});

document.querySelector('.btn-new').addEventListener('click', init);

function nextPlayer() {
  resetRolls();
  enableDice(dices);

  //reset the roundscore and display it
  roundScore = 0;
  document.getElementById('current-' + activePlayer).textContent = roundScore;

  //change the active player and toggle the visual cue
  document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
  activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
  document.querySelector('.player-' + activePlayer + '-panel').classList.toggle('active');
  checkScore(roundScore);
}

function init() {
  //start round with scores at 0 and no dice image
  scores = [0,0];
  activePlayer = 0;
  roundScore = 0;
  gamePlaying = true;
  winScore = 1000;
  resetRolls();
  enableDice(dices);

  document.getElementById('score-0').textContent = '0';
  document.getElementById('score-1').textContent = '0';
  document.getElementById('current-0').textContent = '0';
  document.getElementById('current-1').textContent = '0';
  document.getElementById('name-0').textContent = 'Player 1';
  document.getElementById('name-1').textContent = 'Player 2';

  hideDice(dices);

  document.querySelector('.player-0-panel').classList.remove('winner');
  document.querySelector('.player-1-panel').classList.remove('winner');
  document.querySelector('.player-0-panel').classList.remove('active');
  document.querySelector('.player-1-panel').classList.remove('active');

  document.querySelector('.player-0-panel').classList.add('active');
}
