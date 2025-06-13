const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (image) => {
  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: "products",
    });
    return { url: result.secure_url, public_id: result.public_id };
  } catch (error) {
    throw new Error("Image upload failed");
  }
};

module.exports = { uploadToCloudinary };
