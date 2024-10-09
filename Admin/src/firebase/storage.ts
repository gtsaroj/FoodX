import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "./index";
import { ImageFolders } from "../models/authentication.model";


const storeImageInFirebase = async (image: File, folder: ImageFolders) => {
  if (!image) throw new Error("No image Found.");
  try {
    const imageRef = ref(storage, `${folder.folder}/${image.name}`);
    console.log(imageRef.fullPath);
    await uploadBytes(imageRef, image);
    const imageUrl = getDownloadURL(imageRef).then((url) => url);
    return imageUrl;
  } catch (error) {
    throw new Error("Error while uploading image.");
  }
};

export { storeImageInFirebase };
