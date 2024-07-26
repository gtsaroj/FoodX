import { Category } from "../../models/category.model.js";
import { ApiError } from "../../utils/ApiError.js";
import { db } from "../index.js";

const getAllCategoryFromDatabase = async () => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new ApiError(404, "No category collection found.");
  try {
    const category = await categoryRef.get();
    let categories: Category[] = [];
    if (category.empty) throw new ApiError(404, "No category found");
    category.docs.forEach((doc) => {
      const data = doc.data() as Category;
      categories.push(data);
    });
    return categories;
  } catch (error) {
    throw new ApiError(401, "Unable to get category data from database.");
  }
};

const addNewCategoryInDatabase = async (name: string, image: string) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new ApiError(404, "No category collection found.");
  try {
    const category = await categoryRef
      .add({
        id: "",
        name,
        image,
      })
      .then((docRef) => docRef.update({ id: docRef.id }));
    return category;
  } catch (error) {
    throw new ApiError(401, "Unable to add category data in database.");
  }
};

const deleteCategoryFromDatabase = async (id: string) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new ApiError(404, "No category collection found.");
  try {
    const category = await categoryRef.doc(id).delete();
    return category;
  } catch (error) {
    throw new ApiError(401, "Unable to delete category data from database.");
  }
};

const updateCategoryInDatabase = async (
  id: string,
  field: "name" | "image",
  newData: string
) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new ApiError(404, "No category collection found.");
  try {
    const category = await categoryRef.doc(id).update({
      [`${field}`]: newData,
    });
    return category;
  } catch (error) {
    throw new ApiError(401, "Unable to update category data in database.");
  }
};
const bulkDeleteCategoryFromDatabase = async (id: string[]) => {
  const categoryRef = db.collection("category");
  if (!categoryRef) throw new ApiError(400, "No collection available.");
  try {
    const batch = db.batch();

    id.forEach((categoryId) => {
      const docRef = categoryRef.doc(categoryId);
      batch.delete(docRef);
    });
    await batch.commit();
  } catch (error) {
    throw new ApiError(401, "Unable to bulk delete categories data.");
  }
};
export {
  getAllCategoryFromDatabase,
  addNewCategoryInDatabase,
  deleteCategoryFromDatabase,
  updateCategoryInDatabase,
  bulkDeleteCategoryFromDatabase,
};
