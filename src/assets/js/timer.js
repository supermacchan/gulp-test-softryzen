/****************************************
 * ➡️ Start Date Timer from DATE in params
 ****************************************/

// document.addEventListener('DOMContentLoaded', () => {
//   timerHandler();
// });

// function timerHandler() {
//   const ref = {
//     daysVal: document.querySelectorAll('[data-day]'),
//     hoursVal: document.querySelectorAll('[data-hours]'),
//     minutesVal: document.querySelectorAll('[data-min]'),
//     secondsVal: document.querySelectorAll('[data-sec]'),
//     dateVal: document.querySelector('[data-timer]').dataset.timer,
//   };

//   const startDate = Date.parse(String(`${ref.dateVal}`));

//   const timeCount = () => {
//     let nowDate = new Date();
//     let leftUntil = startDate - nowDate;

//     let days = Math.floor(leftUntil / 1000 / 60 / 60 / 24);
//     let hours = Math.floor(leftUntil / 1000 / 60 / 60) % 24;
//     let minutes = Math.floor(leftUntil / 1000 / 60) % 60;
//     let seconds = Math.floor(leftUntil / 1000) % 60;

//     ref.daysVal.forEach(item => (item.textContent = addZero(days)));
//     ref.hoursVal.forEach(item => (item.textContent = addZero(hours)));
//     ref.minutesVal.forEach(item => (item.textContent = addZero(minutes)));
//     ref.secondsVal.forEach(item => (item.textContent = addZero(seconds)));

//     if (leftUntil <= 0) {
//       ref.daysVal.forEach(item => (item.textContent = '00'));
//       ref.hoursVal.forEach(item => (item.textContent = '00'));
//       ref.minutesVal.forEach(item => (item.textContent = '00'));
//       ref.secondsVal.forEach(item => (item.textContent = '00'));

//       timeInterval && clearInterval(timeInterval);
//     }
//   };

//   const addZero = num => {
//     if (num <= 9) {
//       return '0' + num;
//     } else {
//       return num;
//     }
//   };

//   let timeInterval = setInterval(timeCount, 10);
//   timeCount();
// }

/****************************************
 * ➡️ 7 minutes Timer
 ****************************************/

// document.addEventListener('DOMContentLoaded', () => {
//   setlocalStorageLifeTime();
//   timerHandler();
// });

// function setlocalStorageLifeTime() {
//   const localStorageNowDate = localStorage.getItem('localStorageNowDate');
//   const localStorageLifeTime = 1 * 24 * 3600 * 1000; // 1 DAY lifetime for 7m or 24h timer
//   // const localStorageLifeTime = 3 * 24 * 3600 * 1000; // 3 DAYS lifetime for 36h timer (or more)

//   if (!localStorageNowDate) {
//     localStorage.setItem('localStorageNowDate', +new Date());
//   }

//   if (+new Date() - localStorageNowDate > localStorageLifeTime) {
//     localStorage.removeItem('localStorageTimerValue');
//     localStorage.setItem('localStorageNowDate', +new Date());
//   }
// }

// function timerHandler() {
//   const ref = {
//     // daysVal: document.querySelectorAll('[data-day]'),
//     hoursVal: document.querySelectorAll('[data-hours]'),
//     minutesVal: document.querySelectorAll('[data-min]'),
//     secondsVal: document.querySelectorAll('[data-sec]'),
//     msVal: document.querySelectorAll('[data-ms]'),
//   };

//   const localStorageTimerValue = localStorage.getItem('localStorageTimerValue');
//   const timerValue = 7 * 60 * 1000; // Timer (7 minutes)
//   // const timerValue = 24 * 60 * 60 * 1000; // Timer (24 hours)
//   // const timerValue = 36 * 60 * 60 * 1000; // Timer (36 hours)
//   // const timerValue = 48 * 60 * 60 * 1000; // Timer (48 hours)
//   const timer = localStorageTimerValue ? JSON.parse(localStorageTimerValue) : timerValue;
//   const endTime = new Date(Date.parse(new Date()) + timer);

