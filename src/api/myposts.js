const router = require("express").Router();

const { MulterError } = require("multer");
const my_post_controller = require("../controller/my_post_controller");

const multer = require("multer")({
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 1,
    fieldNameSize: 100,
  },
}); //less than 5mb

const upload = multer.single("file");
router.get("/posts/follow", my_post_controller.get_friends_posts); //all friends posts

router.get("/posts", my_post_controller.get_all_my_posts);

router.post(
  "/posts",
  (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        res.status(404);
        return res.json({ message: err.code });
      } else {
        next();
      }
    });
  },
  my_post_controller.createapost
);

router.delete("/posts/:post_id", my_post_controller.deleteapost);

module.exports = router;
