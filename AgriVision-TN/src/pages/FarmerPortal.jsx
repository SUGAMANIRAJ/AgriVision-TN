import YieldPredictor from "../components/YieldPredictor";
import IpfsUploadButton from "../components/IpfsUploadButton";

export default function FarmerPortal() {
  return (
    <YieldPredictor>
      {({ result, form }) => (
        <IpfsUploadButton result={result} form={form} />
      )}
    </YieldPredictor>
  );
}
