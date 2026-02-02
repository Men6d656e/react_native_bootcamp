import { v2 as cloudinary } from "cloudinary";
import config from "../config/index.js";

cloudinary.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

/**
 * Helper to upload image to cloudinary
 */
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string,
  transformation: any[] = [],
) => {
  const base64Image = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  return cloudinary.uploader.upload(base64Image, {
    folder,
    transformation,
  });
};

export default cloudinary;
