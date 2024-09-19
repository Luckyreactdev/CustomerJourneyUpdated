import moment from "moment"

export const truncateString = (myString, chars) => {
  // trunactes the string given and adds elipsis to it if
  // its characters have exceeded the chars param
  if (myString.length > chars) {
    return myString.slice(0, chars) + "..."
  } else {
    return myString
  }
}

export const getTimeDuration = (timestamp) => {
  // Returns timestamp in human readable format e.g
  // 1 hour ago, 12 days ago e.t.c.
  return moment(timestamp).fromNow()
}

export const getReadableTimestamp = (timestamp) => {
  // converts django timestamp to a user friendly format
  const date = new Date(timestamp)
  const dateString = date.toDateString()
  const timestring = date.toTimeString()
  return `${dateString} at ${timestring.slice(0, 9)}`
}

export const getDateTime = (timestamp) => {
  const date = new Date(timestamp) // convert timestamp to date

  const year = date.getFullYear() // get year
  const month = (date.getMonth() + 1).toString().padStart(2, "0") // get month and pad with leading 0 if needed
  const day = date.getDate().toString().padStart(2, "0") // get day and pad with leading 0 if needed
  let hours = date.getHours() // get hours
  const minutes = date.getMinutes().toString().padStart(2, "0") // get minutes and pad with leading 0 if needed
  const seconds = date.getSeconds().toString().padStart(2, "0") // get seconds and pad with leading 0 if needed

  let ampm = "AM" // set default AM/PM value to AM
  if (hours >= 12) {
    // if hours is greater than or equal to 12, set AM/PM to PM
    ampm = "PM"
  }
  hours = hours % 12 // convert hours to 12-hour format
  if (hours === 0) {
    // if hours is 0, set it to 12
    hours = 12
  }
  hours = hours.toString().padStart(2, "0") // pad hours with leading 0 if needed

  const dateString = `${year}-${month}-${day}` // format date as string
  const timeString = `${hours}:${minutes}:${seconds} ${ampm}` // format time as string

  return { date: dateString, time: timeString } // return date and time
}
