import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/prizes');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// Validate file
const fileFilter = (req, file, cb) => {
  // Kiểm tra mime type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Chỉ chấp nhận file JPG, PNG hoặc GIF'), false);
  }

  // Kiểm tra kích thước file (5MB)
  if (req.headers['content-length'] > 5 * 1024 * 1024) {
    return cb(new Error('Kích thước file không được vượt quá 5MB'), false);
  }

  cb(null, true);
};

// Middleware xử lý upload
export const uploadImage = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}).single('image');

// Error handler cho upload
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Kích thước file không được vượt quá 5MB' });
    }
    return res.status(400).json({ error: 'Lỗi upload file' });
  }

  if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
};
