import React, { useEffect, useState } from "react";
import DeckGL from "deck.gl";
import { Tile3DLayer } from "deck.gl";
import { Vector3 } from 'math.gl';
import {
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight
} from "@deck.gl/core";
import {MVTLayer} from '@deck.gl/geo-layers';
import { renderLayers } from "./RenderLayers";

var _dTiles = require("@loaders.gl/3d-tiles");
var count = 0;

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.5
});

const dirLight = new SunLight({
  timestamp: Date.UTC(2019, 7, 1, 23),
  color: [255, 255, 255],
  intensity: 3.0,
  _shadow: true
});

const mvt=()=>{
  const layer = new MVTLayer({
    id:"mvt",
    data: `https://termat.github.io/terrain3d/pbf/{z}/{x}/{y}.pbf`,
    minZoom: 12,
    maxZoom: 16,
    getLineColor: [192, 192, 192],
    getFillColor: [140, 170, 180],
    lineWidthMinPixels: 1,
    extruded: true,
    wireframe: false,
    filled: true,
    getElevation: function getElevation(d) {
      return d.properties.measuredHeight+d.properties.dem;
    }
  });
  return [layer];
};


const t3=()=>{
  var tile3dLayer = new Tile3DLayer({
    id: "tile3dlayer" + count,
    pointSize: 1,
    pickable: true,
    data: "27128_chuo-ku/tileset.json",
    loader: _dTiles.Tiles3DLoader,
    onClick: function onClick(d) {},
    onTilesetLoad: function onTilesetLoad(tileset) {

    },
    onTileLoad: function onTileLoad(tileHeader) {
      tileHeader.content.cartographicOrigin = new Vector3(
        tileHeader.content.cartographicOrigin.x,
        tileHeader.content.cartographicOrigin.y,
        tileHeader.content.cartographicOrigin.z - 35,
      );

      tileHeader.content.gltf.materials.forEach(function (m) {
        if (m.name === "default_material") {
          m.pbrMetallicRoughness.baseColorFactor = [0.0, 1, 0, 0.8];
          m.pbrMetallicRoughness.metallicFactor = 1;
          m.pbrMetallicRoughness.roughnessFactor = 0.6;
        }
      });
    }
  });
  return [tile3dLayer];
};

const App = () => {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    latitude: 34.79,
    longitude: 135.35,
    zoom: 15.0,
    minZoom:12.0,
    maxZoom:18.0,
    bearing: 0,
    pitch: 65,
    maxPitch: 89
  });

  const [effects] = useState(() => {
    const lightingEffect = new LightingEffect({ ambientLight, dirLight });
    lightingEffect.shadowColor = [0, 0, 0, 0.5];
    return [lightingEffect];
  });

  //resize
  useEffect(() => {
    const handleResize = () => {
      setViewport((v) => {
        return {
          ...v,
          width: window.innerWidth,
          height: window.innerHeight
        };
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <DeckGL
        layers={[renderLayers(),mvt()]}
//        effects={effects}
        initialViewState={viewport}
        controller={true}
      />
      <div className="attribution">
        <a href="https://maps.gsi.go.jp/development/ichiran.html" target="_blank">
          © 地理院タイル
        </a>{" "}
      </div>
    </>
  );
};

export default App;
