const router = require("express").Router();

const post_controller = require("../controller/posts_controller");

router.get("/:post_id", post_controller.getapost);

router.get("/:post_id/comments", post_controller.getcommentsofapost);

router.get("/:post_id/likes", post_controller.get_liking_users);

module.exports = router;
