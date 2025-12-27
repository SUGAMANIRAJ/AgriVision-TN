export default function FarmerDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const snap = await getDoc(doc(db, "farmers", id));
      if (snap.exists()) setItem(snap.data());
    };
    fetchItem();
  }, [id]);

  if (!item) return <p className="loading">Loading...</p>;

  const imageUrl = `https://gateway.pinata.cloud/ipfs/${item.cid}`;

  return (
    <div className="details-container">
      <div className="details-card">
        
        <img src={imageUrl} alt={item.crop} className="details-image" />

        <div className="details-info">
          <h2>{item.crop}</h2>

          <p className="price">{item.price} ETH</p>

          <p><b>District:</b> {item.district}</p>
          <p><b>Farmer Address:</b> {item.farmer_address}</p>

          <p className="tx">
            <b>Transaction:</b><br />
            {item.tx_hash}
          </p>

          <button className="buy-btn">
            Buy Now
          </button>

        </div>
      </div>
    </div>
  );
}
