'use strict';


const ITEM_COUNT = 12;
const ITEM_WIDTH = 100;

const playBtn = document.querySelector('.btn__start-stop');
const replayBtn = document.querySelector('.btn__replay');

const gameTimer = document.querySelector('.time');
const gameScore = document.querySelector('.item__left-money span');
const gameZone = document.querySelector('#game-zone');
const gameZoneArea = gameZone.getBoundingClientRect();

const popup = document.querySelector('.popup')
const popupBg = document.querySelector('.container__popup');
const popupTxt = document.querySelector('p.result');

const audioBg = new Audio('carrot/sound/Hiphop.mp3');
const audioClick = new Audio('carrot/sound/carrot_pull.mp3');
const audioBug = new Audio('carrot/sound/bug_pull.mp3');
const audioWin = new Audio('carrot/sound/game_win.mp3');
const audioLose = new Audio('carrot/sound/alert.wav');

let started = false;
let score = 0;
let timer;

playBtn.addEventListener('click', () => {
    // function뒤에 () 안붙여서 작동이 안됐었음
    started ? stopGame() : startGame();
})

gameZone.addEventListener('click', clickItem)

replayBtn.addEventListener('click', () => {
    startGame();
    popupClose();
    showGameBtn();
})


function startGame() {
    started = true;
    score = 0;
    delItem();
    playSound(audioBg);
    startToPause();
    timeStart();
    showTimerAndScore();
    paintItem('dollar', 'carrot/img/dollar.png', ITEM_COUNT);
    paintItem('gun', 'carrot/img/gun.png', ITEM_COUNT);
}

function stopGame() {
    started = false;
    timeStop();
    hideGameBtn();
    popupOpen();
    popupText('Replay? 🤷‍♂️')
    stopSound(audioBg);
    playSound(audioBug);
}

function finishGame(win) {
    timeStop();
    hideGameBtn();
    popupOpen();
    popupText(win ? "You're Winner 🏆" : "you're LoSer 🤯")
        (win ? playSound(audioWin) : playSound(audioLose))
}

function startToPause() {
    playBtn.innerText = 'pause';
    playBtn.style.background = 'rgb(68, 1, 1)'
    playBtn.classList.add('active');
    playBtn.classList.remove('start');
}

function showGameBtn() {
    playBtn.style.opacity = 1;
}


function hideGameBtn() {
    playBtn.style.opacity = 0;
}

function paintItem(name, src, count) {
    const width = gameZoneArea.width - ITEM_WIDTH;
    const height = gameZoneArea.height - ITEM_WIDTH;

    for (let i = 0; i < count; i++) {
        const randomX = randomNum(0, width);
        const randomY = randomNum(0, height);

        const item = document.createElement('img');
        item.setAttribute("class", name);
        item.setAttribute("src", src);
        item.style.position = 'absolute';
        item.style.transform = `translate(${randomX}px,${randomY}px)`
        gameZone.append(item);
    }
}

function randomNum(min, max) {
    return Math.random() * (max - min) + min;
}

function clickItem(e) {
    let target = e.target;
    if (target.matches('.dollar')) {
        playSound(audioClick);
        target.remove();
        score++;
        updateScore();
        if (score === ITEM_COUNT) {
            finishGame(true);
        }
    } else if (target.matches('.gun')) {
        playSound(audioBug);
        timeStop();
        finishGame(false);
    }
}

function updateScore() {
    gameScore.innerText = ITEM_COUNT - score;
}

function timeStart() {
    let timeText = document.querySelector('.time span');
    let timeOut = 10;
    timer = setInterval(function() {
                // time 다 됐을시 게임오버되는 효과
                if (timeOut <= 0) {
                    popupOpen();
                    playSound(audioLose);
                    timeStop();
                    return;
                }
                timeOut -= 1;
                timeText.innerText = `00:${timeOut < 10 ? `0${timeOut}` : timeOut}`;
    }, 1000)
}

const timeStop = () => {
    clearInterval(timer)
}

function showTimerAndScore() {
    gameTimer.style.opacity = 1;
    gameScore.style.opacity = 1;
}


function delItem() {
    const item = document.querySelectorAll('#game-zone img');
    item.forEach((ele) => ele.remove());
}

function popupClose() {
    popupBg.classList.remove('show');
    popup.classList.add('hidden');
}

function popupOpen() {
    popup.classList.remove('hidden');
    popupBg.classList.add('show');
}

function popupText(text) {
    popupTxt.innerText = text;
}

function playSound(audio) {
    audioBg.currentTime = 0;
    audio.play();
}

function stopSound(audio) {
    audio.pause();
}