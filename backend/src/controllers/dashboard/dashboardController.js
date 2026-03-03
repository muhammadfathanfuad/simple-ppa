const prisma = require("../../lib/prisma");

const getDateFilter = (params) => {
    const { filterType, year, month, startDate, endDate } = params;

    if (filterType === 'all' || !filterType) {
        return undefined; // No filter (all time)
    }

    const now = new Date();
    const selectedYear = year ? parseInt(year) : now.getFullYear();
    const selectedMonth = month ? parseInt(month) : now.getMonth();

    if (filterType === 'year') {
        const startOfYear = new Date(selectedYear, 0, 1);
        const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);
        return { gte: startOfYear, lte: endOfYear };
    }
    if (filterType === 'month') {
        const startOfMonth = new Date(selectedYear, selectedMonth, 1);
        const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
        return { gte: startOfMonth, lte: endOfMonth };
    }
    if (filterType === 'week') {
        const getMonday = (d) => {
            const dLocal = new Date(d);
            const day = dLocal.getDay();
            const diff = dLocal.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(dLocal.setDate(diff));
        };
        const startOfWeek = getMonday(now);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return { gte: startOfWeek, lte: endOfWeek };
    }
    if (filterType === 'custom' && startDate && endDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return { gte: start, lte: end };
    }

    return undefined; // Default all fallback
};

