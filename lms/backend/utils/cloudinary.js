import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload file to Cloudinary
export const uploadFile = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'auto'
    });
    return {
      url: result.secure_url,
      public_id: result.public_id
    };
  } catch (error) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Delete file from Cloudinary
export const deleteFile = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};
