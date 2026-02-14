import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useComplaintForm = (id) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(!!id);
    const [jenisKasusList, setJenisKasusList] = useState([]);
    const [bentukKekerasanList, setBentukKekerasanList] = useState([]);
    const [formType, setFormType] = useState('Anak'); // 'Anak' or 'Perempuan'

    const [formData, setFormData] = useState({
        noRegistrasi: '',
        tanggal: new Date().toISOString().split('T')[0],
        namaKlien: '',
        alamatKlien: '',
        penerimaPengaduan: '',

        // Pelapor
        namaPelapor: '',
        jkPelapor: 'Laki-laki',
        ttlPelapor: '',
        alamatPelapor: '',
        noTelpPelapor: '',
        pekerjaanPelapor: '',
        hubunganKorban: '',

        // Korban
        namaKorban: '',
        nikKorban: '',
        kewarganegaraanKorban: 'WNI',
        jkKorban: 'Perempuan',
        ttlKorban: '',
        agamaKorban: 'Islam',
        alamatKorban: '',
        noTelpKorban: '',
        pekerjaanKorban: '',
        pendidikanKorban: '',
        statusPerkawinanKorban: '',
        jumlahAnakKorban: '',

        // Ortu / Wali
        namaOrtuWali: '',
        alamatOrtuWali: '',
        kewarganegaraanOrtuWali: 'WNI',
        pekerjaanAyah: '',
        pekerjaanIbu: '',

        // Lainnya
        jumlahSaudaraKorban: '',
        hubunganTerlapor: '',

        disabilitasKorban: false,
        jenisDisabilitasKorban: '',

        // Terlapor
        namaTerlapor: '',
        tempatLahirTerlapor: '',
        tanggalLahirTerlapor: '',
        alamatTerlapor: '', // desa, kelurahan, kecamatan, kabupaten, kota, provinsi
        noTelpTerlapor: '',
        pendidikanTerlapor: '',
        agamaTerlapor: 'Islam',
        pekerjaanTerlapor: '',
        statusPerkawinanTerlapor: '',
        namaOrtuWaliTerlapor: '',
        alamatOrtuWaliTerlapor: '',
        pekerjaanOrtuTerlapor: '',
        jumlahSaudaraTerlapor: '',
        hubunganKorbanTerlapor: '',

        // Kasus
        gambaranKasus: '',
        kategoriKasus: '',
        bentukKekerasan: '',
        tanggalKejadian: '',
        waktuKejadian: '',
        tempatKejadian: '',
        harapanKorban: '',
        layananDibutuhkan: '',
        rujukanDari: '',
        caraDatang: '',

        // Trafficking
        isTrafficking: false,
        ruteTrafficking: '',
        alatTransportasi: '',
        caraDigunakan: '',
        bentukEksploitasi: '',
        bentukPelanggaran: '',
        bentukKriminalisasi: '',
    });

    useEffect(() => {
        if (id) {
            fetchReportData(id);
        }
        fetchMasterData();
    }, [id]);

    const fetchMasterData = async () => {
        try {
            const [resKasus, resKekerasan] = await Promise.all([
                fetch('http://localhost:5000/api/laporan/master/jenis-kasus'),
                fetch('http://localhost:5000/api/laporan/master/bentuk-kekerasan')
            ]);

            if (resKasus.ok) {
                const data = await resKasus.json();
                setJenisKasusList(data);
            }
            if (resKekerasan.ok) {
                const data = await resKekerasan.json();
                setBentukKekerasanList(data);
            }
        } catch (error) {
            console.error("Error fetching master data:", error);
        }
    };

    const fetchReportData = async (reportId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/laporan/detail/${reportId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();

            if (data) {
                setFormData(prev => ({
                    ...prev,
                    noRegistrasi: data.kodeLaporan || '',
                    tanggal: data.dibuatPada ? data.dibuatPada.split('T')[0] : prev.tanggal,
                    namaKlien: data.namaKlien || '',
                    alamatKlien: data.alamatKlien || '',
                    penerimaPengaduan: data.penerimaPengaduan || '',

                    // Pelapor
                    namaPelapor: data.pelapor?.nama || '',
                    jkPelapor: data.pelapor?.jenisKelamin || 'Laki-laki',
                    ttlPelapor: data.pelapor?.tempatTanggalLahir || '',
                    alamatPelapor: data.pelapor?.alamat || '',
                    noTelpPelapor: data.pelapor?.nomorWhatsapp || '',
                    pekerjaanPelapor: data.pelapor?.pekerjaan || '',
                    hubunganKorban: data.pelapor?.hubunganDenganKorban || '',

                    // Korban
                    namaKorban: data.korban?.namaLengkap || '',
                    nikKorban: data.korban?.nik || '',
                    kewarganegaraanKorban: data.korban?.kewarganegaraan || 'WNI',
                    jkKorban: data.korban?.jenisKelamin || 'Perempuan',
                    ttlKorban: data.korban?.tempatTanggalLahir || '',
                    agamaKorban: data.korban?.agama || 'Islam',
                    alamatKorban: data.korban?.alamatLengkap || '',
                    noTelpKorban: data.korban?.nomorTelepon || '',
                    pekerjaanKorban: data.korban?.pekerjaan || '',
                    pendidikanKorban: data.korban?.pendidikan || '',
                    statusPerkawinanKorban: data.korban?.statusPerkawinan || '',
                    jumlahAnakKorban: data.korban?.jumlahAnak || '',

                    namaOrtuWali: data.korban?.namaOrtuWali || '',
                    alamatOrtuWali: data.korban?.alamatOrtuWali || '',
                    kewarganegaraanOrtuWali: data.korban?.kewarganegaraanOrtuWali || 'WNI',
                    pekerjaanAyah: data.korban?.pekerjaanAyah || '',
                    pekerjaanIbu: data.korban?.pekerjaanIbu || '',

                    jumlahSaudaraKorban: data.korban?.jumlahSaudara || '',
                    hubunganTerlapor: data.korban?.hubunganDenganTerlapor || '',

                    disabilitasKorban: data.korban?.disabilitas || false,
                    jenisDisabilitasKorban: data.korban?.jenisDisabilitas || '',

                    // Terlapor
                    namaTerlapor: data.terlapor?.nama || '',
                    tempatLahirTerlapor: data.terlapor?.tempatLahir || '',
                    tanggalLahirTerlapor: data.terlapor?.tanggalLahir ? data.terlapor.tanggalLahir.split('T')[0] : '',
                    alamatTerlapor: data.terlapor?.alamat || '',
                    noTelpTerlapor: data.terlapor?.nomorTelepon || '',
                    pendidikanTerlapor: data.terlapor?.pendidikan || '',
                    agamaTerlapor: data.terlapor?.agama || 'Islam',
                    pekerjaanTerlapor: data.terlapor?.pekerjaan || '',
                    statusPerkawinanTerlapor: data.terlapor?.statusPerkawinan || '',
                    namaOrtuWaliTerlapor: data.terlapor?.namaOrtuWali || '',
                    alamatOrtuWaliTerlapor: data.terlapor?.alamatOrtuWali || '',
                    pekerjaanOrtuTerlapor: data.terlapor?.pekerjaanOrtu || '',
                    jumlahSaudaraTerlapor: data.terlapor?.jumlahSaudara || '',
                    hubunganKorbanTerlapor: data.terlapor?.hubunganDenganKorban || '',

                    // Kasus
                    gambaranKasus: data.kronologiKejadian || '',
                    kategoriKasus: data.jenisKasus?.idJenisKasus || '', // Store ID for select
                    bentukKekerasan: data.bentukKekerasan?.idBentukKekerasan || '', // Store ID for select
                    tanggalKejadian: data.tanggalKejadian ? data.tanggalKejadian.split('T')[0] : '',
                    waktuKejadian: data.waktuKejadian ? data.waktuKejadian.split('T')[1].substring(0, 5) : '',
                    tempatKejadian: data.lokasiLengkapKejadian || '',
                    harapanKorban: data.harapanKorban || '',
                    layananDibutuhkan: data.layananDibutuhkan || '',
                    rujukanDari: data.rujukanDari || '',
                    caraDatang: data.caraDatang || '',

                    // Trafficking
                    isTrafficking: !!data.trafficking,
                    ruteTrafficking: data.trafficking?.ruteTrafficking || '',
                    alatTransportasi: data.trafficking?.alatTransportasi || '',
                    caraDigunakan: data.trafficking?.caraDigunakan || '',
                    bentukEksploitasi: data.trafficking?.bentukEksploitasi || '',
                    bentukPelanggaran: data.trafficking?.bentukPelanggaran || '',
                    bentukKriminalisasi: data.trafficking?.bentukKriminalisasi || '',
                }));
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setDataLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        // Helper to parse Place, Date string (e.g., "Kendari, 01-01-1990")
        const parseTTL = (ttlString) => {
            if (!ttlString) return { tempat: '', tanggal: null };
            const parts = ttlString.split(',');
            if (parts.length < 2) return { tempat: parts[0]?.trim(), tanggal: null };

            const tempat = parts[0].trim();
            // Try to parse date part (assuming DD-MM-YYYY or YYYY-MM-DD)
            const datePart = parts[1].trim();
            let tanggal = null;

            // Simple check for DD-MM-YYYY format which is common in ID
            if (datePart.includes('-')) {
                const dateParts = datePart.split('-');
                if (dateParts[0].length === 4) {
                    tanggal = datePart; // YYYY-MM-DD
                } else if (dateParts[2].length === 4) {
                    tanggal = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // DD-MM-YYYY to YYYY-MM-DD
                }
            } else if (datePart.includes('/')) {
                const dateParts = datePart.split('/');
                if (dateParts[2].length === 4) {
                    tanggal = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                }
            }

            return { tempat, tanggal };
        };

        const pelaporTTL = parseTTL(formData.ttlPelapor);
        const korbanTTL = parseTTL(formData.ttlKorban);

        const payload = {
            pelapor: {
                nama: formData.namaPelapor,
                alamatLengkap: formData.alamatPelapor,
                tempatLahir: pelaporTTL.tempat,
                tanggalLahir: pelaporTTL.tanggal,
                nomorWhatsapp: formData.noTelpPelapor, // State uses noTelpPelapor
                pekerjaan: formData.pekerjaanPelapor,
                pekerjaanLainnya: formData.pekerjaanPelaporLainnya,
                agama: formData.agamaPelapor, // ensure this is mapped if it's "Lainnya"
                agamaLainnya: formData.agamaPelaporLainnya,
                hubunganDenganKorban: formData.hubunganKorban,
                statusPelapor: formData.statusPelapor,
                statusPelaporLainnya: formData.statusPelaporLainnya,
                jenisKelamin: formData.jkPelapor
            },
            korban: {
                namaLengkap: formData.namaKorban,
                nik: formData.nikKorban,
                nomorWhatsapp: formData.noTelpKorban, // State uses noTelpKorban
                alamatLengkap: formData.alamatKorban,
                tempatLahir: korbanTTL.tempat,
                tanggalLahir: korbanTTL.tanggal,
                jenisKelamin: formData.jkKorban,
                pendidikan: formData.pendidikanKorban,
                pendidikanLainnya: formData.pendidikanKorbanLainnya,
                pekerjaan: formData.pekerjaanKorban,
                pekerjaanLainnya: formData.pekerjaanKorbanLainnya,
                agama: formData.agamaKorban,
                agamaLainnya: formData.agamaKorbanLainnya,
                statusPerkawinan: formData.statusPerkawinanKorban,
                disabilitas: formData.disabilitasKorban,
                jenisDisabilitas: formData.jenisDisabilitasKorban,
                nomorTelepon: formData.noTelpKorban,
                jumlahAnak: formData.jumlahAnakKorban,
                namaOrtuWali: formData.namaOrtuWali,
                alamatOrtuWali: formData.alamatOrtuWali,
                kewarganegaraanOrtuWali: formData.kewarganegaraanOrtuWali,
                pekerjaanAyah: formData.pekerjaanAyah,
                pekerjaanIbu: formData.pekerjaanIbu,
                jumlahSaudara: formData.jumlahSaudaraKorban,
                hubunganDenganTerlapor: formData.hubunganTerlapor,
            },
            terlapor: {
                nama: formData.namaTerlapor,
                tempatLahir: formData.tempatLahirTerlapor,
                tanggalLahir: formData.tanggalLahirTerlapor,
                alamat: formData.alamatTerlapor,
                nomorTelepon: formData.noTelpTerlapor,
                pendidikan: formData.pendidikanTerlapor,
                agama: formData.agamaTerlapor,
                pekerjaan: formData.pekerjaanTerlapor,
                statusPerkawinan: formData.statusPerkawinanTerlapor,
                namaOrtuWali: formData.namaOrtuWaliTerlapor,
                alamatOrtuWali: formData.alamatOrtuWaliTerlapor,
                pekerjaanOrtu: formData.pekerjaanOrtuTerlapor,
                jumlahSaudara: formData.jumlahSaudaraTerlapor,
                hubunganDenganKorban: formData.hubunganKorbanTerlapor,
            },
            trafficking: {
                isTrafficking: formData.isTrafficking,
                ruteTrafficking: formData.ruteTrafficking,
                alatTransportasi: formData.alatTransportasi,
                caraDigunakan: formData.caraDigunakan,
                bentukEksploitasi: formData.bentukEksploitasi,
                bentukPelanggaran: formData.bentukPelanggaran,
                bentukKriminalisasi: formData.bentukKriminalisasi,
            },
            laporan: {
                tanggal: formData.tanggal,
                idJenisKasus: formData.kategoriKasus,
                idBentukKekerasan: formData.bentukKekerasan,
                kronologiKejadian: formData.gambaranKasus,
                tanggalKejadian: formData.tanggalKejadian,
                waktuKejadian: formData.waktuKejadian,
                lokasiLengkapKejadian: formData.tempatKejadian,
                harapanKorban: formData.harapanKorban,
                layananDibutuhkan: formData.layananDibutuhkan,
                rujukanDari: formData.rujukanDari,
                caraDatang: formData.caraDatang,
                namaKlien: formData.namaKlien,
                alamatKlien: formData.alamatKlien,
                penerimaPengaduan: formData.penerimaPengaduan,
                noRegistrasi: formData.noRegistrasi,
            }
        };

        try {
            const url = id
                ? `http://localhost:5000/api/laporan/update/${id}`
                : 'http://localhost:5000/api/laporan/create';

            const method = id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Laporan berhasil disimpan!');
                navigate('/admin/laporan');
            } else {
                const errorData = await response.json();
                alert(`Gagal menyimpan laporan: ${errorData.message}`);
                console.error("Server Error Details:", errorData);
            }
        } catch (error) {
            console.error(error);
            alert('Terjadi kesalahan saat menyimpan laporan.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return {
        formData,
        loading,
        dataLoading,
        jenisKasusList,
        bentukKekerasanList,
        formType,
        setFormType,
        handleChange,
        handleSubmit
    };
};

export default useComplaintForm;
