//declare global variables
let questions;									//array of questions in quiz
let currentQuestion;							//current array position
let result;										//score
let person;										//player name
let currentQuiz;								//quiz name
const quizFiles = ["quiz1","quiz2","quiz3"];	//quizzes available
var quizList = [];								//quizzes in play
let ingredient;									//current question recipe name
let instructions;
let check;								//array of current recipe
var highScore = [];

/*
Runs on quiz.html page load
TEST: is there a game in progress?
If so TEST: is it mid-game?
If so resume
If not reset variables, load quizList, select quiz

If no game in progress, set variables and select quiz
Get questions and display
*/
async function newGame() {
	check = sessionStorage.getItem("saveStatus");
	
	if (check > 0){
		switch (true){
			case check > 1:
				resumeQuiz();
				break;
			case check == 1:
				currentQuestion = 0;
				result = 0;
				sessionStorage.setItem("score",result);
				quizList = JSON.parse(sessionStorage.getItem("previousQ"));
				quizSelector();
			}
	} else {
			quizList = [...quizFiles];
			currentQuestion = 0;
			result = 0;
			quizSelector();
	}			
		
	questions = await getJSON('Quizzes/' + currentQuiz);
	displayQuestion();
}

//Put questions into quiz.html and set colour scheme
function displayQuestion() {
	let q = questions[currentQuestion];
	question.innerHTML = q.question;
	answerA.innerHTML = q.answerA;
	answerB.innerHTML = q.answerB;
	answerC.innerHTML = q.answerC;
	answerD.innerHTML = q.answerD;
	document.documentElement.className = q.scheme;
	ingredient = q.recipe1;
}

/*
Processes the answer and takes following possible actions:
Increment score and store it
Save status and load recipe
TEST: is it the last question?
If not, get the next question
If so store the number of questions and current recipe, load results.html
*/
function processAnswer(answer) {
	if (answer == questions[currentQuestion].correct){
		result++;
		sessionStorage.setItem("score",result);
	} else {
		setStatus();
		document.location.href="recipe.html";
	}
	
	if (currentQuestion < (questions.length-1)){
		currentQuestion++;
		displayQuestion();
	} else {
		setStatus();
		document.location.href="results.html";
	}
}

//Rates the users score
function getRating(mark, numOf){
	let text;
	percent = (mark/numOf)*100;
	
	switch (true){
		case percent == 100:
			text = "Masterchef! Congratulations!";
			break;
		case percent <= 25:
			text = "a pan scrubber, keep trying!";
			break;
		default:
			text = "kitchen hand, keep learning!";
	}
	return text;
}

//Gets the recipe and passes to display function
async function getRecipe(){
	recipe = sessionStorage.getItem("recipe");
	instructions = await getJSON('Recipes/' + recipe);
	displayRecipe();	
}

/*
Put content into recipe.html
TEST: is mid-quiz?
If so set button text & onclick to Quiz
If not, set button text & onclick to Home
*/
function displayRecipe(){
	let r = instructions;
	requirements.innerHTML = r.ingredients;
	recipe1.innerHTML = r.recipe1;
	recipe2.innerHTML = r.recipe2;
	recipe3.innerHTML = r.recipe3;
	recipe4.innerHTML = r.recipe4;
	recipe5.innerHTML = r.recipe5;
	aside1.innerHTML = r.aside1;
	
	if (sessionStorage.getItem("saveStatus") == 2){
		nextPage.innerHTML = "Next question";
		document.getElementById("nextPage").setAttribute("onclick", "window.location.href='quiz.html';");
	} else {
		nextPage.innerHTML = "Return to Results";
		document.getElementById("nextPage").setAttribute("onclick", "window.location.href='results.html';");
	}
}

//Puts entries into results.html, including rating
function results(){
	endGame();
	playSound();
	let a = sessionStorage.getItem("score");
	let b = sessionStorage.getItem("outOf");
	c = getRating(a,b);
	let text = "<strong>Thank you " +sessionStorage.getItem("username") +" your score is: " +a +" out of " +b +", you are a " +c +"<br><br>Thank you for playing <em>Food Quiz</em></strong>";
	document.getElementById("gameOver").innerHTML = text;
	saveScore(c);
	
}

