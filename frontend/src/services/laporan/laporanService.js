import apiService from '../apiService';
import { API_ENDPOINTS } from '../../config';

class LaporanService {
  // Submit new laporan
  async submitLaporan(laporanData, files = []) {
    const formData = new FormData();

    // Add laporan data
    formData.append('data', JSON.stringify(laporanData));

    // Add files
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('bukti', file);
      });
    }

    return await apiService.upload(API_ENDPOINTS.LAPORAN.SUBMIT, formData);
  }

  // Submit new laporan with JSON payload (for admin form)
  async submitLaporanJson(laporanData) {
    return await apiService.post(API_ENDPOINTS.LAPORAN.SUBMIT, laporanData);
  }

  // Get all laporan with filters
  async getAllLaporan(params = {}) {
    return await apiService.get(API_ENDPOINTS.LAPORAN.ALL, params);
  }

  // Get laporan detail by ID
  async getLaporanDetail(id) {
    return await apiService.get(`${API_ENDPOINTS.LAPORAN.DETAIL}/${id}`);
  }

  // Check laporan status by kode
  async checkLaporanStatus(kodeLaporan) {
    return await apiService.get(`${API_ENDPOINTS.LAPORAN.STATUS}/${kodeLaporan}`);
  }

  // Update laporan status
  async updateLaporanStatus(id, statusData) {
    return await apiService.put(`${API_ENDPOINTS.LAPORAN.UPDATE_STATUS}/${id}`, statusData);
  }

  // Update laporan data
  async updateLaporan(id, laporanData) {
    return await apiService.put(`${API_ENDPOINTS.LAPORAN.UPDATE}/${id}`, laporanData);
  }

  // Get laporan locations for GIS
  async getLokasiKasus(params = {}) {
    return await apiService.get(API_ENDPOINTS.LAPORAN.GIS, params);
  }

  // Export laporan data
  async exportLaporan(params = {}) {
    return await apiService.download(API_ENDPOINTS.LAPORAN.EXPORT, params, 'laporan.csv');
  }

  // Export laporan to Excel
  async exportLaporanExcel(params = {}) {
    return await apiService.download(API_ENDPOINTS.LAPORAN.EXPORT_EXCEL, params, 'laporan.xlsx');
  }

  // Get rekapitulasi data
  async getRekapitulasiData(params = {}) {
    return await apiService.get(API_ENDPOINTS.LAPORAN.REKAP, params);
  }

  // Export rekapitulasi data
  async exportRekapitulasi(params = {}) {
    return await apiService.download(API_ENDPOINTS.LAPORAN.REKAP_EXPORT, params, 'rekapitulasi.xlsx');
  }

  // Export rekapitulasi data perempuan
  async exportRekapitulasiPerempuan(params = {}) {
    return await apiService.download(API_ENDPOINTS.LAPORAN.REKAP_EXPORT_PEREMPUAN, params, 'rekapitulasi-perempuan.xlsx');
  }

  // Export rekapitulasi data anak
  async exportRekapitulasiAnak(params = {}) {
    return await apiService.download(API_ENDPOINTS.LAPORAN.REKAP_EXPORT_ANAK, params, 'rekapitulasi-anak.xlsx');
  }

  // Master data methods
  async getKecamatan() {
    return await apiService.get(API_ENDPOINTS.LAPORAN.MASTER_KECAMATAN);
  }

  async getJenisKasus() {
    return await apiService.get(API_ENDPOINTS.LAPORAN.MASTER_JENIS_KASUS);
  }

  async getBentukKekerasan() {
    return await apiService.get(API_ENDPOINTS.LAPORAN.MASTER_BENTUK_KEKERASAN);
  }

  async getJenisLayanan() {
    return await apiService.get(API_ENDPOINTS.LAPORAN.MASTER_JENIS_LAYANAN);
  }

  async getTempatKejadian() {
    return await apiService.get(API_ENDPOINTS.LAPORAN.MASTER_TEMPAT_KEJADIAN);
  }

  async getHubunganKorban() {
    return await apiService.get(API_ENDPOINTS.LAPORAN.MASTER_HUBUNGAN_KORBAN);
  }
}

export default new LaporanService();