const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');

// pdf-parse version 1.1.1 exports a function directly
const pdfParse = require('pdf-parse');

/**
 * Extract text from a file based on its extension
 */
const extractTextFromFile = async (filePath, fileType) => {
    try {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File not found: ${filePath}`);
        }
        const fileBuffer = fs.readFileSync(filePath);

        switch (fileType.toLowerCase()) {
            case 'pdf':
                return await extractFromPDF(fileBuffer);
            case 'docx':
                return await extractFromDOCX(fileBuffer);
            case 'txt':
                return extractFromTXT(fileBuffer);
            default:
                throw new Error(`Unsupported file type: ${fileType}`);
        }
    } catch (error) {
        console.error('Extraction Error:', error);
        throw new Error(`Failed to extract text: ${error.message}`);
    }
};

const extractFromPDF = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        console.error('PDF Parse Error:', error);
        throw new Error(`PDF parsing failed: ${error.message}`);
    }
};

const extractFromDOCX = async (buffer) => {
    try {
        const result = await mammoth.extractRawText({ buffer });
        return result.value;
    } catch (error) {
        console.error('DOCX Parse Error:', error);
        throw new Error(`DOCX parsing failed: ${error.message}`);
    }
};

const extractFromTXT = (buffer) => {
    return buffer.toString('utf-8');
};

module.exports = { extractTextFromFile };