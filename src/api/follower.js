const router = require("express").Router();
const follower_controller = require("../controller/follower_controller");

router.get("/", follower_controller.get_all_users);
router.get("/follow", follower_controller.get_all_friends);

router.put("/:friend_id/follow", follower_controller.follow_a_user);

router.delete("/:friend_id/follow", follower_controller.unfollow_a_user);

module.exports = router;
