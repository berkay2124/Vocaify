import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

/**
 * PDF.js worker'ı ayarla
 * NOT: Production'da CDN kullanımı önerilir
 */
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * PDF dosyasından metin çıkarır
 * @param {File} file - PDF dosyası
 * @returns {Promise<string>} Çıkarılan metin
 */
export async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        // Tüm sayfaları işle
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map(item => item.str)
                .join(' ');
            fullText += pageText + '\n';
        }

        return fullText.trim();
    } catch (error) {
        console.error('PDF metin çıkarma hatası:', error);
        throw new Error('PDF dosyası okunamadı. Lütfen geçerli bir PDF dosyası yükleyin.');
    }
}

/**
 * DOCX dosyasından metin çıkarır
 * @param {File} file - DOCX dosyası
 * @returns {Promise<string>} Çıkarılan metin
 */
export async function extractTextFromDOCX(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value.trim();
    } catch (error) {
        console.error('DOCX metin çıkarma hatası:', error);
        throw new Error('DOCX dosyası okunamadı. Lütfen geçerli bir DOCX dosyası yükleyin.');
    }
}

/**
 * CV dosyasından metin çıkarır (PDF veya DOCX)
 * @param {File} file - CV dosyası
 * @returns {Promise<string>} Çıkarılan metin
 */
export async function extractTextFromCV(file) {
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.pdf')) {
        return await extractTextFromPDF(file);
    } else if (fileName.endsWith('.docx')) {
        return await extractTextFromDOCX(file);
    } else if (fileName.endsWith('.doc')) {
        throw new Error('Eski .doc formatı desteklenmiyor. Lütfen .docx veya PDF formatında yükleyin.');
    } else {
        throw new Error('Desteklenmeyen dosya formatı. Lütfen PDF veya DOCX dosyası yükleyin.');
    }
}

/**
 * Dosya boyutunu kontrol eder (maksimum 5MB)
 * @param {File} file - Kontrol edilecek dosya
 * @returns {boolean} Dosya boyutu uygun mu?
 */
export function validateFileSize(file) {
    const maxSize = 5 * 1024 * 1024; // 5MB
    return file.size <= maxSize;
}

/**
 * Dosya tipini kontrol eder
 * @param {File} file - Kontrol edilecek dosya
 * @returns {boolean} Dosya tipi uygun mu?
 */
export function validateFileType(file) {
    const validTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type) ||
           file.name.toLowerCase().endsWith('.pdf') ||
           file.name.toLowerCase().endsWith('.docx');
}
