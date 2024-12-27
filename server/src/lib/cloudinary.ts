import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { UploadApiResponse } from "cloudinary";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

const uploadToCloudinary = async (localFilePath: string): Promise<UploadApiResponse | Error> => {
  try {
    const response = await cloudinary.uploader.upload(localFilePath);
    fs.unlinkSync(localFilePath);
    return response;
  } catch (err) {
    fs.unlinkSync(localFilePath);
    return err as Error;
  }
};

export default uploadToCloudinary;
