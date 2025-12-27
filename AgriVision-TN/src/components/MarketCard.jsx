import { useNavigate } from "react-router-dom";

export default function MarketCard({ item }) {
  const navigate = useNavigate();

  const imageUrl = `https://gateway.pinata.cloud/ipfs/${item.cid}`;

  return (
    <div className="card" onClick={() => navigate(`/farmer/${item.id}`)}>
      <img src={imageUrl} alt={item.crop} />

      <div className="card-body">
        <h3>{item.crop}</h3>
        <p className="price">{item.price} ETH</p>
        <span className="district">{item.district}</span>
      </div>
    </div>
  );
}
