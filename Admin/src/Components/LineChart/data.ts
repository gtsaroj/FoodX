export interface ColourOption {
  readonly value: string;
  readonly label: string;
  readonly color: string;
  readonly isFixed?: boolean;
  readonly isDisabled?: boolean;
}

export const selectOptions: readonly ColourOption[] = [
  {
    label: "Current Week",
    value: "current week order",
    color: "Red",
  },
  {
    label: "Previous Week",
    value: "previous week order",
    color: "Red",
  },
  {
    label: "2 Weeks ago",
    value: "2  week ago order",
    color: "Red",
  },
];

export const orderCharts = [
  {
    samosa: 120,
    cold_drinks: 45,
    Momo: 30,
    others: 20,
    day: "sunday",
  },
  {
    samosa: 95,
    cold_drinks: 60,
    momo: 22,
    others: 18,
    day: "monday",
  },
  {
    samosa: 110,
    cold_drinks: 50,
    momo: 28,
    others: 25,
    day: "tuesday",
  },
  {
    samosa: 130,
    cold_drinks: 55,
    momo: 35,
    others: 15,
    day: "thursday",
  },
  {
    samosa: 105,
    cold_drinks: 52,
    momo: 20,
    others: 22,
    day: "friday",
  },
  {
    samosa: 115,
    cold_drinks: 47,
    momo: 26,
    others: 19,
    day: "saturday",
  },
];
function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const orderChartsOfMonthly = [
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 1",
  },
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 2",
  },
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 3",
  },
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 4",
  },
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 5",
  },
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 6",
  },
  {
    samosa: getRandomInt(800, 1200),
    pizza: getRandomInt(400, 600),
    cold_drinks: getRandomInt(1400, 1700),
    others: getRandomInt(900, 1300),
    week: "Week 7",
  },
];
