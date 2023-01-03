const express = require('express');
const router = express.Router();
const hottieController = require('../controllers/hottieController');

// multer is used for uploading files
var multer = require('multer');

var storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads')
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '-' + Date.now())
	}
});

var upload = multer({ storage: storage });

// routes
router.get("/", hottieController.index);
router.get("/list", hottieController.hottieList);
router.get("/create", hottieController.hottieCreate_get);
router.post("/create", upload.single('img'), hottieController.hottieCreate_post);
router.get("/:id/update", hottieController.hottieUpdate_get);
router.post("/:id/update", upload.single('img'), hottieController.hottieUpdate_post);

// this route is no longer needed since bootstrap introduced modals
// router.get("/:id/delete", hottieController.hottieDelete_get);

router.post("/:id/delete", hottieController.hottieDelete_post);
router.get("/:id", hottieController.hottieDetail);

module.exports = router;