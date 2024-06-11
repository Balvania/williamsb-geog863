let home_long = 29.0000;
let home_lat = -15.4167;
 
require(["esri/Map", "esri/views/MapView", "esri/geometry/Point", "esri/symbols/SimpleMarkerSymbol", "esri/Graphic"], (Map, MapView, Point, SimpleMarkerSymbol, Graphic) => {
        const map = new Map({
          basemap: "topo-vector"
        });
        const view = new MapView({
          container: "viewDiv", // Reference to the view div created in step 5
          map: map, // Reference to the map object created before the view
          zoom: 4, // Sets zoom level based on level of detail (LOD)
          center: [home_long, home_lat] // Sets center point of view using longitude,latitude
        });
        const pt = new Point({
          latitude: home_lat,
          longitude: home_long
        });
        const sym = new SimpleMarkerSymbol({
          color: "blue",
          style: "square",
          size: 12
        });
        const ptGraphic = new Graphic({
          geometry: pt,
          symbol: sym,
        });
        view.graphics.add(ptGraphic);
      });