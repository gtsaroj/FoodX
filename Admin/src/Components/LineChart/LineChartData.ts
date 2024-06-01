const today = new Date();
export const Week = [
  today.getDay() + 1,
  today.getDay() + 2,
  today.getDay() + 3,
  today.getDay() + 4,
  today.getDay() + 5,
  today.getDay() + 6,
  today.getDay() + 7,
];

export function weekDateRoundUp() {
  const dateCollection : number[] = [];
  Week.forEach((date) => {
    if (date > 7) {
      const currentDate = date - 7;
        dateCollection.push(currentDate);
        return    
    }
    dateCollection.push(date);
  });
    return dateCollection;
}

