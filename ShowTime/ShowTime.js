    require([
      "esri/config",
      "esri/core/reactiveUtils",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/widgets/TimeSlider",
      "esri/widgets/TimeSlider/TimeSliderViewModel",
      "esri/TimeInterval",
      "esri/widgets/Expand",
      "esri/widgets/Legend",
      "esri/widgets/TimeZoneLabel"
    ], (
        esriConfig,
        reactiveUtils,
        Map,
        MapView,
        FeatureLayer,
        TimeSlider,
        TimeSliderVM,
        TimeInterval,
        Expand,
        Legend,
        TimeZoneLabel
      ) => {


      esriConfig.apiKey= "AAPTxy8BH1VEsoebNVZXo8HurGXJlgk9xdfpa0TTnBcauOpVrTqXVoKQed7vZaZ5IDakouaJ3hhnz89sQuIMIe9WpsS-EJpM8e0nKXDZceXTZBg51XBG6XQ9vr4TevgRt1GEbcSHL3X-YE5Ye2UwjKZEjXvQkJyFAkQgOWvuZRqyLL7Gw4GQkYJ770XIcpKgeQ2zCpR-TX55qbg0B_ryGnOkrIfIFAkD0RUbcXedsoGFq74enAXq90mf08FNUZPiryiHAT1_0iCT7va8";

      const elephantLyr = new FeatureLayer({
      	portalItem: { 
		  id: "d43cea74de224770a8bedbd58b770cb2"//ID at sapfira.maps.arcgis.com
		},
      });

      const map = new Map({
        basemap: "hybrid",
        layers: [elephantLyr]
      });

      const view = new MapView({
        map: map,
        container: "viewDiv",
        zoom: 12,
        center: [25.97,-15.89]
      });


      // time slider widget initialization
      const timeSlider = new TimeSlider({
        container: "timeSlider",
        view: view,		//this shows only points included in time view
        mode: "time-window",
        timeVisible: true, // show the time stamps on the timeslider
        playRate: 200,
        loop: true,
      });
      view.ui.add(timeSlider);


      	/*********************************
		* Initialize time slider widget
		*********************************

		// Create a time slider to update layerView filter
		const timeSlider = new TimeSlider({
			container: "timeSlider",
			view: view,
			mode: "instant",
			timeVisible: true, // show the time stamps on the timeslider
			loop: true
		});
		//view.ui.add(timeSlider); //what does the manual do?

		*/

      // add the UI for a title
      view.ui.add("titleDiv", "top-right");


      view.whenLayerView(elephantLyr).then((lv) => {
        // around up the full time extent to full hour
        timeSlider.fullTimeExtent = elephantLyr.timeInfo.fullTimeExtent.expandTo("hours");
        timeSlider.timeExtent = {
        	start: new Date("5/24/2023"),
        	end: new Date("5/25/2023")
        };
        timeSlider.stops = {
		    interval: {
	          	value: 1,
	          	unit: "hours"
	      	} 
      	};
      });


/*
      	//try this instead
	let timeLayerView;
	 view.whenLayerView(elephantLyr).then((layerView) => {
        // around up the full time extent to full hour
        timeLayerView = layerView;
        timeSlider.fullTimeExtent = elephantLyr.timeInfo.fullTimeExtent;
        timeSlider.timeExtent = {
        	start: null,
        	end: timeSlider.fullTimeExtent.start
        };
        timeSlider.stops = {
        //  interval: elephantLyr.timeInfo.interval
        	interval: {
        		value: 1,
        		unit: "days",
        	}
        };
      });


/*
	reactiveUtils.watch(
	  () => timeSlider.timeExtent,
	  (value) => {
	    // update layer view filter to reflect current timeExtent
	    timeLayerView.filter = {
	      timeExtent: value
	    };
	  }
	);
	*/

	//console.log("The layer's time interval is ", elephantLyr.timeInfo.interval.value, " ", elephantLyr.timeInfointerval.unit);



      // calcite input time zone component allows users to pick from one of the IANA
      // time zones without having to add the time zones manually to a drop down
      const timezonePicker = document.getElementById("timezone-picker");
      view.ui.add("timezone-picker", "top-right");

      // Change the map view's time zone when user picks a time zone from the component
      timezonePicker.addEventListener("calciteInputTimeZoneChange", () => {
        view.timeZone = timezonePicker.value;
      });


       // TimeZoneLabel lets users know what the time zone of the view is.
       // This provides an important context to users how the date and times are displayed
      view.ui.add(new TimeZoneLabel({ view: view }), "top-left");

      const legend = new Legend({
        view: view
      });
      const legendExpand = new Expand({
        expandIcon: "legend",
        expandTooltip: "Legend",
        view: view,
        content: legend,
        expanded: false
      });
      view.ui.add(legendExpand, "top-left");



	  timeSlider.play();

	  reactiveUtils.watch(
		  () => timeSlider.timeExtent,
		  (timeExtent) => {
		    console.log("Time extent now starts at", timeExtent.start, "and finishes at:", timeExtent.end);
		  }
	  );

    });

