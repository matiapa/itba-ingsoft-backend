const https = require("https");

const access_token =
  "TEST-2172260712360317-070421-ddef0a4c0adf8c987aa7cb19bf73bf49-293458878";

//const port = 3000;

const options = {
  hostname: "api.mercadopago.com",
//  port: port,
  path: "/checkout/preferences?access_token=" + access_token,
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
};
function get_preference_id(data, callback) {
  console.log(data);
  request = https.request(options, (res) => {
    if (res.statusCode == 201) {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk.toString("utf8");
      });
      res.on("end", () => {
        resData = JSON.parse(data);
        callback(resData.id);
      });
    } else {
      console.log(`Mercado Pago API Error: ${res.statusMessage}`);
    }
  });
  request.on("error", (error) => {
    console.error(error);
  });
  request.write(data);
  request.end();
}

module.exports = {
  createPreference(auction, highestBid, payer_info, callback) {
  console.log(auction);
  const data = JSON.stringify({
      items: [
        {
          title: auction.name,
          description: auction.description,
          quantity: auction.quantity,
          currency_id: "ARS",
          unit_price: parseFloat(highestBid),
        },
      ],
      payer: {
        name: payer_info.name,
        surname: payer_info.last_name,
      },
      payment_methods: {
        excluded_payment_methods: [
          {
            id: "ticket",
          },
          {
            id: "atm",
          },
          {
            id: "prepaid_card",
          },
        ],
      },
    });
    get_preference_id(data, callback);
  },
};
