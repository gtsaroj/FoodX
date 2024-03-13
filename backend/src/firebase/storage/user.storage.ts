import fs from "fs";
import { storage } from "../index.js";
import { ApiError } from "../../utils/ApiError.js";

const uploadImageToFirebase = async (filePath: string) => {
  const bucket = storage.bucket("users/");
  try {
    const metaData = {
      contentType: "image/png",
    };

    const [uploadedData] = await bucket.upload(filePath, metaData);
    return `${uploadedData}`;
  } catch (error) {
    fs.unlinkSync(filePath);
    throw new ApiError(400, "Unable to upload image.");
  }
};

export { uploadImageToFirebase };
