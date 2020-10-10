// Create a map object
var myMap = L.map("mapid", {
    center: [40.77, -112.71],
    zoom: 3
  });
  
  // Add a tile layer
  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);
  
  var url="https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02";

  d3.json(url, function(data) {
      //console.log(data.features);
      dataFeatures=data.features;

      dataFeatures.forEach(function(event) {
          var mag= event.properties.mag;
          console.log(mag);
          var depth=event.geometry.coordinates[2];

          

          L.circle([event.geometry.coordinates[1], event.geometry.coordinates[0]], {
              color:'yellow',
              radius: mag * 100000,
              fillColor: 'orange'             
          }).bindPopup("<h3>Location: " + event.properties.place + "</h3> <hr><h3>Magnitude: " + event.properties.mag + "</h3><hr> <h3>Depth: "+event.geometry.coordinates[2]+"</h3>").addTo(myMap);
        });
      
  });