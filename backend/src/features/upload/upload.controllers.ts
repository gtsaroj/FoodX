import { Request, Response } from "express";
import fs from "fs";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { uploadImageToFirebase } from "../../utils/storage/uploadImage.js";

export const Upload = asyncHandler(async (req: Request, res: Response) => {
  const { file } = req;
  let response: API.ApiResponse;
  if (!file) {
    response = {
      data: null,
      message: "No file found.",
      success: false,
      status: 400,
    };
    return res.status(400).json(response);
  }

  if (!file.mimetype.startsWith("image/")) {
    response = {
      data: null,
      message: "Only image files are allowed.",
      success: false,
      status: 400,
    };
    return res.status(400).json(response);
  }
  const filePath = file.path;
  const folderName = req.body.folderName || "default";

  const firebaseUrl = await uploadImageToFirebase(folderName, filePath);

  response = {
    data: firebaseUrl,
    message: "Image uploaded successfully.",
    success: true,
    status: 200,
  };
  if (fs.existsSync(filePath)) {
    await fs.promises.unlink(filePath);
  }
  return res.status(200).json(response);
});
