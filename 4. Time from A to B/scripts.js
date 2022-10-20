// Take all the necessary elements
const routeSelect = document.getElementById('routeSelect');
const timeForm = document.getElementById('timeForm');
const timeSelect = document.getElementById('timeSelect');
const timeOptions = Array.from(timeSelect.children);
const returnForm = document.getElementById('returnForm');
const returnSelect = document.getElementById('returnSelect');
const returnOptions = Array.from(returnSelect.children);
const numForm = document.getElementById('numForm');
const numInput = document.getElementById('numInput');
const calcButton = document.getElementById('calculationButton');
const commonWrapper = document.getElementById('commonWrapper');

// Create variables that will change depending on the incoming data
let routeType = '';
let ticketPrice = 700;

// Сreate constant constants for convenience and not to be mistaken
const AB = 'из A в B';
const BA = 'из B в A';
const ABA = 'из A в B и обратно в А';
const travelTime = '00:50';
const abRegExp = /\d\d\:\d\d\(из A в B\)/;
const baRegExp = /\d\d\:\d\d\(из B в A\)/;

// Adding Listeners
routeSelect.addEventListener('change', handleRouteChange);
timeSelect.addEventListener('change', handleTimeChange);
returnSelect.addEventListener('change', handleReturnChange);
calcButton.addEventListener('click', handleClick);

// Handlers

function handleRouteChange() {
  // Find out what type of route is selected and, depending on this,
  // we substitute a regular expression that will select options
  switch (routeSelect.value) {
    case AB: {
      routeType = abRegExp;
      ticketPrice = 700;
      break;
    }
    case BA: {
      routeType = baRegExp;
      ticketPrice = 700;
      break;
    }
    default: {
      routeType = abRegExp;
      ticketPrice = 1200;
    }
  }

  // This function does a check specifically for timeOptions,
  // which is then passed to the general function
  const checksForTimeOptions = (timeOption) => {
    return routeType.test(timeOption.value) && isToBeInTime(timeOption.value);
  };
  showHideOptions(timeOptions, checksForTimeOptions);

  // This function does a check specifically for returnOptions,
  // which is then passed to the general function
  if (routeSelect.value === ABA) {
    const firstTimePossible = timeOptions.find((timeOption) => {
      return abRegExp.test(timeOption.value) && isToBeInTime(timeOption.value);
    }).value;
    const checksForReturnOptions = (returnOption) => {
      const firstPossibleInDate = translateToDate(timeAddition(firstTimePossible, travelTime));
      const currValueInDate = translateToDate(returnOption.value);
      return firstPossibleInDate < currValueInDate && isToBeInTime(returnOption.value);
    };

    showHideOptions(returnOptions, checksForReturnOptions);
  }

  // When we have hidden the options that are not suitable,
  // we need to change the value of the select to the first suitable one.
  changeSelectedValue(timeOptions, timeSelect);
  if (routeSelect.value === ABA) {
    changeSelectedValue(returnOptions, returnSelect);
  }

  timeForm.classList.remove('timeForm__hidden');
  if (routeSelect.value === ABA) {
    returnForm.classList.remove('returnForm__hidden');
  } else {
    returnForm.classList.add('returnForm__hidden');
  }
  numForm.classList.remove('numForm__hidden');

  removeOrderText();
}

function handleTimeChange() {
  // When the timeSelect changes and the path is equal to ABA,
  // need to change the visibility of the option
  if (routeSelect.value === ABA) {
    const timeSelectDateWithTravelTime = translateToDate(
      timeAddition(timeSelect.value, travelTime),
    );
    returnOptions.forEach((returnOption) => {
      const returnDate = translateToDate(returnOption.value);
      if (timeSelectDateWithTravelTime < returnDate) {
        returnOption.classList.remove('option__hidden');
      } else {
        returnOption.classList.add('option__hidden');
      }
    });
    changeSelectedValue(returnOptions, returnSelect);
  }

  removeOrderText();
}

function handleReturnChange() {
  removeOrderText();
}

