const database = require("../models/database");

exports.like_a_post = async (req, res, next) => {
  try {
    //check if this post exists in the first place
    const [post, f] = await database.execute(
      `SELECT post_id FROM posts WHERE post_id=? LIMIT 1`,
      [req.params.post_id]
    );
    if (post.length === 0) {
      return res.status(404).json({ message: "Post does'nt exists" });
    }
    const [ans, _] = await database.execute(
      `SELECT like_id FROM likes WHERE post_id=? and user_id=? LIMIT 1`,
      [req.params.post_id, req.user_id]
    );
    if (ans.length === 0) {
      await database.execute(
        `INSERT INTO likes(post_id,user_id,name) VALUES(?,?,?)`,
        [req.params.post_id, req.user_id, req.name]
      );
    }
    //also returning total likes for the post so to reduce bandwidth
    console.log(11);
    const [a, cc] = await database.execute(
      `SELECT count(*) as count FROM likes WHERE post_id=?`,
      [req.params.post_id]
    );
    const {count} = a[0];
    return res.status(201).json({ like: true, likes_count: count });
  } catch (error) {
    res.status(500);
    return next(error);
  }
};
exports.unlike_a_post = async (req, res, next) => {
  try {
    await database.execute(`DELETE FROM likes WHERE post_id=? and user_id=?`, [
      req.params.post_id,
      req.user_id,
    ]);
    res.status(201).json({ like: false });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
