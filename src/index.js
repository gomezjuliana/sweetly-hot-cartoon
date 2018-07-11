const Calendar = require("./datepicker.js");

class Input {
  constructor(container) {
    this.container = document.querySelector(`.${container}`);
    this.input = "";
    this.datepickerDiv = document.querySelector(".datepicker");
    this.cally = new Calendar("datepicker");
  }

  init() {
    this.container.innerHTML = `
      <label for="datepicker-input">Date:</label>
      <input type="text" id="datepicker-input"></input>
      <button class="datepicker-button">Datepicker</button>`;

    this.listenForDatepickerButton();

    this.input = document.getElementById("datepicker-input");
    this.input.addEventListener("input", e => this.formatDate(e.target.value));
  }

  checkValue(str, max) {
    if (str.charAt(0) !== "0" || str == "00") {
      let num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) {
        num = 1;
      }
      str = num.toString().length == 1 ? "0" + num : num.toString();
    }
    return str;
  }

  checkIfItWorks() {
    console.log("hey");
  }

  formatDate(date) {
    let inputValue = date;
    if (/\D\/$/.test(inputValue)) {
      inputValue = inputValue.substr(0, inputValue.length - 1);
    }
    let values = inputValue.split("/").map(function(v) {
      return v.replace(/\D/g, "");
    });
    if (values[0]) {
      values[0] = this.checkValue(values[0], 12);
    }
    if (values[1]) {
      values[1] = this.checkValue(values[1], 31);
    }
    let output = values.map(function(v, i) {
      return v.length == 2 && i < 2 ? v + " / " : v;
    });
    this.input.value = output.join("").substr(0, 14);
  }

  listenForDatepickerButton() {
    document
      .querySelector(".datepicker-button")
      .addEventListener("click", e => this.openDatepicker(e));
  }

  openDatepicker(e) {
    if (this.datepickerDiv.classList.contains("datepicker--active")) {
      this.datepickerDiv.classList.remove("datepicker--active");
      this.datepickerDiv.style.display = "none";
      return;
    }

    this.datepickerDiv.style.display = "grid";

    if (this.input.value) {
      const val = this.input.value;
      const month = val.slice(0, 2) - 1;
      const day = val.slice(5, 7);
      const year = val.slice(10, 14);
      const preselectedDay = new Date(year, month, day);
      this.cally.prepareCalendarData(preselectedDay);
    } else {
      this.cally.init();
      const state = this.cally.returnState();
      this.formatDate(
        `${state.month} / ${state.currentSelection} / ${state.year}`
      );
    }

    this.datepickerDiv.classList.add("datepicker--active");
    this.datepickerDiv.addEventListener("keyup", e => this.onKeyUp(e));
    this.datepickerDiv.addEventListener("click", e => this.onClick(e));
  }

  onClick(e) {
    const state = this.cally.returnState();
    this.formatDate(
      `${state.month} / ${state.currentSelection} / ${state.year}`
    );
    if (
      e.target.className !== "datepicker__back" &&
      e.target.className !== "datepicker__forward"
    ) {
      this.datepickerDiv.classList.remove("datepicker--active");
      this.datepickerDiv.style.display = "none";
    }
  }

  onKeyUp(e) {
    const state = this.cally.returnState();
    this.formatDate(
      `${state.month} / ${state.currentSelection} / ${state.year}`
    );
    if (e.key == "Enter") {
      this.datepickerDiv.classList.remove("datepicker--active");
      this.datepickerDiv.style.display = "none";
    }
  }
}

module.exports = { Input };
