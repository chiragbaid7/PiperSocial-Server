const router = require("express").Router();

const my_likes_controller=require("../controller/my_likes_controller")


router.put("/posts/:post_id/likes",my_likes_controller.like_a_post);

router.delete("/posts/:post_id/likes",my_likes_controller.unlike_a_post);

module.exports = router;