//   const timeCount = () => {
//     let nowDate = new Date();
//     let leftUntil = endTime - nowDate;

//     window.onbeforeunload = () =>
//       localStorage.setItem('localStorageTimerValue', JSON.stringify(leftUntil));

//     // let days = Math.floor(leftUntil / 1000 / 60 / 60 / 24);
//     let hours = Math.floor(leftUntil / 1000 / 60 / 60) % 24;
//     let minutes = Math.floor(leftUntil / 1000 / 60) % 60;
//     let seconds = Math.floor(leftUntil / 1000) % 60;
//     let milliseconds = Math.floor(leftUntil / 10) % 100;

//     // ref.daysVal.forEach(item => (item.textContent = addZero(days)));
//     ref.hoursVal.forEach(item => (item.textContent = addZero(hours)));
//     ref.minutesVal.forEach(item => (item.textContent = addZero(minutes)));
//     ref.secondsVal.forEach(item => (item.textContent = addZero(seconds)));
//     ref.msVal.forEach(item => (item.textContent = addZero(milliseconds)));

//     if (leftUntil <= 0) {
//       // ref.daysVal.forEach(item => (item.textContent = '00'));
//       ref.hoursVal.forEach(item => (item.textContent = '00'));
//       ref.minutesVal.forEach(item => (item.textContent = '00'));
//       ref.secondsVal.forEach(item => (item.textContent = '00'));
//       ref.msVal.forEach(item => (item.textContent = '00'));

//       localStorage.setItem('localStorageTimerValue', 0);

//       timeInterval && clearInterval(timeInterval);
//     }
//   };

//   const addZero = num => {
//     if (num <= 9) {
//       return '0' + num;
//     } else {
//       return num;
//     }
//   };

//   let timeInterval = setInterval(timeCount, 10);
//   timeCount();
// }

/****************************************
 * ➡️ Timer start work from DATE in params
 ****************************************/
// const howManyHours = 48;

// document.addEventListener('DOMContentLoaded', () => {
//   timerHandler();
// });

// function timerHandler() {
//   const ref = {
//     daysVal: document.querySelectorAll('[data-day]'),
//     hoursVal: document.querySelectorAll('[data-hours]'),
//     minutesVal: document.querySelectorAll('[data-min]'),
//     secondsVal: document.querySelectorAll('[data-sec]'),
//     dateVal: document.querySelector('[data-timer]').dataset.timer,
//   };

//   const startDate = Date.parse(String(ref.dateVal));
//   const endDate = startDate + howManyHours * 60 * 60 * 1000; // 48 hours from start date

//   const timeCount = () => {
//     let nowDate = new Date();

//     if (nowDate < startDate || !startDate) {
//       resetTimer();
//     } else {
//       let leftUntil = endDate - nowDate;

//       let days = Math.floor(leftUntil / (1000 * 60 * 60 * 24));
//       let hours = Math.floor((leftUntil / (1000 * 60 * 60)) % 24);
//       let minutes = Math.floor((leftUntil / (1000 * 60)) % 60);
//       let seconds = Math.floor((leftUntil / 1000) % 60);

//       ref.daysVal.forEach(item => (item.textContent = addZero(days)));
//       ref.hoursVal.forEach(item => (item.textContent = addZero(hours)));
//       ref.minutesVal.forEach(item => (item.textContent = addZero(minutes)));
//       ref.secondsVal.forEach(item => (item.textContent = addZero(seconds)));

//       if (leftUntil <= 0) {
//         resetTimer();
//         clearInterval(timeInterval);
//       }
//     }
//   };

//   const resetTimer = () => {
//     ref.daysVal.forEach(item => (item.textContent = '00'));
//     ref.hoursVal.forEach(item => (item.textContent = '00'));
//     ref.minutesVal.forEach(item => (item.textContent = '00'));
//     ref.secondsVal.forEach(item => (item.textContent = '00'));
//   };

//   const addZero = num => (num <= 9 ? '0' + num : num);

//   let timeInterval = setInterval(timeCount, 10);
//   timeCount();
// }
