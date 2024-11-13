import { Card } from "../stores/storeCategories";
import dayjs from "dayjs";

export interface CardDataType {
  labels: string[];
  correct: number[];
  incorrect: number[];
}

export const getCardStatistics = (card: Card): CardDataType => {
  return [...Array(7)].reduce(
    (acc: CardDataType, _, index: number) => {
      const today = dayjs().subtract(6 - index, "day");
      const dateMin = today.startOf("day");
      const dateMax = today.endOf("day");

      return {
        labels: [...acc.labels, dateMin.format("DD.MM.")],
        correct: [
          ...acc.correct,
          card.statistics.filter(
            (card) =>
              card.time >= dateMin.unix() * 1000 &&
              card.time <= dateMax.unix() * 1000 &&
              card.correct === true
          ).length,
        ],
        incorrect: [
          ...acc.incorrect,
          card.statistics.filter(
            (card) =>
              card.time >= dateMin.unix() * 1000 &&
              card.time <= dateMax.unix() * 1000 &&
              card.correct === false
          ).length,
        ],
      };
    },
    { labels: [], correct: [], incorrect: [] }
  );
};
