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
    Filler,
    BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { dashboardService } from '../../services';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarElement
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
        trendLabels: [],
        trendData: [],
        regions: [],
        kasusStats: [],
        usiaStats: { 'Laki-laki': {}, 'Perempuan': {} }
    });

    // Global filter states
    const [globalFilterType, setGlobalFilterType] = useState('all'); // 'all', 'year', 'month', 'week', 'custom'
    const [availableYears, setAvailableYears] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth().toString());
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    const [loading, setLoading] = useState(true);

    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    useEffect(() => {
        const fetchYears = async () => {
            try {
                const res = await dashboardService.getAvailableYears();
                if (res && res.data) {
                    setAvailableYears(res.data);
                } else if (Array.isArray(res)) {
                    setAvailableYears(res);
                }
            } catch (error) {
                console.error("Failed to fetch available years:", error);
                setAvailableYears([new Date().getFullYear()]);
            }
        };
        fetchYears();
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                // Build global filter parameters
                const params = {
                    filterType: globalFilterType,
                    year: selectedYear,
                    month: selectedMonth
                };
                if (globalFilterType === 'custom') {
                    params.startDate = customStartDate;
                    params.endDate = customEndDate;
                }

                const data = await dashboardService.getDashboardStats(params);
                setStats(data.data || data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };

        // Don't auto-fetch if custom is selected but dates aren't filled
        if (globalFilterType === 'custom' && (!customStartDate || !customEndDate)) {
            return;
        }

        fetchStats();
    }, [globalFilterType, selectedYear, selectedMonth, customStartDate, customEndDate]);

    // Custom DivIcon for percentage markers
    const createPercentageIcon = (percentage) => {
        return L.divIcon({
            className: 'custom-div-icon',
            html: `<div style="background-color: #ef4444; color: white; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${percentage}%</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    };

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

    const kendariCenter = [-3.9985, 122.5126];

    const chartData = {
        labels: stats.trendLabels || [],
        datasets: [
            {
                label: 'Jumlah Laporan',
                data: stats.trendData || [],
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

    // 1. Per Kecamatan
    const sortedRegions = [...(stats.regions || [])].sort((a, b) => b.reportCount - a.reportCount);
    const kecamatanChartData = {
        labels: sortedRegions.map(r => r.name),
        datasets: [{
            label: 'Jumlah Laporan',
            data: sortedRegions.map(r => r.reportCount),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderRadius: 4,
        }]
    };
    const horizontalBarOptions = {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
            }
        },
        scales: {
            x: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { stepSize: 1, font: { size: 11 }, color: '#64748b' }
            },
            y: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#64748b' }
            }
        }
    };

    // 2. Per Usia & Jenis Kelamin
    const usiaLabels = ['0-5', '6-11', '12-17', '18-25', '26-45', '46+'];
    const usiaLakiData = usiaLabels.map(label => stats.usiaStats?.['Laki-laki']?.[label] || 0);
    const usiaPerempuanData = usiaLabels.map(label => stats.usiaStats?.['Perempuan']?.[label] || 0);

    const usiaChartData = {
        labels: usiaLabels,
        datasets: [
            {
                label: 'Laki-laki',
                data: usiaLakiData,
                backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue
                borderRadius: 4,
            },
            {
                label: 'Perempuan',
                data: usiaPerempuanData,
                backgroundColor: 'rgba(236, 72, 153, 0.8)', // Pink
                borderRadius: 4,
            }
        ]
    };
    const groupedBarOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { size: 11 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#1e293b',
                bodyColor: '#475569',
                borderColor: '#e2e8f0',
                borderWidth: 1,
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: { color: '#f1f5f9' },
                ticks: { stepSize: 1, font: { size: 11 }, color: '#64748b' }
            },
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, color: '#64748b' }
            }
        }
    };

    // 3. Per Kasus
    const kasusChartData = {
        labels: (stats.kasusStats || []).map(k => {
            const match = k.name.match(/\((.*?)\)/);
            return match ? match[1] : k.name;
        }),
        datasets: [{
            label: 'Jumlah Kasus',
            data: (stats.kasusStats || []).map(k => k.count),
            backgroundColor: 'rgba(16, 185, 129, 0.8)', // Emerald
            borderRadius: 4,
        }]
    };

    return (
        <div className="space-y-6">
            {/* GLOBAL FILTER */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <i className="bi bi-funnel text-slate-500"></i>
                    <h2 className="text-slate-700 font-semibold">Filter Global Laporan</h2>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <select
                        className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                        value={globalFilterType}
                        onChange={(e) => setGlobalFilterType(e.target.value)}
                    >
                        <option value="year">Tahun</option>
                        <option value="month">Bulan</option>
                        <option value="week">Minggu Ini</option>
                        <option value="custom">Rentang Waktu (Custom)</option>
                        <option value="all">Semua Waktu</option>
                    </select>

                    {(globalFilterType === 'year' || globalFilterType === 'month') && (
                        <select
                            className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                        >
                            {availableYears.map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    )}

                    {globalFilterType === 'month' && (
                        <select
                            className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(e.target.value)}
                        >
                            {months.map((m, index) => (
                                <option key={index} value={index}>{m}</option>
                            ))}
                        </select>
                    )}

                    {globalFilterType === 'custom' && (
                        <div className="flex items-center gap-2">
                            <input
                                type="date"
                                className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                                value={customStartDate}
                                onChange={(e) => setCustomStartDate(e.target.value)}
                            />
                            <span className="text-sm text-slate-500">s.d</span>
                            <input
                                type="date"
                                className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-blue-500"
                                value={customEndDate}
                                onChange={(e) => setCustomEndDate(e.target.value)}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* DASHBOARD CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Total Laporan</h3>
                    <p className="text-4xl font-bold text-slate-800 mt-2">
                        {loading ? '...' : stats.totalReports}
                    </p>
                    <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
                        <i className="bi bi-file-earmark-text text-lg"></i>
                        <span>Semua Laporan Masuk</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Sedang Di Proses</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                        {loading ? '...' : stats.reportsInProcess}
                    </p>
                    <div className="mt-4 text-sm text-blue-600 flex items-center gap-1">
                        <i className="bi bi-hourglass-split text-lg"></i>
                        <span>Laporan Ditangani</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Laporan Selesai</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                        {loading ? '...' : stats.reportsCompleted}
                    </p>
                    <div className="mt-4 text-sm text-green-600 flex items-center gap-1">
                        <i className="bi bi-check-circle-fill text-lg"></i>
                        <span>Kasus Terselesaikan</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
                        <span className="text-slate-600 font-medium">Memuat Data...</span>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700">Tren Laporan</h3>
                    </div>
                    <div className="h-[300px]">
                        <Line data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700">Statistik Per Jenis Kasus</h3>
                    </div>
                    <div className="h-[300px]">
                        <Bar data={kasusChartData} options={horizontalBarOptions} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
                        <span className="text-slate-600 font-medium">Memuat Data...</span>
                    </div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700">Statistik Per Kecamatan</h3>
                    </div>
                    <div className="h-[300px]">
                        <Bar data={kecamatanChartData} options={horizontalBarOptions} />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-700">Statistik Per Usia & Jenis Kelamin</h3>
                    </div>
                    <div className="h-[300px]">
                        <Bar data={usiaChartData} options={groupedBarOptions} />
                    </div>
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

                            {stats?.regions?.map((region) => (
                                <React.Fragment key={region.id}>
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

                                    {(() => {
                                        if (!region.geojson) return null;
                                        try {
                                            const geoJsonData = typeof region.geojson === 'string'
                                                ? JSON.parse(region.geojson)
                                                : region.geojson;

                                            const layer = L.geoJSON(geoJsonData);
                                            const bounds = layer.getBounds();
                                            let center = bounds.getCenter();

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
                                                            <path fill="#ef4444" d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0z"/>
                                                            <circle cx="192" cy="192" r="110" fill="white"/>
                                                        </svg>
                                                        <div style="position: absolute; top: 38%; left: 50%; transform: translate(-50%, -50%); font-weight: bold; font-size: 10px; color: #333;">
                                                            ${region.percentage}%
                                                        </div>
                                                    </div>
                                                `,
                                                iconSize: [40, 40],
                                                iconAnchor: [20, 40],
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