/*
Controls how many rounds can be played
TEST: Have all quizzes been played?
If not, make button allow another round
If so, disable button
*/
function endGame(){
	quizList = JSON.parse(sessionStorage.getItem("previousQ"));
	
	if (quizList.length > 0){
		nextGame.innerHTML = "New game";
		sessionStorage.setItem("saveStatus",1);
	} else {
		nextGame.innerHTML = "GAME OVER";
		document.getElementById("nextGame").className = "button disabled";
		document.getElementById("nextGame").title = "";
		sessionStorage.setItem("saveStatus",0);
	}
}

/*
Saves score to local storage
Passed the rating from results() and retrieves username from sessionStorage
Creates score object from both variables
If highScore already exists in localStorage retrieves and adds score,
else adds score to empty variable
Sorts and stores to localStorage
*/
function saveScore(rating){
	let score = {};
	score['name'] = sessionStorage.getItem("username");
	score['mark'] = rating;
	
	check = JSON.parse(localStorage.getItem("scoreList"));
	if (check){
		highScore = JSON.parse(localStorage.getItem("scoreList"));
		highScore.push(score);
	} else {
	highScore.push(score);
	}
	highScore = highScore.sort(function (score1, score2) {
		return score1.mark.localeCompare(score2.mark);
	});
	highScore.reverse();
	localStorage.setItem("scoreList", JSON.stringify(highScore));
	console.log(highScore);
}

//Retrieves scores from local storage, displays in table
function getScores(){
	var board = document.getElementById("scoreboard");
	var highScore = JSON.parse(localStorage.getItem("scoreList"));
	
	if (highScore.length < 6){
		for (var i = 0; i < highScore.length; i++) {
		board.innerHTML += "<tr><td>" + highScore[i].name + "</td><td>" + highScore[i].mark + "</td></tr>";
		}
	} else {
		for (var i = 0; i < 5; i++) {
		board.innerHTML += "<tr><td>" + highScore[i].name + "</td><td>" + highScore[i].mark + "</td></tr>";
		}
	}
}

/*******************************************/
/****UTILITY FUNCTIONS BEYOND THIS POINT****/
/*******************************************/

//Get player name - MAKE MANDATORY???
function getName() {
  person = prompt("Please enter your name:", "");
  if (person == null || person == "") {
    person = prompt("Please enter your name:", "");
  } else {
	sessionStorage.setItem("username",person);
  }
}

//Reads requested JSON file and returns
async function getJSON(fileName){
	let url = fileName +'.JSON';
	try {
		let file = await fetch(url);
		return await file.json();
	} catch (error) {
		console.log(error);
	}
}

//Random quiz selector
async function quizSelector(){	
	let x = Math.floor(Math.random()*quizList.length);
	currentQuiz = quizList[x];
	quizList.splice(x,1);
}

//Get the current status and move counter to next question
async function resumeQuiz(){
	getStatus();	
	currentQuestion++;
}

//Resets game if you return to homepage
function goHome(){
	sessionStorage.setItem("saveStatus",0);
	document.location.href="index.html";
}

//Getter & Setter for game status
function getStatus(){
	currentQuestion = sessionStorage.getItem("currentQuestion");
	result = sessionStorage.getItem("result");
	currentQuiz = sessionStorage.getItem("currentQuiz");
	quizList = JSON.parse(sessionStorage.getItem("previousQ"));
}

function setStatus(){
	sessionStorage.setItem("currentQuestion",currentQuestion);
	sessionStorage.setItem("result",result);
	sessionStorage.setItem("currentQuiz",currentQuiz);
	sessionStorage.setItem("recipe",ingredient);
	sessionStorage.setItem("outOf",questions.length);
	sessionStorage.setItem("saveStatus",2);
	sessionStorage.setItem("previousQ", JSON.stringify(quizList));
}

function playSound() {
	var audio = document.getElementById("audio");
        audio.play();
}
