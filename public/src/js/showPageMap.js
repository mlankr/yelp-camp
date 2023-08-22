mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
    center: campgroundData.geometry.coordinates, // starting position [lng, lat]
    zoom: 6 // starting zoom
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

// Create a default Marker and add it to the map.
const marker = new mapboxgl.Marker({color: 'red'})
    .setLngLat(campgroundData.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
            .setHTML(
                `<h4>${campgroundData.title}</h4><p>${campgroundData.location}</p>`
            )
    )
    .addTo(map);