import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: "Hello! I'm your intelligent banking assistant. I can help you with government schemes, credit scores, loans, and banking services. What would you like to explore today? 🚀",
      assistant: "Banking Assistant",
      typeMessage: "Type your message...",
    }
  },
  hi: {
    translation: {
      welcome: "नमस्ते! मैं आपका बुद्धिमान बैंकिंग सहायक हूँ। मैं सरकारी योजनाओं, क्रेडिट स्कोर, ऋण और बैंकिंग सेवाओं में आपकी सहायता कर सकता हूँ। आज आप क्या जानना चाहेंगे? 🚀",
      assistant: "बैंकिंग सहायक",
      typeMessage: "अपना संदेश लिखें...",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
