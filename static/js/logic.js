var layers={
    earthquakes: new L.layerGroup(),
    tectonics: new L.layerGroup(),
    tornadoes: new L.layerGroup()
};

// Create a map object
var myMap = L.map("mapid", {
    center: [0, 0],
    zoom: 3,
    layers: [layers.earthquakes]
});
  
  // Add a tile layer
  var satellite=L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 20,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

  var street= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var light= L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
  });

  
  
  var url="https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";

  d3.json(url, function(data) {
      //console.log(data.features);
      dataFeatures=data.features;


        var depthArray=[]
      dataFeatures.forEach(function(event) {
          var mag= event.properties.mag;
          //console.log(mag);
          var depth=event.geometry.coordinates[2];
          depthArray.push(depth);
          //console.log(depth);

          color="white"
          if (depth<25) {
              color='#fcbba1'
            }else if (depth<50) {
                color="#fc9272"
            }else if (depth<75) {
                color="#fb6a4a"
            }else if (depth<100) {
                color="#ef3b2c"
            }else if (depth<150) {
                color="#cb181d"
            }else if (depth>=150) {
                color="#99000d"
            }

          var newCircle=L.circle([event.geometry.coordinates[1], event.geometry.coordinates[0]], {
              color: 'black',
              radius: (mag*2) * 50000,
              fillColor: color,
              fillOpacity: 0.8      
          }).bindPopup("<h3>Location: " + event.properties.place + "</h3> <hr><h3>Magnitude: " + event.properties.mag + "</h3><hr> <h3>Depth: "+event.geometry.coordinates[2]+"</h3>").addTo(myMap);
          newCircle.addTo(layers['earthquakes']);
        });


        var baseLayers= {
            "Satellite": satellite,
            "Street": street,
            "Light": light
        };

        
        var overlays= {
            "Earthquakes": layers["earthquakes"],
            "Tectonic Plates": layers["tectonics"]
        };

        L.control.layers(baseLayers, overlays, {collapsed:false}).addTo(myMap);

        //Create a legend to display information about our map
        var info = L.control({
            position: "bottomright"
        });

        // When the layer control is added, insert a div with the class of "legend"
        info.onAdd = function() {
            var div = L.DomUtil.create("div", "legend")
            return div;
            };
        // Add the info legend to the map
            info.addTo(myMap);

        document.querySelector(".legend").innerHTML= [
            "<p>Eartquake<br>Depth Scale</p>",
            "<p class='first'>Depth < 25</p>",
            "<p class='second'>Depth < 50</p>",
            "<p class='third'>Depth < 75</p>",
            "<p class='fourth'>Depth < 100</p>",
            "<p class='fifth'>Depth < 150</p>",
            "<p class='sixth'>Depth > 150</p>"
        ].join("");


    });

    var geoURL= "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

    d3.json(geoURL, function(data) {
        var features=(data.features);

        features.forEach(function(feature) {
            var type= feature.geometry.type;
            //console.log(type);
            var coords= feature.geometry.coordinates;
            //console.log(coords);

            var lines= [{
                "type": type,
                "coordinates": coords
            }];

            var lineStyle={
                "color": "yellow",
                "weight": 2
            };

            var newLine=L.geoJSON(lines, {style: lineStyle});
            newLine.addTo(layers['tectonics']);
        });
    });


