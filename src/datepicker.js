/**
 * Creates a calendar datepicker
 *
 */
class Calendar {
  constructor(container) {
    this.state = {
      weekday: 0,
      day: 0,
      month: 0,
      year: 0,
      currentSelection: 0
    };
    this.daysOftheWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ];

    this.container = document.querySelector(`.${container}`);
  }

  /**
   * Adds event listeners on the buttons and the calendar
   *
   */
  addEventListeners() {
    document
      .querySelector(".datepicker__back")
      .addEventListener("click", e => this.onBack());
    document
      .querySelector(".datepicker__forward")
      .addEventListener("click", e => this.onForward());
    document
      .querySelector(".calendar")
      .addEventListener("click", this.onClick.bind(this));
    document
      .querySelector(".calendar")
      .addEventListener("keyup", this.onKeyUp.bind(this));
  }

  /**
   * Fills the calendar for the particular month
   *
   * @param the number of days in that month
   */
  buildCalendar(days) {
    //this is hacky but when you create dates January is 01
    const monthsOfTheYear = [
      "",
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];

    const weekdays = `${this.createWeekdayHeaders().join("")}`;

    const daysOfTheMonth = this.createDaysOfTheMonth(days, monthsOfTheYear);

    const monthLabel = `<h2 class="datepicker__month">${
      monthsOfTheYear[this.state.month]
    } ${this.state.year}</h2>`;
    const back = `<button class="datepicker__back" aria-label="Previous Month">Back</button>`;
    const forth = `<button class="datepicker__forward" aria-label="Next Month">Forth</button>`;

    this.container.innerHTML =
      back + monthLabel + forth + weekdays + daysOfTheMonth;
    document
      .getElementById(this.state.currentSelection)
      .classList.add("selected");
    document.getElementById(this.state.currentSelection).focus();
    this.addEventListeners();
  }

  /**
   * Helper function change the date onKeyUp
   *
   * @param type: String
   * @param amount: Number
   */
  changeDate(type, amount) {
    const currentSelection = new Date(
      `${this.state.month}, ${this.state.currentSelection}, ${this.state.year}`
    );
    const newSelection = new Date(currentSelection);

    let timestamp;
    if (type == "subtract") {
      timestamp = newSelection.setDate(currentSelection.getDate() - amount);
    } else {
      timestamp = newSelection.setDate(currentSelection.getDate() + amount);
    }

    const theDayToday = new Date(timestamp);
    this.state.currentSelection = theDayToday.getDate();
    //if we're adding, we need to add +1 to the month because of the discrepancy between the index of months when created (see comment in buildCalendar)
    const month =
      type == "subtract" ? theDayToday.getMonth() : theDayToday.getMonth() + 1;
    if (month != this.state.month) {
      this.prepareCalendarData(theDayToday);
    }
  }

  /**
   * Helper function to create a div for the days of the week and the empty days at the beginning of the month
   *
   * @returns a string of divs that create the days of the month
   */
  createDaysOfTheMonth(days, months) {
    const state = this.state;
    const daysOftheWeek = this.daysOftheWeek;
    const firstDayOfTheMonth = new Date(
      `${this.state.month} 01 ${this.state.year}`
    );

    if (firstDayOfTheMonth.getDay() == 0) {
      return `<div class="calendar">${createDaysOfTheWeek(
        Array(days).fill(1)
      ).join("")}</div>`;
    } else {
      const emptyDays = `${createEmptyDivs(
        Array(firstDayOfTheMonth.getDay()).fill(1)
      ).join("")}`;
      return `<div class="calendar">${emptyDays}${createDaysOfTheWeek(
        Array(days).fill(1)
      ).join("")}</div>`;
    }

    function createDaysOfTheWeek(arrayOfDays) {
      return arrayOfDays.map(function(elem, index) {
        //we're creating a new Date each day so we can get the day of the week to include in the label
        const newDay = new Date(`${state.month}, ${index + 1}, ${state.year}`);
        const weekday = newDay.getDay();
        return `<button class="calendar__days" id="${index +
          1}" aria-label="${daysOftheWeek[weekday]} ${months[state.month]} ${index + 1}">${index + 1}</button>`;
      });
    }

    function createEmptyDivs(array) {
      return array.map(function(elem) {
        return `<div></div>`;
      });
    }
  }

  /**
   * Helper function to create the weekday headers
   *
   * @returns a string of divs that create the weekday headers
   */
  createWeekdayHeaders() {
    return this.daysOftheWeek.map(function(weekday) {
      return `<div class="datepicker__weekday">${weekday}</div>`;
    });
  }

  /**
   * Initializes a calendar on the curresnt date
   *
   */
  init() {
    const rightNow = new Date();
    this.prepareCalendarData(rightNow);
  }

  /**
   * Switches view to previous month
   *
   */
  onBack(e, fromKeyboard) {
    const previousMonth =
      this.state.month == 1
        ? new Date(`12 01 ${this.state.year - 1}`)
        : new Date(`${this.state.month - 1} 01 ${this.state.year}`);

    if (fromKeyboard) {
      return previousMonth;
    } else this.prepareCalendarData(previousMonth);
  }

  /**
   * Adds highlight when clicked and updates state
   *
   */
  onClick(e) {
    if (this.state.currentSelection) {
      document
        .getElementById(this.state.currentSelection)
        .classList.remove("selected");
    }

    document.getElementById(e.target.id).classList.add("selected");
    this.state.currentSelection = Number(e.target.id);
  }

  /**
   * Switches view to next month
   *
   */
  onForward(e, fromKeyboard) {
    const nextMonth =
      this.state.month == 12
        ? new Date(`01 01 ${this.state.year + 1}`)
        : new Date(`${this.state.month + 1} 01 ${this.state.year}`);

    if (fromKeyboard) {
      return nextMonth;
    } else this.prepareCalendarData(nextMonth);
  }

  /**
   * Adds keyboard navigation and updates state
   */
  onKeyUp(e) {
    if (this.state.currentSelection) {
      document
        .getElementById(this.state.currentSelection)
        .classList.remove("selected");
    }

    if (e.key.toLowerCase() === "tab") {
      this.state.currentSelection = Number(e.target.id);
    }
    if (e.key === "ArrowLeft") {
      this.changeDate("subtract", 1);
    }
    if (e.key === "ArrowRight") {
      this.changeDate("add", 1);
    }
    if (e.key === "ArrowUp") {
      this.changeDate("subtract", 7);
    }
    if (e.key === "ArrowDown") {
      this.changeDate("add", 7);
    }

    document.getElementById(this.state.currentSelection).focus();
    document
      .getElementById(this.state.currentSelection)
      .classList.add("selected");
  }

  /**
   * Sets state and prepares to fill calendar
   *
   * @param a Date object
   */
  prepareCalendarData(currentDate) {
    this.state.weekday = currentDate.getDay();
    this.state.day = currentDate.getDate();
    this.state.month = currentDate.getMonth() + 1;
    this.state.year = currentDate.getFullYear();
    this.state.currentSelection = this.state.day;
    const daysInMonth = new Date(
      this.state.year,
      this.state.month,
      0
    ).getDate();
    this.buildCalendar(daysInMonth);
  }

  returnState() {
    return this.state;
  }
}

module.exports = { Calendar };