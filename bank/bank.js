// bank.js (Express)
const express = require('express');
const { groth16 } = require('snarkjs'); // ZK-SNARK library
const cors = require('cors'); // Import the cors middleware
const fs = require("fs");

const app = express();
// Enable CORS for all origins or a specific origin
app.use(cors({ origin: 'http://localhost:3000' })); // Only allow requests from your React app
app.use(express.json());

// Verifies the proof received from the merchant
app.post('/bank/verify-proof', async (req, res) => {
  const { proof, publicSignals } = req.body;
  console.log(proof, publicSignals); 
  // Verify the proof using snarkJS
  const verificationKey = JSON.parse(fs.readFileSync('verification_key.json')) // Your verification key

  console.log("publicSignals:",publicSignals);
  const isValid = await groth16.verify(verificationKey, publicSignals, proof);


  if (isValid) {
    res.json({ verified: true });
  } else {
    res.json({ verified: false });
  }
});

app.listen(6000, () => {
  console.log('Bank server running on port 6000');
});
