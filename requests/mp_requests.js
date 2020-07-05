const https = require("https");

const access_token =
  "TEST-2172260712360317-070421-ddef0a4c0adf8c987aa7cb19bf73bf49-293458878";

const port = 3000;

const options = {
  hostname: "https://api.mercadopago.com",
  port: port,
  path: "/checkout/preferences?access_token=" + access_token,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};

const post_request = https.request(options, (res) => {
  if (res.statusCode == 201) {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk.toString("utf8");
    });
    res.on("");
  } else {
    console.log("Mercado Pago API Error:");
  }
});

module.exports = {
  createPreference(info) {
    const postData = info;
  },
};
