const { isEmail, isStrongPassword, isAlpha, isEmpty } = require("validator");
const database = require("../models/database");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    const { email, name, password } = req.body;
    //validation
    const [check_email, _] = await database.execute(
      `SELECT user_id from users WHERE email=?`,
      [email]
    );
    if (check_email.length > 0) {
      const error = new Error("Email  already plz login");
      res.status(404);
      return next(error);
    }
    if (!isEmail(email)) {
      const error = new Error("Enter valid email id");
      res.status(422);
      return next(error);
    } else if (isEmpty(name)) {
      const error = new Error("Enter name field");
      res.status(422);
      return next(error);
    } else if (!isStrongPassword(password, { minSymbols: 0 })) {
      const error = new Error(
        "Enter a strong password minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0"
      );
      res.status(422);
      return next(error);
    } else {
      const [result, fields] = await database.execute(
        `insert into users (email,name,password) values (?,?,?)`,
        [email, name, password]
      );
      //send authentication details
      const userid = result.insertId;
      const payload = { userid: userid, name: name };
      const jsontoken = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "5h",
      });

      payload.token = jsontoken;
      res.setHeader("Authorization", `Bearer ${jsontoken}`);
      res.status(201).json(payload);
    }
  } catch (error) {
    res.status(500);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (isEmpty(email) || isEmpty(password)) {
      const error = new Error("Enter email id or password");
      return next(error);
    }
    const [result, field] = await database.execute(
      "SELECT user_id,name from users WHERE email=? and password=?",
      [email, password]
    );
    if (result.length > 0) {
      const user_id = result[0].user_id;
      const name = result[0].name;
      const payload = { userid: user_id, name: name };
      const jsontoken = await jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "5h",
      });
      payload.token = jsontoken;
      res.setHeader("Authorization", `Bearer ${jsontoken}`);
      res.status(200).json(payload);
    } else {
      const error = new Error("Invalid email or password");
      res.status(401);
      next(error);
    }
  } catch (err) {
    res.status(500);
    next(err);
  }
};
