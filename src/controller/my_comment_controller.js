const database = require("../models/database");
const { isLength } = require("validator");

exports.createacomment = async (req, res, next) => {
  try {
    if (req.body.comment === undefined) {
      return res.status(404).json({ message: "Send comment" });
    }
    const comment = req.body.comment.trim();

    if (!isLength(comment, { min: 1, max: 100 })) {
      const error = new Error(
        "Empty text not allowed or Max limit reached of 100 characters"
      );
      res.status(422);
      return next(error);
    }
    const c = await database.execute(
      `INSERT INTO comments(user_id,post_id,name,comment) VALUES(?,?,?,?)`,
      [req.user_id, req.params.post_id, req.name, comment]
    );
    res
      .status(201)
      .json({ message: "comment created", comment_id: c[0].insertId });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.deleteacomment = async (req, res, next) => {
  try {
    const [ans, _] = await database.execute(
      `SELECT comment_id FROM comments WHERE comment_id=? LIMIT 1`,
      [req.params.comment_id]
    );
    if (ans.length === 0) {
      res.status(404).json({ message: "Comment not found" });
    }
    await database.execute(
      `DELETE FROM comments WHERE comment_id=? and user_id=?`,
      [req.params.comment_id, req.user_id]
    );
    res.json({ delete: true });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
