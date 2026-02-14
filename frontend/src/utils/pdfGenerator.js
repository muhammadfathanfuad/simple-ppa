import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoKendari from '../img/logo kota kendari.png';

export const generateSuratPermohonan = (formData, jenisKasusList) => {
    const doc = new jsPDF();

    // Helper to get text width for centering
    const getCenterX = (text, fontSize) => {
        doc.setFontSize(fontSize);
        const textWidth = doc.getTextWidth(text);
        return (doc.internal.pageSize.width - textWidth) / 2;
    };

    // Header
    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('SURAT PERMOHONAN', getCenterX('SURAT PERMOHONAN', 14), 20);

    // Underline header
    const textWidth = doc.getTextWidth('SURAT PERMOHONAN');
    const startX = (doc.internal.pageSize.width - textWidth) / 2;
    doc.line(startX, 21, startX + textWidth, 21);

    // Reset Font
    doc.setFont('times', 'normal');
    doc.setFontSize(12);

    let yPos = 40;
    const leftMargin = 20;
    const col1Ex = 20;
    const col2Ex = 70;
    const lineHeight = 7;

    doc.text('Yang bertanda tangan di bawah ini :', leftMargin, yPos);
    yPos += 10;

    // --- PELAPOR ---
    const pelaporData = [
        { label: 'Nama', value: formData.namaPelapor || '-' },
        { label: 'Jenis Kelamin', value: formData.jkPelapor || '-' },
        { label: 'Tempat Tanggal Lahir', value: formData.ttlPelapor || '-' },
        { label: 'Alamat', value: formData.alamatPelapor || '-' },
        { label: 'No. Telepon', value: formData.noTelpPelapor || '-' },
        { label: 'Pekerjaan', value: formData.pekerjaanPelapor || '-' },
    ];

    pelaporData.forEach(item => {
        doc.text(item.label, col1Ex, yPos);
        doc.text(':', col2Ex - 2, yPos); // Colon alignment

        // Handle long text for address or other fields
        if (item.label === 'Alamat' || item.value.length > 50) {
            const splitText = doc.splitTextToSize(item.value, 120);
            doc.text(splitText, col2Ex, yPos);
            yPos += splitText.length * lineHeight;
        } else {
            doc.text(item.value, col2Ex, yPos);
            yPos += lineHeight;
        }
    });

    yPos += 5;

    // --- Dugaan / Kasus ---
    // Find category name from list
    let jenisKasusLabel = 'Kekerasan';
    if (formData.kategoriKasus) {
        const selectedKasus = jenisKasusList.find(k => k.idJenisKasus === parseInt(formData.kategoriKasus));
        if (selectedKasus) jenisKasusLabel = selectedKasus.namaJenisKasus;
    }

    const statementText = `Memohon pendampingan Atas Dugaan ${jenisKasusLabel} yang dilakukan oleh :`;
    const splitStatement = doc.splitTextToSize(statementText, 170);
    doc.text(splitStatement, leftMargin, yPos);
    yPos += (splitStatement.length * lineHeight) + 5;

    // --- TERLAPOR ---
    const terlaporTTL = `${formData.tempatLahirTerlapor || ''}${formData.tempatLahirTerlapor && formData.tanggalLahirTerlapor ? ', ' : ''}${formData.tanggalLahirTerlapor || ''}`;

    const terlaporData = [
        { label: 'Nama', value: formData.namaTerlapor || '-' },
        { label: 'Jenis Kelamin', value: '-' }, // Not in DB schema for Terlapor yet
        { label: 'Tempat Tanggal Lahir', value: terlaporTTL || '-' },
        { label: 'Alamat', value: formData.alamatTerlapor || '-' },
        { label: 'No. Telepon', value: formData.noTelpTerlapor || '-' },
        { label: 'Pekerjaan', value: formData.pekerjaanTerlapor || '-' },
    ];

    terlaporData.forEach(item => {
        doc.text(item.label, col1Ex, yPos);
        doc.text(':', col2Ex - 2, yPos);

        if (item.label === 'Alamat' || item.value.length > 50) {
            const splitText = doc.splitTextToSize(item.value, 120);
            doc.text(splitText, col2Ex, yPos);
            yPos += splitText.length * lineHeight;
        } else {
            doc.text(item.value, col2Ex, yPos);
            yPos += lineHeight;
        }
    });

    yPos += 10;

    // --- Footer Text ---
    const footerText = `Kepada Unit Pelaksana Teknis Daerah Perlindungan Perempuan dan Anak ( UPTD PPA) Dinas Pemberdayaan Perempuan dan Perlindungan Anak Kota Kendari,`;
    const splitFooter = doc.splitTextToSize(footerText, 170);
    doc.text(splitFooter, leftMargin, yPos);
    yPos += (splitFooter.length * lineHeight) + 5;

    const closingText = `Demikian Surat permohonan ini saya buat dalam keadaan sadar dan tanpa tekanan dari pihak manapun.`;
    const splitClosing = doc.splitTextToSize(closingText, 170);
    doc.text(splitClosing, leftMargin, yPos);
    yPos += (splitClosing.length * lineHeight) + 20;

    // --- Signature ---
    const dateString = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const signatureX = 140; // Right side

    doc.text(`Kendari, ${dateString}`, signatureX, yPos);
    yPos += 7;
    doc.text('Pemohon,', signatureX, yPos);
    yPos += 25; // Space for signature

    // ... existing code ...
    doc.text(`( ${formData.namaPelapor || '.......................'} )`, signatureX, yPos);

    doc.save(`surat-permohonan-${formData.noRegistrasi || 'draft'}.pdf`);
};

