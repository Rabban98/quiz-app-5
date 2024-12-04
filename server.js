const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51QSN5iAOyBtcmLt74sT97JkDACqPhXkZWyfS7Fbp5mFpklpCdpwz7d3jdIpqS01o2C2YPnlixSlISyvh1xWjflKy00VDPEtVZk"); // Din Stripe hemliga nyckel

const app = express();

app.use(cors());
app.use(express.json());

// Testroute för att kontrollera att backend fungerar
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

// Checkout-session route
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: { name: "Camping Reservation" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://celebritypartys.com/success.html",
      cancel_url: "https://celebritypartys.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


