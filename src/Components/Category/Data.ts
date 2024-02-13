interface CategoryType {
  type: string;
  data: DataType[];
}

 export interface DataType {
  id: number;
  title: string;
   price: number;
   image : string;
  isAvailable: boolean;
}

export interface menuType {
  id: number;
  type: string;
}

export const category: CategoryType[] = [
  {
    type: "Burger",
    data: [
      {
        id: 1,
        title: "chicken pizza",
        price: 450,
        image : "https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg",
        isAvailable: true,
      },
      {
        id: 2,
        title: "chicken pizza",
        price: 450,
        image : "https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg",
        isAvailable: true,
      },
      {
        id: 3,
        title: "chicken pizza",
        price: 450,
        image : "https://www.thecookierookie.com/wp-content/uploads/2023/04/featured-stovetop-burgers-recipe.jpg",
        isAvailable: true,
      },
    ],
  },
  {
    type: "MOMO",
    data: [
      {
        id: 4,
        image : "https://cuisinenepal.com/wp-content/uploads/2019/08/steamed-pork-momo-optimized-1-825x550.jpg",
        title: "MOMO pizza",
        price: 450,
        isAvailable: true,
      },
      {
        id: 5,
        title: "MOMO pizza",
        image : "https://cuisinenepal.com/wp-content/uploads/2019/08/steamed-pork-momo-optimized-1-825x550.jpg",
        price: 450,
        isAvailable: true,
      },
      {
        id: 6,
        title: "MOMO pizza",
        image : "https://cuisinenepal.com/wp-content/uploads/2019/08/steamed-pork-momo-optimized-1-825x550.jpg",
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
        title: "MOMO pizza",
        image : "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
        price: 450,
        isAvailable: true,
      },
      {
        id: 8,
        title: "MOMO pizza",
        image : "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
        price: 450,
        isAvailable: true,
      },
      {
        id: 9,
        title: "MOMO pizza",
        image : "https://hips.hearstapps.com/hmg-prod/images/classic-cheese-pizza-recipe-2-64429a0cb408b.jpg?crop=0.8888888888888888xw:1xh;center,top&resize=1200:*",
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
        title: "MOMO pizza",
        image : "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_744,ar_5:4/v1/img/recipes/26/95/8/C6mbbDDdRACyUFLZbI8I_samosas.jpg",
        price: 450,
        isAvailable: true,
      },
      {
        id: 11,
        title: "MOMO pizza",
        image : "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_744,ar_5:4/v1/img/recipes/26/95/8/C6mbbDDdRACyUFLZbI8I_samosas.jpg",
        price: 450,
        isAvailable: true,
      },
      {
        id: 12,
        title: "MOMO pizza",
        image : "https://img.sndimg.com/food/image/upload/f_auto,c_thumb,q_55,w_744,ar_5:4/v1/img/recipes/26/95/8/C6mbbDDdRACyUFLZbI8I_samosas.jpg",
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
  },
  {
    id: 1,
    type: "MOMO",
  },
  {
    id: 2,
    type: "Pizza",
  },
  {
    id: 3,
    type: "Samosa",
  }
  
];
