import React from "react";

import { Wrapper } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { formatMoney, formatNumber } from "../../utils/utils";

interface MapProps extends google.maps.MapOptions {
  style?: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  onCenterChange?: (map: google.maps.Map) => void;
  onBoundsChange?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
}

interface MapViewProps {
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  onCenterChange?: (map: google.maps.Map) => void;
  onBoundsChange?: (map: google.maps.Map) => void;
  center: google.maps.LatLngLiteral;
  focusedMarker?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: {
    price: string;
    lat: number;
    lng: number;
  }[];
}

const MapView: React.FC<MapViewProps> = ({
  onClick,
  onIdle,
  onCenterChange,
  onBoundsChange,
  center,
  zoom,
  markers = [],
  focusedMarker,
}) => {
  return (
    <>
      <Map
        fullscreenControl={false}
        rotateControl={false}
        streetViewControl={false}
        mapTypeControl={false}
        zoomControl={false}
        scrollwheel={true}
        center={center}
        onClick={onClick}
        onCenterChange={onCenterChange}
        onIdle={onIdle}
        zoom={zoom}
        style={{ flexGrow: "1", height: "100%" }}
      >
        {markers?.map((item, i) => (
          <Marker
            clickable
            key={i}
            position={item}
            icon={
              focusedMarker &&
              JSON.stringify(focusedMarker) ===
                JSON.stringify({ lat: item.lat, lng: item.lng })
                ? "/images/map/marker_yellow.png"
                : "/images/map/marker.png"
            }
            label={{
              text: formatNumber(item.price) ?? "",
              className: "marker-label",
            }}
          />
        ))}
      </Map>
    </>
  );
};

export const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  onCenterChange,
  onBoundsChange,
  children,
  style,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<google.maps.Map>();

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle", "bounds_changed", "center_changed"].forEach(
        (eventName) => google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }

      if (onCenterChange) {
        map.addListener("center_changed", () => onCenterChange(map));
      }

      if (onBoundsChange) {
        map.addListener("bounds_changed", () => onBoundsChange(map));
      }
    }
  }, [map, onClick, onIdle, onCenterChange, onBoundsChange]);

  return (
    <>
      <div ref={ref} style={style} className="rounded-lg" />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          //@ts-ignore
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};

export const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const deepCompareEqualsForMaps = createCustomEqual(
  //@ts-ignore
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    //@ts-ignore
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

export default MapView;
