'use strict';


const playBtn = document.querySelector('.btn__start-stop.start');
const audioBg = document.querySelector('#bgm');
const audioAlert = document.querySelector('#lost');
const audioWin = document.querySelector('#win')
const replayBtn = document.querySelector('.btn__replay');
const gameZone = document.querySelector('#game-zone');


function painItem() {
    const width = gameZone.getBoundingClientRect().width * 0.85;
    const height = gameZone.getBoundingClientRect().height * 0.7;

    // money 그리기
    for (let i = 0 ; i < 12 ; i ++) {
        const randomX = Math.floor(Math.random() * width);
        const randomY = Math.floor(Math.floor(Math.random() * height));
        const money = document.createElement('img');
        money.setAttribute("class", "money");
        money.setAttribute("src", "carrot/img/dollar.png");
        money.style.transform = `translate(${randomX}px,${randomY}px)`
        gameZone.append(money);
    }

    // bug 그리기
    for (let i = 0 ; i < 12 ; i ++) {
        const randomX = Math.floor(Math.random() * width);
        const randomY = Math.floor(Math.floor(Math.random() * height));

        const bug = document.createElement('img');
        bug.setAttribute("class", "bug");
        bug.setAttribute("src", "carrot/img/gun.png");
        bug.style.transform = `translate(${randomX}px,${randomY}px)`

        gameZone.append(bug);

    }

}

function timer() {
    let timeText = document.querySelector('.time span');
    let timeOut = 10;
    let timer = setInterval(function () {
            
        // time 다 됐을시 게임오버되는 효과
        if (timeOut === 0) {
            audioAlert.play();
            popupOpen();
            timeStop();
            return  false;
        }
        timeOut -= 1;
        timeText.innerText = `00:${timeOut < 10 ? `0${timeOut}` : timeOut}`;
    }, 1000)
}

const timeStop = () => {
    clearInterval(timer)
}

function delItem() {
    const item = document.querySelectorAll('#game-zone img');
    item.forEach((ele) => ele.remove());
}

function popupClose() {
    const popup = document.querySelector('.popup')
    const popupBg = document.querySelector('.container__popup');
    popupBg.classList.remove('show');
    popup.classList.add('hidden');
}

function popupOpen() {
    const popup = document.querySelector('.popup')
    const popupBg = document.querySelector('.container__popup');

    popup.classList.remove('hidden');
    popupBg.classList.add('show');
    audioBg.pause();

    // replay game
    replayBtn.addEventListener('click', () => {
        popupClose();

        // game 다시시작
        timer();
        delItem();
        painItem();
        audioBg.play();
    } )
}


function controlPlay(e) {
    const pauseBtn = document.querySelector('.btn__start-stop.active');

    //when click play btn, change text, bg
    playBtn.innerText = 'pause';
    playBtn.style.background = 'rgb(68, 1, 1)'
    playBtn.classList.add('active');
    playBtn.classList.remove('start');
    audioBg.play();

    // timer
    timer();
    // paint item
    painItem();

    // 남은돈 다털어서 나오면 포켓몬빵 하나씩
    const leftItemTxt = document.querySelector('.item__left-money span')
    let moneyLeft = gameZone.querySelectorAll('.money').length;
    leftItemTxt.innerText = `${moneyLeft}`

    // item click
    gameZone.addEventListener('click', (e) => {
        const audioMoney = document.querySelector('audio#money');
        const audioBug = document.querySelector('audio#bug');

        if(e.target.className === 'money') {
            e.target.remove();
            audioMoney.play();
            moneyLeft -= 1;
            leftItemTxt.innerText = `${moneyLeft}`
            if (moneyLeft === 0 ) {
                audioWin.play();
                popupOpen();
                let result = document.querySelector('.result');
                result.innerText = "You're Win!!!"
            }
            
        }
        if (e.target.className === 'bug') {
            audioBug.play();
            audioAlert.play();
            popupOpen();
        }
    })

    // 팝업창 띄움 -> 안됨
    if (e.target === pauseBtn) {
     // tiem 멈추기 어떻게 해야함 ㅠ_ㅠ?
        timeStop(); }
}

playBtn.addEventListener('click', (e) => controlPlay(e))