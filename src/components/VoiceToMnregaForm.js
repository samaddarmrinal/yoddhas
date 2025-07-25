import React, { useState, useRef } from "react";
import "../styles/VoiceToMnregaForm.css";
import { Link } from 'react-router-dom';

const labelsByLang = {
    en: {
        name: "Name",
        occupation: "Occupation",
        age: "Age",
        village: "Village",
        jobCard: "Job Card Number",
        submit: "Submit",
        startRecording: "Start Recording",
        stopRecording: "Stop Recording",
        fillForm: "Fill MNREGA Form",
        resetForm: "Reset Form",
        sampleScript:
            'Sample phrases:\n"My name is Lakshman Raju."\n"I am a farmer."\n"I am 40 years old."\n"My village is Rampur."\n"My job card number is 123456."',
        transcriptPlaceholder: "Your recognized speech will appear here...",
        formHeader: "MNREGA Form",
        submitAlert: "Form submitted!",
        pleaseEnter: "Please enter",
    },
    hi: {
        name: "नाम",
        occupation: "व्यवसाय",
        age: "आयु",
        village: "गाँव",
        jobCard: "जॉब कार्ड नंबर",
        submit: "जमा करें",
        startRecording: "रिकॉर्डिंग शुरू करें",
        stopRecording: "रिकॉर्डिंग बंद करें",
        fillForm: "MNREGA फॉर्म भरें",
        resetForm: "फॉर्म रीसेट करें",
        sampleScript:
            'नमूना वाक्य:\n"मेरा नाम लक्ष्मण राजू है।"\n"मैं एक किसान हूँ।"\n"मेरी उम्र 40 साल है।"\n"मेरा गाँव रामपुर है।\n"मेरे पास जॉब कार्ड नंबर 123456 है।"',
        transcriptPlaceholder: "आपकी आवाज़ की पहचान यहाँ दिखेगी...",
        formHeader: "MNREGA फॉर्म",
        submitAlert: "फॉर्म जमा किया गया!",
        pleaseEnter: "कृपया दर्ज करें",
    },
    kn: {
        name: "ಹೆಸರು",
        occupation: "ವೃತ್ತಿ",
        age: "ವಯಸ್ಸು",
        village: "ಗ್ರಾಮ",
        jobCard: "ಕೆಲಸದ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ",
        submit: "ಸಲ್ಲಿಸಿ",
        startRecording: "ರೆಕಾರ್ಡಿಂಗ್ ಶುರುಮಾಡಿ",
        stopRecording: "ರೆಕಾರ್ಡಿಂಗ್ ನಿಲ್ಲಿಸಿ",
        fillForm: "MNREGA ಫಾರ್ಮ್ ಭರ್ತಿ ಮಾಡಿ",
        resetForm: "ಫಾರ್ಮ್ ಮರುಹೊಂದಿಸಿ",
        sampleScript:
            'ನಮೂನಾ ವಾಕ್ಯಗಳು:\n"ನನ್ನ ಹೆಸರು ಲಕ್ಷ್ಮಣ ರಾಜು."\n"ನಾನು ರೈತನು."\n"ನನ್ನ ವಯಸ್ಸು 40 ವರ್ಷ."\n"ನನ್ನ ಗ್ರಾಮ ರಾಮಪುರ."\n"ನನ್ನ ಕೆಲಸದ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ 123456."',
        transcriptPlaceholder: "ನಿಮ್ಮ ಮಾತು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತದೆ...",
        formHeader: "MNREGA ಫಾರ್ಮ್",
        submitAlert: "ಫಾರ್ಮ್ ಸಲ್ಲಿಸಲಾಯಿತು!",
        pleaseEnter: "ದಯವಿಟ್ಟು ನಮೂದಿಸಿ",
    },
};

const fields = ["name", "occupation", "age", "village", "jobCard"];

