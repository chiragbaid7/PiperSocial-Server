const database = require("../models/database");

exports.get_all_posts = async (req, res, next) => {
  try {
    const [posts, feilds] = await database.execute(
      `SELECT post_id,post,created_at,(SELECT count(*) from likes WHERE post_id=posts.post_id) as likes_count from posts WHERE user_id=? ORDER BY created_at DESC`,
      [req.params.user_id]
    );
    if (posts.length >= 1) {
      res.status(200);
      res.json({ posts: posts });
    } else {
      //either user has 0 post or user removed his account and therefore it is deleted from the database
      const [ans, _] = await database.execute(
        "SELECT user_id from users where user_id=?",
        [req.params.user_id]
      );
      if (ans.length >= 1) {
        res.status(200);
        res.json({ message: "User has not posted anything yet " });
      } else {
        res.status(404);
        const error = new Error("User not found");
        return next(error);
      }
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};
