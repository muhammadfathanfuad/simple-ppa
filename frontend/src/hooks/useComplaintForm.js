import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { laporanService } from '../services';
import Swal from 'sweetalert2';

const useComplaintForm = (id) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(!!id);
    const [jenisKasusList, setJenisKasusList] = useState([]);
    const [bentukKekerasanList, setBentukKekerasanList] = useState([]);
    const [kecamatanList, setKecamatanList] = useState([]);
    const [jenisLayananList, setJenisLayananList] = useState([]);
    const [tempatKejadianList, setTempatKejadianList] = useState([]);
    const [hubunganKorbanList, setHubunganKorbanList] = useState([]);
    const [formType, setFormType] = useState('Anak'); // 'Anak' or 'Perempuan'

    const [formData, setFormData] = useState({
        noRegistrasi: '',
        tanggal: new Date().toISOString().split('T')[0],
        namaKlien: '',
        alamatKlien: '',
        penerimaPengaduan: '',
        idKecamatan: '',

        // Pelapor
        namaPelapor: '',
        jkPelapor: 'Laki-laki',
        ttlPelapor: '',
        alamatPelapor: '',
        noTelpPelapor: '',
        pekerjaanPelapor: '',
        hubunganKorban: '',
        hubunganKorbanLainnya: '', // Added for "Lainnya" input
        hubunganTerlaporPelapor: '',

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

        jumlahSaudaraKorban: '',
        hubunganTerlapor: '',
        hubunganTerlaporLainnya: '', // Added for "Lainnya" input

        disabilitasKorban: false,
        jenisDisabilitasKorban: '',

        // Terlapor
        namaTerlapor: '',
        umurTerlapor: '',
        alamatTerlapor: '', // desa, kelurahan, kecamatan, kabupaten, kota, provinsi
        noTelpTerlapor: '',
        jkTerlapor: 'Laki-laki',
        kewarganegaraanTerlapor: 'WNI',
        pendidikanTerlapor: '',
        agamaTerlapor: 'Islam',
        pekerjaanTerlapor: '',
        statusPerkawinanTerlapor: '',
        namaOrtuWaliTerlapor: '',
        alamatOrtuWaliTerlapor: '',
        pekerjaanOrtuTerlapor: '',
        jumlahSaudaraTerlapor: '',
        jumlahAnakTerlapor: '',
        hubunganKorbanTerlapor: '',
        hubunganKorbanTerlaporLainnya: '', // Added for "Lainnya" input

        // Kasus
        gambaranKasus: '',
        kategoriKasus: '',
        bentukKekerasan: '',
        tanggalKejadian: '',
        waktuKejadian: '',
        tempatKejadian: '',
        lokasiKejadianPerkara: '',
        lokasiKejadianPerkaraLainnya: '',
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
            const [kasusData, kekerasanData, kecamatanData, layananData, tempatData, hubunganData] = await Promise.all([
                laporanService.getJenisKasus(),
                laporanService.getBentukKekerasan(),
                laporanService.getKecamatan(),
                laporanService.getJenisLayanan(),
                laporanService.getTempatKejadian(),
                laporanService.getHubunganKorban()
            ]);

            setJenisKasusList(kasusData.data || kasusData || []);
            setBentukKekerasanList(kekerasanData.data || kekerasanData || []);
            setKecamatanList(kecamatanData.data || kecamatanData || []);
            setJenisLayananList(layananData.data || layananData || []);
            setTempatKejadianList(tempatData.data || tempatData || []);
            setHubunganKorbanList(hubunganData.data || hubunganData || []);
        } catch (error) {
            console.error("Error fetching master data:", error);
        }
    };

    const fetchReportData = async (reportId) => {
        try {
            const [response, tempatRes, hubunganRes] = await Promise.all([
                laporanService.getLaporanDetail(reportId),
                laporanService.getTempatKejadian(),
                laporanService.getHubunganKorban()
            ]);
            const data = response.data || response;
            const tempatList = tempatRes.data || tempatRes || [];
            const hubunganList = hubunganRes.data || hubunganRes || [];

            if (data) {
                const formatTTL = (tempat, tanggal) => {
                    if (!tempat && !tanggal) return '';
                    const datePart = tanggal ? tanggal.split('T')[0] : '';
                    if (tempat && datePart) return `${tempat}, ${datePart}`;
                    return tempat || datePart;
                };

                const parseEnumToUI = (val, type) => {
                    if (!val) return '';
                    if (type === 'Pendidikan') {
                        if (val === 'Tidak_Sekolah') return 'Tidak Sekolah';
                        if (val === 'Perguruan_Tinggi') return 'Perguruan Tinggi';
                        if (val === 'PAUD_TK') return 'PAUD/TK';
                    }
                    if (type === 'JenisKelamin') {
                        if (val === 'Laki_laki') return 'Laki-laki';
                    }
                    if (type === 'Pekerjaan') {
                        if (val === 'Pelajar_Mahasiswa') return 'Pelajar/Mahasiswa';
                        if (val === 'TNI_POLRI') return 'TNI/POLRI';
                        if (val === 'Ibu_Rumah_Tangga') return 'Ibu Rumah Tangga';
                    }
                    if (type === 'StatusPelapor') {
                        if (val === 'Korban_Langsung') return 'Korban Langsung';
                    }
                    return val;
                };

                const isLainnyaTempat = data.lokasiKejadianPerkara && !tempatList.find(t => t.namaTempatKejadian === data.lokasiKejadianPerkara);

                const isLainnyaHubunganPelapor = data.pelapor?.hubunganDenganKorban && !hubunganList.find(h => h.namaHubungan === data.pelapor?.hubunganDenganKorban);
                const isLainnyaHubunganKorban = data.korban?.hubunganDenganTerlapor && !hubunganList.find(h => h.namaHubungan === data.korban?.hubunganDenganTerlapor);
                const isLainnyaHubunganTerlapor = data.terlapor?.hubunganDenganKorban && !hubunganList.find(h => h.namaHubungan === data.terlapor?.hubunganDenganKorban);

                setFormData(prev => ({
                    ...prev,
                    // ... existing fields ...

                    // Laporan (General)
                    noRegistrasi: data.kodeLaporan || '',
                    tanggal: data.dibuatPada ? data.dibuatPada.split('T')[0] : new Date().toISOString().split('T')[0],
                    namaKlien: data.namaKlien || '',
                    alamatKlien: data.alamatKlien || '',
                    penerimaPengaduan: data.penerimaPengaduan || '',

                    // Pelapor
                    namaPelapor: data.pelapor?.nama || '',
                    alamatPelapor: data.pelapor?.alamatLengkap || '',
                    noTelpPelapor: data.pelapor?.nomorWhatsapp || '',
                    pekerjaanPelapor: data.pelapor?.pekerjaan === 'Lainnya' ? (data.pelapor?.pekerjaanLainnya || 'Lainnya') : parseEnumToUI(data.pelapor?.pekerjaan, 'Pekerjaan'),
                    pekerjaanPelaporLainnya: data.pelapor?.pekerjaanLainnya || '',
                    agamaPelapor: data.pelapor?.agama || '',
                    agamaPelaporLainnya: data.pelapor?.agamaLainnya || '',
                    hubunganKorban: isLainnyaHubunganPelapor ? 'Lainnya' : (data.pelapor?.hubunganDenganKorban || ''),
                    hubunganKorbanLainnya: isLainnyaHubunganPelapor ? data.pelapor?.hubunganDenganKorban : '',
                    hubunganTerlaporPelapor: data.pelapor?.hubunganDenganTerlapor || '',
                    statusPelapor: parseEnumToUI(data.pelapor?.statusPelapor, 'StatusPelapor'),
                    statusPelaporLainnya: data.pelapor?.statusPelaporLainnya || '',
                    jkPelapor: parseEnumToUI(data.pelapor?.jenisKelamin, 'JenisKelamin') || 'Laki-laki',
                    ttlPelapor: formatTTL(data.pelapor?.tempatLahir, data.pelapor?.tanggalLahir),

                    // Korban
                    namaKorban: data.korban?.namaLengkap || '',
                    nikKorban: data.korban?.nik || '',
                    kewarganegaraanKorban: data.korban?.kewarganegaraan || 'WNI',
                    jkKorban: parseEnumToUI(data.korban?.jenisKelamin, 'JenisKelamin') || 'Perempuan',
                    ttlKorban: formatTTL(data.korban?.tempatLahir, data.korban?.tanggalLahir),
                    agamaKorban: data.korban?.agama || 'Islam',
                    agamaKorbanLainnya: data.korban?.agamaLainnya || '',
                    alamatKorban: data.korban?.alamatLengkap || '',
                    noTelpKorban: data.korban?.nomorWhatsapp || data.korban?.nomorTelepon || '',
                    pekerjaanKorban: data.korban?.pekerjaan === 'Lainnya' ? (data.korban?.pekerjaanLainnya || 'Lainnya') : parseEnumToUI(data.korban?.pekerjaan, 'Pekerjaan'),
                    pekerjaanKorbanLainnya: data.korban?.pekerjaanLainnya || '',
                    pendidikanKorban: parseEnumToUI(data.korban?.pendidikan, 'Pendidikan'),
                    pendidikanKorbanLainnya: data.korban?.pendidikanLainnya || '',
                    statusPerkawinanKorban: data.korban?.statusPerkawinan || '',
                    jumlahAnakKorban: data.korban?.jumlahAnak || '',

                    // Ortu / Wali
                    namaOrtuWali: data.korban?.namaOrtuWali || '',
                    alamatOrtuWali: data.korban?.alamatOrtuWali || '',
                    kewarganegaraanOrtuWali: data.korban?.kewarganegaraanOrtuWali || 'WNI',
                    pekerjaanAyah: data.korban?.pekerjaanAyah || '',
                    pekerjaanIbu: data.korban?.pekerjaanIbu || '',

                    // Lainnya (Korban continued)
                    jumlahSaudaraKorban: data.korban?.jumlahSaudara || '',
                    hubunganTerlapor: isLainnyaHubunganKorban ? 'Lainnya' : (data.korban?.hubunganDenganTerlapor || ''),
                    hubunganTerlaporLainnya: isLainnyaHubunganKorban ? data.korban?.hubunganDenganTerlapor : '',
                    disabilitasKorban: data.korban?.disabilitas || false,
                    jenisDisabilitasKorban: data.korban?.jenisDisabilitas || '',

                    // Terlapor
                    namaTerlapor: data.terlapor?.nama || '',
                    umurTerlapor: data.terlapor?.umur || '',
                    alamatTerlapor: data.terlapor?.alamat || '',
                    noTelpTerlapor: data.terlapor?.nomorTelepon || '',
                    jkTerlapor: parseEnumToUI(data.terlapor?.jenisKelamin, 'JenisKelamin') || 'Laki-laki',
                    kewarganegaraanTerlapor: data.terlapor?.kewarganegaraan || 'WNI',
                    pendidikanTerlapor: parseEnumToUI(data.terlapor?.pendidikan, 'Pendidikan'),
                    agamaTerlapor: data.terlapor?.agama || 'Islam',
                    pekerjaanTerlapor: data.terlapor?.pekerjaan || '',
                    statusPerkawinanTerlapor: data.terlapor?.statusPerkawinan || '',
                    namaOrtuWaliTerlapor: data.terlapor?.namaOrtuWali || '',
                    alamatOrtuWaliTerlapor: data.terlapor?.alamatOrtuWali || '',
                    pekerjaanOrtuTerlapor: data.terlapor?.pekerjaanOrtu || '',
                    jumlahSaudaraTerlapor: data.terlapor?.jumlahSaudara || '',
                    jumlahAnakTerlapor: data.terlapor?.jumlahAnak || '',
                    hubunganKorbanTerlapor: isLainnyaHubunganTerlapor ? 'Lainnya' : (data.terlapor?.hubunganDenganKorban || ''),
                    hubunganKorbanTerlaporLainnya: isLainnyaHubunganTerlapor ? data.terlapor?.hubunganDenganKorban : '',

                    // Kasus
                    gambaranKasus: data.kronologiKejadian || '',
                    kategoriKasus: data.idJenisKasus || '',
                    bentukKekerasan: data.idBentukKekerasan || '',
                    idKecamatan: data.idKecamatan || '',
                    tanggalKejadian: data.tanggalKejadian ? data.tanggalKejadian.split('T')[0] : '',
                    waktuKejadian: data.waktuKejadian ? new Date(data.waktuKejadian).toTimeString().slice(0, 5) : '',
                    tempatKejadian: data.lokasiLengkapKejadian || '',
                    lokasiKejadianPerkara: isLainnyaTempat ? 'Lainnya' : (data.lokasiKejadianPerkara || ''),
                    lokasiKejadianPerkaraLainnya: isLainnyaTempat ? data.lokasiKejadianPerkara : '',
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

        // Enforce sync if Pelapor is Korban, before generating payload
        let currentFormData = { ...formData };
        const isKorbanLangsungSubmit = (hubunganVal) => {
            if (!hubunganVal) return false;
            const lower = hubunganVal.toLowerCase();
            return lower.includes('korban') || lower.includes('diri sendiri') || lower === 'sendiri';
        };

        if (isKorbanLangsungSubmit(currentFormData.hubunganKorban)) {
            currentFormData.namaKorban = currentFormData.namaPelapor || currentFormData.namaKorban;
            currentFormData.jkKorban = currentFormData.jkPelapor || currentFormData.jkKorban;
            currentFormData.ttlKorban = currentFormData.ttlPelapor || currentFormData.ttlKorban;
            currentFormData.alamatKorban = currentFormData.alamatPelapor || currentFormData.alamatKorban;
            currentFormData.noTelpKorban = currentFormData.noTelpPelapor || currentFormData.noTelpKorban;
            currentFormData.pekerjaanKorban = currentFormData.pekerjaanPelapor || currentFormData.pekerjaanKorban;
            currentFormData.pekerjaanKorbanLainnya = currentFormData.pekerjaanPelaporLainnya || currentFormData.pekerjaanKorbanLainnya;
        }

        const pelaporTTL = parseTTL(currentFormData.ttlPelapor);
        const korbanTTL = parseTTL(currentFormData.ttlKorban);

        const payload = {
            pelapor: {
                nama: currentFormData.namaPelapor,
                alamatLengkap: currentFormData.alamatPelapor,
                tempatLahir: pelaporTTL.tempat,
                tanggalLahir: pelaporTTL.tanggal,
                nomorWhatsapp: currentFormData.noTelpPelapor, // State uses noTelpPelapor
                pekerjaan: currentFormData.pekerjaanPelapor,
                pekerjaanLainnya: currentFormData.pekerjaanPelaporLainnya,
                agama: currentFormData.agamaPelapor, // ensure this is mapped if it's "Lainnya"
                agamaLainnya: currentFormData.agamaPelaporLainnya,
                hubunganDenganKorban: currentFormData.hubunganKorban === 'Lainnya' ? currentFormData.hubunganKorbanLainnya : currentFormData.hubunganKorban,
                hubunganDenganTerlapor: currentFormData.hubunganTerlaporPelapor,
                statusPelapor: currentFormData.statusPelapor,
                statusPelaporLainnya: currentFormData.statusPelaporLainnya,
                jenisKelamin: currentFormData.jkPelapor
            },
            korban: {
                namaLengkap: currentFormData.namaKorban,
                nik: currentFormData.nikKorban,
                nomorWhatsapp: currentFormData.noTelpKorban, // State uses noTelpKorban
                alamatLengkap: currentFormData.alamatKorban,
                tempatLahir: korbanTTL.tempat,
                tanggalLahir: korbanTTL.tanggal,
                jenisKelamin: currentFormData.jkKorban,
                kewarganegaraan: currentFormData.kewarganegaraanKorban,
                pendidikan: currentFormData.pendidikanKorban,
                pendidikanLainnya: currentFormData.pendidikanKorbanLainnya,
                pekerjaan: currentFormData.pekerjaanKorban,
                pekerjaanLainnya: currentFormData.pekerjaanKorbanLainnya,
                agama: currentFormData.agamaKorban,
                agamaLainnya: currentFormData.agamaKorbanLainnya,
                statusPerkawinan: currentFormData.statusPerkawinanKorban,
                disabilitas: currentFormData.disabilitasKorban,
                jenisDisabilitas: currentFormData.jenisDisabilitasKorban,
                nomorTelepon: currentFormData.noTelpKorban,
                jumlahAnak: currentFormData.jumlahAnakKorban,
                namaOrtuWali: currentFormData.namaOrtuWali,
                alamatOrtuWali: currentFormData.alamatOrtuWali,
                kewarganegaraanOrtuWali: currentFormData.kewarganegaraanOrtuWali,
                pekerjaanAyah: currentFormData.pekerjaanAyah,
                pekerjaanIbu: currentFormData.pekerjaanIbu,
                jumlahSaudara: currentFormData.jumlahSaudaraKorban,
                hubunganDenganTerlapor: currentFormData.hubunganTerlapor === 'Lainnya' ? currentFormData.hubunganTerlaporLainnya : currentFormData.hubunganTerlapor,
            },
            terlapor: {
                nama: currentFormData.namaTerlapor,
                umur: currentFormData.umurTerlapor,
                jenisKelamin: currentFormData.jkTerlapor,
                kewarganegaraan: currentFormData.kewarganegaraanTerlapor,
                alamat: currentFormData.alamatTerlapor,
                nomorTelepon: currentFormData.noTelpTerlapor,
                pendidikan: currentFormData.pendidikanTerlapor,
                agama: currentFormData.agamaTerlapor,
                pekerjaan: currentFormData.pekerjaanTerlapor,
                statusPerkawinan: currentFormData.statusPerkawinanTerlapor,
                namaOrtuWali: currentFormData.namaOrtuWaliTerlapor,
                alamatOrtuWali: currentFormData.alamatOrtuWaliTerlapor,
                pekerjaanOrtu: currentFormData.pekerjaanOrtuTerlapor,
                jumlahSaudara: currentFormData.jumlahSaudaraTerlapor,
                jumlahAnak: currentFormData.jumlahAnakTerlapor,
                hubunganDenganKorban: currentFormData.hubunganKorbanTerlapor === 'Lainnya' ? currentFormData.hubunganKorbanTerlaporLainnya : currentFormData.hubunganKorbanTerlapor,
            },
            trafficking: {
                isTrafficking: currentFormData.isTrafficking,
                ruteTrafficking: currentFormData.ruteTrafficking,
                alatTransportasi: currentFormData.alatTransportasi,
                caraDigunakan: currentFormData.caraDigunakan,
                bentukEksploitasi: currentFormData.bentukEksploitasi,
                bentukPelanggaran: currentFormData.bentukPelanggaran,
                bentukKriminalisasi: currentFormData.bentukKriminalisasi,
            },
            laporan: {
                tanggal: currentFormData.tanggal,
                idKecamatan: currentFormData.idKecamatan,
                idJenisKasus: currentFormData.kategoriKasus,
                idBentukKekerasan: currentFormData.bentukKekerasan,
                kronologiKejadian: currentFormData.gambaranKasus,
                tanggalKejadian: currentFormData.tanggalKejadian,
                waktuKejadian: currentFormData.waktuKejadian,
                lokasiLengkapKejadian: currentFormData.tempatKejadian,
                lokasiKejadianPerkara: currentFormData.lokasiKejadianPerkara === 'Lainnya' ? currentFormData.lokasiKejadianPerkaraLainnya : currentFormData.lokasiKejadianPerkara,
                harapanKorban: currentFormData.harapanKorban,
                layananDibutuhkan: currentFormData.layananDibutuhkan,
                rujukanDari: currentFormData.rujukanDari,
                caraDatang: currentFormData.caraDatang,
                namaKlien: currentFormData.namaKlien,
                alamatKlien: currentFormData.alamatKlien,
                penerimaPengaduan: currentFormData.penerimaPengaduan,
                noRegistrasi: currentFormData.noRegistrasi,
            }
        };

        try {
            if (id) {
                await laporanService.updateLaporan(id, payload);
            } else {
                await laporanService.submitLaporanJson(payload);
            }

            Swal.fire({
                title: 'Berhasil!',
                text: 'Laporan berhasil disimpan!',
                icon: 'success',
                confirmButtonColor: '#0d9488'
            }).then(() => {
                navigate('/admin/laporan');
            });
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'Gagal',
                text: `Gagal menyimpan laporan: ${error.message}`,
                icon: 'error',
                confirmButtonColor: '#0d9488'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const newData = { ...prev, [name]: val };

            // Auto-sync if Pelapor is also the Korban
            const isKorbanLangsung = (hubunganVal) => {
                if (!hubunganVal) return false;
                const lower = hubunganVal.toLowerCase();
                return lower.includes('korban') || lower.includes('diri sendiri') || lower === 'sendiri';
            };

            const currentHubungan = name === 'hubunganKorban' ? val : prev.hubunganKorban;

            if (isKorbanLangsung(currentHubungan)) {
                // Sync from Pelapor to Korban
                if (name === 'namaPelapor') newData.namaKorban = val;
                if (name === 'jkPelapor') newData.jkKorban = val;
                if (name === 'ttlPelapor') newData.ttlKorban = val;
                if (name === 'alamatPelapor') newData.alamatKorban = val;
                if (name === 'noTelpPelapor') newData.noTelpKorban = val;
                if (name === 'pekerjaanPelapor') newData.pekerjaanKorban = val;

                // Also force sync if they just set the relationship to Korban
                if (name === 'hubunganKorban' && isKorbanLangsung(val) && !isKorbanLangsung(prev.hubunganKorban)) {
                    newData.namaKorban = prev.namaPelapor || '';
                    newData.jkKorban = prev.jkPelapor || 'Perempuan';
                    newData.ttlKorban = prev.ttlPelapor || '';
                    newData.alamatKorban = prev.alamatPelapor || '';
                    newData.noTelpKorban = prev.noTelpPelapor || '';
                    newData.pekerjaanKorban = prev.pekerjaanPelapor || '';
                }
            }

            return newData;
        });
    };

    return {
        formData,
        loading,
        dataLoading,
        jenisKasusList,
        bentukKekerasanList,
        kecamatanList,
        jenisLayananList,
        tempatKejadianList,
        hubunganKorbanList,
        formType,
        setFormType,
        handleChange,
        handleSubmit
    };
};

export default useComplaintForm;
