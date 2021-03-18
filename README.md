# xen-node
Interact with XenForo 2.x forums, nodejs flavor

## Installation

    npm install xen-node
    
## Usage

First instantiate the object and pass the forum url in the constructor:
```javascript
    const XenNode = require("xen-node");

    const url = "https://forum.some.com";
    const req = new XenNode(url);
```

#### Login
Store your **logged Cookies** as JSON in a file or in your project enviroment variables.

```javascript
req.xenLogin("myusername", "mypass")
      .then((loggedCookies) => {
        console.log(JSON.stringify(loggedCookies));
            // '["xf_user=234553%ubIUYBuybiuyIU_v-SDFfg34...
      })
      .catch((err) => console.log(err));
```

#### Forum Requests
Before sending any request to the forum use the check login functionto to test if the credentials are 
valid and load the **CSRF token**.

Then using your previously saved cookies:

```javascript
   const loggedCookies = JSON.parse(mySavedCookies)

   req.checkLogin(loggedCookies).then((resp) => {
     console.log("logged", resp);
     // Then:
     req.react("1", "123456789"); // react_id / post_id
     // req.post("hello", "571225")  // text message / thread_id
     // req.editPost("edit my post now", '123456789') // text message / post_id
     // req.newThread("hello again", "lol", '/some-board.14') title / message / board URI
     // req.editThread("Ayy lmao", "peace", '1233456789') title / message / board URI
     // req.privateMsg("tes", 'ting', ['myfriend']) title / message / friend_user_name
   });
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
