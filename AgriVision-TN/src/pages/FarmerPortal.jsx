import { useEffect, useState } from "react";
import YieldPredictor from "../components/YieldPredictor";
import IpfsUploadButton from "../components/IpfsUploadButton";
import MintReportNFT from "../components/MintReportNTF";

const REQUIRED_CHAIN_ID = "0xaa36a7"; // Sepolia testnet

export default function FarmerPortal() {
  const [farmerAddress, setFarmerAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cid,setCid] = useState(null);

  useEffect(() => {
    if (!window.ethereum) {
      alert("MetaMask not detected");
      return;
    }

    const connectWallet = async () => {
      try {
        // 1️⃣ Enforce correct network
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });

        if (chainId !== REQUIRED_CHAIN_ID) {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: REQUIRED_CHAIN_ID }],
          });
        }

        // 2️⃣ Request wallet access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setFarmerAddress(accounts[0]);
        setLoading(false);
        console.log("Connected wallet:", accounts[0]);
      } catch (err) {
        console.error("Wallet connection failed", err);
        alert("Wallet connection failed");
      }
    };

    const handleAccountsChanged = () => {
      console.warn("Account changed — resetting app");
      window.location.reload(); // HARD RESET
    };

    const handleChainChanged = () => {
      console.warn("Network changed — resetting app");
      window.location.reload(); // HARD RESET
    };

    connectWallet();

    // 3️⃣ Register listeners ONCE
    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    // 4️⃣ Cleanup listeners
    return () => {
      window.ethereum.removeListener(
        "accountsChanged",
        handleAccountsChanged
      );
      window.ethereum.removeListener(
        "chainChanged",
        handleChainChanged
      );
    };
  }, []);

  if (loading) {
    return <p>Connecting to MetaMask...</p>;
  }

  if (!farmerAddress) {
    return <p>Please connect your MetaMask wallet</p>;
  }

return (
   <div className="portal-page">
      <div className="portal-container">
        <header className="portal-intro">
          <h1>Farmer Analysis & Storage</h1>
          <p>
            Complete the form below to generate your yield report. Once
            generated, you can upload it to the decentralized web (IPFS).
          </p>
        </header>

        <div className="tool-container">
          <div className="tool-image">
            <div className="tool-overlay">
              <h3>Secure Data</h3>
              <p>Yield reports are cryptographically signed and stored.</p>
            </div>
          </div>

  <YieldPredictor>
    {({ result, form }) => (
      <>
        <IpfsUploadButton
          farmerAddress={farmerAddress}
          result={result}
          form={form}
          onUploaded={setCid}
        />

        {cid && <MintReportNFT cid={cid} 
            farmerAddress={farmerAddress}
        />}

      </>
    )}
  </YieldPredictor>
  </div>
  </div>
      </div>
    
);

}
