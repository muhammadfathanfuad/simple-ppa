const prisma = require("../lib/prisma");
const bcrypt = require("bcrypt");

// --- Admin Management ---

const getAllAdmins = async (req, res) => {
    try {
        const admins = await prisma.admin.findMany({
            select: {
                idAdmin: true,
                namaAdmin: true,
                email: true,
                aktif: true,
                dibuatPada: true,
                diperbaruiPada: true,
            },
            orderBy: { dibuatPada: 'desc' }
        });
        res.json(admins);
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ message: "Gagal mengambil data admin." });
    }
};

const createAdmin = async (req, res) => {
    const { nama, email, password } = req.body;

    try {
        const existingAdmin = await prisma.admin.findUnique({
            where: { email },
        });

        if (existingAdmin) {
            return res.status(400).json({ message: "Email sudah terdaftar." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = await prisma.admin.create({
            data: {
                namaAdmin: nama,
                email,
                password: hashedPassword,
                aktif: true,
            },
        });

        res.status(201).json({
            message: "Admin berhasil dibuat",
            admin: { id: newAdmin.idAdmin, nama: newAdmin.namaAdmin, email: newAdmin.email }
        });
    } catch (error) {
        console.error("Error creating admin:", error);
        res.status(500).json({ message: "Gagal membuat admin." });
    }
};

const updateAdmin = async (req, res) => {
    const { id } = req.params;
    const { nama, email, password, aktif } = req.body;

    try {
        const dataToUpdate = {};
        if (nama) dataToUpdate.namaAdmin = nama;
        if (email) dataToUpdate.email = email;
        if (aktif !== undefined) dataToUpdate.aktif = aktif;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            dataToUpdate.password = await bcrypt.hash(password, salt);
        }

        const updatedAdmin = await prisma.admin.update({
            where: { idAdmin: parseInt(id) },
            data: dataToUpdate,
        });

        res.json({ message: "Admin berhasil diperbarui", admin: updatedAdmin });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ message: "Gagal memperbarui admin." });
    }
};

const deleteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        // Prevent deleting self (optional check could be added if we had current user context here cleanly)
        await prisma.admin.delete({
            where: { idAdmin: parseInt(id) },
        });
        res.json({ message: "Admin berhasil dihapus" });
    } catch (error) {
        console.error("Error deleting admin:", error);
        res.status(500).json({ message: "Gagal menghapus admin." });
    }
};

// --- Activity Logs ---

const getActivityLogs = async (req, res) => {
    try {
        const logs = await prisma.logStatusLaporan.findMany({
            take: 50, // Limit to last 50 logs
            orderBy: { dibuatPada: 'desc' },
            include: {
                admin: {
                    select: { namaAdmin: true }
                },
                laporan: {
                    select: { kodeLaporan: true }
                }
            }
        });

        res.json(logs);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Gagal mengambil log aktivitas." });
    }
};

module.exports = {
    getAllAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    getActivityLogs
};