const getAvailableYears = async (req, res) => {
    try {
        const laporanDates = await prisma.laporan.findMany({
            select: { tanggalKejadian: true }
        });

        const years = new Set(
            laporanDates
                .filter(l => l.tanggalKejadian != null)
                .map(l => new Date(l.tanggalKejadian).getFullYear())
        );
        const currentYear = new Date().getFullYear();
        years.add(currentYear); // Ensure at least current year is in the list

        // Return sorted descending
        const sortedYears = Array.from(years).sort((a, b) => b - a);

        res.json(sortedYears);
    } catch (error) {
        console.error("Error getting available years:", error);
        res.status(500).json({ message: "Gagal mengambil daftar tahun." });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const { filterType, year, month, startDate, endDate } = req.query;

        // Apply global date filter
        const globalDateFilter = getDateFilter({ filterType, year, month, startDate, endDate });

        // 1. Get total reports for percentage calculation
        const totalReports = await prisma.laporan.count({
            where: globalDateFilter ? { tanggalKejadian: globalDateFilter } : undefined
        });

        // 2. Get report counts by status
        const reportsInProcess = await prisma.laporan.count({
            where: {
                statusLaporan: 'diproses',
                ...(globalDateFilter && { tanggalKejadian: globalDateFilter })
            }
        });

        const reportsCompleted = await prisma.laporan.count({
            where: {
                statusLaporan: 'selesai',
                ...(globalDateFilter && { tanggalKejadian: globalDateFilter })
            }
        });

        // 2.5 Get trends
        let trendLabels = [];
        let trendData = [];

        const now = new Date();
        const selectedYear = year ? parseInt(year) : now.getFullYear();
        const selectedMonth = month ? parseInt(month) : now.getMonth();

        if (filterType === 'month') {
            const startOfMonth = new Date(selectedYear, selectedMonth, 1);
            const endOfMonth = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999);
            const daysInMonth = endOfMonth.getDate();

            for (let i = 1; i <= daysInMonth; i++) {
                trendLabels.push(i.toString());
            }
            trendData = Array(daysInMonth).fill(0);

            const monthlyReports = await prisma.laporan.groupBy({
                by: ['tanggalKejadian'],
                where: {
                    tanggalKejadian: { gte: startOfMonth, lte: endOfMonth }
                },
                _count: { idLaporan: true }
            });

            monthlyReports.forEach(item => {
                if (item.tanggalKejadian) {
                    const localDate = new Date(item.tanggalKejadian);
                    const dayIndex = localDate.getDate() - 1;
                    if (dayIndex >= 0 && dayIndex < daysInMonth) {
                        trendData[dayIndex] += item._count.idLaporan;
                    }
                }
            });
        } else if (filterType === 'week') {
            trendLabels = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
            trendData = Array(7).fill(0);

            const startOfWeek = new Date(now);
            const day = startOfWeek.getDay();
            const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
            startOfWeek.setDate(diff);
            startOfWeek.setHours(0, 0, 0, 0);

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const weeklyReports = await prisma.laporan.groupBy({
                by: ['tanggalKejadian'],
                where: {
                    tanggalKejadian: { gte: startOfWeek, lte: endOfWeek }
                },
                _count: { idLaporan: true }
            });

            weeklyReports.forEach(item => {
                if (item.tanggalKejadian) {
                    let dayIndex = new Date(item.tanggalKejadian).getDay();
                    dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
                    if (dayIndex >= 0 && dayIndex < 7) {
                        trendData[dayIndex] += item._count.idLaporan;
                    }
                }
            });
        } else if (filterType === 'custom' && startDate && endDate) {
            const start = new Date(startDate);
            start.setHours(0, 0, 0, 0);
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);

            const customReports = await prisma.laporan.groupBy({
                by: ['tanggalKejadian'],
                where: {
                    tanggalKejadian: { gte: start, lte: end }
                },
                _count: { idLaporan: true }
            });

            const dayMap = new Map();
            let curr = new Date(start);
            while (curr <= end) {
                const dateStr = [
                    curr.getFullYear(),
                    String(curr.getMonth() + 1).padStart(2, '0'),
                    String(curr.getDate()).padStart(2, '0')
                ].join('-');
                dayMap.set(dateStr, 0);
                curr.setDate(curr.getDate() + 1);
            }

            customReports.forEach(item => {
                if (item.tanggalKejadian) {
                    const localDate = new Date(item.tanggalKejadian);
                    const dateStr = [
                        localDate.getFullYear(),
                        String(localDate.getMonth() + 1).padStart(2, '0'),
                        String(localDate.getDate()).padStart(2, '0')
                    ].join('-');

                    if (dayMap.has(dateStr)) {
                        dayMap.set(dateStr, dayMap.get(dateStr) + item._count.idLaporan);
                    }
                }
            });

            dayMap.forEach((count, dateStr) => {
                const parts = dateStr.split('-');
                trendLabels.push(`${parts[2]}/${parts[1]}`); // DD/MM format for labels
                trendData.push(count);
            });
        } else if (filterType === 'year') {
            trendLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            trendData = Array(12).fill(0);

            const startOfYear = new Date(selectedYear, 0, 1);
            const endOfYear = new Date(selectedYear, 11, 31, 23, 59, 59, 999);

            const yearlyReports = await prisma.laporan.groupBy({
                by: ['tanggalKejadian'],
                where: {
                    tanggalKejadian: { gte: startOfYear, lte: endOfYear }
                },
                _count: { idLaporan: true }
            });

            yearlyReports.forEach(item => {
                if (item.tanggalKejadian) {
                    const monthIndex = new Date(item.tanggalKejadian).getMonth();
                    if (monthIndex >= 0 && monthIndex < 12) {
                        trendData[monthIndex] += item._count.idLaporan;
                    }
                }
            });
        } else {
            // filterType === 'all'
            const allReports = await prisma.laporan.groupBy({
                by: ['tanggalKejadian'],
                _count: { idLaporan: true }
            });

            const yearMap = new Map();
            allReports.forEach(item => {
                if (item.tanggalKejadian) {
                    const y = new Date(item.tanggalKejadian).getFullYear();
                    yearMap.set(y, (yearMap.get(y) || 0) + item._count.idLaporan);
                }
            });

            const sortedYears = Array.from(yearMap.keys()).sort();
            sortedYears.forEach(y => {
                trendLabels.push(y.toString());
                trendData.push(yearMap.get(y));
            });

            if (trendLabels.length === 0) {
                trendLabels = [selectedYear.toString()];
                trendData = [0];
            }
        }

        // 3. Get all Kecamatan with their report counts
        const kecamatanStatsArgs = {
            include: {
                _count: {
                    select: {
                        laporan: globalDateFilter ? {
                            where: { tanggalKejadian: globalDateFilter }
                        } : true
                    }
                }
            }
        };
        const kecamatanStats = await prisma.kecamatan.findMany(kecamatanStatsArgs);

        // 3. Transform data for frontend
        const regionData = kecamatanStats.map(kec => {
            const reportCount = kec._count.laporan;
            const percentage = totalReports > 0 ? ((reportCount / totalReports) * 100).toFixed(1) : 0;

            return {
                id: kec.idKecamatan,
                name: kec.namaKecamatan,
                geojson: kec.fileGeojson,
                color: kec.warna || '#3B82F6',
                reportCount: reportCount,
                percentage: percentage
            };
        });

        // 4. Get cases by case type (Jenis Kasus)
        const jenisKasusArgs = {
            include: {
                _count: {
                    select: {
                        laporan: globalDateFilter ? {
                            where: { tanggalKejadian: globalDateFilter }
                        } : true
                    }
                }
            }
        };
        const jenisKasusData = await prisma.jenisKasus.findMany(jenisKasusArgs);
        const kasusStats = jenisKasusData.map(jk => ({
            name: jk.namaJenisKasus,
            count: jk._count.laporan
        })).sort((a, b) => b.count - a.count);

        // 5. Get victims data to calculate age and gender stats
        const korbanArgs = {
            select: {
                tanggalLahir: true,
                jenisKelamin: true
            },
            where: {
                laporan: globalDateFilter ? { tanggalKejadian: globalDateFilter } : undefined
            }
        };
        const korbanData = await prisma.korban.findMany(korbanArgs);

        const usiaStats = {
            'Laki-laki': { '0-5': 0, '6-11': 0, '12-17': 0, '18-25': 0, '26-45': 0, '46+': 0 },
            'Perempuan': { '0-5': 0, '6-11': 0, '12-17': 0, '18-25': 0, '26-45': 0, '46+': 0 }
        };

        const today = new Date();
        korbanData.forEach(korban => {
            if (korban.jenisKelamin && korban.tanggalLahir) {
                const birthDate = new Date(korban.tanggalLahir);
                let age = today.getFullYear() - birthDate.getFullYear();
                const m = today.getMonth() - birthDate.getMonth();
                if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                    age--;
                }

                const jk = korban.jenisKelamin === 'Laki-laki' || korban.jenisKelamin === 'Laki_laki' ? 'Laki-laki' : 'Perempuan';
                if (usiaStats[jk]) {
                    if (age >= 0 && age <= 5) usiaStats[jk]['0-5']++;
                    else if (age >= 6 && age <= 11) usiaStats[jk]['6-11']++;
                    else if (age >= 12 && age <= 17) usiaStats[jk]['12-17']++;
                    else if (age >= 18 && age <= 25) usiaStats[jk]['18-25']++;
                    else if (age >= 26 && age <= 45) usiaStats[jk]['26-45']++;
                    else if (age >= 46) usiaStats[jk]['46+']++;
                }
            }
        });

        res.json({
            totalReports,
            reportsInProcess,
            reportsCompleted,
            trendLabels,
            trendData,
            regions: regionData,
            kasusStats,
            usiaStats
        });

    } catch (error) {
        console.error("Error Dashboard Stats:", error);
        res.status(500).json({ message: "Gagal mengambil data dashboard." });
    }
};

module.exports = {
    getDashboardStats,
    getAvailableYears
};
