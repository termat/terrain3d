import { TerrainLayer } from "deck.gl";

const TERRAIN_IMAGE = `https://www.termat.net/dem/{z}/{x}/{y}`;
const SURFACE_IMAGE = 'https://cyberjapandata.gsi.go.jp/xyz/seamlessphoto/{z}/{x}/{y}.jpg';

const ELEVATION_DECODER = {
  rScaler: 6553.6,
  gScaler: 25.6,
  bScaler: 0.1,
  offset: -10000
};

export function renderLayers(props) {
  const layer = new TerrainLayer({
    id: "terrain",
    minZoom: 0,
    maxZoom: 15,
    strategy: "no-overlap",
    elevationDecoder: ELEVATION_DECODER,
    elevationData: TERRAIN_IMAGE,
    texture: SURFACE_IMAGE,
    wireframe: false,
    color: [0, 0, 0]
  });

  return [layer];
}
