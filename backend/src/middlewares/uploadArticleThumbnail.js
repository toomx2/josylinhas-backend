import path from "path";
import multer from "multer";

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const storage = multer.diskStorage({

    destination(req, file, cb) {
        cb(null, "uploads/articles/thumbnails");
    },

    filename(req, file, cb) {
        const extension = path.extname(file.originalname);
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
        cb(null, filename);
    }

});

function fileFilter(req, file, cb) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
        return cb(
            new Error("A thumbnail deve ser uma imagem JPG, PNG ou WEBP.")
        );
    }
    cb(null, true);
}

const uploadArticleThumbnail = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

export default uploadArticleThumbnail;