const VoiceToMnregaForm = ({isAuthenticated, currentUser, onLogin, onSignup, onLogout}) => {
    const [language, setLanguage] = useState("en");
    const [listening, setListening] = useState(false);
    const [fieldListening, setFieldListening] = useState(null); // which field is actively listening
    const [transcript, setTranscript] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        occupation: "",
        age: "",
        village: "",
        jobCard: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const recognitionRef = useRef(null);

    // Text-to-Speech helper
    const speak = (text) => {
        if ("speechSynthesis" in window) {
            const utterance = new window.SpeechSynthesisUtterance(text);
            utterance.lang =
                language === "hi"
                    ? "hi-IN"
                    : language === "kn"
                        ? "kn-IN"
                        : "en-US";
            window.speechSynthesis.speak(utterance);
        }
    };

    // Stop any active speech recognition (general or field-specific)
    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.onresult = null;
            recognitionRef.current.onerror = null;
            recognitionRef.current.onend = null;
            try {
                recognitionRef.current.stop();
            } catch {}
            recognitionRef.current = null;
        }
        setListening(false);
        setFieldListening(null);
    };

    // Start continuous general speech recognition to fill transcript
    const startListening = () => {
        if (fieldListening) return;

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang =
            language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let interimTranscript = "";
            let finalTranscript = transcript;

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                let currentTranscript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += currentTranscript + " ";
                } else {
                    interimTranscript += currentTranscript;
                }
            }

            setTranscript(finalTranscript + interimTranscript);
        };

        recognition.onerror = () => {
            stopListening();
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        setListening(true);
    };

    // Start voice input for a specific field (single-shot)
    const startFieldListening = (field) => {
        if (listening) stopListening();

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang =
            language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            if (event.results.length > 0) {
                const speechResult = event.results[0][0].transcript.trim();
                setFormData((prev) => ({ ...prev, [field]: speechResult }));
            }
            setFieldListening(null);
            recognition.stop();
            recognitionRef.current = null;
        };

        recognition.onerror = () => {
            setFieldListening(null);
            recognitionRef.current = null;
        };

        recognition.onend = () => {
            setFieldListening(null);
            recognitionRef.current = null;
        };

        recognition.start();
        recognitionRef.current = recognition;
        setFieldListening(field);
    };

    // Parses the transcript text and extracts form data based on language patterns
    const parseTranscriptToFormData = (text) => {
        const lower = text.toLowerCase();
        const newFormData = { ...formData };

        if (language === "en") {
            const nameMatch = lower.match(
                /(?:my name is|name is|i am|this is)\s+([a-z\s]+?)(?:\.|,|$|\si am|\smy|\sand|\sthe|\swho|\sis)/
            );
            if (nameMatch) {
                let name = nameMatch[1].trim();
                name = name.replace(
                    /\s+(years?|old|from|lives?|work|farmer|age|occupation).*$/i,
                    ""
                );
                newFormData.name = name;
            }

            const occupationMatch = lower.match(
                /(?:i am a|i'm a|my occupation is|occupation is|i work as|job is)\s+([a-z\s]+?)(?:\.|,|$|\si am|\smy|\sand|\sthe|\swho|\sis)/
            );
            if (occupationMatch) {
                let occupation = occupationMatch[1].trim();
                occupation = occupation.replace(
                    /\s+(years?|old|from|lives?|age|village).*$/i,
                    ""
                );
                newFormData.occupation = occupation;
            }

            const ageMatch = lower.match(
                /(?:i am|age is|i'm)\s+(\d{1,3})(?:\s+years?\s+old|$|\s)/
            );
            if (ageMatch) newFormData.age = ageMatch[1];

            const villageMatch = lower.match(
                /(?:village is|from village|my village is|live in)\s+([a-z\s]+?)(?:\.|,|$|\smy|\sand|\sthe|\swho|\sis)/
            );
            if (villageMatch) {
                let village = villageMatch[1].trim();
                village = village.replace(/\s+(job|card|number|age|years).*$/i, "");
                newFormData.village = village;
            }

            const jobCardMatch = lower.match(
                /(?:job card number is|card number is|number is)\s+([a-z0-9\s]+?)(?:\.|,|$|\smy|\sand|\sthe|\swho|\sis)/
            );
            if (jobCardMatch) {
                let jobCard = jobCardMatch[1].trim();
                newFormData.jobCard = jobCard;
            }
        } else if (language === "hi") {
            const nameMatch = lower.match(
                /(?:मेरा नाम|नाम है)\s+([\u0900-\u097F\s]+?)(?:\s+है|$|\s+मैं|\s+मेरा|\s+और)/
            );
            if (nameMatch) {
                let name = nameMatch[1].trim();
                name = name.replace(/\s+(साल|उम्र|वर्ष|का|की|से).*$/g, "");
                newFormData.name = name;
            }

            const occupationMatch = lower.match(
                /(?:मैं एक|मैं हूँ|व्यवसाय है)\s+([\u0900-\u097F\s]+?)(?:\s+हूँ|$|\s+मैं|\s+मेरा|\s+और)/
            );
            if (occupationMatch) {
                let occupation = occupationMatch[1].trim();
                occupation = occupation.replace(/\s+(साल|उम्र|वर्ष|का|की).*$/g, "");
                newFormData.occupation = occupation;
            }

            const ageMatch = lower.match(/(?:मेरी उम्र|आयु है|उम्र है)\s+(\d{1,3})/);
            if (ageMatch) newFormData.age = ageMatch[1];

            const villageMatch = lower.match(
                /(?:गांव है|गाँव है|से हूँ)\s+([\u0900-\u097F\s]+?)(?:\s+है|$|\s+मैं|\s+मेरा|\s+और)/
            );
            if (villageMatch) {
                let village = villageMatch[1].trim();
                village = village.replace(/\s+(जॉब|कार्ड|नंबर).*$/g, "");
                newFormData.village = village;
            }

            const jobCardMatch = lower.match(
                /(?:जॉब कार्ड नंबर|कार्ड नंबर)\s+([\u0900-\u097F0-9\s]+?)(?:$|\s+है|\s+मैं|\s+मेरा)/
            );
            if (jobCardMatch) {
                let jobCard = jobCardMatch[1].trim();
                newFormData.jobCard = jobCard;
            }
        } else if (language === "kn") {
            const nameMatch = lower.match(
                /(?:ನನ್ನ ಹೆಸರು|ಹೆಸರು)\s+([\u0C80-\u0CFF\s]+?)(?:\s+ನಾನು|$|\s+ನನ್ನ|\s+ಮತ್ತು)/
            );
            if (nameMatch) {
                let name = nameMatch[1].trim();
                name = name.replace(/\s+(ವರ್ಷ|ವಯಸ್ಸು|ರ|ದ).*$/g, "");
                newFormData.name = name;
            }

            const occupationMatch = lower.match(
                /(?:ನಾನು|ವೃತ್ತಿ)\s+([\u0C80-\u0CFF\s]+?)(?:\s+ನಾನು|$|\s+ನನ್ನ|\s+ಮತ್ತು)/
            );
            if (occupationMatch) {
                let occupation = occupationMatch[1].trim();
                occupation = occupation.replace(/\s+(ವರ್ಷ|ವಯಸ್ಸು|ರ|ದ).*$/g, "");
                newFormData.occupation = occupation;
            }

            const ageMatch = lower.match(/(?:ವಯಸ್ಸು|ನನ್ನ ವಯಸ್ಸು)\s+(\d{1,3})/);
            if (ageMatch) newFormData.age = ageMatch[1];

            const villageMatch = lower.match(
                /(?:ಗ್ರಾಮ|ನನ್ನ ಗ್ರಾಮ)\s+([\u0C80-\u0CFF\s]+?)(?:\s+ನಾನು|$|\s+ನನ್ನ|\s+ಮತ್ತು)/
            );
            if (villageMatch) {
                let village = villageMatch[1].trim();
                village = village.replace(/\s+(ಕೆಲಸದ|ಕಾರ್ಡ್|ಸಂಖ್ಯೆ).*$/g, "");
                newFormData.village = village;
            }

            const jobCardMatch = lower.match(
                /(?:ಕೆಲಸದ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ|ಕಾರ್ಡ್ ಸಂಖ್ಯೆ)\s+([\u0C80-\u0CFF0-9\s]+?)(?:$|\s+ನಾನು|\s+ನನ್ನ)/
            );
            if (jobCardMatch) {
                let jobCard = jobCardMatch[1].trim();
                newFormData.jobCard = jobCard;
            }
        }

        return newFormData;
    };

    // Fill form with parsed data and announce first missing field, if any
    const fillForm = () => {
        const newData = parseTranscriptToFormData(transcript);
        setFormData(newData);

        // Find first missing required field to prompt user
        const firstMissing = fields.find((f) => !newData[f]?.trim());
        if (firstMissing) {
            const promptText = `${labelsByLang[language].pleaseEnter} ${labelsByLang[language][firstMissing]}`;
            speak(promptText);
        }
    };

    // Handle manual input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission, validate fields, and speak prompt for missing fields
    const handleSubmit = (e) => {
        e.preventDefault();

        const mandatoryFields = [...fields];
        const missingField = mandatoryFields.find((f) => !formData[f]?.trim());
        if (missingField) {
            const promptText = `${labelsByLang[language].pleaseEnter} ${labelsByLang[language][missingField]}`;
            speak(promptText);
            return;
        }

        stopListening();
        setSubmitted(true);
    };

    const resetAll = () => {
        stopListening();
        setSubmitted(false);
        setTranscript("");
        setFormData({
            name: "",
            occupation: "",
            age: "",
            village: "",
            jobCard: "",
        });
    };

    const languageButtonLabels = {
        en: "English",
        hi: "हिंदी",
        kn: "ಕನ್ನಡ",
    };

    return (
    <div className="mnrega-page">
    {/* Header */}
                    <header className="schemes-nav-header">
                            <div className="container">
                              <div className="nav-left">
                                <Link to="/" className="logo">DbAwaaZ</Link>
                              </div>
                              <div className="nav-right">
                                <Link to="/" className="nav-link">Home</Link>
                                {isAuthenticated ? (
                                  <Link to="/dashboard" className="nav-link">Dashboard</Link>
                                ) : (
                                  <button onClick={onLogin}  className="auth-btn login-btn">Login</button>
                                )}
                              </div>
                            </div>
                          </header>
    <section className="heroicnrega">
                    <div className="container">
                      <div className="hero-content">
                      </div>
                    </div>
                  </section>
        <div className="mg-container">


            <div className="mg-left-pane">
                <h2>{languageButtonLabels[language]}</h2>
                <div className="mg-language-buttons">
                    {Object.keys(languageButtonLabels).map((lng) => (
                        <button
                            key={lng}
                            onClick={() => {
                                stopListening();
                                setSubmitted(false);
                                setTranscript("");
                                setFormData({
                                    name: "",
                                    occupation: "",
                                    age: "",
                                    village: "",
                                    jobCard: "",
                                });
                                setLanguage(lng);
                            }}
                            disabled={language === lng}
                        >
                            {languageButtonLabels[lng]}
                        </button>
                    ))}
                </div>
                <p className="mg-sample-text">{labelsByLang[language].sampleScript}</p>
                <button
                    onClick={listening ? stopListening : startListening}
                    className="mg-button"
                    disabled={fieldListening !== null}
                >
                    {listening
                        ? labelsByLang[language].stopRecording
                        : labelsByLang[language].startRecording}
                </button>
                <button
                    onClick={fillForm}
                    disabled={!transcript.trim() || submitted}
                    className="mg-button"
                    style={{ marginTop: 6 }}
                >
                    {labelsByLang[language].fillForm}
                </button>
                <button
                    onClick={() => {
                        stopListening();
                        setSubmitted(false);
                        setTranscript("");
                        setFormData({
                            name: "",
                            occupation: "",
                            age: "",
                            village: "",
                            jobCard: "",
                        });
                    }}
                    className="mg-button mg-reset-button"
                    style={{ marginTop: 6 }}
                    disabled={submitted}
                >
                    {labelsByLang[language].resetForm}
                </button>
                <textarea
                    readOnly
                    className="mg-textarea"
                    placeholder={labelsByLang[language].transcriptPlaceholder}
                    value={transcript}
                />
            </div>

            <div className="mg-right-pane">
                <h2>{labelsByLang[language].formHeader}</h2>

                {submitted ? (
                    <div className="mg-success">
                        <h3>Thank you!</h3>
                        <p>Form submitted successfully. The admin will contact you soon.</p>
                        <p>
                            Please be ready with these documents.<br />
                            1. Aadhar card<br />
                            2. Rashan Card<br />
                            3. Passbook photocopy
                        </p>
                        <button
                            onClick={resetAll}
                            className="mg-button"
                            style={{ backgroundColor: "#28a745" }}
                        >
                            Fill another form
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="mg-form">
                        {fields.map((field) => {
                            const isFieldEmpty = !formData[field]?.trim();
                            return (
                                <label key={field} className="mg-label">
                                    {labelsByLang[language][field]}:
                                    <div className="mg-input-wrap">
                                        <input
                                            name={field}
                                            type={field === "age" ? "number" : "text"}
                                            value={formData[field] || ""}
                                            onChange={handleInputChange}
                                            placeholder={`Enter ${labelsByLang[language][field].toLowerCase()}`}
                                            required={field === "name" || field === "age"}
                                            className="mg-input"
                                            disabled={fieldListening !== null}
                                        />
                                        {isFieldEmpty && fieldListening !== field && !submitted && (
                                            <button
                                                type="button"
                                                onClick={() => startFieldListening(field)}
                                                className="mg-mic-btn"
                                                disabled={fieldListening !== null}
                                                title={`Speak to fill ${labelsByLang[language][field]}`}
                                            >
                                                🎤
                                            </button>
                                        )}
                                        {fieldListening === field && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    stopListening();
                                                    setFieldListening(null);
                                                }}
                                                className="mg-listening-btn"
                                                title="Stop listening"
                                            >
                                                🎙️...
                                            </button>
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                        <button
                            type="submit"
                            className="mg-button"
                            style={{ marginTop: 10 }}
                            disabled={fieldListening !== null}
                        >
                            {labelsByLang[language].submit}
                        </button>
                    </form>
                )}
            </div>
        </div>
        </div>
    );
};

export default VoiceToMnregaForm;