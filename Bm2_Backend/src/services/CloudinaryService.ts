import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export class CloudinaryService {
  /**
   * Uploads a buffer to Cloudinary
   * @param fileBuffer Buffer of the file
   * @param folder Folder name in Cloudinary
   */
  async uploadImage(
    fileBuffer: Buffer,
    folder: string = "bm2mall/profiles",
  ): Promise<CloudinaryUploadResult> {
    console.log(
      `[CloudinaryService] Starting upload to folder: ${folder}, buffer size: ${fileBuffer.length} bytes`,
    );

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: "auto", // Automatically detect file type
        },
        (error, result) => {
          if (error) {
            console.error(`[CloudinaryService] Upload error:`, error);
            return reject(error);
          }
          if (!result) {
            console.error(`[CloudinaryService] No result from Cloudinary`);
            return reject(new Error("Cloudinary upload failed"));
          }

          console.log(
            `[CloudinaryService] Upload successful: ${result.secure_url}`,
          );
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );

      // More robust stream creation
      Readable.from(fileBuffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes an image from Cloudinary using its URL or public ID
   * @param imageUrl The full secure URL of the image
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public ID from URL
      // Example: https://res.cloudinary.com/cloud_name/image/upload/v12345/folder/id.jpg
      const parts = imageUrl.split("/");
      const fileName = parts[parts.length - 1];
      const publicIdWithoutExt = fileName.split(".")[0];

      // If it's in a folder, we need the folder path too
      // This is a simple implementation, might need refinement for nested folders
      const folderPart = parts
        .slice(parts.indexOf("upload") + 2, parts.length - 1)
        .join("/");
      const publicId = folderPart
        ? `${folderPart}/${publicIdWithoutExt}`
        : publicIdWithoutExt;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
    }
  }
}

export const cloudinaryService = new CloudinaryService();
