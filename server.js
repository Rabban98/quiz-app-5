const express = require("express");
const Stripe = require("stripe");
const cors = require("cors");

// Replace this with your actual Stripe secret key
const stripe = new Stripe("sk_test_51QSN5iAOyBtcmLt74sT97JkDACqPhXkZWyfS7Fbp5mFpklpCdpwz7d3jdIpqS01o2C2YPnlixSlISyvh1xWjflKy00VDPEtVZk");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON requests

// Create Checkout Session
app.post("/create-checkout-session", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      throw new Error("Invalid amount provided.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "sek",
            product_data: { name: "Camping Booking" },
            unit_amount: amount, // Amount in smallest currency unit (e.g., 50000 = 500 SEK)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://127.0.0.1:8080/success.html",
      cancel_url: "http://127.0.0.1:8080/cancel.html",
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://127.0.0.1:${PORT}`);
});
