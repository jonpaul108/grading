
function datePicker(props) {
  const { updateState, handleDateSelection } = props;
  const container = document.createElement("div");
  const btn = document.createElement("button");
  const el = document.createElement("input");
  el.id = "datepicker";
  el.type = "text";
  el.className = "date input";
  btn.id = "dateButton";
  btn.className = "btn";
  btn.innerText = "select"
  document.addEventListener("DOMContentLoaded", function () {
    $("#datepicker").datepicker();
  });
  btn.addEventListener("click", async function (e) {
    const picker = document.getElementById("datepicker")
    const formatted = formatDate(picker.value);
    await updateState("date", formatted);
    handleDateSelection();
  });
  container.append(el);
  container.append(btn);
  return container;
}


function formatDate(date) {
  const split = date.split("/");
  [split[0], split[1], split[2]] = [split[2], split[0], split[1]];
  const newDate = split.join("-");
  return newDate;
}
export default datePicker;