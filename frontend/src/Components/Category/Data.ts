interface CategoryType {
  type: string;
  data: DataType[];
}

export interface DataType {
  id: number;
  name: string;
  price: number;
  image: string;
  isAvailable: boolean;
}

export interface menuType {
  id: number;
  type: string;
  icon: string;
}

export const category: CategoryType[] = [
  {
    type: "Burger",
    data: [
      {
        id: 1,
        name: "Chicken Burger",
        price: 450,
        image:
          "https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg",
        isAvailable: true,
      },
      {
        id: 2,
        name: "Chicken Burger",
        price: 450,
        image:
          "https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg",
        isAvailable: true,
      },
      {
        id: 3,
        name: "Chicken Burger",
        price: 450,
        image:
          "https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    type: "MOMO",
    data: [
      {
        id: 4,
        image:
          "https://cuisinenepal.com/wp-content/uploads/2019/08/steamed-pork-momo-optimized-1-825x550.jpg",
        name: "Chicken Momo",
        price: 450,
        isAvailable: true,
      },
      {
        id: 5,
        name: "Chicken Momo",
        image:
          "https://cuisinenepal.com/wp-content/uploads/2019/08/steamed-pork-momo-optimized-1-825x550.jpg",
        price: 450,
        isAvailable: true,
      },
      {
        id: 6,
        name: "Chicken Momo",
        image:
          "https://cuisinenepal.com/wp-content/uploads/2019/08/steamed-pork-momo-optimized-1-825x550.jpg",
        price: 450,
        isAvailable: true,
      },
    ],
  },
  {
    type: "Pizza",
    data: [
      {
        id: 7,
        name: "Chicken Pizza",
        image:
          "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
        price: 450,
        isAvailable: true,
      },
      {
        id: 8,
        name: "Chicken Pizza",
        image:
          "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
        price: 450,
        isAvailable: true,
      },
      {
        id: 9,
        name: "Chicken Pizza",
        image:
          "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
        price: 450,
        isAvailable: true,
      },
    ],
  },
  {
    type: "Samosa",
    data: [
      {
        id: 10,
        name: "Samosa",
        image:
          "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_744,ar_5:4/v1/img/recipes/26/95/8/C6mbbDDdRACyUFLZbI8I_samosas.jpg",
        price: 450,
        isAvailable: true,
      },
      {
        id: 11,
        name: "Samosa",
        image:
          "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_744,ar_5:4/v1/img/recipes/26/95/8/C6mbbDDdRACyUFLZbI8I_samosas.jpg",
        price: 450,
        isAvailable: true,
      },
      {
        id: 12,
        name: "Samosa",
        image:
          "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_744,ar_5:4/v1/img/recipes/26/95/8/C6mbbDDdRACyUFLZbI8I_samosas.jpg",
        price: 450,
        isAvailable: true,
      },
    ],
  },
];

export const MenuCategory: menuType[] = [
  {
    id: 0,
    type: "Burger",
    icon: "https://imgs.search.brave.com/HDb4jGtZOjp-tB-peWwoG8iOjZepE2cyrvJHlnSy7Fc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhlbm91bnBy/b2plY3QuY29tL3Bu/Zy8xNzE1NS0yMDAu/cG5n",
  },
  {
    id: 1,
    type: "MOMO",
    icon: "https://imgs.search.brave.com/1Agw85Z_lChLlxgoC4HzFxAYztsu0MWXnf6xP5Ud7Ok/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhlbm91bnBy/b2plY3QuY29tL3Bu/Zy8zMzczMzU2LTIw/MC5wbmc",
  },
  {
    id: 2,
    type: "Pizza",
    icon: "https://imgs.search.brave.com/ntccHHP3Ztxp159xf4cy2tUYJGt5bRRnobugrZUECvU/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9pY29u/cy52ZXJ5aWNvbi5j/b20vcG5nLzEyOC9t/aXNjZWxsYW5lb3Vz/L2dlb21ldHJ5LWlj/b24tbGlicmFyeS9j/b2xkLWRyaW5rLTMu/cG5n",
  },
  {
    id: 3,
    type: "Samosa",
    icon: "https://imgs.search.brave.com/63tFmhbWweR0nyvuoYqEXUoqLst2EcR9aU-YTls5gTw/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudGhlbm91bnBy/b2plY3QuY29tL3Bu/Zy8zMDAwMC0yMDAu/cG5n",
  },
];
