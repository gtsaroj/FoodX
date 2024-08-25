import AllCustomerAnalytics from "./AllCategory.analytics";
import AllCategoryAnalytics from "./AllUser.analytics";
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
