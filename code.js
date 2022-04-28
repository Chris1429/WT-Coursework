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

/*Runs on quiz.html page load
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

//Put questions into quiz.html
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

/*Processes the answer and takes following possible actions:
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

//Get player name  - NEEDS WORK!!!
function getName() {
	/*Currently echoes to screen, stores in sessionStorage */
	
  let text;
  person = prompt("Please enter your name:", "");
  if (person == null || person == "") {
    text = "User cancelled the prompt.";
  } else {
	sessionStorage.setItem("username",person);
    text = "Hello " + sessionStorage.getItem("username") + "! How are you today?";
  }
  document.getElementById("demo").innerHTML = text;
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

//Puts entries into results.html, including rating
function results(){
	
	let a = sessionStorage.getItem("score");
	let b = sessionStorage.getItem("outOf");
	c = getRating(a,b);
	let text = "Thank you " +sessionStorage.getItem("username") +" your score is: " +a +" out of " +b +", you are a " +c +"<br>  Thanks for playing Food Quiz";
	document.getElementById("gameOver").innerHTML = text;
	endGame();
}

//Random quiz selector
async function quizSelector(){	
	let x = Math.floor(Math.random()*quizList.length);
	currentQuiz = quizList[x];
	var removed = quizList.splice(x,1);
}

/*
//Checks if all quizzes have been ran, if so ends the game - NEEDS WORK!!!
function checkQuiz() {
	if (quizList.indexOf(currentQuiz) > -1){
		quizSelector();
	} else (quizList.length == quizFiles.length){
		endGame();
	}
}*/

//Rates the users score
function getRating(mark, numOf){
	let text;
	percent = (mark/numOf)*100;
	
	switch (true){
		case percent == 100:
			text = "Masterchef! Congratulations!";
			break;
		case percent <= 25:
			text = "pan scrubber, keep trying!";
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

/*Put content into recipe.html
Test: is mid-quiz?
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
		nextPage.innerHTML = "Return home";
		document.getElementById("nextPage").setAttribute("onclick", "window.location.href='index.html';");
	}
}

//Get the current status and move counter to next question
async function resumeQuiz(){
	getStatus();	
	currentQuestion++;
}

function endGame(){
	getStatus();
	sessionStorage.setItem("saveStatus",1);
	//let y = quizList[0];
	endGameTest.innerHTML = "The current status of quizList is: " + quizList;
}

//Getter & Setter for mid-game status
function setStatus(){
	sessionStorage.setItem("currentQuestion",currentQuestion);
	sessionStorage.setItem("result",result);
	sessionStorage.setItem("currentQuiz",currentQuiz);
	sessionStorage.setItem("recipe",ingredient);
	sessionStorage.setItem("outOf",questions.length);
	sessionStorage.setItem("saveStatus",2);
	sessionStorage.setItem("previousQ", JSON.stringify(quizList));
}

function getStatus(){
	currentQuestion = sessionStorage.getItem("currentQuestion");
	result = sessionStorage.getItem("result");
	currentQuiz = sessionStorage.getItem("currentQuiz");
	quizList = JSON.parse(sessionStorage.getItem("previousQ"));
}