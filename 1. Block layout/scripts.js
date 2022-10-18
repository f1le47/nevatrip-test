const allTimes = document.querySelectorAll('#times');

allTimes.forEach((times) => {
  const moreBtn = document.createElement('span');
  const timesLenght = times.childElementCount;
  const numOfVisibleTimes = 3;

  function showAllTimes() {
    times.removeChild(moreBtn);

    for (let i = numOfVisibleTimes; i <= timesLenght; i++) {
      console.log(i);
      times.children[i - 1].classList.remove('card-body-checks-check-times__time_disabled');
    }

    moreBtn.removeEventListener('click', showAllTimes);
  }

  moreBtn.innerHTML = 'ещё...';
  moreBtn.classList.add('card-body-checks-check-times__more');
  moreBtn.addEventListener('click', showAllTimes);

  if (timesLenght >= 5) {
    for (let i = times.childElementCount; i > numOfVisibleTimes; i--) {
      times.children[i - 1].classList.add('card-body-checks-check-times__time_disabled');
    }

    // times.appendChild(moreBtn);
    times.insertBefore(moreBtn, times.children[3]);
  }
});
