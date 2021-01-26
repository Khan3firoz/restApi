To create Rest Api(restapi: is mainly used to provide communication over the cross platform. Here we can share the data by utilizing the proper resource @client's end. to do this we nned create server so that our client communicate to ur server or not )
1.npm init
2.we need to install some packages
    a.express (dependency)  -->it is used to built restApi-->it is ur based framwork,
    b.nodemon (dev depency)
    c.cuncurrently (dev depency) ==> to run multiple commonds parallely.
    d.bcrypt (dependency) ==> to encrypt and decrypt passwort prtwe are going to use it.
    e.underscore (dependency)==> to perform validation. here we write the spec.
    f.validator (dependency) ==>use to perform all generic validations. here we will get
    g.mongoose(dependency)
3. set nodemon script in package.json
    "start": "nodemon run app.js"
4.creat app.js
5.we need to create some file in api folder
    devconnecto==> database to store data
    user==>login and register(user.js)
    post(post.js)
    profile==> all exp and education details(profile.js)
    comments(comment.js)
6.below the mentioned resource should be accessible with the help of token not direct access.
    comments
    post
    profile
