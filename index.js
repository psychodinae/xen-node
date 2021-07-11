const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

const defaultOpt = {
  verbose: null,
  timeout: 5000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
};

module.exports = class XenNode {
  constructor(url, options) {
    if (typeof url === "undefined")
      throw new TypeError("forum url is required!");
    this.options = { ...defaultOpt, ...options };
    this.cookies = [];
    this.postData = {};
    this.axiosXen = axios.create({
      maxRedirects: 1,
      baseURL: url,
      timeout: this.options.timeout,
      headers: this.options.headers,
    });
  }

  xenLogin(login, password, json = false) {
    let params = {
      login: login,
      password: password,
      remember: "1",
    };
    return this.axiosXen().then((resp) => {
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
          return status == 303; // Resolve only if the status code is 303, this means successfully logged in.
        },
      }).then((response) => {
        verbosity(this.options.verbose, "[!] successfully logged in.");
        this.cookies = response.headers["set-cookie"];
        return json ? JSON.stringify(this.cookies) : this.cookies;
      });
    });
  }

  checkLogin(freshCookies = null) {
    this.postData = {}; // clear
    if (!Array.isArray(freshCookies)) freshCookies = this.cookies;
    return this.axiosXen({
      method: "post",
      validateStatus: function (status) {
        return status <= 400; // misteriously the post request returns xf_csrf cookie but with 400 status code
      },
    }).then((resp) => {
      this.cookies = mergeCookies(freshCookies, resp.headers["set-cookie"]);
      return this.axiosXen({
        headers: { Cookie: this.cookies },
      }).then((res) => {
        const $ = cheerio.load(res.data);
        const logged = $("#XF").attr("data-logged-in");
        this.postData._xfToken = $("input[name=_xfToken]").val();
        verbosity(this.options.verbose, `[!] check login: ${logged}`);
        return logged === "true" ? res : Promise.reject(notLoggedInError(res)); // reject Promise with custom error.
      });
    });
  }

  getRequest(uri) {
    return this.axiosXen(uri, {
      headers: {
        Cookie: this.cookies,
      },
    });
  }

  postRequest(uri, data, log) {
    return this.axiosXen(uri, {
      method: "post",
      maxRedirects: 0,
      data: qs.stringify(data),
      validateStatus: function (status) {
        if (status == 303) {
          return true; // Resolve only if the status code is 303
        }
      },
      headers: {
        Cookie: this.cookies,
      },
    }).then((res) => {
      verbosity(this.options.verbose, log);
      return  Promise.resolve(res)
    });
  }

  react(reactId, postId) {
    this.postData.reaction_id = reactId;
    const uri = `index.php?posts/${postId}/react`;
    const log = `[!] reacted on post: ${postId}`;
    return this.postRequest(uri, this.postData, log);
  }

  post(text, thread) {
    this.postData.message = text;
    const uri = `index.php?threads/${thread}/add-reply`;
    const log = `[!] commented on thread: ${thread}`;
    return this.postRequest(uri, this.postData, log);
  }

  editPost(text, postId) {
    this.postData.message = text;
    const uri = `index.php?posts/${postId}/edit`;
    const log = `[!] post edited: ${postId}`; ////
    return this.postRequest(uri, this.postData, log);
  }

  newThread(title, text, boardUri, prefixId = "0") {
    const data = {
      ...{
        title: title,
        message: text,
        prefix_id: prefixId,
      },
      ...this.postData,
    };
    const uri = `index.php?forums${boardUri}/post-thread`;
    const log = `[!] new thread on board: ${boardUri}`;
    return this.postRequest(uri, data, log);
  }

  editThread(title, text, postId, prefixId = "0") {
    const data = {
      ...{
        title: title,
        message: text,
        prefix_id: prefixId,
      },
      ...this.postData,
    };
    const uri = `index.php?posts/${postId}/edit`;
    const log = `[!] thread edited: ${postId}`;
    return this.postRequest(uri, data, log);
  }

  privateMsg(title, text, nickList) {
    const nickStr = nickList.join();
    const data = {
      ...{
        title: title,
        message: text,
        recipients: nickStr,
      },
      ...this.postData,
    };
    const uri = `index.php?conversations/add`;
    const log = `[!] private message send to: ${nickStr}`;
    return this.postRequest(uri, data, log);
  }

  replyPrivateMsg(text, messageId) {
    this.postData.message = text;
    const uri = `index.php?conversations/${messageId}/add-reply`;
    const log = `[!] private message replyed: ${messageId}`;
    return this.postRequest(uri, this.postData, log);
  }

  leavePrivateMsg(messageId, acceptFutureMsg = true) {
    let futureMsg = acceptFutureMsg ? "deleted" : "deleted_ignored";
    this.postData.recipient_state = futureMsg;
    const uri = `index.php?conversations/${messageId}/leave`;
    const log = `[!] leave conversation: ${messageId}`;
    return this.postRequest(uri, this.postData, log);
  }

  ignore(memberId) {
    const uri = `index.php?members/${memberId}/ignore`;
    const log = `[!] ignoring member: ${memberId}`;
    return this.postRequest(uri, this.postData, log);
  }

  follow(memberId) {
    const uri = `index.php?members/${memberId}/follow`;
    const log = `[!] following member: ${memberId}`;
    return this.postRequest(uri, this.postData, log);
  }

  profilePost(text, memberId) {
    this.postData.message = text;
    const uri = `index.php?members/${memberId}/post`;
    const log = `[!] posted in profile: ${memberId}`;
    return this.postRequest(uri, this.postData, log);
  }

  editProfilePost(text, ProfilePostId) {
    this.postData.message = text;
    const uri = `index.php?profile-posts/${ProfilePostId}/edit`;
    const log = `[!] profile post edited: ${ProfilePostId}`;
    return this.postRequest(uri, this.postData, log);
  }

  deleteProfilePost(ProfilePostId, reason = "") {
    this.postData.reason = reason;
    const uri = `index.php?profile-posts/${ProfilePostId}/delete`;
    const log = `[!] profile post deleted: ${ProfilePostId}`;
    return this.postRequest(uri, this.postData, log);
  }

  bookMark(postId, message = "", labels = "") {
    const label = labels ? labels.join() : null;
    const data = {
      ...{
        message: message,
        labels: label,
      },
      ...this.postData,
    };
    const uri = `index.php?posts/${postId}/bookmark/`;
    const log = `[!] bookmarked: ${postId}`;
    return this.postRequest(uri, data, log);
  }

  signature(text) {
    this.postData.signature = text;
    const uri = `index.php?account/signature`;
    const log = `[!] signature edited.`;
    return this.postRequest(uri, this.postData, log);
  }
};

const verbosity = function (fn, message) {
  if (typeof fn === "function") fn(message);
};

const mergeCookies = (c1, c2) => {
  let filtered = c2;
  for (let idx in c1)
    for (let idy in c2)
      if (c1[idx].startsWith(c2[idy].split("=")[0])) filtered.splice(idy, 1);
  return c1.concat(filtered);
};

const notLoggedInError = (axiosResponse) => {
  const custom = {
    errno: -3010,
    code: "NOTAUTHENTICATED",
    hostname: axiosResponse.request.socket._host,
    config: axiosResponse.config,
    response: undefined,
    isAxiosError: false,
  };
  return { ...new Error("not logged in."), ...custom };
};
