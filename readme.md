## PROJECT FLOW

1. Designed an ER diagram using lucid chart

2.Created tables and relationships + participation constraints with SQL as a Relational Database

3. Authentication using JWT TOKEN  
   [✔] SIGN IN
   [✔] LOGIN

4. VALIDATIONS + ALL STATUS CODE

5.Multer for parsing multiform data

6.Storage AWS S3 Buckets for storing images 

# REST API
7.me is used in the endpoints to indicate current_user of the app

8.users indicates existing users of the PiperSocial    

       [✔] GET all users of the application                GET       http:://api/users

    ## [✔] POSTS API

        [✔] Authorization Header

        [✔] get a list of current user's posts             GET      http:://api/me/posts

        [✔] get a particular post                          GET      http:://api/posts/{post_id}

        [✔] get all my friends posts                       GET      http:://api/me/posts/follow

        [✔] create a post                                  POST     http:://api/me/posts

        [✔] delete a post                                  DELETE   http:://api/me/posts/{post_id}

        [✔] get a list of user's posts                     GET      http:://api/users/{user_id}/posts


    ## [✔] COMMENT API

        [✔] get all comments on a post                     GET      http:://api/posts/{post_id}/comments

        [✔] create a comment on a post                     POST     http:://api/me/posts/{post_id}/comments

        [✔] delete a comment of a post                     DELETE   http:://api/me/comments/{comment_id}

    ## [✔] LIKES API

        [✔] like  a post                                   PUT      http:://api/me/posts/{post_id}/likes

        [✔] unlike a post                                  DELETE   http:://api/me/posts/{posts_id}/likes

        [✔] Liking users(users who have liked the post)    GET      http:://api/posts/{post_id}/likes

    #[✔] FOLLOW API

        [✔] follow a user                                  PUT      http:://api/me/users/{user_id}/follow

        [✔] unfollow a user                                DELETE   http:://api/me/users/{user_id}/follow

        [✔] get all users I follow                         GET      http:://api/me/users/follow




