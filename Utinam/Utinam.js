// DAPHNE LAI

// tracking state variable
let mode = 1;

// constants
const startTime = 1800;
const paddingRL = 30;
const paddingTB = 20;

// home page var. (static)
let startBtn, infoBtn;

// information page var. (static)
let infoText;

// game play var.
let timer = startTime;
let userAnswer = 0;
let scoreCounter = 0;
let scoreDisplay;
let isPlayed = false;
let fillRandom = [];

// end game page var.
let scoreJSON = [];
let pastScores = [];
let scrBoardUser;
let scrBoardScore;

// DOM elements (dynamic)
let backBtn, submitBtn, nextBtn;
let userInput;
let userName;
let message;
let title;
let userDisplay;

/*------------------------------------------------------------------ PRELOAD ------------------------------------------------------------------*/
function preload() {
  // load scores from previous games
  pastScores = loadJSON("data/top_scores.json");
  // text for information page
  infoText = loadStrings("data/information.txt");
}

/*------------------------------------------------------------------ SET UP ------------------------------------------------------------------*/
function setup() {
  createCanvas(900, 800);

  // game title 
  title = createElement('h1', 'Welcome to Utinam');
  title.style('font-family', 'courier'); 

  // user input
  userInput = createInput();
  userInput.style('padding-right', 10);
  userInput.style('padding-left', 10);
  userInput.style('padding-top', paddingTB/2);
  userInput.style('padding-bottom', paddingTB/2);
  userInput.style('font-family', 'courier');

  // html buttons
  startBtn = createButton("Let's start");
  infoBtn = createButton("Information");
  backBtn = createButton("Back");
  submitBtn = createButton("Generate!");
  nextBtn = createButton("Next");
  styleBtn(startBtn);
  styleBtn(infoBtn);
  styleBtn(backBtn);
  styleBtn(submitBtn);
  styleBtn(nextBtn);

  // DOM paragraphs 
  userDisplay = createP();
  userDisplay.style('font-family', 'courier');

  scrBoardUser = createP();
  scrBoardUser.style("font-family", 'courier');
  scrBoardUser.style("font-size", 30);

  scrBoardScore = createP();
  scrBoardScore.style("font-family", 'courier');
  scrBoardScore.style("font-size", 30);

  // game initialization
  mode = 1;

  // paragraphs
  message = createP();
  message.style('font-family', 'courier');

  scoreDisplay = createP();
  scoreDisplay.style("font-family", 'courier');
}

function draw() {
  gameMode(mode);
}

// allows each state to be drawn consecutively
function gameMode(mode) {
  if (mode === 1) { 
    startState(); // home page
  } else if (mode === 2) {
    information(); // info. page
  } else if (mode === 3) {
    usernameState(); // making username page
  } else if (mode === 4) {
    playState(); // game play
  } else if (mode === 5) {
    endGame(); // ending scores
  }
}

/*------------------------------------------------------------------ HOME PAGE ------------------------------------------------------------------*/
function startState() {
  background("#fde2e2");

  // set mode
  mode = 1;

  // game title
  title.style('font-style', '#363636');
  title.position(30, 30);
  title.style('font-size', 80);
  title.style('color', '#AF6262');
  title.html("Welcome to Utinam");

  // button position
  startBtn.position(width/2 - (startBtn.width + paddingRL * 2), height/2 - 50); 
  infoBtn.position(width/2 - (startBtn.width + paddingRL * 2), height/2 + 50);

  // display html
  startBtn.show();
  infoBtn.show();
  title.show();
  backBtn.hide();
  userInput.hide();
  submitBtn.hide();
  message.hide();
  nextBtn.hide();
  userDisplay.hide();
  scoreDisplay.hide();
  scrBoardUser.hide();
  scrBoardScore.hide();

  // button listeners
  infoBtn.mouseClicked(information);
  startBtn.mouseClicked(usernameState);

  // reset game values
  reset();
}

function reset() {
  isGenerated = false;
  timer = startTime;
  scoreCounter = 0;
}

/*------------------------------------------------------------------ INFO. PAGE ------------------------------------------------------------------*/

function information() {  
  background("#aacfcf"); // green

  // set mode
  mode = 2;

  // information paragraph
  message.html(infoText);
  message.position(30, 200);
  message.style("font-size", 25);

  // title 
  title.style('color', '#3D8D7E'); // dark green
  title.style('font-size', 50);
  title.html("What's Utinam?");

  // button position
  backBtn.position(width-150, height-100);

  // display html 
  backBtn.show();
  startBtn.hide();
  infoBtn.hide();
  userInput.hide();
  submitBtn.hide();
  nextBtn.hide();
  scoreDisplay.hide();
  message.show();
  // button listeners
  backBtn.mouseClicked(startState);
}

/*------------------------------------------------------------------ USERNAME PAGE ------------------------------------------------------------------*/

let isGenerated = false;

// ---------- USER NAME PAGE ---------- //

function usernameState() {
  background("#A4E0F2"); // blue  
  // set mode
  mode = 3;

  // username title
  title.style('font-size', 50);
  title.style('color', '#4CA2D8'); // dark blue
  title.html("Let's generate a username :D");

  // input position
  userInput.position(width/2 - userInput.width - 20, height/2 - 150);

  // submit button styling
  submitBtn.style('padding-left', paddingRL/3);
  submitBtn.style('padding-right', paddingRL/3);
  submitBtn.style('padding-top', paddingTB/3);
  submitBtn.style('padding-bottom', paddingTB/3);
  submitBtn.style('font-size', 20);

  // button position
  backBtn.position(10, height-100);
  submitBtn.position(width/2, height/2 - 150);

  // button listeners
  backBtn.mouseClicked(startState);
  submitBtn.mouseClicked(generateUser);

  // display html 
  startBtn.hide();
  infoBtn.hide();
  backBtn.show();
  userInput.show();
  submitBtn.show();
  scoreDisplay.hide();

  // play button 
  nextBtn.html("PLAY");
  styleBtn(nextBtn);
  nextBtn.position(width - 150, height - 100);
  nextBtn.show();
  
  // prompted message after name is generated
  message.html("Great! Time to play!");
  message.position(width/2 - 150, height/2 + 80);
  message.style("font-size", 20);
  
  // checks if a name has been made
  if (isGenerated) {
    // allow user to play
    nextBtn.disabled = false;
    nextBtn.style('background-color', "#FFFFFF");
    nextBtn.mouseClicked(playState);
    message.show();
  } else {
    // don't allow user to play
    nextBtn.disabled = true;
    nextBtn.style('background-color', "#D5D5D5"); // deactivate btn
    message.hide();
  }
}


// ---------- HELPER FUNCTION THAT GENERATES THE USER NAME ---------- //

function generateUser() {
  let origName = userInput.value().toLowerCase();
  let newName = [];

  origName = origName.trim(); // remove whitespace

  // dictionary for conversion
  charToNum = { 1: ['a', 'h', 'i', 'p'], 
                2: ['d', 'e', 'm', 'v'], 
                3: ['c', 'r', 'z'], 
                4: ['f', 'k', 'q', 'x'], 
                5: ['b', 'j', 'l', 'n'], 
                6: ['g', 'u'], 
                7: ['o', 'y'], 
                8: 's', 
                9: ['t', 'w']
              };

  // maintain first char.
  newName[0] = origName[0]; 

  // letter >> number
  for (let ch = 1; ch < origName.length - 1; ch++) {
    for (let n = 1; n < 10; n++) {
      if (charToNum[n].includes(origName[ch])) {
        newName.push(str(n));
      }
    }
  }

  // if the name is less than 4, add zeros
  if (newName.length < 4) {
    for (let idx = 1; idx < 4; idx++) {
      newName.push('0');
    }
  }

  // add final character 
  newName[4] = origName[origName.length-1];

  // truncate username
  newName = newName.splice(0, 5);
  // finalize username as a string
  userName = str(newName.join("").toUpperCase());

  // position and draw the new username
  userDisplay.style('font-size', 80);
  userDisplay.position(width/2 - 150, height/2 - 80);
  userDisplay.html(userName);

  userDisplay.show();
  userInput.value("");
  isGenerated = true;
}

/*------------------------------------------------------------------ GAME PLAY ------------------------------------------------------------------*/

// ---------- PLAY PAGE INTERFACE ---------- //

function playState() {
  background("#FFFDC5"); // YELLOW

  // set mode
  mode = 4;

  // input position
  userInput.position(width/2 - userInput.width/2, height-100);

  // display username
  userDisplay.style('font-size', 20);
  userDisplay.position(15, 0);

  // display score
  scoreDisplay.html("SCORE: " + scoreCounter);
  scoreDisplay.position(15, 25);

  // exit button
  nextBtn.html("EXIT");
  nextBtn.style('padding-left', paddingRL/3);
  nextBtn.style('padding-right', paddingRL/3);
  nextBtn.style('padding-top', paddingTB/3);
  nextBtn.style('padding-bottom', paddingTB/3);
  nextBtn.style('font-size', 20);
  nextBtn.position(width - 80, 15);

  // display html
  message.hide();
  startBtn.hide();
  infoBtn.hide();
  backBtn.hide();
  submitBtn.hide();
  title.hide();
  userInput.show();
  userDisplay.show();
  nextBtn.show();
  scoreDisplay.show();

  // button listeners for exit button
  nextBtn.mouseClicked(startState);

  // run game mechanics
  playGame();
}

// ---------- RUNS TIMER, SHAPES, AND SCORES ---------- //

