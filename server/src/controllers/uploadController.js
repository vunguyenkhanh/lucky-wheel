import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const uploadPrizeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Không tìm thấy file' });
    }

    // Optimize image
    const optimizedFileName = `optimized-${req.file.filename}`;
    const optimizedPath = path.join('public/uploads/prizes', optimizedFileName);

    await sharp(req.file.path)
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 80 })
      .toFile(optimizedPath);

    // Xóa file gốc
    await fs.unlink(req.file.path);

    // Trả về đường dẫn file
    const imageUrl = `/uploads/prizes/${optimizedFileName}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Lỗi xử lý file' });
  }
};
