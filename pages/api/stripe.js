// Logic here that makes purchases:
import Stripe from "stripe";

const stripe = new Stripe(`${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`);

import { getSession } from "@auth0/nextjs-auth0";

export default async function nextExpress(req, res) {
  // Capture user session data from a getSession hook with `req/res` params.
  const session = getSession(req, res);
  const user = session?.user;

  // Create checkout session object and use `req/res` params.
  if (user) {
    const stripeId = user["http://localhost:3000/stripe_customer_id"];
    if (req.method === "POST") {
      try {
        const session = await stripe.checkout.sessions.create({
          submit_type: "pay",
          mode: "payment",
          payment_method_types: ["card"],
          customer: stripeId, // you will need the above implemented.
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "ZA", "GB", "IT", "DE"],
          },
          shipping_options: [
            { shipping_rate: "shr_1LZwbZJSo5bJNqnzqzRRjhMc" },
            { shipping_rate: "shr_1LZwguJSo5bJNqnzop3FuXzz" },
          ],
          allow_promotion_codes: true,
          line_items: req.body.map((item) => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.title,
                  images: [item.image.data.attributes.formats.thumbnail.url],
                },
                unit_amount: item.price * 100,
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
              },
              quantity: item.quantity,
            };
          }),
          // Will bring visitors to either a success or failed page.
          // You need the following string to submit to the success page:
          // `?&session_id={CHECKOUT_SESSION_ID}`
          success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/canceled`,
        });
        res.status(200).json(session);
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  } else {
    console.log("nope");
    if (req.method === "POST") {
      try {
        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
          submit_type: "pay",
          mode: "payment",
          payment_method_types: ["card"],
          shipping_address_collection: {
            allowed_countries: ["US", "CA", "ZA", "GB", "IT", "DE"],
          },
          shipping_options: [
            { shipping_rate: "shr_1LZwbZJSo5bJNqnzqzRRjhMc" },
            { shipping_rate: "shr_1LZwguJSo5bJNqnzop3FuXzz" },
          ],
          allow_promotion_codes: true,
          line_items: req.body.map((item) => {
            return {
              price_data: {
                currency: "usd",
                product_data: {
                  name: item.title,
                  images: [item.image.data.attributes.formats.thumbnail.url],
                },
                unit_amount: item.price * 100,
              },
              adjustable_quantity: {
                enabled: true,
                minimum: 1,
              },
              quantity: item.quantity,
            };
          }),
          // Will bring visitors to either a success or failed page.
          // You need the following string to submit to the success page:
          // `?&session_id={CHECKOUT_SESSION_ID}`
          success_url: `${req.headers.origin}/success?&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${req.headers.origin}/canceled`,
        });
        res.status(200).json(session);
      } catch (err) {
        res.status(err.statusCode || 500).json(err.message);
      }
    } else {
      res.setHeader("Allow", "POST");
      res.status(405).end("Method Not Allowed");
    }
  }
}

// BELOW IS THE AUTH PIPELINE RULE USED TO CAPTURE STRIPE SESSION DATA:
// If successful "app_metadata" will appear in the auth0 dashboard under rules.
// 1) Update secret key, see below - 2) Ensure correct URL, see below.
// Finally we can use 3) A getSession hook, as seen above.
/*
function (user, context, callback) {
  user.app_metadata = user.app_metadata || {};

  if ("stripe_customer_id" in user.app_metadata) {
    context.idToken["http://localhost:3000/stripe_customer_id"] =
      user.app_metadata.stripe_customer_id;

    return callback(null, user, context);
  }

  const stripe = require("stripe")("SK_KEY_HERE");

  const customer = {
    email: user.email,

    description: user.name,
  };

  stripe.customers.create(customer, function (err, customer) {
    if (err) {
      return callback(err);
    }

    user.app_metadata.stripe_customer_id = customer.id;

    auth0.users
      .updateAppMetadata(user.user_id, user.app_metadata)

      .then(function () {
        context.idToken["http://localhost:3000/stripe_customer_id"] =
          user.app_metadata.stripe_customer_id;

        callback(null, user, context);
      })

      .catch(function (err) {
        callback(err);
      });
  });
}
*/
