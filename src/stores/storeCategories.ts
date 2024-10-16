import { v4 } from "uuid";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CardStatistic {
  time: number;
  isRight: boolean;
}

export interface Card {
  id: string;
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
  categories: Category[];
}

export interface CategoriesActions {
  createCategory: (name: string) => void;
  changeCategoryName: (id: string, name: string) => void;
  deleteCategorey: (id: string) => void;
  createSubcategory: (subcategoryName: string, categoryID: string) => void;
  changeSubcategoryName: (id: string, value: string) => void;
  deleteSubcategory: (id: string) => void;
  getCategoryByID: (id: string) => Category | undefined;
  addCard: (subcategoryID: string, card: Card) => void;
  getCards: (categoryID: string, subcategoryID?: string | undefined) => Card[];
  deleteCard: (id: string) => void;
  changeCard: (id: string, question: string, answer: string) => void;
  getQueryList: () => Card[];
  reset: () => void;
}

const initialState: CategoriesState = {
  categories: [],
};

export const useCategoriesStore = create<CategoriesState & CategoriesActions>()(
  persist(
    (set, get) => ({
      ...initialState,

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
        subcategoryID?: string | undefined
      ): Card[] => {
        const { categories } = get();

        const category = categories.find((e) => e.id === categoryID);
        if (category === undefined) return [];

        // SUBCATEGORY SELECTED
        if (subcategoryID) {
          const subcategory = category.subcategories.find(
            (subcategory) => subcategory.id === subcategoryID
          );

          if (subcategory === undefined) {
            return [];
          }
          return subcategory.cards;
        }

        // WITHOUT SUBCATEGORY
        return category.subcategories.map((e) => e.cards).flat();
      },

      getQueryList: (): Card[] => {
        return [];
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: "cards-categories-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
