import { useState } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import {db} from "../../config/firebase"


export default function IpfsUploadButton({ farmerAddress, result, form, onUploaded }) {
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState(null);

  const upload = async () => {
    setLoading(true);

    const metadata = {
      farmer_address: farmerAddress,
      input: form,
      output: result,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:3000/ipfs/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metadata),
    });

    const data = await res.json();
    setCid(data.cid);
    onUploaded(data.cid);

    await setDoc(doc(db, "farmers",farmerAddress), {
            farmer_address: farmerAddress,
            cid : data.cid,
            crop : form.crop,
            district : form.district
          });

    setLoading(false);

    

  };

  return (
    <>
    <br/>
    <br/>
      <button
        onClick={upload}
        disabled={loading}
        className="ipfs-upload-btn"
      >
        {loading ? "Uploading..." : "Upload to IPFS"}
      </button>
      <br/>
      <br/>
      {cid && <code className="ipfs-cid">{cid}</code>}

      <br/>
    <br/>
    </>
    
  );
}
