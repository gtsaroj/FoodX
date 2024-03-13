import multer from "multer";

const storage = multer.diskStorage({
  destination: function (_, __, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (_, file, cb) {
    const date = new Date();
    const timeStamp = date.toISOString().toString();
    cb(null, file.originalname + "-" + timeStamp);
  },
});

export const upload = multer({ storage });