function playGame() {
  let timerLength;

  // update the timer
  timer--;
  timerLength = map(timer, startTime, 0, width, 0);

  // drawing the timer at the top of screen
  push();

  strokeWeight(8);
  stroke('#7381FF'); // vibrant purple
  line(0, 5, timerLength, 5);

  pop();

  // creating the shapes
  push();

  translate(width/2, height/2); // center the shape
  if (!isPlayed) {
    // change the appearance of the shape
    numPoints = floor(random(3, 12));
    for (let clr = 0; clr <  3; clr++) {
      fillRandom[clr] = random(215, 255);
    }
    isPlayed = true;
  } 

  if (int(userAnswer) ===  numPoints) {
    // when the answer is correct, change the appearance
    isPlayed = false;
    scoreCounter++;
  } else {
    isPlayed = true;
  }

  // drawing the shape
  fill(fillRandom[0], fillRandom[1], fillRandom[2]);
  strokeWeight(3);
  rotate(noise(timer/100)*10); // toggle the shape
  drawShape(numPoints);

  pop();

  // end game if time runs out
  if (timerLength <= 0) {
    endGame();
    topScores();
  }
}

// ---------- DRAWS INDIVIDUAL SHAPES ---------- //

function drawShape(numPoints) {
  let angle;

  // determines the angles to place the points
  angle = 360 / numPoints; 

  beginShape();
  for (let i = 0; i < 360; i+=angle) {
    let coordinate = polar(200, i);
    // draw verticies for polygon
    vertex(coordinate.x, coordinate.y);
  }
  endShape(CLOSE);
}

// ---------- HELPER FUNCTION FOR drawShape ---------- //

function polar( r, theta ) {
  let dt = radians( theta );

  let x = r * cos( dt );
  let y = r * sin( dt );

  return createVector( x, y );
}


/*------------------------------------------------------------------ END GAME ------------------------------------------------------------------*/

// ---------- END GAME PAGE ---------- //

function endGame() {
  background("#D0D3F0"); // light purple
  // set mode
  mode = 5;

  // home button
  nextBtn.html("HOME");

  // top score header
  title.html("TOP SCORES");
  title.style('color', "#7F85BA");
  title.position(width/2 - 150, 30);

  // display html
  startBtn.hide();
  infoBtn.hide();
  backBtn.hide();
  submitBtn.hide();
  title.show();
  message.hide();
  userInput.hide();
  userDisplay.show();
  nextBtn.show();
  scoreDisplay.show();
  message.hide();

  // button listener for home btn
  nextBtn.mouseClicked(startState);
}

// ---------- CALCULATES AND PRESENTS TOP 5 SCORES (From oldest to newest scores) ---------- //

function topScores() {
  //let tempArray = []; 

  // tempArray holds all previous and new scores
  scoreJSON = pastScores.prevScores;
  scoreJSON.push( {
  username: 
  userName, score: 
    scoreCounter
  }
  );

  // filter out values that are lower than the top 5
  let minVal = 0;

  if (scoreJSON.length > 5) { 
    for (let n = 0; n < scoreJSON.length; n++) {
      if (scoreJSON[n].score < scoreJSON[minVal].score) {
        minVal = n; // isolate the index of the smallest value
      }
    }
    scoreJSON.splice(minVal, 1);
  }

  print(minVal);
  // new top five to be saved on external file
  pastScores.prevScores = scoreJSON;

  // save new score json file
  save(pastScores, 'top_scores.json', true);

  // display final scores
  let displayScore; 
  let names = [];
  let scores = [];

  for (let scr = 0; scr < scoreJSON.length; scr++) {
    names.push(scoreJSON[scr].username);
    scores.push(scoreJSON[scr].score);
  }

  // presenting scoreboard
  scrBoardUser.html(names.join("<br> <br>"));
  scrBoardScore.html(scores.join("<br> <br>"));

  // score board username and scores positioning
  scrBoardUser.position(width/2 - 80, 200);
  scrBoardScore.position(width/2 + 30, 200);
  scrBoardUser.show();
  scrBoardScore.show();
}


/*------------------------------------------------------------------ HELPER FUNCTIONS ------------------------------------------------------------------*/

// ---------- STYLIZES ALL BUTTONS TO A UNIFORM STANDARD ---------- //

function styleBtn(button) {
  // padding
  button.style('padding-left', paddingRL); 
  button.style('padding-right', paddingRL);
  button.style('padding-top', paddingTB);
  button.style('padding-bottom', paddingTB);
  // typeface
  button.style('font-size', 30);
  button.style('font-family', 'courier');
  button.style('font-style', "#363636"); 
  button.style('background-color', "#FFFFFF");
}

// ---------- KEY PRESSED ---------- //

function keyPressed() {
  if (mode === 4) { // allows player to enter their answers
    if (keyCode === ENTER) {
      userAnswer = userInput.value();
      userInput.value('');
    }
  }
}
