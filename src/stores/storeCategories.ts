import { v4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CardStatistic {
  time: number;
  correct: boolean;
}

export interface Card {
  id: string;
  time: number;
  question: string;
  answer: string;
  statistics: CardStatistic[];
}

export interface Subcategory {
  id: string;
  name: string;
  cards: Card[];
}

export interface Category {
  id: string;
  name: string;
  subcategories: Subcategory[];
}

export interface CategoriesState {
  syncTime: number | undefined;
  categories: Category[];
}

export interface CategoriesActions {
  setCategories: (value: Category[]) => void;
  createCategory: (name: string) => void;
  changeCategoryName: (id: string, name: string) => void;
  deleteCategorey: (id: string) => void;
  importCategory: (value: string) => boolean;
  createSubcategory: (subcategoryName: string, categoryID: string) => void;
  changeSubcategoryName: (id: string, value: string) => void;
  deleteSubcategory: (id: string) => void;
  getCategoryByID: (id: string) => Category | undefined;
  addCard: (subcategoryID: string, card: Card) => void;
  getCards: (
    categoryID: string,
    shuffle: boolean,
    training: boolean,
    subcategoryID?: string
  ) => Card[];
  deleteCard: (id: string) => void;
  changeCard: (id: string, question: string, answer: string) => void;
  addCardStatistic: (id: string, time: number, isCorrect: boolean) => void;
  deleteCardStatistics: (id: string) => void;
  deleteAllCardStatistics: (subcategoryID: string) => void;
  setSyncTime: (value: number | undefined) => void;
  exportCategory: (id: string) => string;
  reset: () => void;
}

const initialState: CategoriesState = {
  syncTime: undefined,
  categories: [],
};

const shuffle = (cards: Card[]): Card[] => {
  return cards
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCategories: (value: Category[]) => {
        set({ categories: value });
      },

      createCategory: (name: string) => {
        const { categories } = get();
        const newCategories: Category[] = [
          ...categories,
          {
            id: v4(),
            name: name,
            subcategories: [],
          },
        ];

        set({ categories: newCategories });
      },

      importCategory: (value: string): boolean => {
        const { categories } = get();

        try {
          let importedCategory: Category = JSON.parse(value);

          if (
            !importedCategory.id ||
            !importedCategory.name ||
            !importedCategory.subcategories
          ) {
            return false;
          }

          importedCategory.id = v4();
          const newCategories = [...categories, importedCategory];
          set({ categories: newCategories });

          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },

      exportCategory: (id: string): string => {
        const { categories } = get();

        return JSON.stringify(
          categories.filter((category) => category.id === id)[0]
        );
      },

      changeCategoryName: (id: string, name: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          if (category.id === id) {
            return {
              id: category.id,
              name: name,
              subcategories: category.subcategories,
            };
          } else {
            return category;
          }
        });

        set({ categories: newCategories });
      },

      createSubcategory: (subcategoryName: string, categoryID: string) => {
        const { categories } = get();

        const newSubcategory: Subcategory = {
          id: v4(),
          name: subcategoryName,
          cards: [],
        };

        const newCategories = categories.map((category) => {
          if (category.id === categoryID) {
            const newCategory = {
              id: category.id,
              name: category.name,
              subcategories: category.subcategories.concat(newSubcategory),
            };
            return newCategory;
          } else {
            return category;
          }
        });
        set({ categories: newCategories });
      },

      deleteSubcategory: (id: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.filter(
            (subcategory) => subcategory.id !== id
          );
          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories, //category.subcategory,
          };
        });

        set({ categories: newCategories });
      },

      changeSubcategoryName: (id: string, value: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            if (subcategory.id === id) {
              return {
                id: subcategory.id,
                name: value,
                cards: subcategory.cards,
              };
            } else {
              return subcategory;
            }
          });
          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories, //category.subcategory,
          };
        });

        set({ categories: newCategories });
      },

      deleteCategorey: (id: string) => {
        const { categories } = get();
        const newCategories = categories.filter((cat) => cat.id !== id);
        set({ categories: newCategories });
      },

      getCategoryByID: (id: string): Category | undefined => {
        const { categories } = get();
        const result = categories.find((cat) => cat.id === id);
        return result;
      },

      addCard: (id: string, card: Card) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            if (subcategory.id === id) {
              return {
                id: subcategory.id,
                name: subcategory.name,
                cards: subcategory.cards.concat(card),
              };
            } else {
              return subcategory;
            }
          });

          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories,
          };
        });

        set({ categories: newCategories });
      },

      deleteCard: (id: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            const newCards = subcategory.cards.filter((card) => card.id !== id);

            return {
              id: subcategory.id,
              name: subcategory.name,
              cards: newCards,
            };
          });

          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories,
          };
        });

        set({ categories: newCategories });
      },

      changeCard: (id: string, question: string, answer: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            const newCards = subcategory.cards.map((card) => {
              if (card.id === id) {
                return {
                  id: card.id,
                  time: Date.now(),
                  question: question,
                  answer: answer,
                  statistics: card.statistics,
                };
              } else {
                return card;
              }
            });

            return {
              id: subcategory.id,
              name: subcategory.name,
              cards: newCards,
            };
          });

          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories,
          };
        });

        set({ categories: newCategories });
      },

      getCards: (
        categoryID: string,
        isShuffle: boolean,
        isTraining: boolean,
        subcategoryID?: string
      ): Card[] => {
        const { categories } = get();
        let cards: Card[] = [];

        const category = categories.find((e) => e.id === categoryID);
        if (category === undefined) return [];

        // GET CARDS
        if (subcategoryID) {
          const subcategory = category.subcategories.find(
            (subcategory) => subcategory.id === subcategoryID
          );

          if (subcategory === undefined) {
            return [];
          }
          cards = subcategory.cards;
        } else {
          cards = category.subcategories
            .map((subcategory) => subcategory.cards)
            .flat();
        }

        // GET TRAINING CARDS
        const trainingCards = cards.filter((card) => {
          let correct = 0;
          let tries = 0;
          let lastTry = 0;
          correct += card.statistics.filter(
            (statistic) => statistic.correct === true
          ).length;

          tries = card.statistics.length;
          if (card.statistics[card.statistics.length - 1] === undefined) {
            return card;
          } else {
            lastTry = card.statistics[card.statistics.length - 1].time;
          }

          const deltaTime = Date.now() - new Date(lastTry).getTime();
          let deltaDay = deltaTime / (24 * 60 * 60 * 1000);
          if (deltaDay < 1) deltaDay = 1;

          const index = correct / tries / deltaDay;

          console.log(
            "correct: ",
            correct,
            "tries:",
            tries,
            "deltaDay:",
            deltaDay,
            "index:",
            index,
            card
          );
          if (index <= 0.5 || Number.isNaN(index)) return card;
        });
        console.log(trainingCards);
        if (isTraining) cards = trainingCards;
        if (isShuffle) cards = shuffle(cards);

        return cards;
      },

      addCardStatistic: (id: string, time: number, isCorrect: boolean) => {
        const { categories } = get();
        const newCatogories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            const newCards = subcategory.cards.map((card) => {
              if (card.id === id) {
                return {
                  id: card.id,
                  time: card.time,
                  question: card.question,
                  answer: card.answer,
                  statistics: [
                    ...card.statistics,
                    {
                      time: time,
                      correct: isCorrect,
                    },
                  ],
                };
              }

              return {
                id: card.id,
                time: card.time,
                question: card.question,
                answer: card.answer,
                statistics: card.statistics,
              };
            });

            return {
              id: subcategory.id,
              name: subcategory.name,
              cards: newCards,
            };
          });

          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories,
          };
        });

        set({ categories: newCatogories });
      },

      deleteCardStatistics: (id: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            const newCards = subcategory.cards.map((card) => {
              if (card.id === id) {
                return {
                  id: card.id,
                  time: card.time,
                  question: card.question,
                  answer: card.answer,
                  statistics: [],
                };
              } else {
                return {
                  id: card.id,
                  time: card.time,
                  question: card.question,
                  answer: card.answer,
                  statistics: card.statistics,
                };
              }
            });

            return {
              id: subcategory.id,
              name: subcategory.name,
              cards: newCards,
            };
          });
          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories,
          };
        });

        set({ categories: newCategories });
      },

      deleteAllCardStatistics: (subcategoryID: string) => {
        const { categories } = get();
        const newCategories = categories.map((category) => {
          const newSubcategories = category.subcategories.map((subcategory) => {
            const newCards = subcategory.cards.map((card) => {
              if (subcategory.id === subcategoryID) {
                return {
                  id: card.id,
                  time: card.time,
                  question: card.question,
                  answer: card.answer,
                  statistics: [],
                };
              } else {
                return {
                  id: card.id,
                  time: card.time,
                  question: card.question,
                  answer: card.answer,
                  statistics: card.statistics,
                };
              }
            });

            return {
              id: subcategory.id,
              name: subcategory.name,
              cards: newCards,
            };
          });
          return {
            id: category.id,
            name: category.name,
            subcategories: newSubcategories,
          };
        });

        set({ categories: newCategories });
      },

      setSyncTime: (value: number | undefined) => {
        if (value === undefined) return;
        set({ syncTime: value });
      },

      reset: async () => {
        set(initialState);
      },
    }),
    {
      name: "cards-categories-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
