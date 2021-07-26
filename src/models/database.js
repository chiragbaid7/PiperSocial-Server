const mysql2 = require("mysql2");
//create a pool

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../", ".env") });

const pool = mysql2.createPool({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 32,
  waitForConnections: true,
  queueLimit: 0,
});
// wrap a promise instance on that pool
//1.create a user table

pool.execute(`CREATE TABLE IF NOT EXISTS users(
    user_id INT auto_increment,
    email varchar(45) NOT NULL UNIQUE,
    name varchar(45) NOT NULL,
    password varchar(45) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    primary key(user_id)
)
    ENGINE=InnoDB
`);

pool.execute(`CREATE TABLE IF NOT EXISTS posts(
    post_id INT AUTO_INCREMENT,
    user_id INT NOT NULL,
    name varchar(45) NOT NULL,
    post longtext NOT NULL,
    created_at TIMESTAMP  DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(post_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id) ON DELETE CASCADE  
)

    ENGINE=INNODB
`);

pool.execute(`CREATE TABLE IF NOT EXISTS comments(
  comment_id INT AUTO_INCREMENT ,
  post_id INT NOT NULL,
  user_id INT NOT NULL ,
  name varchar(45) NOT NULL,
  comment longtext NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(comment_id),
  FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
)

    ENGINE=INNODB
`);

pool.execute(`CREATE TABLE IF NOT EXISTS likes(
  like_id INT AUTO_INCREMENT ,
  user_id INT,
  post_id INT,
  name varchar(45) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(like_id),
  FOREIGN KEY(user_id) REFERENCES users(user_id),
  FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE
)

    ENGINE=INNODB
`);

pool.execute(`CREATE TABLE IF NOT EXISTS followers(
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  created_at TIMESTAMP default CURRENT_TIMESTAMP,
  PRIMARY KEY(follower_id,following_id),
  FOREIGN KEY(follower_id)  REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY(following_id) REFERENCES users(user_id) ON DELETE CASCADE
)
    ENGINE=INNODB
`);

module.exports = pool.promise();
