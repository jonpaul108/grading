import { PromptGrades } from "./views/promptGrades.js";
import { delineateGrades } from "./utilities/getGrades.js";
import { weatherData as tAAData } from "../data/tAAData.js";
import { studentData } from "../data/studentData.js";
import { handlePromptGradeClick } from "./utilities/handlePromptGradeClick.js";
import { header } from "./views/header.js";


export class App {
  constructor() {
    this.state = {
      grades: [],
      totalHelpRequests: 0,
      finalGrade: "",
      date: "",
      uids: [],
    };
    this.header = header.bind(this);
    this.handleFinalGrade = this.handleFinalGrade.bind(this);
    this.calculateFinalGrade = this.calculateFinalGrade.bind(this);
    this.changeFinalGrade = this.changeFinalGrade.bind(this);
    this.retrieveState = this.retrieveState.bind(this);
    this.updateState = this.updateState.bind(this);
    this.handleDateSelection = this.handleDateSelection.bind(this);
    this.handleUIDupdate = this.handleUIDupdate.bind(this);
    this.getDataByUIDs = this.getDataByUIDs.bind(this);
    this.onLoadEvent();
    console.log("app loaded");
  }

  async updateState(target, payload, callback) {
    const prevState = JSON.stringify(this.state);
    this.state[target] = payload;
    const newState = JSON.stringify(this.state);
    const stateChanged = newState !== prevState;
    if (stateChanged && callback) callback();
    console.log("updated State", this.state);
  }

  retrieveState(target) {
    return this.state[target];
  }

  handleUIDupdate(uids) {
    const { updateState, getDataByUIDs } = this;
    console.log("uids:", uids);
    updateState("uids", uids, getDataByUIDs);
  }

  handleDateSelection() {
    const { retrieveState, handleUIDupdate } = this;
    const date = retrieveState("date");
    const url = `/unreported-uids-by-date-range-pacific?startDate=${date}&endDate=${date}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => handleUIDupdate(data))
      .catch((err) => console.log(err));
  }

  getDataByUIDs() {
    const uids = this.retrieveState("uids");
    const config = {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ uids }),
    };
    fetch("/beta-user-data-by-uid-array?format=TNUR", config)
      .then((res) => res.json())
      .then((data) => console.log('DATA:', data))
      .catch((err) => console.log(err));
  }

  onLoadEvent() {
    window.addEventListener("load", () => {
      //update to load today's date
      // this.getTAAData();
      console.log("loaded");
    });
  }

  getDate(date) {
    console.log("get Date");
    let today = date;
    if (!today) {
      today = new Date();
      date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
    }
    return date;
  }

  getTAAData() {
    const { date } = this.state;
    const url = `/unreported-uids-by-date-range-pacific?startDate=${date}&endDate=${date}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("uids::::::::::", data);
        this.updateState("uids", data);
      })
      .catch((err) => console.log(err));
  }

  getStudentData() {
    //to retrieve student data
  }

  handleFinalGrade(e) {
    const { calculateFinalGrade } = this;
    const { grades } = this.state;
    calculateFinalGrade();
    console.log("final", this.state.finalGrade);
    this.changeFinalGrade(this.state.finalGrade);
  }

  calculateFinalGrade() {
    const { grades } = this.state;
    const tAA = tAAData;
    const scores = grades.reduce((score, el) => {
      const { promptGrade } = el;
      score[promptGrade] = score[promptGrade] ? score[promptGrade] + 1 : 1;
      return score;
    }, {});
    console.log(scores);
    const {
      "Four Week": fourWeek,
      "Two Week": twoWeek,
      Accept: accept,
    } = scores;
    console.log(fourWeek, twoWeek, accept, scores);
    if (!fourWeek && accept >= 3) {
      this.state.finalGrade = "Accept";
    } else if (!fourWeek && twoWeek) {
      this.state.finalGrade = "Two Week";
    } else if (fourWeek) {
      this.state.finalGrade = "Four Week";
    } else {
      this.state.finalGrade = "N/A";
    }
  }

  changeFinalGrade(grade = "") {
    const gradeSpan = document.getElementById("final_grade");
    const lowerCase = grade.toLowerCase();
    const textClass =
      lowerCase === "accept"
        ? "green-text"
        : lowerCase === "two week"
        ? "yellow-text"
        : "red-text";
    gradeSpan.innerText = grade;
    gradeSpan.className = textClass;
  }

  view() {
    const { prompts } = tAAData;
    const { grades, finalGrade } = this.state;
    const { header, updateState, handleFinalGrade, handleDateSelection } = this;
    const appContainer = document.createElement("div");
    const headerBar = header({
      updateState,
      finalGrade,
      handleFinalGrade,
      handleDateSelection,
    });
    delineateGrades(studentData, tAAData, grades);
    appContainer.className = "app_container";
    appContainer.append(headerBar);
    grades.forEach((el, i) => {
      const promptGrades = new PromptGrades(el, prompts[i], studentData[i]);
      const prompt = promptGrades.createGradeContainer();
      const gradeSectionButton = document.createElement("button");
      const handlePromptButton = handlePromptGradeClick.bind(promptGrades);
      gradeSectionButton.className = "btn prompt_grade_btn";
      gradeSectionButton.innerText = "Grade Prompt";
      gradeSectionButton.addEventListener("click", handlePromptButton);
      prompt.append(gradeSectionButton);
      appContainer.append(prompt);
    });
    return appContainer;
  }
}
