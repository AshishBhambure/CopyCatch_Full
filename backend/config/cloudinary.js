import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'assignments';
    let resource_type = 'raw'; // raw for doc, docx, pdf, etc.
    let allowed_formats = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png']; // include doc

    // Optional: only allow listed formats
    if (!allowed_formats.includes(file.originalname.split('.').pop().toLowerCase())) {
      throw new Error('Invalid file format');
    }

    return {
      folder,
      resource_type,
      format: file.originalname.split('.').pop().toLowerCase(), // keep original extension
    };
  },
});

export default storage;
