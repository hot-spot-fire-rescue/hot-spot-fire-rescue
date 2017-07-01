export const findClosestAmbulance = (location) => {
  if ([0, 1, 2, 3, 4].includes(location % 10) && location < 35) {
    return 30
  } else if ([5, 6, 7, 8, 9].includes(location % 10) && location < 40) {
    return 6
  } else if ([0, 1, 2, 3, 4].includes(location % 10)) {
    return 73
  } else {
    return 49
  }
}
