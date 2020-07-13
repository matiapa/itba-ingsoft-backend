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

const get_preference_id = https.request(options, (res) => {
  if (res.statusCode == 201) {
    let data = "";
    res.on("data", (chunk) => {
      data += chunk.toString("utf8");
    });
    res.on("end", () => {
      console.log(JSON.parse(data));
      //TODO mandar evento de cerrado
    });
  } else {
    console.log("Mercado Pago API Error:");
  }
});
get_preference_id.on("error", (error) => {
  console.error(error);
});

module.exports = {
  createPreference(auction, highestBid, payer_info) {
    const data = JSON.stringify({
      items: [
        {
          title: auction.name,
          description: auction.description,
          quantity: auction.quantity,
          currency_id: "ARS",
          unit_price: highestBid,
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
    get_preference_id.write(data);
    get_preference_id.end();
  },
};
