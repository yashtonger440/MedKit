import multer from "multer";
import path from "path";

// Doctor profile image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Patient report upload
const reportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/reports/");
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const uploadReport = multer({
  storage: reportStorage,

  // Max file size: 5MB
  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|pdf/;
    const allowedMimeTypes = /jpeg|jpg|png|pdf/;

    const extOk  = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedMimeTypes.test(file.mimetype);

    if (extOk && mimeOk) {
      cb(null, true); // accept file
    } else {
      cb(new Error("Only JPG, PNG, PDF files are allowed")); // reject file
    }
  },
});

// upload for profile images, uploadReport for patient reports
export { upload as default, uploadReport };
