import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Chatbot.css';
import { mockSchemes, loanTypes, creditTips } from '../utils/mockData';

const Chatbot = ({ currentUser, isAuthenticated }) => {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  // Conversation state management with context types
  const [conversationContext, setConversationContext] = useState({
    awaitingConfirmation: false,
    confirmationType: null, // 'scheme' or 'loan'
    currentItem: null // current scheme or loan object
  });

  // Translations
  const translations = {
    en: {
      welcome: "Namaste! I'm Bhoomi ,your assistant. How may I assist you today?",
      assistant: "Bhoomi",
      onlineReady: "Online & Ready",
      quickOptions: "💡 Quick Options:",
      typeMessage: "Type your message or use voice...",
      schemes: "Government schemes",
      creditScore: "Credit score check",
      loanAssist: "Loan assistance",
      applicationHelp: "Application help",
      bankingServices: "Banking services",
      trackApps: "Track applications",
      voiceMuted: "Voice responses muted",
      voiceEnabled: "Voice responses enabled"
    },
    hi: {
      welcome: "नमस्ते! मैं आपकी भूमि हूँ। आज मैं आपकी कैसे सहायता कर सकती हूँ?",
      assistant: "भूमि",
      onlineReady: "ऑनलाइन और तैयार",
      quickOptions: "💡 त्वरित विकल्प:",
      typeMessage: "अपना संदेश टाइप करें या आवाज़ का उपयोग करें...",
      schemes: "सरकारी योजनाएं",
      creditScore: "क्रेडिट स्कोर जांच",
      loanAssist: "ऋण सहायता",
      applicationHelp: "आवेदन सहायता",
      bankingServices: "बैंकिंग सेवाएं",
      trackApps: "आवेदन ट्रैक करें",
      voiceMuted: "आवाज़ की प्रतिक्रियाएं बंद कर दी गई हैं",
      voiceEnabled: "आवाज़ की प्रतिक्रियाएं चालू कर दी गई हैं"
    }
  };

  const t = (key) => translations[language][key] || key;

  // Initialize voices and load them
  useEffect(() => {
    const loadVoices = () => {
      if ('speechSynthesis' in window) {
        const voices = speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log('Voices loaded:', voices.length);
          
          // Log available voices for debugging
          const hindiVoices = voices.filter(v => v.lang.includes('hi'));
          const femaleVoices = voices.filter(v => 
            v.name.toLowerCase().includes('female') ||
            v.name.toLowerCase().includes('woman') ||
            v.name.toLowerCase().includes('aditi') ||
            v.name.toLowerCase().includes('raveena')
          );

          console.log('Hindi voices:', hindiVoices.map(v => `${v.name} (${v.lang})`));
          console.log('Female voices:', femaleVoices.map(v => `${v.name} (${v.lang})`));
        }
      }
    };

    // Load voices immediately and on voiceschanged event
    loadVoices();
    if ('speechSynthesis' in window) {
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }

    // Check browser compatibility
    const isChrome = /Chrome/.test(navigator.userAgent);
    const isEdge = /Edge/.test(navigator.userAgent);
    if (!isChrome && !isEdge && language === 'hi') {
      console.warn('Hindi TTS works best in Chrome or Edge browsers');
    }

    return () => {
      if ('speechSynthesis' in window) {
        speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
    };
  }, [language]);

  // Initialize welcome message
  useEffect(() => {
    setMessages([{
      id: 1,
      text: t('welcome'),
      from: 'bot',
      timestamp: new Date()
    }]);
  }, [language]);

  // Enhanced voice selection specifically for Hindi
  const selectBestFemaleVoice = (targetLanguage) => {
    if (!voicesLoaded || availableVoices.length === 0) {
      return null;
    }

    console.log('Selecting voice for language:', targetLanguage);
    console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));

    if (targetLanguage === 'hi') {
      // Priority order for Hindi voices
      const hindiPriorities = [
        // Exact Hindi voices
        (voice) => voice.lang === 'hi-IN' && voice.name.toLowerCase().includes('female'),
        (voice) => voice.lang === 'hi-IN' && voice.name.toLowerCase().includes('woman'),
        (voice) => voice.lang === 'hi-IN' && voice.name.toLowerCase().includes('aditi'),
        (voice) => voice.lang === 'hi-IN' && voice.name.toLowerCase().includes('raveena'),
        (voice) => voice.lang === 'hi-IN',
        // Hindi variants
        (voice) => voice.lang.includes('hi') && voice.name.toLowerCase().includes('female'),
        (voice) => voice.lang.includes('hi'),
        // English-Indian as fallback
        (voice) => voice.lang === 'en-IN' && voice.name.toLowerCase().includes('female'),
        (voice) => voice.lang === 'en-IN',
        // Any female voice
        (voice) => voice.name.toLowerCase().includes('female'),
        (voice) => voice.name.toLowerCase().includes('woman')
      ];

      for (const priority of hindiPriorities) {
        const matchedVoice = availableVoices.find(priority);
        if (matchedVoice) {
          console.log(`Selected Hindi voice: ${matchedVoice.name} (${matchedVoice.lang})`);
          return matchedVoice;
        }
      }
    } else {
      // English voice selection
      const englishPriorities = [
        (voice) => voice.lang === 'en-IN' && voice.name.toLowerCase().includes('female'),
        (voice) => voice.lang === 'en-IN',
        (voice) => voice.lang === 'en-US' && voice.name.toLowerCase().includes('female'),
        (voice) => voice.name.toLowerCase().includes('zira'),
        (voice) => voice.name.toLowerCase().includes('susan'),
        (voice) => voice.name.toLowerCase().includes('female'),
        (voice) => voice.name.toLowerCase().includes('woman')
      ];

      for (const priority of englishPriorities) {
        const matchedVoice = availableVoices.find(priority);
        if (matchedVoice) {
          console.log(`Selected English voice: ${matchedVoice.name} (${matchedVoice.lang})`);
          return matchedVoice;
        }
      }
    }

    console.log('No suitable voice found, using default');
    return availableVoices[0] || null;
  };

  // Enhanced text cleaning for Hindi
  const cleanTextForSpeech = (text) => {
    let cleanText = text;

    if (language === 'hi') {
      // Hindi-specific cleaning
      cleanText = cleanText
        // Keep Devanagari characters
        .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
        // Remove markdown but keep Hindi text
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        // Replace line breaks with pauses
        .replace(/\n\n/g, '। ')
        .replace(/\n/g, ' ')
        // Remove bullet points but keep content
        .replace(/•\s/g, '')
        .replace(/\d+\.\s/g, '')
        .replace(/^\s*-\s/gm, '')
        // Convert English numbers to Hindi pronunciation
        .replace(/₹/g, 'रुपये')
        .replace(/%/g, 'प्रतिशत')
        .replace(/EMI/g, 'ई एम आई')
        .replace(/MUDRA/g, 'मुद्रा')
        .replace(/PMJDY/g, 'पी एम जे डी वाई')
        .replace(/CIBIL/g, 'सिबिल')
        // Add pronunciation helpers for numbers
        .replace(/750/g, 'सात सौ पचास')
        .replace(/650/g, 'छह सौ पचास')
        .replace(/50,000/g, 'पचास हजार')
        .replace(/20/g, 'बीस')
        .replace(/30/g, 'तीस');
    } else {
      // English cleaning
      cleanText = cleanText
        .replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '')
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/\n\n/g, '. ')
        .replace(/\n/g, ' ')
        .replace(/•\s/g, '')
        .replace(/\d+\.\s/g, '')
        .replace(/^\s*-\s/gm, '')
        .replace(/₹/g, 'rupees')
        .replace(/%/g, 'percent')
        .replace(/EMI/g, 'E M I')
        .replace(/MUDRA/g, 'MUDRA')
        .replace(/PMJDY/g, 'P M J D Y');
    }

    return cleanText.replace(/\s+/g, ' ').trim();
  };

  // Enhanced speech function with better Hindi support
  const speak = async (text) => {
    if (isMuted || !text || !voicesLoaded) {
      console.log('Speech skipped:', { isMuted, hasText: !!text, voicesLoaded });
      return;
    }

    // Stop any current speech
    if (isSpeaking) {
      speechSynthesis.cancel();
      await new Promise(resolve => setTimeout(resolve, 100)); // Wait for cancellation
    }

    const cleanText = cleanTextForSpeech(text);
    console.log(`Speaking in ${language}:`, cleanText);

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Select the best voice for the current language
    const selectedVoice = selectBestFemaleVoice(language);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
    } else {
      console.log('No voice selected, using default');
    }

    // Configure speech parameters based on language
    if (language === 'hi') {
      // Hindi-specific settings
      utterance.lang = 'hi-IN';
      utterance.rate = 0.9; // Slower for Hindi clarity
      utterance.pitch = 1.1; // Moderate pitch for female voice
      utterance.volume = 0.9; // Higher volume for clarity

      // If no Hindi voice found, try with en-IN and higher pitch
      if (!selectedVoice || !selectedVoice.lang.includes('hi')) {
        utterance.lang = 'en-IN';
        utterance.pitch = 1.4; // Higher pitch to sound more feminine
        utterance.rate = 0.6; // Even slower for non-native Hindi voice
      }
    } else {
      // English settings
      utterance.lang = selectedVoice?.lang.includes('IN') ? 'en-IN' : 'en-US';
      utterance.rate = 0.8;
      utterance.pitch = 1.2;
      utterance.volume = 0.85;
    }

    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log(`Speech started in ${language}`);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      console.log(`Speech ended in ${language}`);
    };

    utterance.onerror = (event) => {
      setIsSpeaking(false);
      console.error(`Speech error in ${language}:`, event.error, event);

      // Fallback for Hindi - try with different settings
      if (language === 'hi' && event.error !== 'synthesis-failed') {
        console.log('Retrying Hindi speech with fallback settings...');
        setTimeout(() => {
          const fallbackUtterance = new SpeechSynthesisUtterance(cleanText);
          fallbackUtterance.lang = 'en-US'; // Use English voice for Hindi text
          fallbackUtterance.rate = 0.6;
          fallbackUtterance.pitch = 1.5;
          fallbackUtterance.volume = 0.9;
          fallbackUtterance.onstart = () => setIsSpeaking(true);
          fallbackUtterance.onend = () => setIsSpeaking(false);
          fallbackUtterance.onerror = () => setIsSpeaking(false);
          speechSynthesis.speak(fallbackUtterance);
        }, 500);
      }
    };

    utterance.onpause = () => {
      console.log('Speech paused');
    };

    utterance.onresume = () => {
      console.log('Speech resumed');
    };

    // Speak the text
    try {
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

  // Stop speech function
  const stopSpeech = () => {
    try {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
    setIsSpeaking(false);
  };

  // Toggle mute function
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopSpeech();
    }
    const feedbackMessage = !isMuted ? t('voiceMuted') : t('voiceEnabled');
    appendMessage(feedbackMessage, 'system');
  };

  // Language change handler
  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    stopSpeech(); // Stop current speech when changing language
    
    const changeMessage = newLang === 'hi' ? 
      'भाषा हिंदी में बदल गई है। अब मैं हिंदी में जवाब दूंगी।' :
      'Language changed to English. I will now respond in English.';
    appendMessage(changeMessage, 'system');
  };

  // Speech Recognition
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const errorMsg = language === 'hi' ? 
        'स्पीच रिकग्निशन आपके ब्राउज़र में समर्थित नहीं है।' :
        'Speech recognition is not supported in your browser.';
      appendMessage(errorMsg, 'bot');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setIsRecording(true);
    };
    
    recognitionRef.current.onend = () => {
      setIsListening(false);
      setIsRecording(false);
    };
    
    recognitionRef.current.onerror = (event) => {
      setIsListening(false);
      setIsRecording(false);
      const errorMsg = language === 'hi' ? 
        `स्पीच त्रुटि: ${event.error}` :
        `Speech error: ${event.error}`;
      appendMessage(errorMsg, 'bot');
    };
    
    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    
    recognitionRef.current.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Enhanced test speech function
  const testSpeech = () => {
    const testMessages = {
      en: "Hello! This is a test of my English voice. I am your banking assistant.",
      hi: "नमस्ते! यह मेरी हिंदी आवाज़ का परीक्षण है। मैं आपकी बैंकिंग सहायक हूँ।"
    };
    
    console.log(`Testing speech in ${language}`);
    speak(testMessages[language]);
  };

  // Voice diagnosis function
  const diagnoseVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log('=== VOICE DIAGNOSIS ===');
    console.log('Total voices available:', voices.length);
    
    const hindiVoices = voices.filter(v => v.lang.includes('hi'));
    console.log('Hindi voices:', hindiVoices.map(v => `${v.name} (${v.lang})`));
    
    const indianVoices = voices.filter(v => v.lang.includes('IN'));
    console.log('Indian voices:', indianVoices.map(v => `${v.name} (${v.lang})`));
    
    const femaleVoices = voices.filter(v => 
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('woman')
    );
    console.log('Female voices:', femaleVoices.map(v => `${v.name} (${v.lang})`));
    
    return {
      total: voices.length,
      hindi: hindiVoices.length,
      indian: indianVoices.length,
      female: femaleVoices.length,
      selectedForHindi: selectBestFemaleVoice('hi'),
      selectedForEnglish: selectBestFemaleVoice('en')
    };
  };

  // Navigate to schemes page using React Router (preserves login state)
  const redirectToSchemePage = (schemeId) => {
    setTimeout(() => {
      // Use React Router navigation - preserves app state and login
      navigate(`/schemes?highlight=${schemeId}`);

      // Keep chatbot open but minimize it
      setOpen(true);

      // Show success message in chatbot
      setTimeout(() => {
        appendMessage(
          language === 'hi' ?
            '✅ स्कीम पेज खुल गया है। आप वापस चैटबॉट खोल सकते हैं।' :
            '✅ Schemes page opened. You can reopen the chatbot anytime.',
          'system'
        );
      }, 1000);
    }, 1000);
  };

  // Enhanced response generator with schemes display and loan handling
  const generateSchemeResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const isHindiInput = /[अ-ह]/.test(userInput);
    const responseLanguage = isHindiInput ? 'hi' : language;

    // Show all schemes
    if (/show.*scheme|list.*scheme|available.*scheme|all.*scheme|योजना.*दिखाएं|सभी.*योजना/.test(input)) {
      let response = responseLanguage === 'hi' ? 
        'यहाँ सभी उपलब्ध सरकारी योजनाएं हैं:\n\n' :
        'Here are all available government schemes:\n\n';

      mockSchemes.forEach((scheme, index) => {
        response += `${index + 1}. **${scheme.name}**\n`;
        response += `${scheme.description}\n`;
        response += `📋 Eligibility: ${scheme.eligibility}\n`;
        response += `⏱️ Processing: ${scheme.processingTime}\n`;
        response += `🔗 Apply: ${scheme.applicationLink}\n`;
        response += `📞 Contact: ${scheme.contactInfo}\n\n`;
      });

      response += responseLanguage === 'hi' ? 
        'किसी विशिष्ट योजना के बारे में जानने के लिए उसका नाम बताएं।' :
        'Ask about any specific scheme by mentioning its name.';

      return response;
    }

    // Show specific scheme details
    const foundScheme = mockSchemes.find(scheme => 
      input.includes(scheme.name.toLowerCase()) ||
      input.includes(scheme.id.toLowerCase()) ||
      (input.includes('pmjdy') && scheme.id === 'pmjdy') ||
      (input.includes('jan dhan') && scheme.id === 'pmjdy') ||
      (input.includes('mudra') && scheme.id === 'pmmy')
    );

    if (foundScheme) {
      // Set context for scheme confirmation
      setConversationContext({
        awaitingConfirmation: true,
        confirmationType: 'scheme',
        currentItem: foundScheme
      });

      let response = `**${foundScheme.name}**\n\n`;
      response += `📝 **Description:** ${foundScheme.description}\n\n`;
      response += `✨ **Key Benefits:**\n${foundScheme.benefits.map(b => `• ${b}`).join('\n')}\n\n`;
      response += `👥 **Eligibility:** ${foundScheme.eligibility}\n\n`;
      response += `📄 **Required Documents:** ${foundScheme.documents.join(', ')}\n\n`;
      response += `⏱️ **Processing Time:** ${foundScheme.processingTime}\n\n`;
      response += `📞 **Contact Info:** ${foundScheme.contactInfo}\n\n`;
      
      response += responseLanguage === 'hi' ? 
        'क्या आप इस योजना के लिए आवेदन करना चाहते हैं?' :
        'Would you like to apply for this scheme?';

      return response;
    }

    return null; // Let other response handlers process the input
  };

  const generateLoanResponse = (userInput) => {
    const input = userInput.toLowerCase();
    const isHindiInput = /[अ-ह]/.test(userInput);
    const responseLanguage = isHindiInput ? 'hi' : language;

    // Show all loan types
    if (/loan.*type|available.*loan|loan.*option|ऋण.*प्रकार|उपलब्ध.*ऋण/.test(input)) {
      let response = responseLanguage === 'hi' ? 
        'यहाँ उपलब्ध ऋण विकल्प हैं:\n\n' :
        'Here are the available loan options:\n\n';

      loanTypes.forEach((loan, index) => {
        response += `${index + 1}. **${loan.name}**\n`;
        response += `${loan.description}\n`;
        response += `💰 Max Amount: ₹${loan.maxAmount.toLocaleString()}\n`;
        response += `📊 Interest Rate: ${loan.interestRate}\n`;
        response += `⏰ Tenure: ${loan.tenure}\n`;
        response += `💳 Processing Fee: ${loan.processingFee}\n\n`;
      });

      response += responseLanguage === 'hi' ? 
        'किस प्रकार के ऋण के लिए आवेदन करना चाहते हैं?' :
        'Which type of loan would you like to apply for?';

      return response;
    }

    // Handle loan application request
    if (/apply.*loan|loan.*apply|want.*loan|need.*loan|ऋण.*आवेदन|लोन.*चाहिए/.test(input)) {
      // Check for specific loan type
      const requestedLoan = loanTypes.find(loan =>
        input.includes(loan.name.toLowerCase()) ||
        input.includes(loan.id.toLowerCase()) ||
        (input.includes('micro') && loan.id === 'microloan') ||
        (input.includes('personal') && loan.id === 'personal') ||
        (input.includes('home') && loan.id === 'home') ||
        (input.includes('mudra') && loan.id === 'mudra')
      );

      if (requestedLoan) {
        // Set context for loan confirmation
        setConversationContext({
          awaitingConfirmation: true,
          confirmationType: 'loan',
          currentItem: requestedLoan
        });

        let response = `**${requestedLoan.name}**\n\n`;
        response += `📝 **Description:** ${requestedLoan.description}\n\n`;
        response += `💰 **Max Amount:** ₹${requestedLoan.maxAmount.toLocaleString()}\n`;
        response += `📊 **Interest Rate:** ${requestedLoan.interestRate}\n`;
        response += `⏰ **Tenure:** ${requestedLoan.tenure}\n`;
        response += `💳 **Processing Fee:** ${requestedLoan.processingFee}\n\n`;
        
        response += responseLanguage === 'hi' ?
          'क्या आप इस लोन के लिए आवेदन करना चाहते हैं?' :
          'Would you like to apply for this loan?';

        return response;
      } else {
        let response = responseLanguage === 'hi' ? 
          'कृपया ऋण का प्रकार चुनें:\n\n' :
          'Please select the type of loan:\n\n';

        loanTypes.forEach((loan, index) => {
          response += `${index + 1}. ${loan.name} - ₹${loan.maxAmount.toLocaleString()} तक\n`;
        });

        response += responseLanguage === 'hi' ? 
          '\nकिस प्रकार के ऋण के लिए आवेदन करना चाहते हैं?' :
          '\nWhich type of loan would you like to apply for?';

        return response;
      }
    }

    return null;
  };

  // Response generator with enhanced responses
  const generateResponse = (userInput) => {
    // Handle contextual "yes" responses first
    const input = userInput.toLowerCase();

    if (/^(yes|हां|ha|sure|ok|okay|definitely|जरूर|बिल्कुल|apply|आवेदन)$/i.test(input.trim())) {
      if (conversationContext.awaitingConfirmation) {

        // SCHEME APPLICATION - Navigate to schemes page
        if (conversationContext.confirmationType === 'scheme' && conversationContext.currentItem) {
          const scheme = conversationContext.currentItem;

          // Clear context
          setConversationContext({
            awaitingConfirmation: false,
            confirmationType: null,
            currentItem: null
          });

          // Navigate to schemes page
          redirectToSchemePage(scheme.id);

          return language === 'hi' ?
            `🎉 बढ़िया! ${scheme.name} के लिए स्कीम पेज खोल रहे हैं...\n\n📍 आपको संबंधित योजना दिखाई जाएगी जहाँ आप आवेदन कर सकते हैं।\n\n💬 स्कीम पेज देखने के बाद आप वापस चैटबॉट खोल सकते हैं।` :
            `🎉 Great! Opening schemes page for ${scheme.name}...\n\n📍 You'll see the relevant scheme where you can apply.\n\n💬 You can reopen the chatbot after viewing the schemes page.`;
        }

        // LOAN APPLICATION - Open financial modal
        if (conversationContext.confirmationType === 'loan' && conversationContext.currentItem) {
          const loan = conversationContext.currentItem;

          // Clear context
          setConversationContext({
            awaitingConfirmation: false,
            confirmationType: null,
            currentItem: null
          });

          // Open financial modal
          setTimeout(() => {
            navigate('/microlendingPage');

            // Keep chatbot open but minimize it
            setOpen(false);

            // Show success message in chatbot
            setTimeout(() => {
              appendMessage(
                language === 'hi' ?
                  '✅ लोन आवेदन पेज खुल गया है। आप वापस चैटबॉट खोल सकते हैं।' :
                  '✅ Loan application page opened. You can reopen the chatbot anytime.',
                'system'
              );
            }, 1000);
          }, 1000);


          return language === 'hi' ?
            `✅ समझ गया! ${loan.name} के लिए फॉर्म खोल रहे हैं...\n\n📋 कृपया वित्तीय विवरण भरें।` :
            `✅ Got it! Opening form for ${loan.name}...\n\n📋 Please fill the financial details.`;
        }
      }
    }

    // Try scheme-specific responses first
    const schemeResponse = generateSchemeResponse(userInput);
    if (schemeResponse) return schemeResponse;

    // Try loan-specific responses
    const loanResponse = generateLoanResponse(userInput);
    if (loanResponse) return loanResponse;

    const isHindiInput = /[अ-ह]/.test(userInput);
    const responseLanguage = isHindiInput ? 'hi' : language;

    // Voice diagnosis command
    if (/voice.*diagnosis|diagnose.*voice|check.*voice|voice.*debug|आवाज़.*जांच/.test(input)) {
      const diagnosis = diagnoseVoices();
      if (responseLanguage === 'hi') {
        return `आवाज़ निदान:\nकुल आवाज़ें: ${diagnosis.total}\nहिंदी आवाज़ें: ${diagnosis.hindi}\nभारतीय आवाज़ें: ${diagnosis.indian}\nमहिला आवाज़ें: ${diagnosis.female}\n\nहिंदी के लिए चुनी गई आवाज़: ${diagnosis.selectedForHindi?.name || 'कोई नहीं'}\n\nयदि हिंदी आवाज़ काम नहीं कर रही है तो कृपया क्रोम ब्राउज़र का उपयोग करें।`;
      } else {
        return `Voice Diagnosis:\nTotal voices: ${diagnosis.total}\nHindi voices: ${diagnosis.hindi}\nIndian voices: ${diagnosis.indian}\nFemale voices: ${diagnosis.female}\n\nSelected for Hindi: ${diagnosis.selectedForHindi?.name || 'None'}\nSelected for English: ${diagnosis.selectedForEnglish?.name || 'None'}\n\nIf Hindi speech is not working, please try Chrome browser.`;
      }
    }

    // Hindi speech problems
    if (/hindi.*not.*working|हिंदी.*काम.*नहीं|speech.*problem/.test(input)) {
      if (responseLanguage === 'hi') {
        return `हिंदी आवाज़ की समस्या का समाधान:\n\n1. क्रोम ब्राउज़र का उपयोग करें\n2. ब्राउज़र सेटिंग्स में जाएं\n3. Advanced > Accessibility\n4. "Use built-in accessibility features" चालू करें\n5. Windows में Hindi language pack इंस्टॉल करें\n\nफिर "आवाज़ जांच" बटन दबाएं।`;
      } else {
        return `Hindi speech troubleshooting:\n\n1. Use Chrome browser for best results\n2. Go to browser Settings\n3. Advanced > Accessibility\n4. Enable "Use built-in accessibility features"\n5. Install Hindi language pack in Windows\n6. Try "Voice Check" button\n\nIf still not working, Hindi text will be read by English voice.`;
      }
    }

    // Test speech command
    if (/test.*speech|speech.*test|voice.*test|test.*voice|आवाज़.*टेस्ट|टेस्ट.*आवाज़/.test(input)) {
      testSpeech();
      return responseLanguage === 'hi' ? 
        'आवाज़ का परीक्षण कर रही हूँ। क्या आप मुझे सुन सकते हैं? यदि आवाज़ सुनाई नहीं दे रही है तो कृपया अपने ब्राउज़र की आवाज़ सेटिंग्स जांचें।' :
        'Testing my voice. Can you hear me clearly? If you cannot hear me, please check your browser audio settings.';
    }

    // Greetings
    if (/^(hi|hello|hey|namaste|नमस्ते|good morning|good afternoon|good evening)/.test(input)) {
      if (responseLanguage === 'hi') {
        return `नमस्ते! मैं आपकी बैंकिंग सहायक हूँ। आज मैं आपकी कैसे सहायता कर सकती हूँ? मैं सरकारी योजनाओं, बैंकिंग सेवाओं और ऋण आवेदनों में आपकी मदद कर सकती हूँ।`;
      } else {
        return `Namaste! I am your banking assistant. How may I help you today? I can assist you with government schemes, banking services, and loan applications.`;
      }
    }
    
    // Credit score responses
    if (/credit\s*score|credit\s*rating|score|rating|cibil|क्रेडिट|स्कोर/.test(input)) {
      if (responseLanguage === 'hi') {
        if (currentUser?.creditScore) {
          const scoreComment = currentUser.creditScore >= 750 ? 'बहुत बढ़िया स्कोर!' : 
                             currentUser.creditScore >= 650 ? 'अच्छा स्कोर!' : 'हम इसे सुधार सकते हैं!';
          return `आपका वर्तमान क्रेडिट स्कोर ${currentUser.creditScore} है। ${scoreComment}\n\nसुझाव: सभी बिलों का समय पर भुगतान करें और क्रेडिट उपयोग तीस प्रतिशत से कम रखें।\n\nक्या आप चाहेंगे कि मैं आपको स्कोर बढ़ाने की व्यक्तिगत रणनीति दूं?`;
        }
        return `मैं क्रेडिट स्कोर के बारे में समझाने में खुशी से मदद करूंगी!\n\nक्रेडिट स्कोर आपकी वित्तीय रिपोर्ट कार्ड की तरह है।\n\nस्कोर रेंज:\n- सात सौ पचास से आठ सौ पचास: उत्कृष्ट\n- छह सौ पचास से सात सौ उनचास: अच्छा\n- छह सौ पचास से कम: सुधार की जरूरत\n\nक्या आप चाहेंगे कि मैं मजबूत क्रेडिट स्कोर बनाने की विधि समझाऊं?`;
      } else {
        if (currentUser?.creditScore) {
          const scoreComment = currentUser.creditScore >= 750 ? 'Excellent score!' : 
                             currentUser.creditScore >= 650 ? 'Good score!' : 'We can improve this!';
          return `Your current credit score is ${currentUser.creditScore}. ${scoreComment}\n\nPro Tip: Pay all bills on time and keep credit utilization below thirty percent.\n\nShall I provide you with personalized strategies to boost your score further?`;
        }
        return `I will be happy to explain credit scores to you!\n\nCredit score is like your financial report card - it shows how good you are with money.\n\nScore Ranges:\n- Seven fifty to eight fifty: Excellent\n- Six fifty to seven forty nine: Good\n- Below six fifty: Needs improvement\n\nWould you like me to explain how to build a strong credit score?`;
      }
    }
    
    // Loan responses
    if (/loan|lend|borrow|finance|money|microlend|mudra|ऋण|लोन|पैसा/.test(input)) {
      if (responseLanguage === 'hi') {
        return `बिल्कुल! मैं ऋण की जानकारी में आपकी पूरी सहायता करूंगी!\n\nहमारे ऋण विकल्प:\n- माइक्रो लेंडिंग: पचास हजार रुपये तक का त्वरित ऋण\n- मुद्रा ऋण: व्यापार के लिए बीस लाख रुपये तक\n- व्यक्तिगत ऋण प्रतिस्पर्धी दरों के साथ\n- गृह ऋण आकर्षक ब्याज दरों के साथ\n\nक्या मैं आपको आवेदन करने में या ई एम आई की गणना करने में सहायता करूं?`;
      } else {
        return `Absolutely! I can help you completely with loan information!\n\nOur loan options:\n- Microlending: Quick loans up to fifty thousand rupees\n- MUDRA Loans: Business loans up to twenty lakh rupees\n- Personal loans with competitive rates\n- Home loans with attractive interest rates\n\nShall I help you apply or calculate EMI?`;
      }
    }
    
    // Banking services
    if (/bank|account|balance|transfer|withdraw|deposit|बैंक|खाता|बैलेंस/.test(input)) {
      if (responseLanguage === 'hi') {
        return `हमारी बैंकिंग सेवाएं सभी के लिए हैं!\n\nउपलब्ध सेवाएं:\n- शून्य बैलेंस बचत खाते\n- मोबाइल बैंकिंग\n- सुरक्षित लेनदेन\n- किराना स्टोर से नकद निकासी\n- त्वरित मनी ट्रांसफर\n\nकौन सी सेवा में आपकी रुचि है?`;
      } else {
        return `Our banking services are designed for everyone!\n\nAvailable Services:\n- Zero balance savings accounts\n- Mobile banking\n- Secure transactions\n- Cash withdrawal from kirana stores\n- Instant money transfers\n\nWhat specific service interests you?`;
      }
    }

    // Government schemes
    if (/scheme|yojana|योजना|policy|benefit|subsidy|government|सरकारी|pmjdy|mudra|pmsby|show.*scheme|apply.*scheme|scheme.*apply/.test(input)) {
      if (responseLanguage === 'hi') {
        return `मैं आपको सही सरकारी योजना ढूंढने में मदद कर सकती हूँ!\n\nमुख्य सरकारी योजनाएं:\n\n🏦 **प्रधानमंत्री जन धन योजना (PMJDY)**\n- शून्य बैलेंस बैंक खाता\n- मुफ्त रुपे डेबिट कार्ड\n- 10,000 रुपये तक ओवरड्राफ्ट\n\n💰 **मुद्रा योजना**\n- 20 लाख रुपये तक बिना गारंटी ऋण\n- छोटे व्यापार के लिए\n\n🛡️ **प्रधानमंत्री सुरक्षा बीमा योजना (PMSBY)**\n- सिर्फ 20 रुपये सालाना प्रीमियम\n- 2 लाख रुपये का दुर्घटना बीमा\n\n👴 **अटल पेंशन योजना (APY)**\n- 60 साल की उम्र में गारंटीड पेंशन\n- 1,000 से 5,000 रुपये मासिक पेंशन\n\nकौन सी योजना आपको दिलचस्प लगती है? क्या आप किसी खास योजना के लिए आवेदन करना चाहते हैं?`;
      } else {
        return `I can help you find the perfect government scheme!\n\n**Major Government Schemes:**\n\n🏦 **Pradhan Mantri Jan Dhan Yojana (PMJDY)**\n- Zero balance bank account\n- Free RuPay debit card\n- Overdraft facility up to Rs. 10,000\n\n💰 **MUDRA Yojana**\n- Loans up to Rs. 20 lakh without collateral\n- Support for small businesses\n\n🛡️ **Pradhan Mantri Suraksha Bima Yojana (PMSBY)**\n- Only Rs. 20 annual premium\n- Rs. 2 lakh accident insurance coverage\n\n👴 **Atal Pension Yojana (APY)**\n- Guaranteed pension at age 60\n- Monthly pension from Rs. 1,000 to Rs. 5,000\n\nWhich scheme interests you? Would you like to apply for any specific scheme?`;
      }
    }

    if (/apply|application|form|document|how to|process|आवेदन|दस्तावेज|कैसे/.test(input)) {
      if (responseLanguage === 'hi') {
        return `मैं आपको आवेदन प्रक्रिया के बारे में विस्तार से बताती हूँ!\n\n**📋 सामान्य आवेदन प्रक्रिया:**\n\n**चरण 1: योजना चुनें**\n- सबसे पहले हमारे स्कीम ओवरव्यू पेज पर जाएं\n- अपनी आवश्यकता के अनुसार सही योजना का चयन करें\n- प्रत्येक योजना की पात्रता और लाभों को ध्यान से पढ़ें\n\n**चरण 2: पात्रता जांच**\n- चयनित योजना की पात्रता मापदंड जांचें\n- आवश्यक दस्तावेजों की सूची देखें\n- अपनी आयु, आय और अन्य शर्तों की पुष्टि करें\n\n**चरण 3: दस्तावेज तैयार करें**\n- आधार कार्ड (मोबाइल से लिंक)\n- बैंक खाता विवरण\n- आय प्रमाण पत्र\n- निवास प्रमाण पत्र\n- पासपोर्ट साइज फोटो\n\n**चरण 4: ऑनलाइन आवेदन**\n- योजना के आवेदन फॉर्म को भरें\n- सभी दस्तावेज अपलोड करें\n- फॉर्म को सबमिट करने से पहले सभी जानकारी की जांच करें\n\n**चरण 5: ट्रैकिंग और फॉलो-अप**\n- आवेदन संख्या नोट करें\n- नियमित रूप से स्थिति की जांच करें\n- 7-15 कार्य दिवसों में प्रक्रिया पूर्ण होती है\n\n**🔗 विस्तृत जानकारी के लिए:**\nकृपया हमारे स्कीम ओवरव्यू पेज पर जाएं और अपनी पसंदीदा योजना का चयन करें। वहाँ आपको प्रत्येक योजना की संपूर्ण आवेदन प्रक्रिया मिलेगी।\n\nक्या आप किसी विशिष्ट योजना के लिए आवेदन करना चाहते हैं?`;
      } else {
        return `I'll explain the detailed application process for you!\n\n**📋 General Application Process:**\n\n**Step 1: Choose Your Scheme**\n- First, visit our Scheme Overview page\n- Select the right scheme based on your needs\n- Carefully read eligibility criteria and benefits for each scheme\n\n**Step 2: Eligibility Check**\n- Verify you meet the selected scheme's eligibility criteria\n- Review the required documents list\n- Confirm your age, income, and other conditions\n\n**Step 3: Prepare Documents**\n- Aadhaar Card (linked to mobile)\n- Bank account details\n- Income proof (salary slip or ITR)\n- Address proof\n- Passport size photographs\n\n**Step 4: Online Application**\n- Fill out the scheme application form\n- Upload all required documents\n- Review all information before submitting\n\n**Step 5: Tracking and Follow-up**\n- Note down your application number\n- Regularly check application status\n- Processing typically takes 7-15 working days\n\n**🔗 For Detailed Information:**\nPlease visit our Scheme Overview page and select your preferred scheme. There you'll find the complete application process for each individual scheme.\n\n**💡 Pro Tips:**\n- Double-check all documents before submission\n- Keep digital copies of all submitted documents\n- Use the 24/7 helpline for any queries\n\nWhich specific scheme would you like to apply for?`;
      }
    }

    // Scheme navigation help
    if (/find.*scheme|which.*scheme|scheme.*page|योजना.*खोज|कौन.*सी.*योजना/.test(input)) {
      if (responseLanguage === 'hi') {
        return `सही योजना खोजने के लिए इन चरणों का पालन करें:\n\n**🎯 योजना चुनने की गाइड:**\n\n**1. हमारे स्कीम ओवरव्यू पेज पर जाएं**\n- सभी उपलब्ध सरकारी योजनाओं की सूची देखें\n- प्रत्येक योजना का संक्षिप्त विवरण पढ़ें\n\n**2. श्रेणी के अनुसार फिल्टर करें:**\n- 🏦 वित्तीय समावेश (जन धन, PMSBY)\n- 💼 व्यापारिक ऋण (MUDRA, स्टैंड अप इंडिया)\n- 👴 पेंशन और बचत (APY, NSC)\n- 🎓 कौशल विकास (PMKVY)\n\n**3. अपनी स्थिति के अनुसार चुनें:**\n- आपकी उम्र और आय\n- व्यापार या नौकरी की स्थिति\n- परिवारिक परिस्थितियां\n\n**4. योजना पर क्लिक करें**\n- विस्तृत जानकारी पढ़ें\n- पात्रता मापदंड जांचें\n- आवेदन प्रक्रिया देखें\n\nकौन सी श्रेणी की योजना में आपकी रुचि है?`;
      } else {
        return `Here's how to find the right scheme for you:\n\n**🎯 Scheme Selection Guide:**\n\n**1. Visit Our Scheme Overview Page**\n- Browse all available government schemes\n- Read brief descriptions of each scheme\n\n**2. Filter by Category:**\n- 🏦 Financial Inclusion (Jan Dhan, PMSBY)\n- 💼 Business Loans (MUDRA, Stand Up India)\n- 👴 Pension & Savings (APY, NSC)\n- 🎓 Skill Development (PMKVY)\n\n**3. Match Your Profile:**\n- Your age and income level\n- Employment or business status\n- Family circumstances\n\n**4. Click on Scheme Details**\n- Read comprehensive information\n- Check eligibility criteria\n- Review application process\n\n**📍 Quick Navigation:**\nGo to our main menu → Schemes → Browse by category or use the search function\n\nWhich category of schemes interests you most?`;
      }
    }

    if (/yes|हां|ha|sure|ok|okay|definitely|जरूर|बिल्कुल/.test(input) && messages.some(msg => msg.text.includes('apply') || msg.text.includes('आवेदन'))) {
      if (responseLanguage === 'hi') {
        return `बहुत बढ़िया! मैं आपकी आवेदन प्रक्रिया में मदद करूंगी।\n\n🎯 **अगले कदम:**\n1. आधार कार्ड तैयार रखें\n2. बैंक खाता पासबुक\n3. मोबाइल नंबर (OTP के लिए)\n4. आय प्रमाण पत्र\n\n📱 **आवेदन करने के तरीके:**\n- ऑनलाइन पोर्टल के माध्यम से\n- नजदीकी बैंक शाखा में जाकर\n- CSC केंद्र (कॉमन सर्विस सेंटर) के माध्यम से\n\nक्या आप चाहेंगे कि मैं आपको ऑनलाइन आवेदन प्रक्रिया के बारे में विस्तार से बताऊं?`;
      } else {
        return `Excellent! I'll help you with the application process.\n\n🎯 **Next Steps:**\n1. Keep your Aadhaar card ready\n2. Bank account passbook\n3. Mobile number (for OTP)\n4. Income proof documents\n\n📱 **Ways to Apply:**\n- Through online portal\n- Visit nearest bank branch\n- Through CSC center (Common Service Center)\n\nWould you like me to explain the online application process in detail?`;
      }
    }

    // Thanks responses
    if (/thank|thanks|thank you|thank u|धन्यवाद|शुक्रिया/.test(input)) {
      if (responseLanguage === 'hi') {
        return `आपका स्वागत है! मैं हमेशा आपकी मदद के लिए यहाँ हूँ। बैंकिंग और योजनाओं में कोई भी सवाल हो तो पूछिए!`;
      } else {
        return `You're very welcome! I'm always here to help with your banking and scheme needs. Feel free to ask me anything!`;
      }
    }

    // Goodbye responses
    if (/bye|goodbye|see you|अलविदा|नमस्कार/.test(input)) {
      if (responseLanguage === 'hi') {
        return `अलविदा! याद रखिए, मैं चौबीस घंटे यहाँ हूँ आपके बैंकिंग और योजना प्रश्नों के लिए। अच्छा दिन हो!`;
      } else {
        return `Goodbye! Remember, I'm here twenty four seven for all your banking and scheme queries. Have a great day!`;
      }
    }
    
    // Default response
    if (responseLanguage === 'hi') {
      return `मैं यहाँ सरकारी योजनाओं, बैंकिंग और ऋणों में मदद के लिए हूँ!\n\n🤝 **मैं आपकी इन चीजों में मदद कर सकती हूँ:**\n- सरकारी योजना विवरण और आवेदन\n- ऋण आवेदन और EMI गणना\n- बैंकिंग सेवाएं और खाता खोलना\n- क्रेडिट स्कोर सुधार\n\nकृपया बताएं कि आपको किस विषय में जानकारी चाहिए?`;
    } else {
      return `I'm here to help with government schemes, banking, and loans!\n\n🤝 **I can help you with:**\n- Government scheme details and applications\n- Loan applications and EMI calculations\n- Banking services and account opening\n- Credit score improvement\n\nPlease tell me what specific information you need?`;
    }
  };


  // Get prompt suggestions with Hindi test
  const getPromptSuggestions = () => [
    {
      icon: '🔊',
      text: language === 'hi' ? 'आवाज़ टेस्ट' : 'Test Voice',
      query: language === 'hi' ? 'आवाज़ का परीक्षण करें' : 'Test speech'
    },
    {
      icon: '🔍',
      text: language === 'hi' ? 'आवाज़ जांच' : 'Voice Check',
      query: language === 'hi' ? 'आवाज़ की जांच करें' : 'Voice diagnosis'
    },
    {
      icon: '🎙️',
      text: language === 'hi' ? 'हिंदी टेस्ट' : 'Hindi Test',
      query: language === 'hi' ? 'हिंदी में बोलें' : 'Speak in Hindi: नमस्ते मैं आपकी सहायक हूँ'
    },
    {
      icon: '🏛️',
      text: t('schemes'),
      query: language === 'en' ? 
        'What government schemes are available?' : 
        'सरकारी योजनाएं क्या उपलब्ध हैं?'
    },
    {
      icon: '💳',
      text: t('creditScore'),
      query: language === 'en' ? 
        'Check my credit score' : 
        'मेरा क्रेडिट स्कोर जांचें'
    },
    {
      icon: '💰',
      text: t('loanAssist'),
      query: language === 'en' ? 
        'I need loan help' : 
        'मुझे ऋण सहायता चाहिए'
    }
  ];

  // Message functions
  const appendMessage = (text, from) => {
    const newMessage = {
      id: Date.now(),
      text,
      from,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSuggestionClick = (suggestion) => {
    appendMessage(suggestion.text, 'user');
    handleUserMessage(suggestion.query);
  };

  const handleUserMessage = (userInput) => {
    if (!userInput.trim()) return;
    
    setIsTyping(true);
    
    setTimeout(() => {
      const response = generateResponse(userInput);
      setIsTyping(false);
      appendMessage(response, 'bot');
      speak(response);
    }, 800 + Math.random() * 1000);
  };

  const handleSend = () => {
    if (input.trim()) {
      appendMessage(input, 'user');
      handleUserMessage(input);
      setInput('');
    }
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  return (
    <>
      <button 
        className={`chatbot-toggle ${open ? 'open' : ''}`} 
        onClick={() => setOpen(!open)}
        title="Chat with AI Assistant"
      >
        {open ? '×' : '💬'}
        {!open && <span className="notification-dot" />}
      </button>

      {open && (
        <div className="chatbot-container">
          <header className="chatbot-header">
            <div className="header-left">
              <span className="bot-avatar">👩‍💼</span>
              <div>
                <h3>{t('assistant')}</h3>
                <span className="status">
                  <span className="status-dot"></span>
                  {t('onlineReady')} {voicesLoaded && '🎤'}
                </span>
              </div>
            </div>
            
            <div className="header-controls">
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="language-selector"
              >
                <option value="en">🇬🇧 English</option>
                <option value="hi">🇮🇳 हिन्दी</option>
              </select>
              
              <button 
                className={`mute-btn ${isMuted ? 'muted' : ''}`}
                onClick={toggleMute}
              >
                {isMuted ? '🔇' : isSpeaking ? '🔊📢' : '🔊'}
              </button>
            </div>
          </header>

          <main className="chatbot-messages">
            {messages.map(msg => (
              <div key={msg.id} className={`message ${msg.from}-message`}>
                <div className="message-content">
                  {msg.text}
                  <span className="message-time">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot-message">
                <div className="message-content typing">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  {language === 'hi' ? 'टाइप कर रही हूँ...' : 'Typing...'}
                </div>
              </div>
            )}
            
            <div ref={bottomRef} />
          </main>

          <div className="quick-suggestions">
            <div className="suggestions-header">
              <span className="suggestions-title">{t('quickOptions')}</span>
            </div>
            <div className="suggestions-grid">
              {getPromptSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  className="suggestion-card quick-suggestion"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <span className="suggestion-icon">{suggestion.icon}</span>
                  <span className="suggestion-text">{suggestion.text}</span>
                </button>
              ))}
            </div>
          </div>

          <footer className="chatbot-input">
            <div className="input-container">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder={t('typeMessage')}
                className="message-input"
              />
              <button 
                className={`voice-input-btn ${isRecording ? 'recording' : ''}`}
                onClick={isListening ? stopListening : startListening}
                title="Voice Input"
              >
                {isRecording ? '🔴' : '🎤'}
              </button>
            </div>
            <button 
              onClick={handleSend} 
              className="send-btn" 
              disabled={!input.trim()}
              title="Send Message"
            >
              ➤
            </button>
          </footer>
        </div>
      )}
    </>
  );
};

export default Chatbot;
