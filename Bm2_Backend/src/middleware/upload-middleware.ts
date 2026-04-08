import multer from "multer";
import AppError from "../errors/AppError";

// Use memory storage to get access to file buffer
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  // Only accept images
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(AppError.validation("Only image files are allowed"), false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter,
});
