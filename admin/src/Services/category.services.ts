import { makeRequest } from "../makeRequest";
import { Category, UpdateCategory } from "../models/category.model";

// categories
export const addCategory = async (data: { image: string; name: string }) => {
    try {
      const response = await makeRequest({
        method: "post",
        url: "categories/add-category",
        data: { name: data.name, image: data.image },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to add new category" + error);
    }
  };
  export const updateCategory = async (data: UpdateCategory) => {
    try {
      const response = await makeRequest({
        method: "put",
        url: "categories/update-category",
        data: { id: data.id, field: data.field, newData: data.newData },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to update exist category" + error);
    }
  };
  export const deleteCategory = async (id: string) => {
    try {
      const response = await makeRequest({
        method: "delete",
        url: "categories/delete-category",
        data: { id },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to delete exist category" + error);
    }
  };
  export const getCategories = async (): Promise<Category[]> => {
    try {
      const response = await makeRequest({
        method: "get",
        url: "categories/get-category",
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to fetch  categories" + error);
    }
  };
  export const bulkDeleteOfCategory = async (id: string[]) => {
    try {
      const response = await makeRequest({
        method: "delete",
        url: "categories/bulk-delete",
        data: { ids: [...id] },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Unable to delete categories");
    }
  };