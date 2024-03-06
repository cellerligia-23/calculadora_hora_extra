const inputDate = document.getElementById("date");
const inputStart = document.getElementById("start");
const inputEnd = document.getElementById("end");
const span_error = document.getElementById("span-error");
const btn_hours = document.getElementById("btn-calc-hours");
const resultHours = document.getElementById("result-hours");

/*********** Funções para o LocalStorage ***************/
const keyLocalStorage = "dates";

function checkLocalStorage() {
  const dates = new Array();

  if (localStorage.getItem(keyLocalStorage) === null) {
    localStorage.setItem(keyLocalStorage, JSON.stringify(dates));
  };
};

function setLocalStorage() {
  checkLocalStorage();

  const date = inputDate.value.split("-");
  const day = JSON.parse(localStorage.getItem(keyLocalStorage));

  const object = {
    date: `${date[2]}/${date[1]}/${date[0]}`,
    input: inputStart.value,
    output: inputEnd.value,
    hours_extras: resultHours.value,
  };

  day.push(object);

  localStorage.setItem(keyLocalStorage, JSON.stringify(day));
};

function getLocalStorage() {
  const arrayLocalStorage = JSON.parse(localStorage.getItem(keyLocalStorage));
  return arrayLocalStorage;
};
/*********** FUNÇÕES QUANTIDADES DE HORAS EXTRAS TRABALHADAS *******************************/
function calculateMinutesWorked() {
  const start = inputStart.value.split(":");
  const end = inputEnd.value.split(":");
  const lunch = 1;
  const workHoursDay = 8;
  const hours = Number(end[0]) - Number(start[0]) - lunch;
  const minutes = Number(end[1]) + Number(start[1]);

  if (hours > workHoursDay || minutes > 5) {
    const hoursInMinutes = (hours - workHoursDay) * 60;
    const minutesWored = minutes + hoursInMinutes;

    convertMinutesToHours(minutesWored);
  } else {
    resultHours.value = `Sem horas a mais trabalhadas`;
  };

  setLocalStorage();
  writeDays();
};

function convertMinutesToHours(total_minutes) {
  const hours = Math.floor(total_minutes / 60);
  const minutes = total_minutes % 60;

  let format_hours = (hours >= 0 && hours < 10) ? `0${hours}` : hours;
  let format_minutes = (minutes >= 0 && minutes < 10) ? `0${minutes}` : minutes;

  resultHours.value = `${format_hours}:${format_minutes}`;
};

function currentDate() {
  const date = new Date();
  const today = date.getDate();
  const currentMonth = date.getMonth() + 1;
  const currentYear = date.getFullYear();

  const format_today = (today >= 1 && today < 9) ? `0${today}` : today;
  const format_month = (currentMonth >= 1 && currentMonth < 9) ? `0${currentMonth}` : currentMonth;

  const format_date = `${currentYear}-${format_month}-${format_today}`;

  inputDate.value = format_date;
};

btn_hours.addEventListener("click", calculateMinutesWorked);

/*********** FUNÇÕES CALCULADORA DE HORAS EXTRAS *******************************/
const salary_month = document.getElementById("salary");
const hours_month = document.getElementById("hours-month");
const select_percentage_hours_extras = document.getElementById("percentage-hours-extras");
const extra_hours = document.getElementById("extra-hours");
const btn_extra_hours = document.getElementById("btn-extra-hours");
const result_hours_extras = document.getElementById("result-hours-extras");

function calculateHoursExtras() {
  const salary_hour = Number(salary_month.value) / Number(hours_month.value);
  const select_percentage = Number(select_percentage_hours_extras.value);
  const time_extra = extra_hours.value.split(":");

  if (select_percentage === 50) {
    const total_hour_extra = (
      salary_hour *
      1.5 *
      Number(time_extra[0])
    ).toFixed(2);
    const minutes_extra = ((salary_hour / 60) * 1.5).toFixed(3);
    const total_minutes_extra = (
      Number(minutes_extra) * Number(time_extra[1])
    ).toFixed(2);
    const sum = Number(total_hour_extra) + Number(total_minutes_extra);

    result_hours_extras.value = `R$ ${sum.toFixed(2)}`;
  } else if (select_percentage === 100) {
    const total_hour_extra = (salary_hour * 2 * Number(time_extra[0])).toFixed(
      2
    );
    const minutes_extra = ((salary_hour / 60) * 2).toFixed(3);
    const total_minutes_extra = (
      Number(minutes_extra) * Number(time_extra[1])
    ).toFixed(2);
    const sum = Number(total_hour_extra) + Number(total_minutes_extra);

    result_hours_extras.value = `R$ ${sum.toFixed(2)}`;
  };
};


btn_extra_hours.addEventListener("click", calculateHoursExtras);

/***************** FUNÇÕES DIAS ANOTADOS **************************/
const tableDays = document.getElementById("table-tbody-days");
function writeDays() {
  const data = getLocalStorage();

  const tableRow = !data ? "" :  data
  .map(
    (item, index) =>
      `<tr id=${index + 1}>
        <td>${item.date}</td>
        <td>${item.input}</td>
        <td>${item.output}</td>
        <td>${item.hours_extras}</td>
        <td>
          <img 
            src="./img/icon/remover.png" 
            alt="botão de remover" 
            class="icons"
            onclick="removeTableRow(${index})"
          />
        </td>
       </tr>`
  )
  .join(" ");

  tableDays.innerHTML = tableRow;
};

function removeTableRow(index) {
  const newListLocalStorege = getLocalStorage();
  newListLocalStorege.splice(index, 1);
  localStorage.setItem(keyLocalStorage, JSON.stringify(newListLocalStorege));
  writeDays();
};

/******** Executar a Função toda fez que a página iniciar/atualizar *********/
window.onload = () => {
  writeDays();
  currentDate();
};