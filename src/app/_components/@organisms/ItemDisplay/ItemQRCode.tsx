import { useState } from "react";
import Image from "next/image";
import QRCode from "qrcode";
import Button from "../../@atoms/Button";

type ItemQRCodeProps = {
  itemId: number;
};

const ItemQRCode = ({ itemId }: ItemQRCodeProps) => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQR = async () => {
    const url = `${window.location.origin}/dashboard/inventory/${itemId}`;
    setQrCodeUrl(await QRCode.toDataURL(url, { width: 200, margin: 2 }));
  };

  return (
    <div className="space-y-4 text-center">
      <Button
        size="sm"
        intent="secondary"
        onClick={generateQR}
        text={qrCodeUrl ? "Regenereaza QR" : "Genereaza QR"}
      />

      {qrCodeUrl && (
        <div className="inline-block rounded-lg bg-white p-3">
          <Image src={qrCodeUrl} alt="Cod QR articol" width={200} height={200} />
        </div>
      )}
    </div>
  );
};

export default ItemQRCode;
