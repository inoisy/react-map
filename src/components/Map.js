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
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: clientsTransformed
                },
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50 
            });
            map.current.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'places',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6',
                        100,
                        '#f1f075',
                        750,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20,
                        100,
                        30,
                        750,
                        40
                    ]
                }
            });
                 
            map.current.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'places',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                }
            });
                
            map.current.addLayer({
                id: 'unclustered-point',
                type: 'circle',
                source: 'places',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-color': '#11b4da',
                    'circle-radius': 4,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': '#fff'
                }
            });

            map.current.on('click', 'clusters', (e) => {
                const features = map.current.queryRenderedFeatures(e.point, {
                    layers: ['clusters']
                });
                const clusterId = features[0].properties.cluster_id;
                map.current.getSource('places').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;
                        
                        map.current.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    }
                );
            });

            const popup = new mapboxgl.Popup({
                closeButton: false,
                closeOnClick: false
            });
             
            map.current.on('mouseenter', 'unclustered-point', (e) => {
                map.current.getCanvas().style.cursor = 'pointer';
                
                const coordinates = e.features[0].geometry.coordinates.slice();
                const description = e.features[0].properties.description;
                
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
                
                popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
            });
             
            map.current.on('mouseleave', 'unclustered-point', () => {
                map.current.getCanvas().style.cursor = '';
                popup.remove();
            });
            map.current.on('mouseenter', 'clusters', () => {
                map.current.getCanvas().style.cursor = 'pointer';
            });
            map.current.on('mouseleave', 'clusters', () => {
                map.current.getCanvas().style.cursor = '';
            });
        });
    });
    return (
        <div className="Map">
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}
