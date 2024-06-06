import { Request } from 'express';
import multer from 'multer';

declare module 'express' {
  interface Request {
    file?: multer.File;
  }
}