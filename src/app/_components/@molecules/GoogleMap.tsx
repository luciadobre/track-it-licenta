import { useState } from "react";
import {
  GoogleMap as GMap,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

interface GoogleMapProps {
  onSelectAddress: (address: string) => void;
}

const mapConfig = {
  defaultCenter: { lat: 46.77121, lng: 23.623634 },
  defaultZoom: 10,
  selectedZoom: 15,
};

function GoogleMap({ onSelectAddress }: GoogleMapProps) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    const position = { lat, lng };

    setMarker(position);

    const geocoder = new google.maps.Geocoder();
    void geocoder.geocode({ location: position }, (results, status) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (status === "OK" && results?.[0]) {
        onSelectAddress(results[0].formatted_address);
      }
    });
  };

  if (!isLoaded) return <div>Harta se incarca</div>;

  return (
    <div className="w-full overflow-hidden rounded-lg border">
      <GMap
        mapContainerClassName="h-[300px] w-full max-w-full"
        center={marker ?? mapConfig.defaultCenter}
        zoom={marker ? mapConfig.selectedZoom : mapConfig.defaultZoom}
        onClick={handleMapClick}
      >
        {marker && <Marker position={marker} />}
      </GMap>
    </div>
  );
}

export default GoogleMap;
