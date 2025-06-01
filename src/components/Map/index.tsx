import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';
import { searchCEP } from '../../utils/cep/searchCep';

// Componente para controlar a centralização do mapa
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const Map = () => {
  const [position, setPosition] = useState<[number, number]>([-23.5505, -46.6333]);
  const [address, setAddress] = useState<string>('');
  const [zoom, setZoom] = useState<number>(15);

  return (
    <div style={{ padding: '20px' }}>
      <input
        type="text"
        placeholder="Digite o CEP (ex: 11040221)"
        onChange={(e) => searchCEP({setAddress, setPosition, setZoom, cep: e.target.value})}
        style={{ width: '300px', padding: '8px', marginBottom: '10px' }}
      />
      {address && <p>Endereço: {address}</p>}
      
      <MapContainer
        center={position}
        zoom={zoom}
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
      >
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={DefaultIcon}>
          <Popup>{address || 'Localização do CEP'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};