const router = require("express").Router();

const my_comment_controller = require("../controller/my_comment_controller");

router.post("/posts/:post_id/comments", my_comment_controller.createacomment);

router.delete("/comments/:comment_id", my_comment_controller.deleteacomment);

module.exports = router;