export const generateFormulirPenerimaan = (formData) => {
    const doc = new jsPDF();

    // --- Helper Functions ---
    const checkbox = (x, y, label, isChecked) => {
        doc.rect(x, y - 3, 3, 3); // Slightly smaller box
        if (isChecked) {
            doc.setFontSize(8);
            doc.text('X', x + 0.5, y - 0.5);
        }
        doc.setFontSize(10);
        doc.text(label, x + 5, y);
        return x + 5 + doc.getTextWidth(label) + 5;
    };

    const getChecked = (fieldValue, targetValue) => {
        if (!fieldValue) return false;
        return fieldValue.toString().toLowerCase() === targetValue.toLowerCase();
    };

    // --- Header ---
    const logoSize = 25;
    try {
        doc.addImage(logoKendari, 'PNG', 15, 10, logoSize, logoSize);
    } catch (e) {
        console.warn("Logo load failed", e);
    }

    doc.setFont('times', 'bold'); // Matches distinct font in header often
    doc.setFontSize(14);
    doc.text('PEMERINTAH KOTA KENDARI', 115, 15, { align: 'center' });
    doc.text('DINAS PEMBERDAYAAN PEREMPUAN DAN', 115, 21, { align: 'center' });
    doc.text('PERLINDUNGAN ANAK', 115, 27, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.text('Jln. Malaka Kompleks Bumi Praja II, Kel. Kambu, Kec. Kambu, Kota Kendari Kode Pos 93231', 115, 33, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(15, 36, 195, 36);

    // --- Title ---
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('Formulir Penerimaan Pengaduan', 105, 42, { align: 'center' });

    let y = 50;
    const labelX = 15;
    const colonX = 65;
    const valueX = 67;
    const lineHeight = 5.5;

    doc.setFont('times', 'normal'); // Serif font often looks more official/like the image
    doc.setFontSize(10);

    // --- Info Block ---
    doc.text('No. Register', labelX, y);
    doc.text(':', colonX, y);
    doc.text(formData.noRegistrasi || '', valueX, y);
    y += lineHeight;

    const dateObj = formData.tanggal ? new Date(formData.tanggal) : new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    doc.text('Hari / Tanggal', labelX, y);
    doc.text(':', colonX, y);
    doc.text(dateObj.toLocaleDateString('id-ID', options), valueX, y);
    y += lineHeight;

    doc.text('Penerima Pengaduan', labelX, y);
    doc.text(':', colonX, y);
    doc.text(formData.penerimaPengaduan || '', valueX, y);
    y += lineHeight * 1.5;

    // --- I. IDENTITAS KORBAN ---
    doc.setFont('times', 'bold');
    doc.text('I. IDENTITAS KORBAN', labelX, y);
    doc.setFont('times', 'normal');
    y += lineHeight;

    const addRow = (no, label, value) => {
        doc.text(`${no}.`, labelX + 3, y);
        doc.text(label, labelX + 8, y);
        doc.text(':', colonX, y);

        const displayValue = value ? String(value) : '';
        if (displayValue.length > 50) {
            const splitText = doc.splitTextToSize(displayValue, 130);
            doc.text(splitText, valueX, y);
            y += (splitText.length * lineHeight) - lineHeight;
        } else {
            doc.text(displayValue, valueX, y);
        }
        y += lineHeight;
    };

    addRow('1', 'Nama', formData.namaKorban);
    addRow('2', 'NIK', formData.nikKorban);
    addRow('3', 'Tempat / Tanggal Lahir', formData.ttlKorban);
    addRow('4', 'Jenis Kelamin', formData.jkKorban);
    addRow('5', 'Alamat', formData.alamatKorban);
    addRow('6', 'Kewarganegaraan', formData.kewarganegaraanKorban);
    addRow('7', 'Nomor Telepon', formData.noTelpKorban);
    addRow('8', 'Pendidikan', formData.pendidikanKorban);
    addRow('9', 'Agama', formData.agamaKorban);
    addRow('10', 'Pekerjaan', formData.pekerjaanKorban);
    addRow('11', 'Status', formData.statusPerkawinanKorban);
    addRow('12', 'Jumlah Anak', formData.jumlahAnakKorban);
    addRow('13', 'Nama Orang Tua / Wali', formData.namaOrtuWali); // Might need split if Ayah/Ibu separate in future
    addRow('14', 'Alamat Orang Tua / Wali', formData.alamatOrtuWali);
    addRow('15', 'Kewarganegaraan', formData.kewarganegaraanOrtuWali);
    addRow('16', 'Pekerjaan Orang Tua / Wali', formData.pekerjaanAyah); // Just mapping Ayah for now as representative
    addRow('17', 'Jumlah Saudara Korban', formData.jumlahSaudaraKorban);
    addRow('18', 'Hubungan dengan Terlapor', formData.hubunganTerlapor);

    // --- II. IDENTITAS TERLAPOR ---
    y += lineHeight; // Spacing
    doc.setFont('times', 'bold');
    doc.text('II. IDENTITAS TERLAPOR', labelX, y);
    doc.setFont('times', 'normal');
    y += lineHeight;

    addRow('1', 'Nama', formData.namaTerlapor);

    // Combining TTL for Terlapor
    const terlaporTTL = `${formData.tempatLahirTerlapor || ''}${formData.tempatLahirTerlapor && formData.tanggalLahirTerlapor ? ' / ' : ''}${formData.tanggalLahirTerlapor || ''}`;
    addRow('2', 'Tempat / Tanggal Lahir', terlaporTTL);

    addRow('3', 'Jenis Kelamin', ''); // Not in formData.terlapor currently?
    addRow('4', 'Alamat', formData.alamatTerlapor);
    addRow('5', 'Kewarganegaraan', ''); // Not in schema?
    addRow('6', 'Nomor Telepon', formData.noTelpTerlapor);
    addRow('7', 'Pendidikan', formData.pendidikanTerlapor);
    addRow('8', 'Agama', formData.agamaTerlapor);
    addRow('9', 'Pekerjaan', formData.pekerjaanTerlapor);
    addRow('10', 'Status', formData.statusPerkawinanTerlapor);
    addRow('11', 'Jumlah Anak', ''); // Not in schema for Terlapor
    addRow('12', 'Nama Orang Tua / Wali', formData.namaOrtuWaliTerlapor);
    addRow('13', 'Alamat Orang Tua / Wali', formData.alamatOrtuWaliTerlapor);

    // --- Page Break Check ---
    if (y > 240) {
        doc.addPage();
        y = 20;
    } else {
        y += lineHeight;
    }

    // --- III. IDENTITAS PELAPOR ---
    doc.setFont('times', 'bold');
    doc.text('III. IDENTITAS PELAPOR', labelX, y);
    doc.setFont('times', 'normal');
    y += lineHeight;

    addRow('1', 'Nama', formData.namaPelapor);
    addRow('2', 'Tempat / Tanggal Lahir', formData.ttlPelapor);
    addRow('3', 'Alamat', formData.alamatPelapor);
    addRow('4', 'Nomor Telepon', formData.noTelpPelapor);
    addRow('5', 'Pekerjaan', formData.pekerjaanPelapor);
    addRow('6', 'Hubungan dengan Korban', formData.hubunganKorban);
    addRow('7', 'Hubungan dengan Terlapor', ''); // Not strictly in pelapor schema, usually inferred or empty

    y += lineHeight * 3;

    // --- Signatures ---
    // Two columns
    // Left: Victim/Reporter? Right: Officer? 
    // Image says "Yang bertanda tangan dibawah," on both sides.
    // Usually Left is "Pelapor/Korban" and Right is "Penerima Pengaduan".

    if (y > 250) {
        doc.addPage();
        y = 30;
    }

    const leftSigX = 30;
    const rightSigX = 130;

    doc.text('Yang bertanda tangan dibawah,', leftSigX, y);
    doc.text('Yang bertanda tangan dibawah,', rightSigX, y);

    y += 25; // Space for signatures

    // Underline for name
    doc.text(formData.namaPelapor || '(Nama Pelapor)', leftSigX, y);
    doc.line(leftSigX, y + 1, leftSigX + 50, y + 1); // Line length 50

    doc.text(formData.penerimaPengaduan || '(Penerima)', rightSigX, y);
    doc.line(rightSigX, y + 1, rightSigX + 50, y + 1);

    y += lineHeight;
    doc.text('Jabatan', leftSigX, y); // Usually Pelapor doesn't have Jabatan in this context, but image has lines for it
    doc.text('Jabatan', rightSigX, y);

    y += lineHeight;
    doc.text('NIP', leftSigX, y); // Pelapor NIP? Maybe clean this up if not applicable
    doc.text('NIP', rightSigX, y);

    doc.save(`formulir-penerimaan-${formData.noRegistrasi || 'draft'}.pdf`);
};

export const generateFormulirIdentifikasi = (formData, jenisKasusList, bentukKekerasanList) => {
    const doc = new jsPDF();

    // --- Header ---
    const logoSize = 25;
    try {
        doc.addImage(logoKendari, 'PNG', 15, 10, logoSize, logoSize);
    } catch (e) {
        console.warn("Logo load failed", e);
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(14);
    doc.text('PEMERINTAH KOTA KENDARI', 115, 15, { align: 'center' });
    doc.text('DINAS PEMBERDAYAAN PEREMPUAN DAN', 115, 21, { align: 'center' });
    doc.text('PERLINDUNGAN ANAK', 115, 27, { align: 'center' });

    doc.setFont('times', 'normal');
    doc.setFontSize(9);
    doc.text('Jln. Malaka Kompleks Bumi Praja II, Kel. Kambu, Kec. Kambu, Kota Kendari Kode Pos 93231', 115, 33, { align: 'center' });

    doc.setLineWidth(0.5);
    doc.line(15, 36, 195, 36);

    // --- Title ---
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('Formulir Identifikasi Kasus', 105, 42, { align: 'center' });

    let y = 50;
    const labelX = 15;
    const colonX = 55;
    const valueX = 57;
    const lineHeight = 6;

    doc.setFont('times', 'normal');
    doc.setFontSize(10);

    // --- Meta Info ---
    doc.text('No. Register', labelX, y);
    doc.text(':', colonX, y);
    doc.text(formData.noRegistrasi || '', valueX, y);
    y += lineHeight;

    const dateObj = formData.tanggal ? new Date(formData.tanggal) : new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    doc.text('Hari / Tanggal', labelX, y);
    doc.text(':', colonX, y);
    doc.text(dateObj.toLocaleDateString('id-ID', options), valueX, y);
    y += lineHeight;

    doc.text('Penerima Pengaduan', labelX, y);
    doc.text(':', colonX, y);
    doc.text(formData.penerimaPengaduan || '', valueX, y);
    y += lineHeight * 2; // Extra space before sections

    // --- Helper for Sections ---
    const addSection = (number, title, content, height = 7) => {
        doc.text(`${number}.`, labelX + 5, y);
        doc.text(title, labelX + 10, y);
        y += 2; // Space to box
        doc.rect(labelX + 10, y, 170, height); // Box

        if (content) {
            doc.text(String(content), labelX + 12, y + 5);
        }

        y += height + 8; // Space to next section
    };

    // 1. Jenis Kekerasan
    let jenisKasusLabel = '';
    if (formData.kategoriKasus) {
        const selected = jenisKasusList.find(k => k.idJenisKasus === parseInt(formData.kategoriKasus));
        if (selected) jenisKasusLabel = selected.namaJenisKasus;
    }
    addSection('1', 'Jenis Kekerasan', jenisKasusLabel);

    // 2. Bentuk Kekerasan
    let bentukKekerasanLabel = '';
    if (formData.bentukKekerasan) {
        const selected = bentukKekerasanList.find(b => b.idBentukKekerasan === parseInt(formData.bentukKekerasan));
        if (selected) bentukKekerasanLabel = selected.namaBentukKekerasan;
    }
    addSection('2', 'Bentuk Kekerasan', bentukKekerasanLabel);

    // 3. Tempat dan waktu Kejadian Kekerasan
    const waktuTempat = `${formData.tempatKejadian || ''}, ${formData.tanggalKejadian || ''} ${formData.waktuKejadian || ''}`;
    addSection('3', 'Tempat dan waktu Kejadian Kekerasan', waktuTempat);

    // 4. Keinginan / Harapan Korban
    addSection('4', 'Keinginan / Harapan Korban', formData.harapanKorban || '');

    // 5. Layanan Yang dibutuhkan Korban
    addSection('5', 'Layanan Yang dibutuhkan Korban', formData.layananDibutuhkan || '');

    // 6. Informasi / Pelimpahan / Rujukan dari
    addSection('6', 'Informasi / Pelimpahan / Rujukan dari', formData.rujukanDari || '');

    // 7. Kedatangan Korban Ke Kantor
    addSection('7', 'Kedatangan Korban Ke Kantor', formData.caraDatang || '');

    // 8. Kronologi Singkat
    doc.text('8.', labelX + 5, y);
    doc.text('Kronologi Singkat : (Waktu, Tempat, dan Proses Kejadian)', labelX + 10, y);
    y += 2;
    doc.rect(labelX + 10, y, 170, 40); // Larger box

    // Handle multi-line text for Kronologi
    if (formData.gambaranKasus) {
        const splitText = doc.splitTextToSize(formData.gambaranKasus, 165);
        doc.text(splitText, labelX + 12, y + 5);
    }
    y += 50; // Space after large box

    // --- Footer Text ---
    const footerText = "Demikian kronologi kejadian ini dibuat dengan sebenar-benarnya untuk digunakan sebagaimana mestinya.";
    const splitFooter = doc.splitTextToSize(footerText, 170);
    doc.text(splitFooter, 105, y, { align: 'center' }); // Centered text
    y += 20;

    // --- Signatures ---
    const leftSigX = 40;
    const rightSigX = 140;

    doc.text('Yang bertanda tangan dibawah,', leftSigX, y, { align: 'center' });
    doc.text('Yang bertanda tangan dibawah,', rightSigX, y, { align: 'center' });

    y += 25; // Space for signatures

    // Left Signature (Pelapor?) - Image implies two generic signatures
    // We can put Pelapor on left? Or maybe just leave lines as in the image sample which is blank?
    // The image shows "Nama Yang Bertanda Tangan", "Jabatan", "NIP" placeholders.
    // Let's mimic the image exactly with placeholders if data is missing, or fill if reasonable.
    // Usually left is Pelapor, Right is Officer.

    // Left Side
    doc.text(formData.namaPelapor || 'Nama Yang Bertanda Tangan', leftSigX, y, { align: 'center' });
    doc.line(leftSigX - 20, y + 1, leftSigX + 20, y + 1);

    y += 4;
    doc.text('Jabatan', leftSigX, y, { align: 'center' });
    y += 4;
    doc.text('NIP 1234567891011121314', leftSigX, y, { align: 'center' }); // Placeholder from image

    // Reset Y for Right Side
    y -= 8;

    // Right Side
    doc.text(formData.penerimaPengaduan || 'Nama Yang Bertanda Tangan', rightSigX, y, { align: 'center' });
    doc.line(rightSigX - 20, y + 1, rightSigX + 20, y + 1);

    y += 4;
    doc.text('Jabatan', rightSigX, y, { align: 'center' });
    y += 4;
    doc.text('NIP 1234567891011121314', rightSigX, y, { align: 'center' });

    doc.save(`formulir-identifikasi-${formData.noRegistrasi || 'draft'}.pdf`);
};
