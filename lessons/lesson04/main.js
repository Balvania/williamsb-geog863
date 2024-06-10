
 require(["esri/Map", "esri/views/MapView", "esri/geometry/Point", "esri/symbols/MarkerSymbol", "esri/layers/GraphicsLayer"], (Map, MapView, Point, MarkerSymbol, GraphicsLayer) => {
        const map = new Map({
          basemap: "topo-vector"
        });
        const view = new MapView({
          container: "viewDiv", // Reference to the view div created in step 5
          map: map, // Reference to the map object created before the view
          zoom: 4, // Sets zoom level based on level of detail (LOD)
          center: [-95, 40] // Sets center point of view using longitude,latitude
        });
        const pt = new Point({
          latitude: 40.792,
          longitude: -77.871
        });
        const sym = new SimpleMarkerSymbol({
          color: "blue",
          style: "square",
          size: 12
        });
        const ptGraphic = new Graphic({
          geometry:pt,
          symbol:sym
        });
        view.graphics.add(ptGraphic);
      });