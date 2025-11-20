'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import L, {
  type LatLngExpression,
  type Marker as LeafletMarker,
} from 'leaflet';
import type { SearchResult } from 'leaflet-geosearch/dist/providers/provider.js';
import GeoSearch from './GeoSearch';
import { api } from '@/shared/lib/axios';

const redIcon = new L.Icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapClickHandler = ({
  setPosition,
}: {
  setPosition: (pos: LatLngExpression) => void;
}) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
    },
  });
  return null;
};

const DraggableMarkerWithPopup = ({
  position,
  setPosition,
}: {
  position: LatLngExpression;
  setPosition: (pos: LatLngExpression) => void;
}) => {
  const markerRef = useRef<LeafletMarker>(null);
  const [address, setAddress] = useState('Loading address...');
  const [isFetchingAddress, setIsFetchingAddress] = useState(false);

  const fetchAddress = useCallback(async (lat: number, lng: number) => {
    setIsFetchingAddress(true);
    setAddress('Loading address...');

    try {
      const response = await api.get('/geocode/reverse', {
        params: { lat, lon: lng },
      });

      if (response.data && response.data.display_name) {
        setAddress(response.data.display_name);
      } else if (response.data && response.data.address) {
        const addr = response.data.address;
        const parts: string[] = [];
        if (addr.road) parts.push(addr.road);
        if (addr.neighbourhood) parts.push(addr.neighbourhood);
        if (addr.suburb) parts.push(addr.suburb);
        if (addr.city || addr.town || addr.village) {
          parts.push(addr.city || addr.town || addr.village);
        }
        if (addr.state) parts.push(addr.state);
        if (addr.country) parts.push(addr.country);

        if (parts.length > 0) {
          setAddress(parts.join(', '));
        } else {
          setAddress('Location selected');
        }
      } else {
        setAddress('Location selected');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setAddress('Location selected');
    } finally {
      setIsFetchingAddress(false);
    }
  }, []);

  useEffect(() => {
    if (Array.isArray(position) && position.length === 2) {
      fetchAddress(position[0], position[1]);
    }

    const marker = markerRef.current;
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 500);
    }
  }, [position, fetchAddress]);

  useEffect(() => {
    const marker = markerRef.current;
    if (marker) {
      const handleDragEnd = () => {
        const newPos = marker.getLatLng();
        setPosition([newPos.lat, newPos.lng]);
        fetchAddress(newPos.lat, newPos.lng);
      };

      marker.on('dragend', handleDragEnd);

      return () => {
        marker.off('dragend', handleDragEnd);
      };
    }
  }, [setPosition, fetchAddress]);

  return (
    <Marker draggable={true} position={position} ref={markerRef} icon={redIcon}>
      <Popup autoClose={false} closeOnClick={false}>
        <div className="max-h-24 overflow-y-auto text-sm">
          {isFetchingAddress ? 'Loading...' : address}
        </div>
      </Popup>
    </Marker>
  );
};

interface MapPickerProps {
  position: LatLngExpression;
  setPosition: (position: LatLngExpression) => void;
  fullHeight?: boolean;
  className?: string;
}

const MapSizeUpdater = ({ map }: { map: React.RefObject<L.Map | null> }) => {
  useEffect(() => {
    if (map.current) {
      const timer = setTimeout(() => {
        map.current?.invalidateSize();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [map]);

  return null;
};

const MapPicker = ({
  position,
  setPosition,
  fullHeight = false,
  className = '',
}: MapPickerProps) => {
  const map = useRef<L.Map>(null);

  const handleLocationSelect = (location: SearchResult) => {
    const newPos: LatLngExpression = [location.y, location.x];
    setPosition(newPos);
    if (map.current) {
      map.current.flyTo(newPos, 15);
    }
  };

  useEffect(() => {
    if (map.current) {
      const timers: NodeJS.Timeout[] = [];

      timers.push(
        setTimeout(() => {
          map.current?.invalidateSize();
        }, 100)
      );

      timers.push(
        setTimeout(() => {
          map.current?.invalidateSize();
        }, 500)
      );

      timers.push(
        setTimeout(() => {
          map.current?.invalidateSize();
        }, 1000)
      );

      return () => {
        timers.forEach((timer) => clearTimeout(timer));
      };
    }
  }, [fullHeight]);

  const containerClasses = fullHeight
    ? `absolute inset-0 w-full h-full overflow-hidden z-0 ${className}`
    : `relative h-80 w-full rounded-lg overflow-hidden border border-gray-300 z-0 ${className}`;

  return (
    <div className={containerClasses}>
      <div className="absolute top-4 right-4 z-[1000] w-11/12 sm:w-auto">
        <GeoSearch onLocationSelect={handleLocationSelect} />
      </div>
      <MapContainer
        ref={map}
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        key={fullHeight ? 'full-height' : 'normal'}
      >
        <MapSizeUpdater map={map} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler setPosition={setPosition} />
        <DraggableMarkerWithPopup
          position={position}
          setPosition={setPosition}
        />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
