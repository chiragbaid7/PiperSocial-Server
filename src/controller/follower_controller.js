const database = require("../models/database");
exports.get_all_users = async (req, res, next) => {
  try {
    const [query, _] = await database.execute(
      `SELECT name,user_id FROM users WHERE user_id<>?`,
      [req.user_id]
    );
    console.log(query);
    res.status(200).json({ users: query });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
exports.follow_a_user = async (req, res, next) => {
  try {
    const friend_id = req.params.friend_id;
    if (friend_id == req.user_id) {
      res.status(404).json({ message: "Cant follow yourself" });
    } else {
      //search for invalid following_id
      //if already friend
      const dup = await database.execute(
        `SELECT follower_id FROM followers WHERE follower_id=? and following_id=?`,
        [req.user_id, friend_id]
      );
      if (dup[0].length > 0) {
        res.status(201).json({ follow: true });
      } else {
        await database.execute(
          `INSERT INTO followers(follower_id,following_id) VALUES(?,?) `,
          [req.user_id, friend_id]
        );
        res.status(201).json({ follow: true });
      }
    }
  } catch (err) {
    res.status(500);
    next(err);
  }
};

exports.unfollow_a_user = async (req, res, next) => {
  try {
    const friend_id = req.params.friend_id;
    await database.execute(
      `DELETE from followers WHERE follower_id=? and following_id=?`,
      [req.user_id, friend_id]
    );
    res.status(201).json({ follow: false });
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.get_all_friends = async (req, res, next) => {
  try {
    const [query, _] = await database.execute(
      `SELECT follower_id as user_id, JSON_ARRAYAGG(following_id) as friends_id FROM followers WHERE follower_id=? GROUP BY follower_id`,
      [req.user_id]
    );
    console.log(query);
    res.json({ data: query[0] });
  } catch (error) {
    res.status(500);
    next(error);
  }
};
