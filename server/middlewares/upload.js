// middlewares/upload.js
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js'; // nhớ thêm .js

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'products', // tên folder trên Cloudinary
        allowed_formats: ['jpg', 'png'],
        transformation: [{ width: 800, height: 800, crop: 'limit' }],
    },
});

const upload = multer({ storage });

export default upload;
