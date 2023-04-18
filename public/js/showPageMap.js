mapboxgl.accessToken =mapToken ;
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v10',
  center: cup,
  zoom:10
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(cup)
.setPopup(
    new mapboxgl.Popup({offset:25})
        .setHTML(
            // cup here is cup.geometry.coordinates, you have to fix this.
            `<h3> ${cup} </h3>`
        )
)
.addTo(map)