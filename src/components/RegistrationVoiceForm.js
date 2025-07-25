import React, { useState, useEffect, useRef } from 'react';

// Translation dictionary for English & Hindi
const translations = {
  en: {
    name: 'Name',
    age: 'Age',
    occupation: 'Occupation',
    gender: 'Gender',
    disability: 'Disability',
    caste: 'Caste',
    aadhaar: 'Aadhaar Number',
    instructions: [
      'Say "My name is Ravi"',
      'Say "I am 30 years old"',
      'Say "I work as a teacher"',
      'Say "Gender male or female"',
      'Say "Disability none or specify"',
      'Say "Caste general, OBC, SC, ST"',
      'Say "My Aadhaar number is 1234 5678 9012"',
    ],
    micStatusActive: 'Microphone is active',
    micStatusInactive: 'Microphone is inactive',
    speakPrompt: 'Click to hear instructions and start voice input',
    stopListening: 'Stop Listening',
    selectLanguage: 'Select Language:'
  },
  hi: {
    name: 'नाम',
    age: 'उम्र',
    occupation: 'पेशा',
    gender: 'लिंग',
    disability: 'विकलांगता',
    caste: 'जाति',
    aadhaar: 'आधार नंबर',
    instructions: [
      '"मेरा नाम रवि है" कहें',
      '"मैं 30 साल का हूँ" कहें',
      '"मैं शिक्षक हूँ" कहें',
      '"लिंग पुरुष या महिला" कहें',
      '"विकलांगता नहीं या बताएं" कहें',
      '"जाति सामान्य, अन्य पिछड़ा वर्ग, एससी, एसटी" कहें',
      '"मेरा आधार नंबर 1234 5678 9012 है" कहें',
    ],
    micStatusActive: 'माइक्रोफोन चालू है',
    micStatusInactive: 'माइक्रोफोन बंद है',
    speakPrompt: 'निर्देश सुनने के लिए क्लिक करें और आवाज़ इनपुट शुरू करें',
    stopListening: 'सुनना बंद करें',
    selectLanguage: 'भाषा चुनें:'
  },
};

