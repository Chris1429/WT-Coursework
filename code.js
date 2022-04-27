//declare global variables
let questions;
let currentQuestion;
let result;
let person;
let currentQuiz;
const quizFiles = ["quiz1","quiz2","quiz3"];
const previousQuiz = [];
let ingredient;
let instructions;

function displayQuestion() {
	
	let q = questions[currentQuestion];
	
	question.innerHTML = q.question;
	answerA.innerHTML = q.answerA;
	answerB.innerHTML = q.answerB;
	answerC.innerHTML = q.answerC;
	answerD.innerHTML = q.answerD;
	document.documentElement.className = q.scheme;
	ingredient = q.recipe1;
	testRecipe.innerHTML = ingredient;
}

function processAnswer(answer) {
	if (answer == questions[currentQuestion].correct){
		result++;
		sessionStorage.setItem("score",result);
	} else {
		sessionStorage.setItem("currentQuestion",currentQuestion);
		sessionStorage.setItem("result",result);
		sessionStorage.setItem("currentQuiz",currentQuiz);
		sessionStorage.setItem("recipe",ingredient);
		sessionStorage.setItem("saveStatus",'1');
		document.location.href="recipe.html";
		
	}
	
	if (currentQuestion < (questions.length-1)){
		currentQuestion++;
		displayQuestion();
	} else {
		sessionStorage.setItem("outOf",currentQuestion);
		sessionStorage.setItem("recipe",ingredient);
		document.location.href="results.html";
		
	}
}


async function newGame() {
	if (sessionStorage.getItem("saveStatus") == '1'){
		resumeQuiz();
	} else {
		currentQuestion = 0;
		result = 0;
		quizSelector();
		checkQuiz();
	}
	
	questions = await getJSON('Quizzes/' + currentQuiz);
	displayQuestion();
	

	
	

}

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

async function getJSON(fileName){
	let url = fileName +'.JSON';
	try {
		let file = await fetch(url);
		return await file.json();
	} catch (error) {
		console.log(error);
	}
}

function results(){
	let a = sessionStorage.getItem("score");
	let b = sessionStorage.getItem("outOf");	
	b++;
	c = getRating(a,b);
	let text = "Thank you " +sessionStorage.getItem("username") +" your score is: " +a +" out of " +b +", you are a " +c +"<br>  Thanks for playing Food Quiz";
	document.getElementById("gameOver").innerHTML = text;
	//endGame();
}

async function quizSelector(){	
	let x = Math.floor(Math.random()*3);
	currentQuiz = quizFiles[x];
}

function checkQuiz() {
	while (previousQuiz.indexOf(currentQuiz) > -1 && previousQuiz.length < quizFiles.length){
		quizSelector();
	} if (previousQuiz.length == quizFiles.length){
		endGame();
	} else {
		previousQuiz.push(currentQuiz);
	}
}

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

async function getRecipe(){
	recipe = sessionStorage.getItem("recipe");
	instructions = await getJSON('Recipes/' + recipe);
	displayRecipe();	
}

function displayRecipe(){
	
	let r = instructions;
	ingredients.innerHTML = r.ingredients;
	recipe1.innerHTML = r.recipe1;
	recipe2.innerHTML = r.recipe2;
	recipe3.innerHTML = r.recipe3;
	recipe4.innerHTML = r.recipe4;
	recipe5.innerHTML = r.recipe5;
	aside1.innerHTML = r.aside1;
	/*If saveStatus = 1 button = Next question else button = home */
}

async function resumeQuiz(){
	currentQuestion = sessionStorage.getItem("currentQuestion");
	currentQuestion++;
	result = sessionStorage.getItem("result");
	currentQuiz = sessionStorage.getItem("currentQuiz");
	sessionStorage.setItem("saveStatus",'0');
}