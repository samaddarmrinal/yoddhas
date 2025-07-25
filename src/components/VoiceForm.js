import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const VoiceForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isFilling, setIsFilling] = useState(false);
  const [language, setLanguage] = useState("en");
  const [voiceMode, setVoiceMode] = useState(false);
  const fields = ["name", "email", "message"];
  const fieldLabels = {
    en: { name: "name", email: "email", message: "message" },
    hi: { name: "नाम", email: "ईमेल", message: "संदेश" }
  };
  const currentFieldIndexRef = useRef(0);
  const recognitionRef = useRef(null);
  const navigate = useNavigate();

  const speak = (text, callback) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === "hi" ? "hi-IN" : "en-US";
    if (callback) utterance.onend = callback;
    synth.cancel();
    synth.speak(utterance);
  };

  const listen = (lang, callback) => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };
    recognition.onerror = () => callback("");
    recognition.start();
    recognitionRef.current = recognition;
  };

  const startLanguageSelection = () => {
    speak("Please say your preferred language: English or Hindi.", () => {
      listen("en-US", (response) => {
        if (response.toLowerCase().includes("hindi") || response.toLowerCase().includes("हिंदी")) {
          setLanguage("hi");
          speak("आपकी भाषा हिंदी चुनी गई है।", startVoiceFormFill);
        } else {
          setLanguage("en");
          speak("English selected.", startVoiceFormFill);
        }
      });
    });
  };

  const startVoiceFormFill = () => {
    setIsFilling(true);
    setVoiceMode(true);
    currentFieldIndexRef.current = 0;
    handleNextField();
  };

  const handleNextField = () => {
    if (currentFieldIndexRef.current >= fields.length) {
      setIsFilling(false);
      speak(language === "hi" ? "फॉर्म भरना समाप्त हुआ। क्या आप सबमिट करना चाहते हैं?" : "Form filling complete. Do you want to submit?", () => {
        listen(language === "hi" ? "hi-IN" : "en-US", (response) => {
          if (response.toLowerCase().includes("yes") || response.toLowerCase().includes("हाँ") || response.toLowerCase().includes("ha")) {
            handleSubmit();
          } else {
            speak(language === "hi" ? "फॉर्म सबमिट रद्द कर दिया गया है।" : "Form submission cancelled.");
          }
        });
      });
      return;
    }

    const field = fields[currentFieldIndexRef.current];
    const prompt = language === "hi" ? `कृपया अपना ${fieldLabels.hi[field]} बोलें` : `Please say your ${field}`;
    speak(prompt, () => {
      listen(language === "hi" ? "hi-IN" : "en-US", (value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        currentFieldIndexRef.current += 1;
        handleNextField();
      });
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      speak(language === "hi" ? "कृपया सभी फ़ील्ड भरें।" : "Please fill all the fields before submitting.");
      return;
    }

    const summary = language === "hi"
      ? `फॉर्म सबमिट किया जा रहा है। नाम: ${name}, ईमेल: ${email}, संदेश: ${message}`
      : `Submitting your form. Name: ${name}, Email: ${email}, Message: ${message}`;
    speak(summary, () => navigate("/thank-you"));
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "" });
    speak(language === "hi" ? "फॉर्म रीसेट कर दिया गया है।" : "Form has been reset.");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <div className="w-full h-[50px] bg-cover bg-center" style={{ backgroundImage: `url(https://picsum.photos/id/1015/1200/300)` }} />
      <div className="bg-white mt-8 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">🎤 Voice Enabled Form</h2>

        <button
          onClick={startLanguageSelection}
          disabled={isFilling}
          className="w-full mb-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          🌐 Select Language & Start
        </button>

        <form onSubmit={handleSubmit}>
          {fields.map((field) => (
            <div key={field} className="mb-4">
              <label className="block mb-1 capitalize font-medium">{language === "hi" ? fieldLabels.hi[field] : field}</label>
              <input
                type={field === "email" ? "email" : "text"}
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-blue-400"
                placeholder={language === "hi" ? `अपना ${fieldLabels.hi[field]} दर्ज करें` : `Enter your ${field}`}
              />
            </div>
          ))}
          <div className="flex justify-between">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2">
              {language === "hi" ? "सबमिट करें" : "Submit"}
            </button>
            <button type="button" onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-2">
              {language === "hi" ? "रीसेट करें" : "Reset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoiceForm;