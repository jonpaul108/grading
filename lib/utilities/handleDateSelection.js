export function handleDateSelection() {
  const { retrieveState, handleUIDupdate } = this;
  const date = retrieveState("date");
  const url = `/uids-by-date-range-pacific?startDate=${date}&endDate=${date}`;
  console.log("url:", url);
  fetch(url)
    .then((res) => res.json())
    .then((data) => handleUIDupdate(data))
    .catch((err) => console.log(err));
}
