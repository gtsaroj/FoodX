import { FilterButton } from "../../Components/Common/Sorting/Sorting";
import Table from "../../Components/Common/Table/Table";
import { ProductTable } from "../../models/productMode";

const AllCategoryAnalytics = () => {
  const headers = ["name", "image", "price", "quantity", "rating"];

  const data: ProductTable[] = [
    {
      name: "Product 1",
      price: 200,
      quantity: 150,
      rating: 4.2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2FC_momo.jpg?alt=media&token=60a6f967-92d7-4a55-bf95-138e0980ac21",
    },
    {
      name: "Product 2",
      price: 100,
      quantity: 100,
      rating: 4.5,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Fburger.jpg?alt=media&token=e24a4e91-496a-4395-a16c-ab5f734f3677",
    },
    {
      name: "Product 3",
      price: 130,
      quantity: 90,
      rating: 4.1,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Fcoffee.jpg?alt=media&token=35891545-eb48-48bb-893c-82a475cb0105",
    },
    {
      name: "Product 4",
      price: 500,
      quantity: 200,
      rating: 4.8,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Foreo_milkshake.jpg?alt=media&token=dae30ba6-6de2-4c63-85ca-cb4d2af40d64",
    },
    {
      name: "Product 5",
      price: 520,
      quantity: 130,
      rating: 3.8,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Foreo_milkshake.jpg?alt=media&token=dae30ba6-6de2-4c63-85ca-cb4d2af40d64",
    },
    {
      name: "Product 6",
      price: 600,
      quantity: 100,
      rating: 3.2,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Foreo_milkshake.jpg?alt=media&token=dae30ba6-6de2-4c63-85ca-cb4d2af40d64",
    },
    {
      name: "Product 7",
      price: 500,
      quantity: 200,
      rating: 4.8,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Foreo_milkshake.jpg?alt=media&token=dae30ba6-6de2-4c63-85ca-cb4d2af40d64",
    },
    {
      name: "Product 8",
      price: 500,
      quantity: 200,
      rating: 4.8,
      image:
        "https://firebasestorage.googleapis.com/v0/b/foodx-nepal.appspot.com/o/products%2Foreo_milkshake.jpg?alt=media&token=dae30ba6-6de2-4c63-85ca-cb4d2af40d64",
    },
  ];
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-5">
      <div className="flex items-center justify-between flex-grow w-full gap-5 px-3 pb-6">
        <p className="text-xl text-nowrap">Categories</p>
        <div>
          <FilterButton
            sortOrder=""
            onSelect={() => {}}
            sortingOptions={["Asc", "Desc"]}
          />
        </div>
      </div>
      <Table
        headers={headers}
        data={data}
        pagination={{ currentPage: 1, perPage: 7 }}
        bodyStyle={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
        }}
        headerStyle={{
          display: "grid",
          gridTemplateColumns: "repeat(7,1fr)",
        }}
      />
    </div>
  );
};

export default AllCategoryAnalytics;
