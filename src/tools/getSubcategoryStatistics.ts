import { Card } from "../stores/storeCategories";
import dayjs from "dayjs";

export interface SubcategoryStytisticsDataType {
  labels: string[];
  amount: number[];
}

export const getSubcategoryStatistics = (
  cards: Card[]
): SubcategoryStytisticsDataType => {
  const cardStatistics = cards.map((card) => card.statistics).flat();

  return [...Array(7)].reduce(
    (acc: SubcategoryStytisticsDataType, _, index: number) => {
      const today = dayjs().subtract(6 - index, "day");
      const dateMin = today.startOf("day");
      const dateMax = today.endOf("day");

      return {
        labels: [...acc.labels, dateMin.format("DD.MM.")],
        amount: [
          ...acc.amount,
          cardStatistics.filter(
            (card) =>
              card.time >= dateMin.unix() * 1000 &&
              card.time <= dateMax.unix() * 1000
          ).length,
        ],
      };
    },
    { labels: [], amount: [] }
  );
};
