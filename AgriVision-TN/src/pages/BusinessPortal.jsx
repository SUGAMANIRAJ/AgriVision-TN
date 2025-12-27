import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";
import { useEffect, useState } from "react";
import MarketCard from "../components/MarketCard"

export default function BusinessPortal() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchFarmers = async () => {
      const snapshot = await getDocs(collection(db, "farmers"));

      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(data);
    };

    fetchFarmers();
  }, []);

  return (
    <div className="grid">
      {items.map(item => (
        <MarketCard key={item.id} item={item} />
      ))}
    </div>
  );
}



