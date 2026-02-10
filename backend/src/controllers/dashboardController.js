const prisma = require("../lib/prisma");

const getDashboardStats = async (req, res) => {
    try {
        // 1. Get total reports for percentage calculation
        const totalReports = await prisma.laporan.count();

        // 2. Get report counts by status
        const reportsInProcess = await prisma.laporan.count({
            where: {
                statusLaporan: 'diproses'
            }
        });

        const reportsCompleted = await prisma.laporan.count({
            where: {
                statusLaporan: 'selesai'
            }
        });

        // 2.5 Get trends
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // YEARLY TREND (Jan-Dec)
        const startOfYear = new Date(currentYear, 0, 1);
        const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

        const yearlyReports = await prisma.laporan.groupBy({
            by: ['tanggalKejadian'],
            where: {
                tanggalKejadian: {
                    gte: startOfYear,
                    lte: endOfYear
                }
            },
            _count: {
                idLaporan: true
            }
        });

        const yearlyStats = Array(12).fill(0);
        yearlyReports.forEach(item => {
            const monthIndex = new Date(item.tanggalKejadian).getMonth();
            yearlyStats[monthIndex] += item._count.idLaporan;
        });

        // MONTHLY TREND (Daily 1-31)
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);
        const daysInMonth = endOfMonth.getDate();

        const monthlyReports = await prisma.laporan.groupBy({
            by: ['tanggalKejadian'],
            where: {
                tanggalKejadian: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            _count: {
                idLaporan: true
            }
        });

        const monthlyStats = Array(daysInMonth).fill(0);
        monthlyReports.forEach(item => {
            const dayIndex = new Date(item.tanggalKejadian).getDate() - 1;
            monthlyStats[dayIndex] += item._count.idLaporan;
        });

        // WEEKLY TREND (Mon-Sun)
        const getMonday = (d) => {
            const dLocal = new Date(d);
            const day = dLocal.getDay();
            const diff = dLocal.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(dLocal.setDate(diff));
        }

        const startOfWeek = getMonday(now);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);

        const weeklyReports = await prisma.laporan.groupBy({
            by: ['tanggalKejadian'],
            where: {
                tanggalKejadian: {
                    gte: startOfWeek,
                    lte: endOfWeek
                }
            },
            _count: {
                idLaporan: true
            }
        });

        const weeklyStats = Array(7).fill(0);
        weeklyReports.forEach(item => {
            let dayIndex = new Date(item.tanggalKejadian).getDay();
            // Convert Sunday (0) to 6, Monday (1) to 0, etc.
            dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
            weeklyStats[dayIndex] += item._count.idLaporan;
        });

        // 3. Get all Kecamatan with their report counts
        const kecamatanStats = await prisma.kecamatan.findMany({
            include: {
                _count: {
                    select: { laporan: true }
                }
            }
        });

        // 3. Transform data for frontend
        const regionData = kecamatanStats.map(kec => {
            const reportCount = kec._count.laporan;
            const percentage = totalReports > 0 ? ((reportCount / totalReports) * 100).toFixed(1) : 0;

            return {
                id: kec.idKecamatan,
                name: kec.namaKecamatan,
                geojson: kec.fileGeojson, // Assuming this contains the GeoJSON string or URL
                color: kec.warna || '#3B82F6', // Default color if not set
                reportCount: reportCount,
                percentage: percentage
            };
        });

        res.json({
            totalReports,
            reportsInProcess,
            reportsCompleted,
            yearlyStats,
            monthlyStats,
            weeklyStats,
            regions: regionData
        });

    } catch (error) {
        console.error("Error Dashboard Stats:", error);
        res.status(500).json({ message: "Gagal mengambil data dashboard." });
    }
};

module.exports = {
    getDashboardStats
};
