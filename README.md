# xen-node
Interact with XenForo 2.x forums, based on axios promise HTTP client.

## Installation

    npm install xen-node
    
## Usage

First instantiate the object and pass the forum url:
```javascript
    const XenNode = require("xen-node");

    const url = "https://forum.some.com";
    const req = new XenNode(url);
```
Passing optional settings:
```javascript
    const req = new XenNode("https://forum.some.com", {
      verbose: console.log,
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10...",
        }
      });
```

All methods (excluding `xenLogin`) return a regular **axios** response/error promise and only resolves if the user is **authenticated**.

#### Login
method `xenLogin` by default resolves an array with **logged in cookies**, to return a JSON string set `json` parameter to `true` 
in order to save to your environment variables or file.

When using then, you will receive the response as follows:`

```javascript
    req.
      xenLogin("myusername", "mypass", json = true) // json parameter is optional, default: false.
        .then((cookies) => {
          console.log(cookies);
          // ["xf_user=234553%ubIUYBuybiuyIU_v-SDFfg34...
          // or json = true:
          // '["xf_user=234553%ubIUYBuybiuyIU_v-SDFfg34...
    })
    .catch((err) => console.log(err));
```

#### Forum Requests
Before sending any request to the forum, use `checkLogin` method to set **cookies**, **CSRF token** and check if is **authenticated**. 

Then using your previously saved cookies:

```javascript
   const loggedCookies = JSON.parse(mySavedCookies) //to array
   req.checkLogin(loggedCookies)
     .then((resp) => {
       resp.status; // 200
       resp.data; // axios data html response from server.
       // your requests here
   })
   .catch((err) => console.log(err))
```

If the `check Login` method resolves the user has been successfully logged in, then:

```javascript
   req.checkLogin(loggedCookies)
     .then(() => 
       // your requests here
       req.react("1", "123456789"); // reactId, postId
       // req.post("hello", "571225")  // text message, threadId
       // req.editPost("edit my post now", '123456789') // text message, postId
       // req.newThread("hello again", "lol", '/some-board.14') // title,  message, board relative url
       // req.editThread("Ayy lmao", "peace", '1233456789') // title, message, board relative url
       // req.privateMsg("tes", 'ting', ['myfriend']) // title, message, friend username
       // req.replyPrivateMsg("yes", "12345") // text, messageId
       // req.leavePrivateMsg("12345", true) // messageId, accept future message
       // req.ignore("9876543") // memberId
       // req.follow("9876543") // memberId
       // req.profilePost("hello", "9876543") // text, memberId
       // req.editProfilePost("ops...", "1234") // text, ProfilePostId
       // req.deleteProfilePost("1234", "wathever") // ProfilePostId, reason
       // req.bookMark("123456789", "nice", "stuff") // postId, message, labels
       // req.signature("My awesome signature") // text
   )
   .catch((err) => console.log(err))
```

After log in you can do the `GET` authenticated request to retrieve data.

```javascript
   req
     .checkLogin(loggedCookies)
     .then(() => {
       return req
         .getRequest("/conversations") // equal to: https://forum.some.com/conversations
         .then((response) => {
           // do things with authenticated html response from server.
           // console.log(response.data)
      })
   })
   .catch((err) => console.log(err));
```

In case of login failure, promise reject and returns an error object with the `code: 'NOTAUTHENTICATED'` parameter:

```javascript
   req.checkLogin(loggedCookies)
     .then(() => {
       // return your requests here
   })
   .catch((err) => {
     console.log(err.code)
     // "NOTAUTHENTICATED"
   })
```

**Short exemple:**

however, do **not** log in to each request because the server will block it, instead save the cookies and reuse them as mentioned above:
```javascript
const XenNode = require("xen-node");

const url = "https://forum.some.com";
const req = new XenNode(url);

req.xenLogin("myusername", "mypass")
  .then((ck) => req.checkLogin(ck))
  .then(() => req.post("hey dude", "571225")
).catch((err) => console.log(err))
```

**Standard reaction_ids:**

| ID | React |
| ------ | ------ |
| 1 | like |
| 2 | Love |
| 3 | Haha |
| 4 | Wow |
| 5 | Sad |
| 6 | Angry |
| 7 | Thinking|
