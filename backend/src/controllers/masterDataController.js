const prisma = require("../lib/prisma");

// Generic function generator for simple Name-Active CRUD
const createMasterDataController = (modelName, idField, nameField) => ({
    getAll: async (req, res) => {
        try {
            const data = await prisma[modelName].findMany({
                orderBy: { [idField]: 'asc' }
            });
            res.json(data);
        } catch (error) {
            res.status(500).json({ message: `Gagal mengambil data ${modelName}` });
        }
    },

    create: async (req, res) => {
        const { nama, aktif } = req.body;
        try {
            const newData = await prisma[modelName].create({
                data: {
                    [nameField]: nama,
                    aktif: aktif !== undefined ? aktif : true
                }
            });
            res.status(201).json(newData);
        } catch (error) {
            res.status(500).json({ message: `Gagal membuat data ${modelName}` });
        }
    },

    update: async (req, res) => {
        const { id } = req.params;
        const { nama, aktif } = req.body;
        try {
            const updatedData = await prisma[modelName].update({
                where: { [idField]: parseInt(id) },
                data: {
                    [nameField]: nama,
                    aktif: aktif
                }
            });
            res.json(updatedData);
        } catch (error) {
            res.status(500).json({ message: `Gagal mengupdate data ${modelName}` });
        }
    },

    delete: async (req, res) => {
        const { id } = req.params;
        try {
            await prisma[modelName].delete({
                where: { [idField]: parseInt(id) }
            });
            res.json({ message: "Berhasil dihapus" });
        } catch (error) {
            // Handle foreign key constraint errors gracefully
            if (error.code === 'P2003') {
                return res.status(400).json({ message: "Data tidak bisa dihapus karena sedang digunakan dalam laporan." });
            }
            res.status(500).json({ message: `Gagal menghapus data ${modelName}` });
        }
    }
});

// Create specific controllers
const jenisKasusController = createMasterDataController('jenisKasus', 'idJenisKasus', 'namaJenisKasus');
const bentukKekerasanController = createMasterDataController('bentukKekerasan', 'idBentukKekerasan', 'namaBentukKekerasan');
const kecamatanController = {
    // Custom for Kecamatan because of fields like 'kodeKecamatan', 'fileGeojson', 'warna'
    getAll: async (req, res) => {
        try {
            const data = await prisma.kecamatan.findMany({ orderBy: { idKecamatan: 'asc' } });
            res.json(data);
        } catch (error) { res.status(500).json({ message: "Gagal mengambil data kecamatan" }); }
    },
    create: async (req, res) => {
        const { namaKecamatan, kodeKecamatan, warna } = req.body;
        try {
            const newData = await prisma.kecamatan.create({
                data: { namaKecamatan, kodeKecamatan, warna }
            });
            res.status(201).json(newData);
        } catch (error) { res.status(500).json({ message: "Gagal membuat kecamatan" }); }
    },
    update: async (req, res) => {
        const { id } = req.params;
        const { namaKecamatan, kodeKecamatan, warna } = req.body;
        try {
            const updated = await prisma.kecamatan.update({
                where: { idKecamatan: parseInt(id) },
                data: { namaKecamatan, kodeKecamatan, warna }
            });
            res.json(updated);
        } catch (error) { res.status(500).json({ message: "Gagal update kecamatan" }); }
    },
    delete: async (req, res) => {
        const { id } = req.params;
        try {
            await prisma.kecamatan.delete({ where: { idKecamatan: parseInt(id) } });
            res.json({ message: "Kecamatan dihapus" });
        } catch (error) {
            if (error.code === 'P2003') {
                return res.status(400).json({ message: "Kecamatan tidak bisa dihapus karena ada laporan terkait." });
            }
            res.status(500).json({ message: "Gagal menghapus kecamatan" });
        }
    }
};

module.exports = {
    jenisKasus: jenisKasusController,
    bentukKekerasan: bentukKekerasanController,
    kecamatan: kecamatanController
};
