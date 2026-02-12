'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api'

const containerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '20px',
    border: '2px solid rgba(0, 242, 96, 0.2)'
}

const PAKISTAN_CITIES = [
    { name: 'Lahore', lat: 31.5497, lng: 74.3436 },
    { name: 'Karachi', lat: 24.8607, lng: 67.0011 },
    { name: 'Islamabad', lat: 33.6844, lng: 73.0479 },
    { name: 'Rawalpindi', lat: 33.5651, lng: 73.0169 },
    { name: 'Peshawar', lat: 34.0151, lng: 71.5249 },
    { name: 'Quetta', lat: 30.1798, lng: 66.9750 },
    { name: 'Faisalabad', lat: 31.4181, lng: 73.0776 },
    { name: 'Multan', lat: 30.1575, lng: 71.5249 },
    { name: 'Hyderabad', lat: 25.3960, lng: 68.3578 },
    { name: 'Gujranwala', lat: 32.1617, lng: 74.1883 },
    { name: 'Sialkot', lat: 32.4945, lng: 74.5229 },
    { name: 'Bahawalpur', lat: 29.3956, lng: 71.6836 },
]

const mapOptions = {
    styles: [
        { elementType: "geometry", stylers: [{ color: "#0a0a2e" }] },
        { elementType: "labels.text.stroke", stylers: [{ color: "#0a0a2e" }] },
        { elementType: "labels.text.fill", stylers: [{ color: "#00f5a0" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#1a1a3e" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d7377" }] },
    ],
    disableDefaultUI: false,
    zoomControl: true,
}

export default function MapComponent({ searchKeyword = '' }) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
    const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: apiKey, libraries: ['places'] })

    const [map, setMap] = useState(null)
    const [center, setCenter] = useState({ lat: 31.5497, lng: 74.3436 }) // Default Lahore
    const [markers, setMarkers] = useState([])
    const [selectedPlace, setSelectedPlace] = useState(null)
    const [status, setStatus] = useState('')
    const [searchType, setSearchType] = useState('pharmacy') // 'pharmacy' or 'hospital'

    const searchPlaces = useCallback((type, keyword = '') => {
        if (!map || !window.google) return

        setStatus(`Searching for ${type}s...`)
        const service = new window.google.maps.places.PlacesService(map)
        const request = {
            location: center,
            radius: 5000,
            type: [type],
            keyword: keyword || type
        }

        service.nearbySearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
                setMarkers(results)
                setStatus(`Found ${results.length} ${type}s nearby.`)
            } else {
                setMarkers([])
                setStatus(`No ${type}s found in this area.`)
            }
        })
    }, [map, center])

    useEffect(() => {
        if (isLoaded && map) {
            searchPlaces(searchType, searchKeyword)
        }
    }, [isLoaded, map, searchType, searchKeyword, searchPlaces])

    const handleCityChange = (e) => {
        const city = PAKISTAN_CITIES.find(c => c.name === e.target.value)
        if (city) {
            setCenter({ lat: city.lat, lng: city.lng })
            map?.panTo({ lat: city.lat, lng: city.lng })
        }
    }

    const getUserLocation = () => {
        if (navigator.geolocation) {
            setStatus('Getting your location...')
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude }
                    setCenter(pos)
                    map?.panTo(pos)
                    setStatus('Location found!')
                },
                () => setStatus('Location access denied. Using default city.')
            )
        }
    }

    if (!isLoaded) return <div style={{ color: 'white' }}>Loading Maps...</div>

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '1rem'
            }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                    <select
                        onChange={handleCityChange}
                        style={{
                            background: '#0a0a2e',
                            color: 'white',
                            padding: '0.8rem',
                            borderRadius: '10px',
                            border: '1px solid #0d7377',
                            flex: 1,
                            minWidth: '150px'
                        }}
                    >
                        <option value="">Select City...</option>
                        {PAKISTAN_CITIES.map(city => <option key={city.name} value={city.name}>{city.name}</option>)}
                    </select>

                    <button
                        onClick={getUserLocation}
                        style={{
                            background: 'rgba(0, 242, 96, 0.1)',
                            color: '#00f260',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '10px',
                            border: '1px solid #00f260',
                            cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        📍 Use My Location
                    </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <button
                        onClick={() => setSearchType('pharmacy')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: searchType === 'pharmacy' ? 'linear-gradient(135deg, #00f260 0%, #0575e6 100%)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        💊 Medicine Stores
                    </button>
                    <button
                        onClick={() => setSearchType('hospital')}
                        style={{
                            flex: 1,
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            background: searchType === 'hospital' ? 'linear-gradient(135deg, #ff4b2b 0%, #ff416c 100%)' : 'rgba(255,255,255,0.05)',
                            color: 'white',
                            fontWeight: '700',
                            cursor: 'pointer'
                        }}
                    >
                        🏥 Find Hospitals
                    </button>
                </div>
                {status && <p style={{ color: '#00f260', fontSize: '0.85rem', textAlign: 'center', margin: 0 }}>{status}</p>}
            </div>

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={13}
                onLoad={setMap}
                options={mapOptions}
            >
                {markers.map((place, i) => (
                    <Marker
                        key={i}
                        position={place.geometry.location}
                        onClick={() => setSelectedPlace(place)}
                        label={(i + 1).toString()}
                        icon={searchType === 'hospital' ? {
                            url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                        } : {
                            url: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                        }}
                    />
                ))}

                {selectedPlace && (
                    <InfoWindow
                        position={selectedPlace.geometry.location}
                        onCloseClick={() => setSelectedPlace(null)}
                    >
                        <div style={{ color: '#000', padding: '10px', maxWidth: '200px' }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{selectedPlace.name}</h3>
                            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem' }}>{selectedPlace.vicinity}</p>
                            <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>
                                ⭐ {selectedPlace.rating || 'N/A'} ({selectedPlace.user_ratings_total || 0})
                            </p>
                            <div style={{ display: 'flex', gap: '5px' }}>
                                <a
                                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.geometry.location.lat()},${selectedPlace.geometry.location.lng()}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                        background: '#0d7377',
                                        color: 'white',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        textDecoration: 'none',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    Directions
                                </a>
                            </div>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
                marginTop: '1.5rem'
            }}>
                {markers.map((place, i) => (
                    <div key={i} style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '16px',
                        padding: '1.25rem',
                        cursor: 'pointer'
                    }} onClick={() => {
                        setSelectedPlace(place)
                        map?.panTo(place.geometry.location)
                    }}>
                        <h4 style={{ color: 'white', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: '#00f260' }}>{i + 1}.</span> {place.name}
                        </h4>
                        <p style={{ color: '#888', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>{place.vicinity}</p>
                        <p style={{ color: '#ffd700', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                            ⭐ {place.rating || 'N/A'} ({place.user_ratings_total || 0} reviews)
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${place.geometry.location.lat()},${place.geometry.location.lng()}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    flex: 1,
                                    background: 'rgba(13, 115, 119, 0.2)',
                                    color: '#00f5a0',
                                    border: '1px solid #0d7377',
                                    padding: '0.5rem',
                                    borderRadius: '8px',
                                    textDecoration: 'none',
                                    textAlign: 'center',
                                    fontSize: '0.85rem'
                                }}
                            >
                                Directions
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
