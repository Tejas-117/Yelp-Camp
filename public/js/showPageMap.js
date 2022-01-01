mapboxgl.accessToken = mapToken;

console.log(campground.geometry.coordinates);
// render map
const map = new mapboxgl.Map({
   container: 'map',
   style: 'mapbox://styles/mapbox/streets-v11', 
   center: campground.geometry.coordinates, 
   zoom: 8
});

//  create marker
const marker = new mapboxgl.Marker()
    .setLngLat(campground.geometry.coordinates)
    .setPopup(
       new mapboxgl.Popup().setHTML(`<h3>${campground.title}</h3>`)
    )
    .addTo(map);

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());