import React from 'react';
import L from 'leaflet';
import {
  MapContainer,
  TileLayer,
  Circle,
  Polyline,
  ImageOverlay,
  useMap,
  crs,
} from 'react-leaflet';
import utils from 'renderer/utils';
import radarIcon from '../../../assets/radarkebolak4.png';
// import radarIcon from 'https://i.imgur.com/kDDFvUp.png';

// const currentPosition = [-6.2839163, 106.6585511];
const currentPosition = [-6.8543788, 107.5867193];

const MarkerRadar = () => {
  const map = useMap();
  // const radiusCrossHair = 12100;
  const radiusCrossHair = 12100;
  const xyCoordinate = map.options.crs.project(L.latLng(currentPosition));

  const right = L.point(xyCoordinate).add([radiusCrossHair, 0]);
  const left = L.point(xyCoordinate).subtract([radiusCrossHair, 0]);
  const top = L.point(xyCoordinate).add([0, radiusCrossHair]);
  const bottom = L.point(xyCoordinate).subtract([0, radiusCrossHair]);

  const crossHairPolyline = [left, right, top, bottom].map((point) =>
    // const crossHairPolyline = [right, left, top, bottom].map((point) =>
    map.options.crs.unproject(point)
  );

  const radarBounds = new L.LatLngBounds(
    ...utils.sliceArrayIntoGroups(crossHairPolyline, 2)
  );

  return (
    <>
      {/* <div class="radar">
        <div class="pointer"> */}
      {[4000, 8000, 12000].map((radius) => {
        return (
          <Circle
            key={radius}
            center={currentPosition}
            radius={radius}
            pathOptions={{ color: '#4CA638', fill: false }}
          />
        );
      })}
      {utils
        .sliceArrayIntoGroups(crossHairPolyline, 2)
        .map((positions, index) => {
          return (
            <Polyline
              key={index}
              positions={positions}
              pathOptions={{ color: '#4CA638', fill: false }}
            />
          );
        })}
      <ImageOverlay
        url={radarIcon}
        bounds={radarBounds}
        opacity={1}
        zIndex={10}
        className="spin"
      />
      {/* </div>
      </div>
      ; */}
    </>
  );
};

const MainMap = () => {
  return (
    <div className="col-span-2 row-span-2 border-r border-slate-900">
      <MapContainer
        id="map"
        className="w-full h-full"
        center={currentPosition}
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerRadar />
      </MapContainer>
    </div>
  );
};

export default MainMap;
