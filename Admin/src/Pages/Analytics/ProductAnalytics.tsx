import AllCustomerAnalytics from "./AllCategories";
import AllCategoryAnalytics from "./AllCustomers";
import AllProductAnalytics from "./AllProducts.analytics";

const ProductAnalytics = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2">
      <AllProductAnalytics />
      <AllCustomerAnalytics />
      <AllCategoryAnalytics />
  
    </div>
  );
};

export default ProductAnalytics;
