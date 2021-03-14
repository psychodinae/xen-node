const interage = require("./interage.js");
const ffCokkies = require("./utils.js");

const url = "https://www.ignboards.com";
const ign = new interage(url);

ffCokkies((ck) => {
  ign
    .checkLogin(ck)
    .then((resp) => {
      console.log("logado:", resp);
      ign.react("1", "525667005").catch((err) => console.log(err));
      //my.post("vem apocalipse", "571225").catch((err) => console.log(err));
      //my.newThread("boa tarde", "sim", '/geral.15').catch((err) => console.log(err));
      //my.editThread("boa tarde", "sim senhor", '1075378927').catch((err) => console.log(err));
      //my.editPost("sim", '1075378964').catch((err) => console.log(err));
      //my.privateMsg("tes", 'te 2', ['testeuser']).catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});
