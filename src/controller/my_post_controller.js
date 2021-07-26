const database = require("../models/database");
const { isLength } = require("validator");
const { uploadobject, deleteobject, getobject } = require("../s3");
let ReadableStream = require("stream").Readable;

exports.get_all_my_posts = async (req, res, next) => {
  try {
    /*
    const data = await getobject("Screenshot (277).png");
    
    let stream = new ReadableStream();
    res.status(200).setHeader("Content-Type", data.ContentType);
    stream.push(data.Body);
    stream.push(null);
    stream.pipe(res);

    res.writeHead(200, { "Content-Type": "image/png" });
    res.write(data.Body, "binary");
    res.end(null, "binary");
    */

    const user_id = req.user_id;
    const [posts, feilds] = await database.execute(
      `SELECT post_id,post,created_at,(SELECT count(*) from likes WHERE post_id=posts.post_id) as likes_count from posts WHERE user_id=? ORDER BY created_at DESC`,
      [user_id]
    );
    if (posts.length >= 1) {
      res.status(200);
      res.json({ posts: posts });
    } else {
      //either user has 0 post or user removed his account and therefore it is deleted from the database
      const [ans, _] = await database.execute(
        "SELECT user_id from users where user_id=?",
        [user_id]
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
exports.get_friends_posts = async (req, res, next) => {
  try {
    /*qyery to get all POSTS with COMMENTS
    let [posts, _] = await database.execute(
      ` SELECT p.user_id,p.post_id,p.post,JSON_ARRAYAGG(comment) AS 'comments',JSON_ARRAYAGG(comment_id) AS 'comment_id' from posts 
      LEFT JOIN comments c ON p.post_id=c.post_id GROUP BY p.post_id `);
    //represent comments and comments_id of a post in comments array
    for (let post_index in posts) {
      const post = posts[post_index];
      for (comment_index in post.comments) {
        let comment = post.comments[comment_index];
        if (comment === null) {
          post.comments = null;
          break;
        }
        post.comments[comment_index] = {
          comment: comment,
          comment_id: post.comment_id[comment_index],
        };
      }
      delete post.comment_id;
    }
    */
    //Find all the posts of user's friends +likes count on each posts
    const [posts, _] = await database.execute(
      `SELECT post_id,user_id,name,post,created_at,(SELECT count(*) from likes WHERE post_id=posts.post_id) as likes_count FROM posts WHERE user_id IN(SELECT following_id FROM followers WHERE follower_id=?)
      ORDER BY created_at DESC `,
      [req.user_id]
    );
    res.status(200).json({ posts: posts });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
exports.createapost = async (req, res, next) => {
  try {
    if (req.file !== undefined) {
      if (
        req.file.detectedMimeType !== "image/png" &&
        req.file.detectedMimeType !== "image/jpeg" &&
        req.file.detectedMimeType !== "image/jpg"
      ) {
        const error = new Error(
          "Unsupported File Type given.Only jpeg,png and jpg type is supported"
        );
        return res.status(404).json({ message: error.message });
      } else {
        const confirm = await uploadobject(req.file);
        const post = confirm.Location;
        const data = await database.execute(
          `INSERT INTO posts(user_id,name,post) VALUES(?,?,?)`,
          [req.user_id, req.name, post]
        );

        return res.status(201).json({ post_id: data[0].insertId, post: true });
      }
    } else {
      const post = req.body.post.trim();
      if (post.length === 0) {
        const error = new Error("no empty post");
        res.status(404);
        next(error);
      } else {
        const data = await database.execute(
          `INSERT INTO posts(user_id,name,post) VALUES(?,?,?)`,
          [req.user_id, req.name, post]
        );
        res.status(201).json({ post_id: data[0].insertId, post: true });
      }
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.deleteapost = async (req, res, next) => {
  try {
    const post_id = req.params.post_id;
    const url = await database.execute(
      "SELECT post FROM posts WHERE post_id=?",
      [post_id]
    );
    const s3_delete = await deleteobject(url[0][0].post);
    await database.execute("DELETE FROM posts WHERE post_id=?", [post_id]);
    res.status(200);
    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
