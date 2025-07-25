import React, { useState, useEffect, useRef } from "react";
import '../styles/mnregaform.css';

// ---- Localized labels ----
const labelsByLang = {
    en: {
        name: "Name",
        age: "Age",
        village: "Village",
        jobCard: "Job Card Number",
        disability: "Disability",
        gender: "Gender",
        caste: "Caste",
        submit: "Submit",
        confirmation: "Do you want to submit the form? Say Yes or Submit.",
        repeat: "Please repeat.",
        fieldSkipped: "Field skipped due to multiple failures.",
        formSubmitted: "Form submitted successfully!",
        stop: "Stop",
        thankYouHeader: "✅ Thank You!",
        thankYouMessage: "Admin will contact you in 3 days. Please be ready with the following documents:",
        documents: [
            "Aadhaar Card",
            "Age Proof",
            "Ration Card",
            "Bank Passbook (photocopy)"
        ]
    },
    hi: {
        name: "नाम",
        age: "आयु",
        village: "गाँव",
        jobCard: "जॉब कार्ड नंबर",
        disability: "विकलांगता",
        gender: "लिंग",
        caste: "जाति",
        submit: "जमा करें",
        confirmation: "क्या आप फॉर्म जमा करना चाहते हैं? हाँ या सबमिट बोलें।",
        repeat: "कृपया दोहराएं।",
        fieldSkipped: "फ़ील्ड को छोड़ दिया गया।",
        formSubmitted: "फॉर्म सफलतापूर्वक जमा हुआ!",
        stop: "रोकें",
        thankYouHeader: "✅ धन्यवाद!",
        thankYouMessage: "एडमिन 3 दिनों के अंदर आपसे संपर्क करेगा। कृपया नीचे दिए दस्तावेज़ तैयार रखें:",
        documents: ["आधार कार्ड", "आयु प्रमाण", "राशन कार्ड", "बैंक पासबुक (फोटोकॉपी)"]
    },
    kn: {
        name: "ಹೆಸರು",
        age: "ವಯಸ್ಸು",
        village: "ಗ್ರಾಮ",
        jobCard: "ಕೆಲಸದ ಕಾರ್ಡ್ ಸಂಖ್ಯೆ",
        disability: "ವಿಕಲಾಂಗತೆ",
        gender: "ಲಿಂಗ",
        caste: "ಜಾತಿ",
        submit: "ಸಲ್ಲಿಸಿ",
        confirmation: "ನೀವು ಫಾರ್ಮ್ ಸಲ್ಲಿಸಲು ಬಯಸುತ್ತೀರಾ? ಹೌದು ಅಥವಾ ಸಲ್ಲಿಸಿ ಎಂದು ಹೇಳಿ.",
        repeat: "ದಯವಿಟ್ಟು ಮರುಹೇಳಿ.",
        fieldSkipped: "ಕ್ಷೇತ್ರವನ್ನು ಬಿಟ್ಟಿಡಲಾಗಿದೆ.",
        formSubmitted: "ಫಾರ್ಮ್ ಯಶಸ್ವಿಯಾಗಿ ಸಲ್ಲಿಸಲಾಗಿದೆ!",
        stop: "ನಿಲ್ಲಿಸಿ",
        thankYouHeader: "✅ ಧನ್ಯವಾದಗಳು!",
        thankYouMessage: "ನಿರ್ವಾಹಕರು 3 ದಿನಗಳಲ್ಲಿ ಸಂಪರ್ಕ ಮಾಡುತ್ತಾರೆ. ಈ ದಾಖಲೆಗಳನ್ನು ಸಿದ್ಧವಾಗಿಡಿ:",
        documents: ["ಆಧಾರ್ ಕಾರ್ಡ್", "ವಯಸ್ಸಿನ ದಾಖಲೆ", "ರೇಷನ್ ಕಾರ್ಡ್", "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್ (ಫೋಟೋಕಾಪಿ)"]
    }
};

const optionsByLang = {
    gender: {
        en: ["Male", "Female", "Other"],
        hi: ["पुरुष", "महिला", "अन्य"],
        kn: ["ಪುರುಷ", "ಹೆಣ್ಣು", "ಇತರರು"]
    },
    caste: {
        en: ["General", "OBC", "SC", "ST", "Other"],
        hi: ["सामान्य", "ओबीसी", "एससी", "एसटी", "अन्य"],
        kn: ["ಸಾಮಾನ್ಯ", "ಒಬಿಸಿ", "ಎಸ್‌ಸಿ", "ಎಸ್‌ಟಿ", "ಇತರರು"]
    }
};

const defaultNames = {
    en: "Lakshman Raju",
    hi: "लक्ष्मण राजू",
    kn: "ಲಕ್ಷ್ಮಣ ರಾಜು"
};

