const database = require("../models/database");

exports.getapost = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    const [post, _] = await database.execute(
      "SELECT user_id,post,created_at from posts WHERE post_id=?",
      [post_id]
    );
    if (post.length >= 1) {
      res.status(200);
      res.json({ post: post });
    } else {
      const error = new Error("Post_id not found");
      res.status(404);
      return next(error);
    }
  } catch (error) {
    next(error);
  }
};

exports.getcommentsofapost = async (req, res, next) => {
  try {
    //get latest comments on post
    if (req.query.limit === undefined) {
      req.query.limit = "10";
    }
    const [comments, _] = await database.execute(
      `SELECT user_id,name,comment_id,comment,created_at from comments WHERE post_id=? ORDER BY created_at DESC LIMIT ?`,
      [req.params.post_id, req.query.limit]
    );
    res.status(200).json({ comments: comments });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.get_liking_users = async (req, res, next) => {
  const [users, _] = await database.execute(
    `SELECT user_id,name FROM likes WHERE post_id=?`,
    [req.params.post_id]
  );
  const count = users.length;
  res.json({ users: users, count: count });
};
