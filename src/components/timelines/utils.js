import { BorderTopSharp } from '@material-ui/icons'
import { MONTHS_PER_YEAR } from './constants'

export const fill = n => {
  const arr = []
  for (let i = 0; i < n; i += 1) {
    arr.push(i)
  }
  return arr
}

export const getAllBotTypes = (bots) => {
  var botTypes = [];

  for(var i = 0; i < bots["bots"].length; i++) {
    if(!botTypes.includes(bots["bots"][i]["type"])) {botTypes.push(bots["bots"][i]["type"])}
  }
  return botTypes;
}

export const convertToDate = (date) => {
  var dateParts = date.split("-");
  var year = dateParts[0];
  var month = dateParts[1];
  var day = dateParts[2];


  var date = new Date(`${year}-${month}-${day}`)
  return date
}
export const convertYearToDate = (year) => {
  var date = new Date(`${year}`)
  console.log(date)
  return date
}

export const addMonthsToYear = (year, monthsToAdd) => {
  let y = year
  let m = monthsToAdd
  while (m >= MONTHS_PER_YEAR) {
    m -= MONTHS_PER_YEAR
    y += 1
  }
  return { year: y, month: m + 1 }
}

export const addMonthsToYearAsDate = (year, monthsToAdd) => {
  const r = addMonthsToYear(year, monthsToAdd)
  return new Date(`${r.year}-${r.month}`)
}