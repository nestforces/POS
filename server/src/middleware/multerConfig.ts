import path from 'path';
import multer from 'multer';
import { Request } from 'express';

const productStorage = multer.diskStorage({
  destination: (req: Request, res, cb) => {
    cb(null, path.join(__dirname, '../public/images/products'));
  },
  filename: (req: Request, file, cb) => {
    const { name } = req.body as { name: string };
    cb(null, `product_${name}-${Date.now()}-${file.originalname}`);
  },
});

const avatarStorage = multer.diskStorage({
  destination: (req: Request, res, cb) => {
    cb(null, path.join(__dirname, '../public/images/avatar'));
  },
  filename: (req: Request, file, cb) => {
    const { username } = req.body as { username: string };
    cb(null, `avatar_${username}-${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: Request, file: any, cb: any) => {
  const fileType = file.mimetype.split('/')[1];
  if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'gif') {
    cb(null, true);
  } else {
    cb(new Error('File type not allowed'), false);
  }
};

const limits = {
  fileSize: 1024 * 1024,
};

const uploadProductFile = multer({
  storage: productStorage as multer.StorageEngine, 
  fileFilter,
  limits,
}).single('product');

const uploadAvatarFile = multer({
  storage: avatarStorage as multer.StorageEngine, 
  fileFilter: fileFilter,
  limits: limits,
}).single('avatar');

export { uploadProductFile, uploadAvatarFile };
