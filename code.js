//declare global variables
let questions;
let currentQuestion;
let result;
let person;
let currentQuiz;
const quizFiles = ["quiz1","quiz2","quiz3"];
const previousQuiz = [];

function displayQuestion() {
	
	let q = questions[currentQuestion];
	
	question.innerHTML = q.question;
	answerA.innerHTML = q.answerA;
	answerB.innerHTML = q.answerB;
	answerC.innerHTML = q.answerC;
	answerD.innerHTML = q.answerD;
}

function processAnswer(answer) {
	if (answer == questions[currentQuestion].correct){
		result++;
		localStorage.setItem("score",result);
	}
	
	if (currentQuestion < (questions.length-1)){
		currentQuestion++;
		displayQuestion();
	} else {
		localStorage.setItem("outOf",currentQuestion);
		document.location.href="results.html";
		
	}
}


async function newGame() {
	currentQuestion=0;
	result = 0;
	
	quizSelector();
	checkQuiz();
	
	questions = await getJSON('Quizzes/' + currentQuiz);
	displayQuestion();
	

	
	

}

function getName() {
	/*Currently echoes to screen, stores in localStorage */
	
  let text;
  person = prompt("Please enter your name:", "");
  if (person == null || person == "") {
    text = "User cancelled the prompt.";
  } else {
	localStorage.setItem("username",person);
    text = "Hello " + localStorage.getItem("username") + "! How are you today?";
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
	let a = localStorage.getItem("score");
	let b = localStorage.getItem("outOf");	
	b++;
	c = getRating(a,b);
	let text = "Thank you " +localStorage.getItem("username") +" your score is: " +a +" out of " +b +", you are a " +c +"<br>  Thanks for playing Food Quiz";
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