const MnregaForm = () => {
    const [language, setLanguage] = useState("en");
    const [form, setForm] = useState({});
    const [manualFill, setManualFill] = useState(false);
    const [step, setStep] = useState("fillingForm");
    const recognitionRef = useRef(null);

    const labels = labelsByLang[language];
    const genders = optionsByLang.gender[language];
    const castes = optionsByLang.caste[language];

    const fields = ["age", "village", "jobCard", "disability", "gender", "caste"];

    useEffect(() => {
        stopAll();
        setManualFill(false);
        setForm({
            name: defaultNames[language],
            age: "",
            village: "",
            jobCard: "",
            disability: "",
            gender: "",
            caste: ""
        });
        setStep("fillingForm");
    }, [language]);

    const speak = (text) =>
        new Promise((resolve) => {
            const utter = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            utter.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-US";
            utter.voice = voices.find(v => v.lang.startsWith(utter.lang)) || voices[0];
            utter.onend = resolve;
            utter.onerror = resolve;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
        });

    const stopAll = () => {
        window.speechSynthesis.cancel();
        if (recognitionRef.current) recognitionRef.current.abort();
    };

    const recognizeAsync = () => {
        return new Promise((resolve, reject) => {
            const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (!SR) return reject("Speech recognition not supported");
            const r = new SR();
            r.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-US";
            r.interimResults = false;
            r.maxAlternatives = 1;
            r.onresult = (e) => resolve(e.results[0][0].transcript.trim());
            r.onerror = (e) => reject(e.error);
            r.onend = () => reject("no-speech");
            r.start();
            recognitionRef.current = r;
            setTimeout(() => r.stop(), 9000);
        });
    };

    useEffect(() => {
        if (manualFill || step !== "fillingForm") return;
        let cancel = false;
        const fill = async () => {
            for (let f of fields) {
                if (cancel) return;
                if (["gender", "caste"].includes(f)) {
                    await speak(`${labels[f]}. ${f === "gender" ? genders.join(", ") : castes.join(", ")}`);
                } else {
                    await speak(labels[f]);
                }

                try {
                    const res = await recognizeAsync();
                    const input = res.toLowerCase();
                    let matchedValue = res;

                    if (f === "gender") matchedValue = genders.find(o => o.toLowerCase() === input);
                    if (f === "caste") matchedValue = castes.find(o => o.toLowerCase() === input);

                    if (["gender", "caste"].includes(f) && !matchedValue) {
                        await speak(labels.repeat);
                        continue;
                    }

                    setForm(val => ({ ...val, [f]: matchedValue || res }));
                } catch {
                    await speak(labels.repeat);
                }
            }

            await speak(labels.confirmation);
            setStep("confirmSubmit");
            startConfirmation();
        };
        fill();
        return () => (cancel = true);
    }, [step, manualFill, language]);

    const startConfirmation = () => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        const r = new SR();
        r.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : "en-US";
        r.interimResults = false;

        r.onresult = (e) => {
            const txt = e.results[0][0].transcript.toLowerCase();
            if (txt.includes("yes") || txt.includes("submit") || txt.includes("हाँ") || txt.includes("ಹೌದು")) {
                handleSubmit();
            } else {
                speak(labels.repeat);
                setTimeout(() => startConfirmation(), 1000);
            }
        };

        r.onend = () => {
            if (step === "confirmSubmit") startConfirmation();
        };

        r.start();
        recognitionRef.current = r;
    };

    const handleSubmit = () => {
        stopAll();
        speak(labels.formSubmitted);
        setStep("thankYou");
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleManualSubmit = (e) => {
        e.preventDefault();
        handleSubmit();
    };

    return (
        <div className="mnrega-container">
            <h2>
              {language === "hi"
                ? "मनरेगा फॉर्म"
                : language === "kn"
                ? "ಎಂಎನ್‌ಆರ್ಇಜಿಎ ಫಾರ್ಮ್"
                : "MNREGA Form"}
            </h2>
            <div className="button-group">
                <button onClick={() => setLanguage("en")}>English</button>
                <button onClick={() => setLanguage("hi")}>हिंदी</button>
                <button onClick={() => setLanguage("kn")}>ಕನ್ನಡ</button>
                <button onClick={() => setManualFill(true)}>Manual Fill</button>
                <button onClick={stopAll}>{labels.stop}</button>
            </div>

            {step === "thankYou" ? (
                <div className="confirmation">
                    <h3>{labels.thankYouHeader}</h3>
                    <p>{labels.thankYouMessage}</p>
                    <ul>{labels.documents.map((d) => <li key={d}>{d}</li>)}</ul>
                </div>
            ) : (
                <form onSubmit={handleManualSubmit}>
                    <label>{labels.name}:
                        <input value={form.name} disabled readOnly />
                    </label>

                    {fields.map((key) =>
                        ["gender", "caste"].includes(key) ? (
                            <label key={key}>{labels[key]}:
                                <select
                                    value={form[key]}
                                    disabled={!manualFill}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                >
                                    <option value="">--</option>
                                    {(key === "gender" ? genders : castes).map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </label>
                        ) : (
                            <label key={key}>{labels[key]}:
                                <input
                                    type="text"
                                    value={form[key]}
                                    disabled={!manualFill}
                                    onChange={(e) => handleChange(key, e.target.value)}
                                />
                            </label>
                        )
                    )}

                    {manualFill && <button type="submit">{labels.submit}</button>}

                    {!manualFill && step === "confirmSubmit" && (
                        <div className="confirmation">
                            <p>{labels.confirmation}</p>
                            <button onClick={handleSubmit}>✔️ {language === "hi" ? "हाँ" : language === "kn" ? "ಹೌದು" : "Yes"}</button>
                            <button onClick={() => setStep("fillingForm")}>❌ {language === "hi" ? "नहीं" : language === "kn" ? "ಇಲ್ಲ" : "No"}</button>
                        </div>
                    )}
                </form>
            )}

                   </div>
    );
};

export default MnregaForm;