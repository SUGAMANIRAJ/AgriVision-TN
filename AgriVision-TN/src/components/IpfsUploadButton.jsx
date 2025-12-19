import { useState } from "react";

export default function IpfsUploadButton({ result, form }) {
  const [loading, setLoading] = useState(false);
  const [cid, setCid] = useState(null);

  const upload = async () => {
    setLoading(true);

    const metadata = {
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
    setLoading(false);
  };

  return (
    <>
      <button onClick={upload} disabled={loading}>
        {loading ? "Uploading..." : "Upload to IPFS"}
      </button>
      {cid && <code>{cid}</code>}
    </>
  );
}
