import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { ethers } from "ethers";
import abi from "../abi/YeildReportNFT.json";

const CONTRACT_ADDRESS = "0x8E65D70d7695F3CCa326773c2E0da816D0674608";

export default function FarmerDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);


  useEffect(() => {
    const fetchItem = async () => {
      try {
        const snap = await getDoc(doc(db, "farmers", id));
        if (snap.exists()) {
          setItem(snap.data());
        }
      } catch (err) {
        console.error("Error fetching farmer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const buyNFT = async () => {
  try {
    if (!window.ethereum) {
      alert("MetaMask not found");
      return;
    }

    if (item.tokenId === undefined) {
      alert("tokenId missing");
      return;
    }

    setBuying(true);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      abi,
      signer
    );

    const priceInWei = ethers.parseEther(String(item.price));

    const tx = await contract.buyReport(item.tokenId, {
      value: priceInWei,
    });

    await tx.wait();

    alert("NFT purchased successfully 🎉");

  } catch (err) {
    console.error(err);
    alert(err.reason || err.message || "Transaction failed");
  } finally {
    setBuying(false);
  }
};


  if (loading) return <p className="loading">Loading details...</p>;
  if (!item) return <p className="error">Farmer not found</p>;

  return (
    <div className="details-container">
      <div className="details-card">
        <div className="details-info">
          <h2>{item.crop}</h2>

          <p className="price-details">{item.price} ETH</p>

          <p><b>District:</b> {item.district}</p>
          <p><b>Farmer Address:</b> {item.farmer_address}</p>

          <p className="tx">
            <b>Mint Transaction</b>
            <span>{item.tx_hash}</span>
          </p>

          <button
            className="buy-btn"
            onClick={buyNFT}
            disabled={buying}
          >
            {buying ? "Processing..." : "Buy Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
