//Selecting HTML elements by thier IDs and Classess
const startBtn = document.getElementById("startbtn");
const lapBtn = document.getElementById("lapbtn");
const resetBtn = document.getElementById("resetbtn");
const timerElement = document.querySelector(".timer");
const lapBox = document.querySelector(".lapBox");

//setting the intial styles for the buttons
lapBtn.style.display = "none";
resetBtn.style.display = "none";


//Variables
let isRunning = false;
let isPaused = false;
let startTime;
let lapStartTime;
let elapsedTime;

//EventListerners
startBtn.addEventListener("click", toggleStart);
lapBtn.addEventListener("click", recordLap);
resetBtn.addEventListener("click", resetStopwatch);

//Functions to hnadle click of buttons
function toggleStart() {
  if (!isRunning) {
    startStopwatch();
  } else if (!isPaused) {
    pauseStopwatch();
  } else {
    resumeStopwatch();
  }
}

//Start function
function startStopwatch() {
  isRunning = true;
  startBtn.textContent = "PAUSE";
  lapBtn.style.display = "inline-block";
  resetBtn.style.display = "none";
  lapBtn.disabled = false;
  startTime = Date.now() - (lapStartTime || 0);
  lapStartTime = Date.now();
  updateDisplay();
  updateTimer();
}

//Pause function
function pauseStopwatch() {
  isPaused = true;
  startBtn.textContent = "RESUME";
  resetBtn.style.display = "inline-block";
  lapBtn.style.display = "none";
  lapBtn.disabled = true;
  elapsedTime = Date.now() - startTime;
  updateDisplay();
}

//Resume Function
function resumeStopwatch() {
  isPaused = false;
  startBtn.textContent = "PAUSE";
  resetBtn.style.display = "none";
  lapBtn.style.display = "inline-block";
  lapBtn.disabled = false;
  startTime = Date.now() - elapsedTime;
  lapStartTime = Date.now() - elapsedTime;
  updateDisplay();
  updateTimer();
}

//Function to reset
function resetStopwatch() {
  isRunning = false;
  isPaused = false;
  startBtn.textContent = "START";
  resetBtn.style.display = "none";
  lapBtn.style.display = "none";
  lapBtn.disabled = true;
  const lapItems = lapBox.querySelectorAll("div");//removes items inside of div without effecting heading
  lapItems.forEach((item) => item.remove());
  startTime = 0;
  lapStartTime = 0;
  updateDisplay();
}

//funtion to display timer as it changes continuously
function updateTimer() {
  if (isRunning && !isPaused) {
    requestAnimationFrame(updateTimer);
  }
  updateDisplay();
}

//displays timer based on the elapsed time
function updateDisplay() {
  const elapsedMilliseconds = isRunning
    ? Date.now() - startTime
    : isPaused
    ? startTime
    : 0;
  const { hours, minutes, seconds, milliseconds } =
    calculateTimeParts(elapsedMilliseconds);
  timerElement.innerHTML = `<span class="hours">${formatTime(
    hours
  )}</span>: <span class="minutes">${formatTime(
    minutes
  )}</span>: <span class="seconds">${formatTime(
    seconds
  )}</span>. <span class="milliseconds">${formatMilliseconds(
    milliseconds
  )}</span>`;
}

//records the laptime 
function recordLap() {
  if (isRunning && !isPaused) {
    const elapsedMilliseconds = Date.now() - startTime;
    const lapTime = calculateTimeParts(elapsedMilliseconds);
    const lapItem = document.createElement("div");
    lapItem.textContent = `Lap ${lapBox.children.length + 1}: ${formatTime(
      lapTime.hours
    )}:${formatTime(lapTime.minutes)}:${formatTime(
      lapTime.seconds
    )}.${formatMilliseconds(lapTime.milliseconds)}`;
    lapBox.appendChild(lapItem);
    lapStartTime = Date.now();
  }
}

//calclation function
function calculateTimeParts(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const remainingMilliseconds = milliseconds % 1000;

  return {
    hours,
    minutes,
    seconds,
    milliseconds: remainingMilliseconds,
  };
}

//format time values with leading 0s
function formatTime(value) {
  return value.toString().padStart(2, "0");
}

//format millisecond with leading 0s
function formatMilliseconds(value) {
  return value.toString().padStart(3, "0");
}
