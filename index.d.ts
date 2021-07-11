import { AxiosResponse } from "axios";

export = XenNode;

declare class XenNode {
  /**
   * Interact with xenforo 2.x forums.
   * @constructor
   * @param {string} url - The forum base URL.
   * @param {promise} options - promise with optional configuration.
   */
  constructor(url: string, options: promise);
  options: any;
  cookies: any[];
  postData: {};
  axiosXen: any;
  /**
   * Forum Login .
   * @param {string} login - forum login.
   * @param {string} password - Forum password.
   * @param {boolean} json - Optional output format selector.
   * @return {Promise<Array<String>> | Promise<String>} Array or a JSON string with cookies.
   */
  xenLogin(
    login: string,
    password: string,
    json?: boolean
  ): Promise<Array<String>> | Promise<String>;
  /**
   * Set cookies, XFtoken and check if is logged in.
   * @param {Array<string>} freshCookies - the logged cookie array.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise,
   * in case of login error rejects a promise with a custom "axios" error.
   */
  checkLogin(freshCookies?: Array<string>): Promise<AxiosResponse>;
  /**
   * Perform a axios regular GET request with authenticated cookies.
   * @param {string} uri - relative URL.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  getRequest(uri: string): Promise<AxiosResponse>;
  /**
   * Perform a axios POST request with authenticated cookies.
   * @param {string} uri - relative URL.
   * @param {promise} data - a promise to urlencoding to pass as data on POST request.
   * @param {string} log - verbosity log message.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  postRequest(uri: string, data: promise, log: string): Promise<AxiosResponse>;
  /**
   * React on a post.
   * @param {string} reactId - react Id.
   * @param {string} postId - post Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  react(reactId: string, postId: string): Promise<AxiosResponse>;
  /**
   * Post in the thread.
   * @param {string} text - message to post.
   * @param {string} thread - thread Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  post(text: string, thread: string): Promise<AxiosResponse>;
  /**
   * Edit a post.
   * @param {string} text - message to post.
   * @param {string} postId - post Id.
   * @return {promise} A regular axios resolve/reject promise.
   */
  editPost(text: string, postId: string): promise;
  /**
   * Create a thread.
   * @param {string} title - message title.
   * @param {string} text - message to post.
   *  @param {string} boardUri - board relative URL.
   * @param {string} prefixId - thread prefix id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  newThread(
    title: string,
    text: string,
    boardUri: string,
    prefixId?: string
  ): Promise<AxiosResponse>;
  /**
   * Edit a thread.
   * @param {string} title - message title.
   * @param {string} text - message to post.
   * @param {string} postId - post Id.
   * @param {string} prefixId - thread prefix id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  editThread(
    title: string,
    text: string,
    postId: string,
    prefixId?: string
  ): Promise<AxiosResponse>;
  /**
   * Send private message.
   * @param {string} title - message title.
   * @param {string} text - message to post.
   * @param {string|Array<string>} nickList - Username or list of recipients.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  privateMsg(
    title: string,
    text: string,
    nickList: string | Array<string>
  ): Promise<AxiosResponse>;
  /**
   * Reply private message.
   * @param {string} text - message to post.
   * @param {string} messageId - message Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  replyPrivateMsg(text: string, messageId: string): Promise<AxiosResponse>;
  /**
   * Leave private message.
   * @param {string} messageId - message Id.
   * @param {boolean} acceptFutureMsg - accept future messages ( default true ).
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  leavePrivateMsg(
    messageId: string,
    acceptFutureMsg?: boolean
  ): Promise<AxiosResponse>;
  /**
   * Ignore user.
   * @param {string} memberId - user Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  ignore(memberId: string): Promise<AxiosResponse>;
  /**
   * Follow user.
   * @param {string} memberId - user Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  follow(memberId: string): Promise<AxiosResponse>;
  /**
   * Post in a user profile.
   * @param {string} text - message to post.
   * @param {string} memberId - user Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  profilePost(text: string, memberId: string): Promise<AxiosResponse>;
  /**
   * Edit post in a user profile.
   * @param {string} text - message to post.
   * @param {string} ProfilePostId - profile post Id.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  editProfilePost(text: string, ProfilePostId: string): Promise<AxiosResponse>;
  /**
   * Delete post in a user profile.
   * @param {string} ProfilePostId - profile post Id.
   * @param {string} reason - a optional reason to delete.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  deleteProfilePost(
    ProfilePostId: string,
    reason?: string
  ): Promise<AxiosResponse>;
  /**
   * Bookmark a post.
   * @param {string} postId - profile post Id.
   * @param {string} message - a optional anottation.
   * @param {string} labels - a optional label.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  bookMark(
    postId: string,
    message?: string,
    labels?: string
  ): Promise<AxiosResponse>;
  /**
   * Edit a profile signature.
   * @param {string} text - signature message.
   * @return {Promise<AxiosResponse>} A regular axios resolve/reject promise.
   */
  signature(text: string): Promise<AxiosResponse>;
}