const RegistrationVoiceForm = () => {
  const [language, setLanguage] = useState('en');
  const [listening, setListening] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    occupation: '',
    gender: '',
    disability: '',
    caste: '',
    aadhaar: '',
  });
  const [error, setError] = useState('');

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = language === 'en' ? 'en-IN' : 'hi-IN';

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          const transcript = event.results[i][0].transcript.trim().toLowerCase();
          parseVoiceInput(transcript);
        }
      }
    };

    recognition.onerror = (event) => {
      setError('Speech recognition error: ' + event.error);
      if (event.error !== 'not-allowed' && listening) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognition.onend = () => {
      if (listening) {
        try {
          recognition.start();
        } catch {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
    // eslint-disable-next-line
  }, [language]); // Only reinitialize on language change

  // Parse voice input and update form fields
  const parseVoiceInput = (text) => {
    let updatedData = { ...formData };

    // English parsing
    if (language === 'en') {
      if (text.includes('name is')) {
        const namePart = text.split('name is')[1]?.trim();
        if (namePart) updatedData.name = capitalize(namePart.split(' ')[0]);
      }
      const ageMatch = text.match(/(\d+)\s*years? old/);
      if (ageMatch) updatedData.age = ageMatch[1];
      if (text.includes('work as')) {
        const part = text.split('work as')[1]?.trim();
        if (part) updatedData.occupation = capitalize(part.split(' ')[0]);
      } else if (text.includes('occupation is')) {
        const part = text.split('occupation is')[1]?.trim();
        if (part) updatedData.occupation = capitalize(part.split(' ')[0]);
      }
      if (text.includes('gender')) {
        const part = text.split('gender')[1]?.trim();
        if (part) updatedData.gender = capitalize(part.split(' ')[0]);
      }
      if (text.includes('disability')) {
        const part = text.split('disability')[1]?.trim();
        if (part) updatedData.disability = capitalize(part.split(' ')[0]);
      }
      if (text.includes('caste')) {
        const part = text.split('caste')[1]?.trim();
        if (part) updatedData.caste = capitalize(part.split(' ')[0]);
      }
      if (text.includes('aadhaar number is')) {
        const part = text.split('aadhaar number is')[1]?.trim();
        if (part) updatedData.aadhaar = part.replace(/\s/g, '').slice(0, 12);
      }
    }

    // Hindi parsing
    if (language === 'hi') {
      if (text.includes('नाम')) {
        const nameMatch = text.match(/नाम\s(.*?)\sहै/);
        if (nameMatch && nameMatch[1]) updatedData.name = capitalize(nameMatch[1].split(' ')[0]);
      }
      const ageMatch = text.match(/(\d+)\s*साल/);
      if (ageMatch) updatedData.age = ageMatch[1];
      if (text.includes('पेशा') || text.includes('काम')) {
        let occ = '';
        const occMatch = text.match(/पेशा\s(.*?)\s(है|हूँ)/);
        if (occMatch && occMatch[1]) occ = occMatch[1].split(' ')[0];
        else {
          const occMatch2 = text.match(/मैं\s(.*?)\s(हूँ|है)/);
          if (occMatch2 && occMatch2[1]) occ = occMatch2[1].split(' ')[0];
        }
        if (occ) updatedData.occupation = capitalize(occ);
      }
      if (text.includes('लिंग')) {
        const genderMatch = text.match(/लिंग\s(पुरुष|महिला)/);
        if (genderMatch && genderMatch[1]) updatedData.gender = genderMatch[1];
      }
      if (text.includes('विकलांगता')) {
        const disabilityMatch = text.match(/विकलांगता\s(.*?)\s(है|नहीं|।|$)/);
        if (disabilityMatch && disabilityMatch[1]) updatedData.disability = disabilityMatch[1];
      }
      if (text.includes('जाति')) {
        const casteMatch = text.match(/जाति\s(.*?)\s(है|।|$)/);
        if (casteMatch && casteMatch[1]) updatedData.caste = casteMatch[1];
      }
      if (text.includes('आधार नंबर')) {
        const aadhaarMatch = text.match(/आधार नंबर\s?(?:है|:)?\s?([\d\s]{12,})/);
        if (aadhaarMatch && aadhaarMatch[1]) {
          updatedData.aadhaar = aadhaarMatch[1].replace(/\s/g, '').slice(0, 12);
        }
      }
    }

    setFormData(updatedData);
  };

  const capitalize = (txt) => {
    if (!txt) return '';
    return txt.charAt(0).toUpperCase() + txt.slice(1);
  };

  // Voice-guided button: speaks instructions, then starts listening
  const handleSpeakAndListen = () => {
    if (!window.speechSynthesis) {
      setError('Speech Synthesis not supported in this browser.');
      return;
    }

    if (listening) {
      recognitionRef.current?.stop();
      window.speechSynthesis.cancel();
      setListening(false);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new window.SpeechSynthesisUtterance(
      translations[language].instructions.join('. ')
    );
    utterance.lang = language === 'en' ? 'en-IN' : 'hi-IN';

    utterance.onend = () => {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (e) {
        setError('Error starting microphone: ' + e.message);
      }
    };

    utterance.onerror = (e) => {
      setError('Speech synthesis error: ' + e.error);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Language change: resets everything
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    setFormData({
      name: '',
      age: '',
      occupation: '',
      gender: '',
      disability: '',
      caste: '',
      aadhaar: '',
    });
    setError('');
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setListening(false);
  };

  return (
    <div style={{ maxWidth: 700, margin: '20px auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>{language === 'en' ? 'Voice-Enabled Registration Form' : 'वॉइस सक्षम पंजीकरण फॉर्म'}</h2>
      <div style={{ marginBottom: 10 }}>
        <label htmlFor="language-select" style={{ marginRight: 10 }}>
          {translations[language].selectLanguage}
        </label>
        <select id="language-select" value={language} onChange={handleLanguageChange}>
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
        </select>
      </div>
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <p>
        <strong>
          {listening
            ? translations[language].micStatusActive
            : translations[language].micStatusInactive}
        </strong>
      </p>
      <button onClick={handleSpeakAndListen} style={{ marginBottom: 20 }}>
        {listening
          ? translations[language].stopListening
          : translations[language].speakPrompt}
      </button>
      <div style={{ display: 'flex', gap: 20 }}>
        {/* Registration form */}
        <form style={{ flex: 1 }} onSubmit={(e) => e.preventDefault()}>
          {['name', 'age', 'occupation', 'gender', 'disability', 'caste', 'aadhaar'].map((field) => (
            <div key={field} style={{ marginBottom: '10px' }}>
              <label>
                {translations[language][field]}:
                <input
                  type="text"
                  value={formData[field]}
                  readOnly
                  style={{ width: '100%' }}
                />
              </label>
            </div>
          ))}
        </form>
        {/* Side prompt instructions */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#f9f9f9',
            padding: 15,
            borderRadius: 5,
            border: '1px solid #ddd',
          }}
        >
          <h3>{language === 'en' ? 'Instructions' : 'निर्देश'}</h3>
          <ul>
            {translations[language].instructions.map((item, index) => (
              <li key={index} style={{ marginBottom: 8 }}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        * {language === 'en'
          ? 'Speak clearly as per instructions for best results.'
          : 'सर्वोत्तम परिणामों के लिए निर्देशों के अनुसार स्पष्ट रूप से बोलें।'}
      </p>
    </div>
  );
};

export default RegistrationVoiceForm;