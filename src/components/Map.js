import React, { useRef, useEffect } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
 
mapboxgl.accessToken = 'pk.eyJ1IjoiaW5vaXN5IiwiYSI6ImNsM21xMDZidTA3NnEzaWw4MzAycmV4ejUifQ.jUP4pGo-40kFy5dxG3CDYg';
export default function Map(props) {
    const clientsTransformed = props.apps.map((item=>{
        return {
            'type': 'Feature',
            'properties': {
                'description':`<div>ID: ${item.id}</div>
                    <div>${props.clientsIdMapping[item.client_id]}</div>
                    <div>${item.price}&#8381;</div>
                `
            },
            'geometry': {
                'type': 'Point',
                'coordinates': [item.coords.long, item.coords.lat]
            }
        }
    }))
    const mapContainer = useRef(null);
    const map = useRef(null);
    useEffect(() => {
        if (map.current) return;
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [76.889709, 43.238949],
            zoom: 11
        });
        map.current.on('load', () => {
            map.current.addSource('places', {
                'type': 'geojson',
                'data': {
                    'type': 'FeatureCollection',
                    'features': clientsTransformed
                }
            });
            map.current.addLayer({
                'id': 'places',
                'type': 'circle',
                'source': 'places',
                'paint': {
                    'circle-color': '#4264fb',
                    'circle-radius': 6,
                    'circle-stroke-width': 2,
                    'circle-stroke-color': '#ffffff'
                }
            });
             
            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
             
            map.current.on('mouseenter', 'places', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;
                
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                
                popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
            });
             
            map.current.on('mouseleave', 'places', () => {
                map.current.getCanvas().style.cursor = '';
                popup.remove();
            });
        });
    });
    return (
        <div className="Map">
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}
