import { ethers } from "ethers";
import { useState } from "react";
import abi from "../abi/YeildReportNFT.json";


import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../config/firebase"


const CONTRACT_ADDRESS = "0x8E65D70d7695F3CCa326773c2E0da816D0674608";

export default function MintReportNFT({ cid, farmerAddress}) {
  const [price, setPrice] = useState("");
  const [txHash, setTxHash] = useState(null);

  const mint = async () => {
  try {
    if (!cid) {
      alert("Upload to IPFS first");
      return;
    }

    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      signer
    );

    const tx = await contract.mintReport(
      cid,
      ethers.parseEther(price)
    );

    await tx.wait();

    // 🔑 GET TOKEN ID
    const tokenId = Number(await contract.tokenCounter()) - 1;

    setTxHash(tx.hash);

    // ✅ SAVE EVERYTHING
    const farmerRef = doc(db, "farmers", farmerAddress);
    await setDoc(
      farmerRef,
      {
        price: price,
        tokenId: tokenId,
        tx_hash: tx.hash,
      },
      { merge: true }
    );

    alert(`NFT Minted Successfully (Token ID: ${tokenId})`);

  } catch (err) {
    console.error(err);
    alert(err.reason || err.message || "Mint failed");
  }
};


  return (
    <div className="mint-nft-container">
      <input
        type="text"
        placeholder="Price in ETH"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="mint-input"
      />

      <button
        onClick={mint}
        className="mint-btn"
      >
        Mint Yield NFT
      </button>

      {txHash && (
        <p className="mint-success">
          Minted: <span>{txHash}</span>
        </p>
      )}
    </div>
  );
}
