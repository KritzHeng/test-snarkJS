const fetch = require('node-fetch'); // Ensure you're using node-fetch v2
const express = require('express');
const app = express();
const cors = require('cors'); // Import the cors middleware
// Enable CORS for all origins or a specific origin
app.use(cors({ origin: 'http://localhost:3000' })); // Only allow requests from your React app
app.use(express.json());

let transaction = {
  amount: 100,
  publicHash: '123456789012345678901234567',
};

// Merchant creates the transaction
app.get('/create-transaction', (req, res) => {
  res.json({ amount: transaction.amount, publicHash: transaction.publicHash });
});

// Merchant receives the proof from the user
app.post('/merchant/submit', async (req, res) => {
  const { proof, publicSignals } = req.body;
  console.log(proof, publicSignals);
  // Forward the proof to the bank for verification
  const response = await fetch('http://localhost:6000/bank/verify-proof', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proof, publicSignals }),
  });


  const verificationResult = await response.json();
  console.log(verificationResult);
  if (verificationResult.verified) {
    res.json({ message: 'Transaction Approved!' });
  } else {
    res.status(400).json({ message: 'Transaction Rejected!' });
  }
});

app.listen(4000, () => {
  console.log('Merchant server running on port 4000');
});