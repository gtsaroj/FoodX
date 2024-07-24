import AllCustomerAnalytics from "./AllCategory.analytics";
import AllCategoryAnalytics from "./AllCustomer.analytics";
import AllProductAnalytics from "./AllProducts.analytics";

const ProductAnalytics = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-5 px-3 py-2">
      <AllProductAnalytics />
      <AllCategoryAnalytics />
      <AllCustomerAnalytics />
    </div>
  );
};

export default ProductAnalytics;
