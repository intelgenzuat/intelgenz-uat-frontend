import React, { useState, useEffect, useMemo } from 'react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { geoNaturalEarth1, geoPath, geoCentroid } from 'd3-geo';
import * as topojson from 'topojson-client';

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    let diff = endAngle - startAngle;
    if (diff < 0) diff += 360;
    const largeArcFlag = diff <= 180 ? "0" : "1";
    return [
        "M", start.x, start.y, 
        "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
    ].join(" ");
}

const americas = [
    "United States of America", "Canada", "Mexico", "Brazil", "Argentina", 
    "Colombia", "Peru", "Venezuela", "Chile", "Ecuador", "Bolivia", 
    "Paraguay", "Uruguay", "Guyana", "Suriname", "French Guiana", 
    "Guatemala", "Honduras", "Nicaragua", "El Salvador", "Costa Rica", 
    "Panama", "Belize", "Greenland", "Cuba", "Haiti", "Dominican Rep.", "Puerto Rico"
];

export default function LiveThreatMap() {
    const [geographies, setGeographies] = useState([]);
    const [landMesh, setLandMesh] = useState(null);
    const [timeRange, setTimeRange] = useState("24h");
    const [hoveredCountry, setHoveredCountry] = useState(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const mapWidth = 900;
    const mapHeight = 550;
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;

    const projection = useMemo(() => {
        return geoNaturalEarth1()
            .scale(130)
            .translate([centerX, centerY + 45]);
    }, [centerX, centerY]);

    const pathGenerator = useMemo(() => geoPath().projection(projection), [projection]);

    useEffect(() => {
        fetch(geoUrl)
            .then(response => response.json())
            .then(data => {
                data.objects.countries.geometries = data.objects.countries.geometries.filter(d => d.properties.name !== "Antarctica");
                const geoJSON = topojson.feature(data, data.objects.countries);
                setGeographies(geoJSON.features);
                setLandMesh(topojson.mesh(data, data.objects.countries, (a, b) => a === b));
            })
            .catch(error => console.error("Error fetching map geometry:", error));
    }, []);

    const containerStyle = {
        width: '100%',
        height: '600px',
        position: 'relative',
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        border: 'none',
        marginBottom: '32px'
    };

    const zoomButtonStyle = {
        width: '32px',
        height: '32px',
        background: '#ffffff',
        border: '1px solid #d2c6d8',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
        color: '#6a5875',
        fontSize: '18px',
        fontWeight: 'bold',
        outline: 'none',
        padding: 0
    };

    return (
        <div className="live-threat-map-container" style={containerStyle}>
            {/* Header / Tabs */}
            <div style={{
                position: 'absolute',
                top: '32px',
                left: '32px',
                zIndex: 10,
                pointerEvents: 'none'
            }}>
                <h3 className="map-title" style={{ 
                    margin: 0, 
                    fontSize: '22px', 
                    fontWeight: '700', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    color: '#1a0e2a',
                    fontFamily: 'Inter, system-ui, sans-serif'
                }}>
                    Live Threat Map
                    <div style={{ 
                        width: '16px', 
                        height: '16px', 
                        borderRadius: '50%', 
                        background: '#7c1032', 
                        border: '3px solid #e1b4c3',
                        display: 'inline-block',
                        boxSizing: 'border-box'
                    }}></div>
                </h3>
            </div>
               
            {/* Legend / Time Filter Overlay */}
            <div className="map-legend-container" style={{ 
                position: 'absolute',
                top: '32px',
                right: '32px',
                zIndex: 10,
                display: 'flex', 
                background: '#fcfafc',
                padding: '6px',
                borderRadius: '50px',
                border: '1px solid #eae5ed',
                boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                pointerEvents: 'auto',
                gap: '4px'
            }}>
                {[
                    { label: '24h', value: '24h' },
                    { label: '7 Days', value: '7d' },
                    { label: '30 Days', value: '30d' },
                    { label: '90 Days', value: '90d' }
                ].map((tab) => {
                    const isActive = timeRange === tab.value;
                    return (
                        <button
                            key={tab.value}
                            onClick={() => setTimeRange(tab.value)}
                            className={`map-legend-btn ${isActive ? 'active' : ''}`}
                            style={{
                                background: isActive ? '#ffffff' : 'transparent',
                                color: isActive ? '#1a0e2a' : '#6a5875',
                                border: isActive ? '1px solid #d2c6d8' : '1px solid transparent',
                                borderRadius: '50px',
                                padding: '5px 14px',
                                fontSize: '11px',
                                fontWeight: isActive ? '600' : '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: isActive ? '0 2px 5px rgba(0,0,0,0.03)' : 'none',
                                outline: 'none',
                                fontFamily: 'Inter, system-ui, sans-serif'
                            }}
                        >
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <TransformWrapper
                initialScale={1}
                minScale={1}
                maxScale={4}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
                doubleClick={{ disabled: true }}
                panning={{ disabled: !isZoomed }}
                onTransform={(ref, state) => {
                    setIsZoomed(state.scale > 1.01);
                }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div style={{
                            position: 'absolute',
                            bottom: '24px',
                            right: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            zIndex: 10
                        }}>
                            <button onClick={() => zoomIn()} className="map-zoom-btn" style={zoomButtonStyle}>+</button>
                            <button onClick={() => zoomOut()} className="map-zoom-btn" style={zoomButtonStyle}>-</button>
                            <button onClick={() => resetTransform()} className="map-zoom-btn" style={zoomButtonStyle}>↺</button>
                        </div>
                        <TransformComponent wrapperStyle={{ width: "100%", height: "100%", cursor: isZoomed ? 'grab' : 'default' }} contentStyle={{ width: "100%", height: "100%", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox={`0 0 ${mapWidth} ${mapHeight}`} style={{ width: "100%", height: "100%", display: 'block' }}>
                        
                        <defs>
                            <filter id="mapShadow" x="-20%" y="-20%" width="140%" height="140%">
                                <feDropShadow dx="2" dy="8" stdDeviation="8" floodOpacity="0.08" floodColor="#000000" />
                            </filter>
                            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="var(--map-arc-start, #987eb3)" />
                                <stop offset="100%" stopColor="var(--map-arc-end, #ad5276)" />
                            </linearGradient>
                        </defs>
                        
                        {/* Background Shapes */}
                        <g>
                            {/* Dashed Circle */}
                            <circle cx={centerX} cy={centerY + 20} r={230} className="map-dashed-circle" fill="none" stroke="#a28ba6" strokeWidth={1} strokeDasharray="12 12" vectorEffect="non-scaling-stroke" style={{ transformOrigin: `${centerX}px ${centerY + 20}px` }} />
                            
                            {/* Connected Arc with Gradient */}
                            <path d={describeArc(centerX, centerY + 20, 195, 110, 5)} className="map-connected-arc" fill="none" stroke="url(#arcGradient)" strokeWidth={40} />
                        </g>

                        {/* Countries */}
                        <g filter="url(#mapShadow)">
                            {geographies.map((geo, i) => {
                                return (
                                    <path
                                        key={`geo-${i}`}
                                        d={pathGenerator(geo)}
                                        className="map-country-path"
                                        fill="#ffffff"
                                        stroke="none"
                                        vectorEffect="non-scaling-stroke"
                                        style={{ outline: "none", cursor: 'default', transition: 'fill 0.2s' }}
                                    />
                                );
                            })}
                        </g>

                        {/* Land Boundary */}
                        <g>
                            {landMesh && (
                                <path
                                    d={pathGenerator(landMesh)}
                                    fill="none"
                                    stroke="#5c3c75"
                                    strokeWidth={0.5}
                                    vectorEffect="non-scaling-stroke"
                                />
                            )}
                        </g>

                        {/* Popups and Lines */}
                        <g>
                            {(() => {
                                const defaultMarkers = [
                                    { name: "Canada", dx: -70, dy: -50, align: "end" },
                                    { name: "United States of America", dx: -100, dy: 30, align: "end" },
                                    { name: "Brazil", dx: -60, dy: 70, align: "end" },
                                    { name: "South Africa", dx: 10, dy: 100, align: "center" },
                                    { name: "Australia", dx: 80, dy: 60, align: "start" },
                                    { name: "Russia", dx: 70, dy: -60, align: "start" }
                                ];
                                
                                const defaultNames = defaultMarkers.map(m => m.name);
                                const countriesToShow = geographies.filter(g => defaultNames.includes(g.properties.name)).map(g => {
                                    const marker = defaultMarkers.find(m => m.name === g.properties.name);
                                    return { geo: g, ...marker };
                                });

                                return countriesToShow.map((item, idx) => {
                                    const centroid = geoCentroid(item.geo);
                                    const coords = projection(centroid);
                                    if (!coords) return null;
                                    const [x, y] = coords;
                                    
                                    let anchorX, anchorY, boxX, boxY;

                                    if (item.dx !== null) {
                                        anchorX = x + item.dx;
                                        anchorY = y + item.dy;
                                        if (item.align === 'end') boxX = anchorX - 190;
                                        else if (item.align === 'center') boxX = anchorX - 95;
                                        else boxX = anchorX + 10;
                                        boxY = anchorY - 32;
                                    } else {
                                        anchorX = x + 60;
                                        anchorY = y - 60;
                                        boxX = anchorX + 10;
                                        boxY = anchorY - 32;
                                        if (x > mapWidth / 2) {
                                            anchorX = x - 60;
                                            boxX = anchorX - 190;
                                        }
                                    }

                                    return (
                                        <g key={`popup-${idx}`}>
                                            {/* Dashed line */}
                                            <line x1={x} y1={y} x2={anchorX} y2={anchorY} className="map-popup-line" stroke="#b82d61" strokeDasharray="2 3" strokeWidth="1" />
                                            
                                            {/* Map Dot */}
                                            <circle cx={x} cy={y} r="3" className="map-dot-center" fill="#691632" />
                                            <circle cx={x} cy={y} r="5" className="map-dot-pulse" fill="none" stroke="#db2760" strokeWidth="1.5" />
                                            
                                            {/* Anchor Dot */}
                                            <circle cx={anchorX} cy={anchorY} r="3" className="map-dot-anchor" fill="#603770" />
                                            
                                            <foreignObject x={boxX} y={boxY} width={200} height={80} style={{ overflow: 'visible', pointerEvents: 'none' }}>
                                                <div className="map-tooltip-container" style={{
                                                    background: '#ffffff',
                                                    border: '1px solid #f2ecf4',
                                                    borderRadius: '8px',
                                                    padding: '10px 12px',
                                                    boxShadow: '0 8px 30px rgba(0,0,0,0.06)',
                                                    width: '180px',
                                                    boxSizing: 'border-box',
                                                    fontFamily: 'Inter, system-ui, sans-serif'
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
                                                        <span className="map-tooltip-val" style={{ fontWeight: '700', color: '#160b21', fontSize: '14px' }}>12,20269.00</span>
                                                        <span className="map-tooltip-time" style={{ color: '#887994', fontSize: '10px', fontWeight: '500' }}>05:30 am</span>
                                                    </div>
                                                    <div className="map-tooltip-country" style={{ color: '#887994', fontSize: '10px', fontWeight: '500', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {item.geo.properties.name}
                                                    </div>
                                                </div>
                                            </foreignObject>
                                        </g>
                                    );
                                });
                            })()}
                        </g>
                            </svg>
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}
