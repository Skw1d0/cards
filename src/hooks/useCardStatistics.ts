import { useCallback } from "react";
import { useCategoriesStore } from "../stores/storeCategories";

export interface CardDataType {
  labels: string[];
  correct: number[];
  incorrect: number[];
}

export const useCardStatistics = () => {
  const { getCardByID } = useCategoriesStore();

  const getCardData = useCallback(
    (cardID: string | undefined): CardDataType | undefined => {
      console.log("card data");
      const card = getCardByID(cardID);
      if (!card) return;

      let correct: number[] = [];
      let incorrect: number[] = [];
      let labels: string[] = [];

      [...Array(7)].forEach((i, index) => {
        const date =
          new Date(
            new Date(Date.now()).getFullYear(),
            new Date(Date.now()).getMonth(),
            new Date(Date.now()).getDate() + 1,
            new Date(Date.now()).getHours(),
            new Date(Date.now()).getMinutes()
          ).getTime() -
          (7 - index) * 24 * 60 * 60 * 1000;

        const dateMin = new Date(
          new Date(date).getFullYear(),
          new Date(date).getMonth(),
          new Date(date).getDate(),
          0,
          0
        ).getTime();
        const dateMax = new Date(
          new Date(date).getFullYear(),
          new Date(date).getMonth(),
          new Date(date).getDate(),
          23,
          59
        ).getTime();

        labels.push(
          `${new Date(date).getDate()}.${new Date(date).getMonth() + 1}.`
        );

        correct.push(
          card.statistics.filter(
            (card) =>
              card.time >= dateMin &&
              card.time <= dateMax &&
              card.correct === true
          ).length
        );

        incorrect.push(
          card.statistics.filter(
            (card) =>
              card.time >= dateMin &&
              card.time <= dateMax &&
              card.correct === false
          ).length
        );
      });

      return { labels, correct, incorrect };
    },
    []
  );

  return { getCardData };
};