function handleClick() {
  const p = document.createElement('p');
  p.classList.add('orderText');

  const amountTickets = numInput.value;
  const route = routeSelect.value;
  const startTime = getTimeFromString(timeSelect.value);
  const price = amountTickets * ticketPrice;
  const endTime = timeAddition(startTime, travelTime);

  p.innerHTML = `
    Вы выбрали ${amountTickets} ${getWordWithTrueEnding(
    amountTickets,
    'билет',
  )} по маршруту ${route} стоимостью ${price}₽.<br>
    Это путешествие займет у вас ${travelTime.slice(3)} минут.<br>
    Теплоход отправляется в ${startTime}, а прибудет в ${endTime}.
  `;

  // If the path is equal to ABA, then information
  // on the reverse route must be added to the message
  if (routeSelect.value === ABA) {
    const startTime = getTimeFromString(returnSelect.value);
    const endTime = timeAddition(startTime, travelTime);
    p.innerHTML += `
      <br>Обратно теплоход отправляется в ${startTime}, а прибудет в ${endTime}.
    `;
  }

  removeOrderText();
  calcButton.innerHTML = 'Посчитать еще раз'; // After the first click, the button should say that when you click on it, there will be a second count
  commonWrapper.appendChild(p);
}

// Utils

// A function that adds some time to another time,
// where time is the value of the select, and the incrementalTime is a string like XX:XX
function timeAddition(time, incrementalTime) {
  const [hours, minutes] = incrementalTime.split(':');

  const date = translateToDate(time);
  date.setHours(date.getHours() + Number(hours));
  date.setMinutes(date.getMinutes() + Number(minutes));

  return formattingDateToString(date);
}

// A function that takes only the time from the select value
function getTimeFromString(string) {
  return `${string.slice(0, 2)}:${string.slice(3, 5)}`;
}

// A function that takes the selected select value
// and checks whether it is still possible to catch this ship
function isToBeInTime(time) {
  const currentTime = new Date();
  const departureTime = translateToDate(time);

  return currentTime < departureTime;
}

// A function that converts the selected select value to the Date data type
function translateToDate(stringWithTime) {
  const now = new Date();
  const hours = Number(stringWithTime.slice(0, 2));
  const minutes = Number(stringWithTime.slice(3, 5));

  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);
}

// A function that expands matching selects and hides unsuitable ones,
// where options are the options of the desired select,
// and checks is a function that does the check and returns a boolean value
function showHideOptions(options, checks) {
  options.forEach((option) => {
    if (checks(option)) {
      option.classList.remove('option__hidden');
    } else {
      option.classList.add('option__hidden');
    }
  });
}

// A function that changes the value of the select to the first possible
function changeSelectedValue(options, select) {
  const firstPossible = options.find((option) => {
    return !option.classList.contains('option__hidden');
  });
  select.value = firstPossible.value;
}

// A function that converts the date data type to the string data type
function formattingDateToString(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  let stringHours = String(hours);
  let stringMinutes = String(minutes);

  if (hours >= 0 && hours <= 9) {
    stringHours = `0${hours}`;
  }
  if (minutes >= 0 && minutes <= 9) {
    stringMinutes = `0${minutes}`;
  }

  return `${stringHours}:${stringMinutes}`;
}

// A function that changes the form of a word (end)
function getWordWithTrueEnding(amount, word) {
  const str = String(amount);

  if (
    (Number(str) >= 10 && Number(str) <= 19) ||
    Number(str[str.length - 1]) === 0 ||
    (Number(str[str.length - 1]) >= 5 && Number(str[str.length - 1]) <= 9)
  ) {
    return `${word}ов`;
  } else if (Number(str[str.length - 1]) === 1) {
    return `${word}`;
  } else if (Number(str[str.length - 1]) >= 2 && Number(str[str.length - 1]) <= 4) {
    return `${word}а`;
  } else if (Number(str[str.length - 1]) >= 5 && Number(str[str.length - 1]) <= 9) {
    return `${word}ов`;
  }
}

// A function that removes the p tag with a class "orderText"
function removeOrderText() {
  if (
    commonWrapper.lastElementChild.tagName === 'P' ||
    commonWrapper.lastElementChild.classList.contains('orderText')
  ) {
    commonWrapper.removeChild(commonWrapper.lastElementChild);
  }
}
