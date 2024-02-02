// A game where you have to solve math problems in a limited time
// The problems are randomly generated and vary in difficulty
// You have to type the correct answer before the time runs out

// Set the time limit in seconds
var timeLimit = 10;

// Set the difficulty level from 1 to 5
var difficulty = 3;

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
  alert(
    "Welcome to the math game!\nYou have " +
      timeLimit +
      " seconds to solve as many problems as you can.\nType your answer and press OK or Enter to submit.\nGood luck!"
  );

  // Start the countdown
  var countdown = setInterval(function () {
    // Update the timer
    timer--;

    // Check if the time is up
    if (timer == 0) {
      // Stop the countdown
      clearInterval(countdown);

      // End the game and show the score
      alert("Time's up!\nYour score is " + score + ".");
    }
  }, 1000); // 1000 milliseconds = 1 second

  // Start the loop
  var loop = setInterval(function () {
    // Generate a new problem
    var problem = generateProblem();

    // Prompt the user for an answer
    var userAnswer = prompt(problem.problem + "\nTime left: " + timer + "s");

    // Check if the user wants to quit
    if (userAnswer == null) {
      // Stop the loop and the countdown
      clearInterval(loop);
      clearInterval(countdown);

      // End the game and show the score
      alert("You quit the game.\nYour score is " + score + ".");
    } else {
      // Check if the user answer is correct
      if (userAnswer == problem.answer) {
        // Increase the score
        score++;

        // Give positive feedback
        alert("Correct!\nYour score is " + score + ".");
      } else {
        // Give negative feedback
        alert("Wrong!\nThe correct answer is " + problem.answer + ".");
      }
    }
  }, 0); // 0 milliseconds = as fast as possible
}

// Run the game
startGame();
      
