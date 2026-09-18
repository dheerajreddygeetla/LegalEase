export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const LANGUAGES = {
  en: 'English',
  hi: 'हिंदी',
  te: 'తెలుగు',
};

export const DOCUMENT_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  TXT: 'text/plain',
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SCHEME_CATEGORIES = [
  'Education',
  'Agriculture',
  'Health',
  'Housing',
  'Employment',
  'Women & Child',
  'Senior Citizens',
  'Disability',
  'Business',
  'Other',
];

export const STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu & Kashmir',
];

export const OCCUPATIONS = [
  'Student',
  'Farmer',
  'Business',
  'Employed',
  'Self-Employed',
  'Homemaker',
  'Retired',
  'Unemployed',
  'Other',
];

export const EDUCATION_LEVELS = [
  'None',
  'Primary',
  'Secondary',
  'Higher Secondary',
  'Graduate',
  'Post Graduate',
  'Professional',
  'Doctorate',
];

export const CATEGORIES = [
  'General',
  'OBC',
  'SC',
  'ST',
  'EWS',
];
