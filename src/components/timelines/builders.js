import {
    START_YEAR,
    NUM_OF_YEARS,
    MONTH_NAMES,
    MONTHS_PER_YEAR,
    QUARTERS_PER_YEAR,
    MONTHS_PER_QUARTER,
    BOT_PROPS,
  } from './constants'
  
  import { convertToDate, convertYearToDate, addMonthsToYear, addMonthsToYearAsDate } from './utils'
  
  export const buildQuarterCells = () => {
    const v = []
    for (let i = 0; i < QUARTERS_PER_YEAR * NUM_OF_YEARS; i += 1) {
      const quarter = (i % 4) + 1
      const startMonth = i * MONTHS_PER_QUARTER
      const s = addMonthsToYear(START_YEAR, startMonth)
      const e = addMonthsToYear(START_YEAR, startMonth + MONTHS_PER_QUARTER)
      v.push({
        id: `${s.year}-q${quarter}`,
        title: `Q${quarter} ${s.year}`,
        start: new Date(`${s.year}-${s.month}-01`),
        end: new Date(`${e.year}-${e.month}-01`),
      })
    }
    return v
  }
  
  export const buildMonthCells = () => {
    const v = []
    for (let i = 0; i < MONTHS_PER_YEAR * NUM_OF_YEARS; i += 1) {
      const startMonth = i
      const start = addMonthsToYearAsDate(START_YEAR, startMonth)
      const end = addMonthsToYearAsDate(START_YEAR, startMonth + 1)
      v.push({
        id: `m${startMonth}`,
        title: MONTH_NAMES[i % 12],
        start,
        end,
      })
    }
    return v
  }
  
  export const buildTimebar = () => [
    {
      id: 'quarters',
      title: 'Quarters',
      cells: buildQuarterCells(),
      style: {},
    },
    {
      id: 'months',
      title: 'Months',
      cells: buildMonthCells(),
      useAsGrid: true,
      style: {},
    },
  ]
  
  export const buildElement = (trackId, start, end, i) => {
    const bgColor = BOT_PROPS[trackId]["color"]
    const color = '#ffffff'
    return {
      id: `t-${trackId}-el-${i}`,
      title: BOT_PROPS[trackId]["label"],
      start,
      end,
      style: {
        backgroundColor: `#${bgColor}`,
        color,
        borderRadius: '4px',
        boxShadow: '1px 1px 0px rgba(0, 0, 0, 0.25)',
        textTransform: 'capitalize',
      },
    }
  }

  export const buildElements = (trackId,bots) => {
    const elements = []
    for(var i = 0; i < bots.length;i++) {
        if(bots[i]["type"] === trackId) {
          if(bots[i]["lifetime"]) {
            elements.push(
              buildElement(
                  trackId,
                  convertYearToDate(START_YEAR),
                  convertYearToDate(START_YEAR+NUM_OF_YEARS),
                  i
              )
            )
          }
          else {
            elements.push(
              buildElement(
                  trackId,
                  convertToDate(bots[i]["start"]),
                  convertToDate(bots[i]["end"]),
                  i
              )

          )
          }

        }
    }

    return elements;
  }
  
  
  export const buildTrack = (trackValue,trackLabel,trackElements) => {
    return {
      id: `track-${trackValue}`,
      title: `${trackLabel}`,
      elements: buildElements(trackValue,trackElements),
      isOpen: false,
    }
  }