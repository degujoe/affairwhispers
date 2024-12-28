const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('your_stripe_secret_key'); // Replace with your Stripe Secret Key

const app = express();
const PORT = 3000; // You can use any port

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse JSON data in requests

// API to check subscription
app.post('/check-subscription', async (req, res) => {
  const { email } = req.body;

  try {
    // Search for customers by email
    const customers = await stripe.customers.list({ email, limit: 1 });

    if (customers.data.length === 0) {
      return res.status(404).json({ isMember: false, message: 'Customer not found' });
    }

    const customerId = customers.data[0].id;

    // Fetch active subscriptions for the customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
    });

    if (subscriptions.data.length > 0) {
      // Active subscription found
      res.status(200).json({
        isMember: true,
        subscriptionId: subscriptions.data[0].id,
        email: customers.data[0].email,
      });
    } else {
      // No active subscriptions
      res.status(200).json({ isMember: false });
    }
  } catch (error) {
    console.error('Error checking subscription:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
