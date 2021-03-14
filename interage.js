const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

module.exports = Interage = function (url) {
  if (typeof url === "undefined") throw new TypeError("forum url is required!");
  this.cookies = [];
  this.postData = {};
  this.axiosXen = axios.create({
    maxRedirects: 1,
    timeout: 5000,
    baseURL: url,
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36",
    },
  });
};

Interage.prototype.xenLogin = function (login, password) {
  let params = {
    login: login,
    password: password,
    remember: "1",
  };
  return this.axiosXen()
    .then((resp) => {
      let $ = cheerio.load(resp.data);
      params._xfToken = $("input[name=_xfToken]").val();
      return this.axiosXen("/index.php?login/login/", {
        maxRedirects: 0,
        method: "post",
        headers: {
          Cookie: resp.headers["set-cookie"] || [],
        },
        data: qs.stringify(params),
        validateStatus: function (status) {
          return status == 303; // Resolve only if the status code is 303
        },
      })
        .then((response) => {
          console.log("logged if 303:", response.status);
          this.cookies = response.headers["set-cookie"];
          return this.cookies;
        })
        .catch((error) => {
          console.log("xenLoginError statuscode:", error);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};

Interage.prototype.checkLogin = function (freshCookies) {
  this.postData = {}
  if (!Array.isArray(freshCookies)) freshCookies = this.cookies;  // if NOT param
  return this.axiosXen({
    method: "post",
    validateStatus: function (status) {
      return status <= 400; // misteriously the post request returns xf_csrf cookie but with 400 status code
    },
  })
    .then((resp) => {
      this.cookies = mergeCookies(freshCookies, resp.headers["set-cookie"]);
      return this.axiosXen({
        headers: { Cookie: this.cookies },
      }).then((respo) => {
        let $ = cheerio.load(respo.data);
        let logged = $("#XF").attr("data-logged-in");
        this.postData._xfToken = $("input[name=_xfToken]").val();
        return (logged === 'true');
      });
    })
    .catch((error) => {
      console.log(console.log(error.response.status))
      console.log('lol', error.response.headers);
    });
};

function mergeCookies(c1, c2) {
  let filtered = c2;
  for (var idx in c1)
    for (var idy in c2)
      if (c1[idx].startsWith(c2[idy].split("=")[0])) filtered.splice(idy, 1);
  return c1.concat(filtered);
}

Interage.prototype.makeRequest = function (url, data, log) {
    return this.axiosXen(url, {
      method: "post",
      maxRedirects: 0,
      data: qs.stringify(data),
      validateStatus: function (status) {
        if (status == 303) {
        console.log(log);
        return true // Resolve only if the status code is 303
        }
      },
      headers: {
        Cookie: this.cookies,
      },
    });
  };

// forum endpoints:

Interage.prototype.react = function (react_id, post_id) {
  this.postData.reaction_id = react_id;
  let url = `index.php?posts/${post_id}/react`
  let log = `[!] reacted on post: ${post_id}`
  return this.makeRequest(url, this.postData, log)
};

Interage.prototype.post = function (text, thread) {
  this.postData.message = text
  let url = `index.php?threads/${thread}/add-reply`
  let log = `[!] commented on thread: ${thread}`
  return this.makeRequest(url, this.postData, log)
};

Interage.prototype.editPost = function (text, post_id) {
  this.postData.message = text
  let url = `index.php?posts/${post_id}/edit`
  let log = `[!] post edited: ${post_id}`
  return this.makeRequest(url, this.postData, log)
};

Interage.prototype.newThread = function (title, text, board_uri, prefix_id='0') {
  let data = {
    ...{
      title: title,
      message: text,
      prefix_id: prefix_id,
    },
    ...this.postData,
  };
  let url = `index.php?forums${board_uri}/post-thread`
  let log = `[!] new thread on board: ${board_uri}`
  return this.makeRequest(url, data, log)
};

Interage.prototype.editThread = function (title, text, post_id, prefix_id='0') {
  let data = {
    ...{
      title: title,
      message: text,
      prefix_id: prefix_id,
    },
    ...this.postData,
  };
  let url = `index.php?posts/${post_id}/edit`
  let log = `[!] thread edited: ${post_id}`
  return this.makeRequest(url, data, log)
};

Interage.prototype.privateMsg = function (title, text, nickList) {
  let nickStr = nickList.join()
  let data = {
    ...{
      title: title,
      message: text,
      recipients: nickStr
    },
    ...this.postData,
  };
  let url = `index.php?conversations/add`
  let log = `[!] private message send to: ${nickStr}`
  return this.makeRequest(url, data, log)
};
