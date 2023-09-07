export const getTime = (currentTime) => {
  console.log("currentTime", currentTime);

  const timeString = "10 AM";

  // Create a new Date object with today's date
  const referenceDate = new Date();
  
  // Extract the hour and minute from the time string
  const timeComponents = timeString.match(/(\d+):(\d+)\s+(AM|PM)/i);
  
  if (timeComponents) {
    let hour = parseInt(timeComponents[1]);
    const minute = parseInt(timeComponents[2]);
    const meridiem = timeComponents[3].toLowerCase();
  
    // Adjust the hour based on AM or PM
    if (meridiem === "pm" && hour !== 12) {
      hour += 12;
    } else if (meridiem === "am" && hour === 12) {
      hour = 0;
    }
  
    // Set the hour and minute to the reference date
    referenceDate.setHours(hour);
    referenceDate.setMinutes(minute);
    referenceDate.setSeconds(0);
  
    console.log("referenceDate", referenceDate);
  } else {
    console.log("Invalid time format");
  }
  

};