"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Khau Van Nam",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2022-10-11T21:31:17.178Z",
    "2022-10-10T07:42:02.383Z",
    "2022-01-28T09:15:04.904Z",
    "2022-04-01T10:17:24.185Z",
    "2022-05-08T14:11:59.604Z",
    "2022-05-27T17:01:17.194Z",
    "2022-07-11T23:36:17.929Z",
    "2022-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "en-GB", // de-DE
  logoutTime: "20",
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2022-11-01T13:15:33.035Z",
    "2022-11-30T09:48:16.867Z",
    "2022-12-25T06:04:23.907Z",
    "2022-01-25T14:18:46.235Z",
    "2022-02-05T16:33:06.386Z",
    "2022-04-10T14:43:26.374Z",
    "2022-06-25T18:49:59.371Z",
    "2022-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
  logoutTime: "30",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
let currentAccount, timer;
const fullDate = {
  hour: "numeric",
  minute: "numeric",
  day: "numeric",
  month: "long",
  year: "numeric",
  weekday: "long",
};
/////////////////////////////////////////////////
//* ---FUNCTION DISPLAY---

const formatCur = (value, locale, currency) => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

const formatDate = (date, locale = "de-DE") => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  const daysPassed = calcDaysPassed(new Date(), date);
  if (daysPassed === 0) return "Today";
  if (daysPassed === 1) return "Yesterday";
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  return `${new Intl.DateTimeFormat(locale).format(date)}`;
};

const updateUI = (acc) => {
  displayMovement(acc);
  displayBalance(acc);
  displaySummary(acc);
};

const welcomeTimer = () => {
  const time = new Date();
  const hours = time.getHours();
  console.log(time);
  if (hours > 0 && hours < 12) return `Good Morning`;
  if (hours <= 17) return `Good Afternoon`;
  return `Good Evenning`;
};

const startLogout = () => {
  let time = +currentAccount.logoutTime;
  const logout = () => {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = `Log in to get started`;
    }
    time--;
  };
  logout();
  const timer = setInterval(logout, 1000);
  return timer;
};

const displayMovement = (acc, sort = false) => {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements; // because of afterbgin so it will start in 3000

  movs.forEach((element, index) => {
    //? --Creating date--
    const date = new Date(acc.movementsDates[index]);
    const displayDate = formatDate(date, acc.locale);

    const type = element > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value">${formatCur(
      element,
      acc.locale,
      acc.currency
    )}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const displayBalance = (acc) => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${formatCur(
    acc.balance,
    acc.locale,
    acc.currency
  )} `;
};

const displaySummary = (acc) => {
  const income = acc.movements
    .filter((value) => value > 0)
    .reduce((acc, mov) => acc + mov);
  const outcomes = acc.movements
    .filter((value) => value < 0)
    .reduce((acc, mov) => acc + mov);
  const interest = acc.movements
    .filter((value) => value > 0)
    .map((value) => (value * acc.interestRate) / 100)
    .filter((value) => value >= 1)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${formatCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
  labelSumIn.textContent = `${formatCur(income, acc.locale, acc.currency)}`;
  labelSumOut.textContent = `${formatCur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  )}`;
};

const userAccount = (acc) => {
  acc.forEach(
    (acc) =>
      (acc.username = acc.owner
        .toLowerCase()
        .split(" ")
        .map((first) => first[0])
        .join(""))
  );
};
userAccount(accounts);

//* FAKE ALWAYS LOGGED IN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

//* ---LOGIN EVENT---

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `${welcomeTimer()}, ${currentAccount.owner
      .split(" ")
      .at(-1)}`;
    const now = new Date();
    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      fullDate
    ).format(now);
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = startLogout();
    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
  }
});

//* ---TRANSFER EVENT---
btnTransfer.addEventListener(`click`, (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const accountReceiver = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    accountReceiver &&
    isFinite(amount) &&
    amount <= currentAccount.balance &&
    accountReceiver?.username !== currentAccount.username
  )
    setTimeout(() => {
      currentAccount.movements.push(-amount);
      accountReceiver.movements.push(amount);
      //= TRANSFER DATE
      currentAccount.movementsDates.push(new Date().toISOString());
      accountReceiver.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
  clearInterval(timer);
  timer = startLogout();
  inputTransferAmount.value = inputTransferTo.value = "";
});

//* ---CLOSE EVENT---
btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

//* ---REQUEST EVENT---
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some((acc) => acc > +inputLoanAmount.value * 0.1)
  ) {
    setTimeout(() => {
      currentAccount.movements.push(loanAmount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 3000);
    clearInterval(timer);
    timer = startLogout();
    inputLoanAmount.value = "";
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovement(currentAccount, !sorted);
  clearInterval(timer);
  timer = startLogout();
  sorted = !sorted;
});
