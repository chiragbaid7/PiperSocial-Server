const router = require("express").Router();

const user_controller = require("../controller/users_controller");

router.get("/:user_id/posts", user_controller.get_all_posts);

module.exports = router;
