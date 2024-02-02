// A game where you have to solve math problems in a limited time
// The problems are randomly generated and vary in difficulty
// You have to type the correct answer before the time runs out

// Set the time limit in seconds
var timeLimit = 10;

// Set the difficulty level from 1 to 5
var difficulty = 3;

// Get the HTML elements
var problemElement = document.getElementById("problem");
var answerElement = document.getElementById("answer");
var timerElement = document.getElementById("timer");
var feedbackElement = document.getElementById("feedback");
var scoreElement = document.getElementById("score");

// Generate a random math problem and its answer
function generateProblem() {
  // Choose a random operator from +, -, *, /
  var operators = ["+", "-", "*", "/"];
  var operator = operators[Math.floor(Math.random() * operators.length)];

  // Choose two random operands from 1 to 10 * difficulty
  var maxOperand = 10 * difficulty;
  var operand1 = Math.floor(Math.random() * maxOperand) + 1;
  var operand2 = Math.floor(Math.random() * maxOperand) + 1;

  // Adjust the operands and the operator if necessary
  // For example, avoid division by zero or negative numbers
  if (operator == "/") {
    // Make sure the second operand is not zero
    while (operand2 == 0) {
      operand2 = Math.floor(Math.random() * maxOperand) + 1;
    }
    // Make sure the result is an integer
    while (operand1 % operand2 != 0) {
      operand1 = Math.floor(Math.random() * maxOperand) + 1;
    }
  } else if (operator == "-") {
    // Make sure the result is not negative
    while (operand1 < operand2) {
      operand1 = Math.floor(Math.random() * maxOperand) + 1;
    }
  }

  // Calculate the answer
  var answer;
  switch (operator) {
    case "+":
      answer = operand1 + operand2;
      break;
    case "-":
      answer = operand1 - operand2;
      break;
    case "*":
      answer = operand1 * operand2;
      break;
    case "/":
      answer = operand1 / operand2;
      break;
  }

  // Return the problem and the answer as an object
  return {
    problem: operand1 + " " + operator + " " + operand2,
    answer: answer,
  };
}

// Start the game
function startGame() {
  // Initialize the score and the timer
  var score = 0;
  var timer = timeLimit;

  // Display the instructions
  feedbackElement.innerHTML =
    "Welcome to the math game!<br>You have " +
    timeLimit +
    " seconds to solve as many problems as you can.<br>Type your answer and press Enter to submit.<br>Good luck!";

  // Start the countdown
  var countdown = setInterval(function () {
    // Update the timer
    timer--;

    // Display the timer
    timerElement.innerHTML = "Time left: " + timer + "s";

    // Check if the time is up
    if (timer == 0) {
      // Stop the countdown
      clearInterval(countdown);

      // End the game and show the score
      feedbackElement.innerHTML = "Time's up!<br>Your score is " + score + ".";
      scoreElement.innerHTML = "";
      problemElement.innerHTML = "";
      answerElement.value = "";
      answerElement.disabled = true;
    }
  }, 1000); // 1000 milliseconds = 1 second

  // Start the loop
  var loop = setInterval(function () {
  setTimeout(function () {

    // Generate a new problem
    var problem = generateProblem();

    // Display the problem
    problemElement.innerHTML = problem.problem;

    // Clear the answer input
    answerElement.value = "";
    answerElement.focus();

    // Listen for the user input
    answerElement.onkeyup = function (event) {
      // Check if the user pressed Enter
      if (event.keyCode == 13) {
        // Get the user answer
        var userAnswer = answerElement.value;

        // Check if the user answer is correct
        if (userAnswer == problem.answer) {
          // Increase the score
          score++;

          // Give positive feedback
          feedbackElement.innerHTML = "Correct!";
          scoreElement.innerHTML = "Your score is " + score + ".";
        } else {
          // Give negative feedback
          feedbackElement.innerHTML =
            "Wrong!<br>The correct answer is " + problem.answer + ".";
          scoreElement.innerHTML = "";
        }
      }
    };
  }, 1000); // 0 milliseconds = as fast as possible
}, 0);
},
// Run the game
startGame();
