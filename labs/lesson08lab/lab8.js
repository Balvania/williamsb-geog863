
  require(["esri/views/MapView", "esri/WebMap", "esri/widgets/LayerList"], 
  	(MapView, WebMap, LayerList) => {
    /************************************************************
     * Creates a new WebMap instance. A WebMap must reference
     * a PortalItem ID that represents a WebMap saved to
     * arcgis.com or an on-premise portal.
     *
     * To load a WebMap from an on-premise portal, set the portal
     * url with esriConfig.portalUrl.
     ************************************************************/
    const webmap = new WebMap({
      portalItem: {
        // autocasts as new PortalItem()
        id: "f2e9b762544945f390ca4ac3671cfa72"
      }
    });

    /************************************************************
     * Set the WebMap instance to the map property in a MapView.
     ************************************************************/
    const view = new MapView({
      map: webmap,
      container: "viewDiv"
    });

    const layerList = new LayerList({ 
        view: view,
        selectionEnabled: true,
        container: "layers-container"
    });

    //dynamically set header
    webmap.when(() => {
    	const title = webmap.portalItem.title;
    	document.getElementById("header-title").textContent = title;
  	});

  	let activeWidget;

  	const handleActionBarClick = ( event ) => {
	    const target = event.target; 
	    if (target.tagName !== "CALCITE-ACTION") {
	      return;
	    }

	    if (activeWidget) {
	      document.querySelector(`[data-action-id=${activeWidget}]`).active = false;
	      document.querySelector(`[data-panel-id=${activeWidget}]`).hidden = true;
	    }

	    const nextWidget = target.dataset.actionId;
	    if (nextWidget !== activeWidget) {
	      document.querySelector(`[data-action-id=${nextWidget}]`).active = true;
	      document.querySelector(`[data-panel-id=${nextWidget}]`).hidden = false;
	      activeWidget = nextWidget;
	    } else {
	      activeWidget = null;
	    }
	};

	document.querySelector("calcite-action-bar").addEventListener("click", handleActionBarClick);
  });

