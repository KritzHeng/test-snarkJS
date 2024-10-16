import React, { useState, useEffect } from 'react';

// import { groth16 } from 'snarkjs'; // ZK-SNARK library
const snarkjs = require('snarkjs')

const User = () => {
  const [transactionAmount, setTransactionAmount] = useState(null);
  const [proof, setProof] = useState(null);

  useEffect(() => {
   generateProof(transactionAmount)
  },[]);

  const cardDetails = {
    cardNumber: 1234567890123456,
    expiryDate: '123',
    cvc: '123',
    secretHash: '12345678901234567890123456789012', // Ideally, this would be pre-computed.
  };

//   {
//     "cardNumber": "1234567890123456",
//     "expiryDate": "1225",
//     "cvc": "123",
//     "secretHash": "12345678901234567890123456789012",
//     "transactionAmount": "100",
//     "publicHash": "123456789012345678901234567"
// }  

  // Generate ZK proof
  const generateProof = async (tx) => {
    const input = 
    // {
    //   cardNumber: cardDetails.cardNumber,
    //   expiryDate: cardDetails.expiryDate,
    //   cvc: cardDetails.cvc,
    //   secretHash: cardDetails.secretHash,
    //   transactionAmount: "100",
    //   publicHash: '123456789012345678901234567',
    // };
    {
      "cardNumber": "1234567890123456",
      "expiryDate": "1225",
      "cvc": "123",
      "secretHash": "12345678901234567890123456789012",
      "transactionAmount": "100",
      "publicHash": "123456789012345678901234567"
    }
    // const proof = "s"
    const zkey = '/circuit/circuit_0000.zkey'; // Path relative to public folder
    const wasm = '/circuit/circuit.wasm';     // Path relative to public folder
  
    // snarkJS: using the compiled circuit and proving key to generate the proof
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(input, wasm, zkey);
    console.log(proof);
    await setProof(proof);
  };

  const sendProofToMerchant = async () => {
    const transactionAmount = 100;
    // await generateProof(transactionAmount); // Generate proof based on transaction
    // Sending proof to merchant
    await fetch('http://localhost:4000/merchant/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ proof, transactionAmount }),
    });
  };

  const handleReceiveTx = (tx) => {
    setTransactionAmount(tx);
    generateProof(tx); // Generate proof based on transaction
  };

  return (
    <div>
      <h2>User Interface</h2>
      <p>Transaction Amount: {transactionAmount}</p>
      <button onClick={sendProofToMerchant}>Send Proof to Merchant</button>
    </div>
  );
};

export default User;