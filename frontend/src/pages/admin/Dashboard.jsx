import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Fix for default marker icon issue in Leaflet with Webpack/Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalReports: 0,
        reportsInProcess: 0,
        reportsCompleted: 0,
        yearlyStats: [],
        monthlyStats: [],
        weeklyStats: [],
        regions: []
    });
    const [chartFilter, setChartFilter] = useState('year'); // 'year', 'month', 'week'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/dashboard/stats');
                const data = await response.json();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    // Custom DivIcon for percentage markers
    const createPercentageIcon = (percentage) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${percentage}%</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    };

    // Style for GeoJSON layer
    const regionStyle = (feature) => {
        return {
            fillColor: feature.properties.color || '#3B82F6',
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.5
        };
    };

    const kendariCenter = [-3.9985, 122.5126]; // Coordinates for Kendari

    const getChartDataRaw = () => {
        if (chartFilter === 'month') {
            return stats.monthlyStats || [];
        } else if (chartFilter === 'week') {
            return stats.weeklyStats || [];
        }
        return stats.yearlyStats || [];
    };

    const getChartLabels = () => {
        if (chartFilter === 'month') {
            // Generate labels for days in current month (1 to length of data)
            const days = (stats.monthlyStats || []).length || 30;
            return Array.from({ length: days }, (_, i) => (i + 1).toString());
        } else if (chartFilter === 'week') {
            return ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
        }
        return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'okt', 'Nov', 'Des'];
    };

    const chartData = {
        labels: getChartLabels(),
        datasets: [
            {
                label: 'Jumlah Laporan',
                data: getChartDataRaw(),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: false,
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#f1f5f9',
                },
                ticks: {
                    stepSize: 1,
                    font: {
                        size: 11
                    },
                    color: '#64748b'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    },
                    color: '#64748b'
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Laporan</h3>
                    <p className="text-4xl font-bold text-slate-800 mt-2">{stats.totalReports}</p>
                    <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
                        <i className="bi bi-file-earmark-text text-lg"></i>
                        <span>Semua Laporan Masuk</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Sedang Di Proses</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">{stats.reportsInProcess}</p>
                    <div className="mt-4 text-sm text-blue-600 flex items-center gap-1">
                        <i className="bi bi-hourglass-split text-lg"></i>
                        <span>Laporan Ditangani</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Laporan Selesai</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">{stats.reportsCompleted}</p>
                    <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
                        <i className="bi bi-check-circle-fill text-lg"></i>
                        <span>Kasus Terselesaikan</span>
                    </div>
                </div>
                {/* Add more stats cards here if needed */}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-700">Tren Laporan</h3>
                    <select
                        className="text-sm border border-slate-200 rounded-lg px-3 py-1 text-slate-600 focus:outline-none focus:border-blue-500"
                        value={chartFilter}
                        onChange={(e) => setChartFilter(e.target.value)}
                    >
                        <option value="year">Tahun Ini</option>
                        <option value="month">Bulan Ini</option>
                        <option value="week">Minggu Ini</option>
                    </select>
                </div>
                <div className="h-[300px]">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-4">Peta Persebaran Kasus Kota Kendari</h3>
                <div className="h-[500px] w-full rounded-lg overflow-hidden border border-slate-200 relative z-0">
                    {loading ? (
                        <div className="flex items-center justify-center h-full bg-slate-50 text-slate-400">
                            Memuat Peta...
                        </div>
                    ) : (
                        <MapContainer center={kendariCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {stats.regions.map((region) => (
                                <React.Fragment key={region.id}>
                                    {/* Render GeoJSON if available */}
                                    {/* Render GeoJSON if available */}
                                    {(() => {
                                        if (!region.geojson) return null;
                                        try {
                                            const geoJsonData = typeof region.geojson === 'string'
                                                ? JSON.parse(region.geojson)
                                                : region.geojson;

                                            return (
                                                <GeoJSON
                                                    data={geoJsonData}
                                                    style={() => ({
                                                        fillColor: region.color,
                                                        weight: 2,
                                                        opacity: 1,
                                                        color: 'white',
                                                        dashArray: '3',
                                                        fillOpacity: 0.6
                                                    })}
                                                />
                                            );
                                        } catch (error) {
                                            console.error(`Failed to parse GeoJSON for region ${region.name}:`, error);
                                            return null;
                                        }
                                    })()}

                                    {/* Render Marker with Percentage */}
                                    {/* Using a rough center or if geojson has center property. 
                                        For now, we might need coordinates for the marker. 
                                        Since we don't have explicit lat/long in the region stats unless added,
                                        we might rely on the map centering or add lat/long to the DB/API.
                                        
                                        Constraint: The USER request said "pin pada wilayah tersebut". 
                                        Without lat/long in DB for admin/kecamatan, we can't place it accurately without parsing GeoJSON centroid.
                                        
                                        Workaround for this iteration: 
                                        I will assume the API returns lat/long for the kecamatan or I'll use a placeholder logic 
                                        if GeoJSON is complex. But wait, `Kecamatan` model doesn't have lat/long.
                                        It has `fileGeojson`. 
                                        
                                        For this step, I will *try* to place markers if I have data. 
                                        If not, I might need to ask or update the backend to calculate centroids.
                                        
                                        Let's assume for now we won't render markers if no lat/long, 
                                        OR I can quickly add a "mock" coordinate map for Sultra cities if needed, 
                                        but that's brittle.
                                        
                                        Actually, `leafet` GeoJSON layer can have `onEachFeature` to attach popups. 
                                        But users want a "pin... yang menunjukkan presentase". 
                                        
                                        I will add a `Marker` but I need lat lng. 
                                        Let's check `Kecamatan` model again. It only has `fileGeojson`.
                                        
                                        Ideally backend parses GeoJSON to find center. 
                                        I'll stick to just GeoJSON polygons for now and maybe add a popup with the percentage 
                                        on click, OR attempt to use `pointToLayer` if the geojson is a Point. 
                                        But likely it's a Polygon.
                                        
                                        Alternative: I will render the GeoJSON and bind a Tooltip 
                                        that is permanent or on hover with the percentage. 
                                        That's a "pin" equivalent for polygons.
                                    */}
                                    {(() => {
                                        if (!region.geojson) return null;
                                        try {
                                            const geoJsonData = typeof region.geojson === 'string'
                                                ? JSON.parse(region.geojson)
                                                : region.geojson;

                                            // Calculate center
                                            const layer = L.geoJSON(geoJsonData);
                                            const bounds = layer.getBounds();
                                            let center = bounds.getCenter();

                                            // Manual fix for specific regions where centroid calculation isn't optimal
                                            const manualCenters = {
                                                'Kadia': [-3.9794, 122.4994],
                                                'Kambu': [-4.0060, 122.5250]
                                            };

                                            const matchedRegion = Object.keys(manualCenters).find(key =>
                                                region.name.toLowerCase().includes(key.toLowerCase())
                                            );

                                            if (matchedRegion) {
                                                center = manualCenters[matchedRegion];
                                            }

                                            const pinIcon = L.divIcon({
                                                className: 'custom-pin-icon',
                                                html: `
                                                    <div style="position: relative; width: 40px; height: 40px;">
                                                        <svg viewBox="0 0 384 512" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));">
                                                            <!-- Font Awesome Location Dot style path -->
                                                            <path fill="#ef4444" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0z"/>
                                                            <circle cx="192" cy="192" r="110" fill="white"/>
                                                        </svg>
                                                        <div style="position: absolute; top: 38%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; font-size: 10px; color: #333;">
                                                            ${region.percentage}%
                                                        </div>
                                                    </div>
                                                `,
                                                iconSize: [40, 40],
                                                iconAnchor: [20, 40], // Tip of the pin
                                                popupAnchor: [0, -40]
                                            });

                                            return (
                                                <Marker
                                                    position={center}
                                                    icon={pinIcon}
                                                >
                                                    <Popup>
                                                        <div className="text-center">
                                                            <strong className="block text-lg mb-1">{region.name}</strong>
                                                            <div className="text-slate-600">
                                                                Total: {region.reportCount} Laporan<br />
                                                                ({region.percentage}%)
                                                            </div>
                                                        </div>
                                                    </Popup>
                                                </Marker>
                                            );
                                        } catch (e) {
                                            console.error("Marker render error:", e);
                                            return null;
                                        }
                                    })()}
                                </React.Fragment>
                            ))}
                        </MapContainer>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
