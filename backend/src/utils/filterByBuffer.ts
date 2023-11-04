interface Coordinates {
  latitude: number;
  longitude: number;
}

const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const radLat1 = (Math.PI * coord1.latitude) / 180;
  const radLat2 = (Math.PI * coord2.latitude) / 180;
  const theta = coord1.longitude - coord2.longitude;
  const radTheta = (Math.PI * theta) / 180;
  let dist =
    Math.sin(radLat1) * Math.sin(radLat2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta); // funções seno e cosseno para converter coordenadas vertical e horizontal
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515; // Milhas
  dist = dist * 1.609344; // Quilometros
  return dist;
};

const filterByBuffer = (
  bufferCenter: Coordinates,
  bufferRadius: number,
  itemCoords: Coordinates
): boolean => {
  const distance = calculateDistance(bufferCenter, itemCoords);
  return distance <= bufferRadius;
};

export default filterByBuffer;
