import { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGES } from '../utils/constants';

const translations = {
  en: {
    // Navigation
    home: 'Home',
    about: 'About',
    help: 'Help',
    login: 'Login',
    register: 'Register',
    dashboard: 'Dashboard',
    assistant: 'AI Assistant',
    documents: 'Documents',
    schemes: 'Schemes',
    eligibility: 'Eligibility Check',
    profile: 'Profile',
    logout: 'Logout',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    reset: 'Reset',
    submit: 'Submit',
    back: 'Back',
    next: 'Next',
    close: 'Close',
    
    // Home
    heroTitle: 'LegalEase – Your Rights, Simplified',
    heroSubtitle: 'Understand Your Rights. Discover Your Benefits. Take the Next Step.',
    startNow: 'Start Now',
    exploreSchemes: 'Explore Schemes',
    trustedBy: 'Trusted by citizens across India',
    
    // Features
    aiAssistant: 'AI Legal Assistant',
    documentAnalyzer: 'Document Analyzer',
    governmentSchemes: 'Government Schemes',
    voiceInteraction: 'Voice Interaction',
    multilingualSupport: 'Multilingual Support',
    sourceGrounded: 'Source-Grounded Answers',
    
    // Chat
    newChat: 'New Chat',
    typeMessage: 'Type your message...',
    speak: 'Speak',
    listening: 'Listening...',
    processing: 'Processing...',
    sources: 'Sources',
    
    // Documents
    uploadDocument: 'Upload Document',
    dragDrop: 'Drag and drop your file here',
    or: 'or',
    browseFiles: 'Browse files',
    supportedFormats: 'Supported formats: PDF, DOCX, TXT',
    maxSize: 'Maximum file size: 10MB',
    documentAnalysis: 'Document Analysis',
    summary: 'Summary',
    keyPoints: 'Key Points',
    obligations: 'Obligations',
    risks: 'Risks',
    
    // Schemes
    findSchemes: 'Find Government Schemes',
    checkEligibility: 'Check Eligibility',
    recommendations: 'Recommendations',
    allSchemes: 'All Schemes',
    benefits: 'Benefits',
    requiredDocuments: 'Required Documents',
    applicationProcess: 'Application Process',
    eligible: 'Eligible',
    notEligible: 'Not Eligible',
    partialMatch: 'Partial Match',
    
    // Profile
    myProfile: 'My Profile',
    personalInfo: 'Personal Information',
    accountSettings: 'Account Settings',
    deleteAccount: 'Delete Account',
    confirmDelete: 'Are you sure you want to delete your account?',
  },
  hi: {
    // Navigation
    home: 'होम',
    about: 'हमारे बारे में',
    help: 'सहायता',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    dashboard: 'डैशबोर्ड',
    assistant: 'AI सहायक',
    documents: 'दस्तावेज',
    schemes: 'योजनाएं',
    eligibility: 'पात्रता जांच',
    profile: 'प्रोफाइल',
    logout: 'लॉगआउट',
    
    // Common
    loading: 'लोड हो रहा है...',
    error: 'त्रुटि',
    success: 'सफल',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    delete: 'हटाएं',
    edit: 'संपादित करें',
    view: 'देखें',
    search: 'खोजें',
    filter: 'फ़िल्टर',
    reset: 'रीसेट',
    submit: 'जमा करें',
    back: 'वापस',
    next: 'अगला',
    close: 'बंद करें',
    
    // Home
    heroTitle: 'LegalEase – आपके अधिकार, सरल',
    heroSubtitle: 'अपने अधिकार समझें। अपने लाभ खोजें। अगला कदम उठाएं।',
    startNow: 'अभी शुरू करें',
    exploreSchemes: 'योजनाएं देखें',
    trustedBy: 'भारत भर के नागरिकों द्वारा विश्वसनीय',
    
    // Features
    aiAssistant: 'AI कानूनी सहायक',
    documentAnalyzer: 'दस्तावेज विश्लेषक',
    governmentSchemes: 'सरकारी योजनाएं',
    voiceInteraction: 'आवाज़ इंटरैक्शन',
    multilingualSupport: 'बहुभाषी समर्थन',
    sourceGrounded: 'स्रोत-आधारित उत्तर',
    
    // Chat
    newChat: 'नई बातचीत',
    typeMessage: 'अपना संदेश टाइप करें...',
    speak: 'बोलें',
    listening: 'सुन रहा हूँ...',
    processing: 'प्रोसेसिंग...',
    sources: 'स्रोत',
    
    // Documents
    uploadDocument: 'दस्तावेज अपलोड करें',
    dragDrop: 'अपनी फ़ाइल यहां खींचें और छोड़ें',
    or: 'या',
    browseFiles: 'फ़ाइलें ब्राउज़ करें',
    supportedFormats: 'समर्थित प्रारूप: PDF, DOCX, TXT',
    maxSize: 'अधिकतम फ़ाइल आकार: 10MB',
    documentAnalysis: 'दस्तावेज विश्लेषण',
    summary: 'सारांश',
    keyPoints: 'मुख्य बिंदु',
    obligations: 'दायित्व',
    risks: 'जोखिम',
    
    // Schemes
    findSchemes: 'सरकारी योजनाएं खोजें',
    checkEligibility: 'पात्रता जांचें',
    recommendations: 'सिफारिशें',
    allSchemes: 'सभी योजनाएं',
    benefits: 'लाभ',
    requiredDocuments: 'आवश्यक दस्तावेज',
    applicationProcess: 'आवेदन प्रक्रिया',
    eligible: 'पात्र',
    notEligible: 'अपात्र',
    partialMatch: 'आंशिक मिलान',
    
    // Profile
    myProfile: 'मेरी प्रोफाइल',
    personalInfo: 'व्यक्तिगत जानकारी',
    accountSettings: 'खाता सेटिंग्स',
    deleteAccount: 'खाता हटाएं',
    confirmDelete: 'क्या आप वाकई अपना खाता हटाना चाहते हैं?',
  },
  te: {
    // Navigation
    home: 'హోమ్',
    about: 'గురించి',
    help: 'సహాయం',
    login: 'లాగిన్',
    register: 'నమోదు',
    dashboard: 'డ్యాష్‌బోర్డ్',
    assistant: 'AI అసిస్టెంట్',
    documents: 'పత్రాలు',
    schemes: 'పథకాలు',
    eligibility: 'అర్హత పరిశీలన',
    profile: 'ప్రొఫైల్',
    logout: 'లాగ్అవుట్',
    
    // Common
    loading: 'లోడ్ అవుతోంది...',
    error: 'లోపం',
    success: 'విజయం',
    cancel: 'రద్దు చేయండి',
    save: 'సేవ్ చేయండి',
    delete: 'తొలగించండి',
    edit: 'ఎడిట్ చేయండి',
    view: 'చూడండి',
    search: 'శోధించండి',
    filter: 'ఫిల్టర్',
    reset: 'రీసెట్',
    submit: 'సమర్పించండి',
    back: 'వెనుకకు',
    next: 'తదుపరి',
    close: 'మూసివేయండి',
    
    // Home
    heroTitle: 'LegalEase – మీ హక్కులు, సులభం',
    heroSubtitle: 'మీ హక్కులను అర్థం చేసుకోండి. మీ ప్రయోజనాలను కనుగొనండి. తదుపరి దశ తీసుకోండి.',
    startNow: 'ఇప్పుడు ప్రారంభించండి',
    exploreSchemes: 'పథకాలను అన్వేషించండి',
    trustedBy: 'భారతదేశం అంతటా పౌరులచే నమ్మకం',
    
    // Features
    aiAssistant: 'AI చట్టపరమైన సహాయకుడు',
    documentAnalyzer: 'పత్రం విశ్లేషకుడు',
    governmentSchemes: 'ప్రభుత్వ పథకాలు',
    voiceInteraction: 'వాయిస్ ఇంటరాక్షన్',
    multilingualSupport: 'బహుభాషా మద్దతు',
    sourceGrounded: 'మూలం-ఆధారిత సమాధానాలు',
    
    // Chat
    newChat: 'కొత్త చాట్',
    typeMessage: 'మీ సందేశాన్ని టైప్ చేయండి...',
    speak: 'మాట్లాడండి',
    listening: 'వింటోంది...',
    processing: 'ప్రాసెసింగ్...',
    sources: 'మూలాలు',
    
    // Documents
    uploadDocument: 'పత్రాన్ని అప్‌లోడ్ చేయండి',
    dragDrop: 'మీ ఫైల్‌ని ఇక్కడ లాగండి మరియు వదిలిపెట్టండి',
    or: 'లేదా',
    browseFiles: 'ఫైల్‌లను బ్రౌజ్ చేయండి',
    supportedFormats: 'మద్దతు ఉన్న ఫార్మాట్‌లు: PDF, DOCX, TXT',
    maxSize: 'గరిష్ఠ ఫైల్ పరిమాణం: 10MB',
    documentAnalysis: 'పత్రం విశ్లేషణ',
    summary: 'సారాంశం',
    keyPoints: 'ముఖ్యమైన సమాచారం',
    obligations: 'బాధ్యతలు',
    risks: 'ప్రమాదాలు',
    
    // Schemes
    findSchemes: 'ప్రభుత్వ పథకాలను కనుగొనండి',
    checkEligibility: 'అర్హతను తనిఖీ చేయండి',
    recommendations: 'సిఫార్సులు',
    allSchemes: 'అన్ని పథకాలు',
    benefits: 'ప్రయోజనాలు',
    requiredDocuments: 'అవసరం పత్రాలు',
    applicationProcess: 'దరఖాస్తు ప్రక్రియ',
    eligible: 'అర్హులు',
    notEligible: 'అనర్హులు',
    partialMatch: 'పాక్షిక మ్యాచ్',
    
    // Profile
    myProfile: 'నా ప్రొఫైల్',
    personalInfo: 'వ్యక్తిగత సమాచారం',
    accountSettings: 'ఖాతా సెట్టింగ్‌లు',
    deleteAccount: 'ఖాతాను తొలగించండి',
    confirmDelete: 'మీరు ఖచ్చితంగా మీ ఖాతాను తొలగించాలనుకుంటున్నారా?',
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
  }, [currentLanguage]);

  const t = (key) => {
    return translations[currentLanguage][key] || key;
  };

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t,
    languages: LANGUAGES,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
