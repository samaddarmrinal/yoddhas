import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMic, FiMicOff } from 'react-icons/fi';
import '../styles/SchemesOverview.css';

const SchemesOverview = ({ isAuthenticated, currentUser, onLogin }) => {
    const [selectedScheme, setSelectedScheme] = useState(null);
    const [recognitionActive, setRecognitionActive] = useState(false);
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en'); // 'en' or 'hi'

    const navigate = useNavigate();
    const recognitionRef = useRef(null);
    const speakingRef = useRef(false);

    const schemes = [
        {
            "id": "mgnrega",
            "name": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
            "nameHindi": "महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी अधिनियम (मनरेगा)",
            "description": "Wage employment scheme ensuring 100 days of guaranteed work to rural households",
            "descriptionHindi": "ग्रामीण परिवारों को 100 दिन के गारंटीशुदा काम को सुनिश्चित करने वाली मजदूरी रोजगार योजना",
            "keywords": ["mgnrega", "mnrega", "nrega", "mahatma gandhi", "employment guarantee", "rural employment", "100 days work"],
            "keywordsHindi": ["मनरेगा", "नरेगा", "महात्मा गांधी", "रोजगार गारंटी", "ग्रामीण रोजगार", "सौ दिन काम", "मजदूरी योजना"],
            "benefits": [
                "Guarantees 100 days of wage employment in a financial year to every rural household",
                "Focuses on unskilled manual work for livelihood security",
                "Empowers rural women through inclusive participation",
                "Promotes sustainable rural infrastructure like ponds, roads, plantations",
                "Wages paid directly to bank or post office accounts"
            ],
            "benefitsHindi": [
                "हर ग्रामीण परिवार को वित्तीय वर्ष में 100 दिन की मजदूरी रोजगार की गारंटी",
                "आजीविका सुरक्षा के लिए अकुशल शारीरिक काम पर केंद्रित",
                "समावेशी भागीदारी के माध्यम से ग्रामीण महिलाओं को सशक्त बनाना",
                "तालाब, सड़क, वृक्षारोपण जैसी टिकाऊ ग्रामीण अवसंरचना को बढ़ावा",
                "मजदूरी सीधे बैंक या डाकघर खाते में भुगतान"
            ],
            "progress": {
                "jobCardsIssued": "14.89 crore",
                "activeWorkers": "8.19 crore",
                "employmentGeneratedFY24": "294.7 crore person-days",
                "womenParticipation": "54.7%",
                "assetsCreated": "Water conservation, roadworks, afforestation, etc."
            },
            "launchDate": "2.2.2006",
            "category": "Employment"
        },
        {
            id: 'pmjdy',
            name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
            nameHindi: 'प्रधानमंत्री जन धन योजना (पीएमजेडीवाई)',
            description: 'Financial inclusion scheme providing universal access to banking facilities',
            descriptionHindi: 'बैंकिंग सुविधाओं तक सार्वभौमिक पहुंच प्रदान करने वाली वित्तीय समावेशन योजना',
            keywords: ['pmjdy', 'jan dhan', 'banking', 'financial inclusion', 'pradhan mantri jan dhan'],
            keywordsHindi: ['पीएमजेडीवाई', 'जन धन', 'बैंकिंग', 'वित्तीय समावेशन', 'प्रधानमंत्री जन धन'],
            benefits: [
                'Basic bank account without minimum balance requirement',
                'Free RuPay debit card with Rs. 2 lakh accident insurance',
                'Overdraft facility up to Rs. 10,000',
                'Access to banking services in rural areas through Bank Mitras',
                'Financial literacy programs'
            ],
            benefitsHindi: [
                'न्यूनतम शेष राशि की आवश्यकता के बिना मूलभूत बैंक खाता',
                '2 लाख रुपये दुर्घटना बीमा के साथ मुफ्त रुपे डेबिट कार्ड',
                '10,000 रुपये तक की ओवरड्राफ्ट सुविधा',
                'बैंक मित्रों के माध्यम से ग्रामीण क्षेत्रों में बैंकिंग सेवाओं तक पहुंच',
                'वित्तीय साक्षरता कार्यक्रम'
            ],
            progress: {
                accounts: '54.97 crore',
                deposits: 'Rs. 2,52,750 crore',
                womenAccounts: '30.60 crore (55.7%)',
                ruralAccounts: '36.59 crore (66.6%)',
                rupayCards: '37.60 crore'
            },
            launchDate: '28.8.2014',
            category: 'Financial'
        },
        {
            id: 'pmsby',
            name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
            nameHindi: 'प्रधानमंत्री सुरक्षा बीमा योजना (पीएमएसबीवाई)',
            description: 'Personal accident insurance scheme offering coverage for death/disability',
            descriptionHindi: 'मृत्यु/विकलांगता के लिए कवरेज प्रदान करने वाली व्यक्तिगत दुर्घटना बीमा योजना',
            keywords: ['pmsby', 'suraksha bima', 'accident insurance', 'pradhan mantri suraksha'],
            keywordsHindi: ['पीएमएसबीवाई', 'सुरक्षा बीमा', 'दुर्घटना बीमा', 'प्रधानमंत्री सुरक्षा'],
            benefits: [
                'Rs. 2 lakh coverage for death or permanent total disability',
                'Rs. 1 lakh coverage for partial disability',
                'Annual premium of Rs. 20 only',
                'Simple claim settlement process',
                'Auto-debit facility from bank account'
            ],
            benefitsHindi: [
                'मृत्यु या स्थायी पूर्ण विकलांगता के लिए 2 लाख रुपये का कवरेज',
                'आंशिक विकलांगता के लिए 1 लाख रुपये का कवरेज',
                'केवल 20 रुपये का वार्षिक प्रीमियम',
                'सरल दावा निपटारा प्रक्रिया',
                'बैंक खाते से ऑटो-डेबिट सुविधा'
            ],
            progress: {
                enrollment: '50.15 crore'
            },
            eligibility: 'Age 18-70 years with bank account',
            launchDate: '9.5.2015',
            category: 'Insurance'
        },
        {
            id: 'pmjjby',
            name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
            nameHindi: 'प्रधानमंत्री जीवन ज्योति बीमा योजना (पीएमजेजेबीवाई)',
            description: 'Life insurance scheme providing coverage for death due to any reason',
            descriptionHindi: 'किसी भी कारण से मृत्यु के लिए कवरेज प्रदान करने वाली जीवन बीमा योजना',
            keywords: ['pmjjby', 'jeevan jyoti', 'life insurance', 'pradhan mantri jeevan jyoti'],
            keywordsHindi: ['पीएमजेजेबीवाई', 'जीवन ज्योति', 'जीवन बीमा', 'प्रधानमंत्री जीवन ज्योति'],
            benefits: [
                'Rs. 2 lakh life insurance coverage',
                'Annual premium of Rs. 436',
                'Coverage for death due to any reason',
                'Auto-debit from bank account',
                'One-year renewable policy'
            ],
            benefitsHindi: [
                '2 लाख रुपये जीवन बीमा कवरेज',
                '436 रुपये वार्षिक प्रीमियम',
                'किसी भी कारण से मृत्यु के लिए कवरेज',
                'बैंक खाते से ऑटो-डेबिट',
                'एक वर्षीय नवीकरणीय पॉलिसी'
            ],
            progress: {
                enrollment: '23.12 crore'
            },
            eligibility: 'Age 18-50 years with bank account',
            launchDate: '9.5.2015',
            category: 'Insurance'
        },
        {
            id: 'apy',
            name: 'Atal Pension Yojana (APY)',
            nameHindi: 'अटल पेंशन योजना (एपीवाई)',
            description: 'Pension scheme for unorganized sector workers',
            descriptionHindi: 'असंगठित क्षेत्र के कामगारों के लिए पेंशन योजना',
            keywords: ['apy', 'atal pension', 'pension scheme', 'retirement'],
            keywordsHindi: ['एपीवाई', 'अटल पेंशन', 'पेंशन योजना', 'सेवानिवृत्ति'],
            benefits: [
                'Fixed pension: Rs. 1,000 to Rs. 5,000 per month at age 60',
                'Government guarantee on minimum pension',
                'Flexible contribution: monthly/quarterly/half-yearly',
                'Death benefit for spouse',
                'Voluntary exit option available'
            ],
            benefitsHindi: [
                '60 वर्ष की आयु में मासिक 1,000 से 5,000 रुपये तक निश्चित पेंशन',
                'न्यूनतम पेंशन पर सरकारी गारंटी',
                'लचीला योगदान: मासिक/त्रैमासिक/अर्धवार्षिक',
                'पति/पत्नी के लिए मृत्यु लाभ',
                'स्वैच्छिक निकास विकल्प उपलब्ध'
            ],
            progress: {
                subscribers: '7.47 crore'
            },
            eligibility: 'Age 18-40 years, minimum 20 years contribution',
            launchDate: '2015',
            category: 'Pension'
        },
        {
            id: 'pmmy',
            name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
            nameHindi: 'प्रधानमंत्री मुद्रा योजना (पीएममाई)',
            description: 'Collateral-free credit scheme for micro enterprises',
            descriptionHindi: 'सूक्ष्म उद्यमों के लिए गिरवी-मुक्त ऋण योजना',
            keywords: ['pmmy', 'mudra', 'loan', 'micro finance', 'pradhan mantri mudra'],
            keywordsHindi: ['पीएममाई', 'मुद्रा', 'ऋण', 'सूक्ष्म वित्त', 'प्रधानमंत्री मुद्रा'],
            benefits: [
                'Loans up to Rs. 20 lakh without collateral',
                'Support for non-agricultural activities',
                'Three categories: Shishu, Kishore, Tarun, Tarun Plus',
                'Working capital and term loan both supported',
                'Wide network of lending institutions'
            ],
            benefitsHindi: [
                'बिना गिरवी के 20 लाख रुपये तक का ऋण',
                'गैर-कृषि गतिविधियों के लिए समर्थन',
                'तीन श्रेणियां: शिशु, किशोर, तरुण, तरुण प्लस',
                'कार्यशील पूंजी और सावधि ऋण दोनों समर्थित',
                'ऋणदाता संस्थानों का व्यापक नेटवर्क'
            ],
            categories: {
                shishu: 'Up to Rs. 50,000',
                kishore: 'Rs. 50,000 to Rs. 5 lakh',
                tarun: 'Rs. 5 lakh to Rs. 10 lakh',
                tarunPlus: 'Rs. 10 lakh to Rs. 20 lakh'
            },
            progress: {
                accounts: '52.07 crore',
                sanctioned: 'Rs. 33.19 lakh crore',
                disbursed: 'Rs. 32.40 lakh crore'
            },
            launchDate: '8.4.2015',
            category: 'Credit'
        },
        {
            id: 'supi',
            name: 'Stand Up India Scheme (SUPI)',
            nameHindi: 'स्टैंड अप इंडिया स्कीम (एसयूपीआई)',
            description: 'Entrepreneurship scheme for SC/ST and Women',
            descriptionHindi: 'एससी/एसटी और महिलाओं के लिए उद्यमिता योजना',
            keywords: ['supi', 'stand up india', 'entrepreneurship', 'sc st women'],
            keywordsHindi: ['एसयूपीआई', 'स्टैंड अप इंडिया', 'उद्यमिता', 'एससी एसटी महिला'],
            benefits: [
                'Loans between Rs. 10 lakh to Rs. 1 crore',
                'Support for greenfield projects',
                'Manufacturing, services, trading sector support',
                'Repayment period up to 7 years',
                'Online guidance through standupmitra.in'
            ],
            benefitsHindi: [
                '10 लाख से 1 करोड़ रुपये तक का ऋण',
                'ग्रीनफील्ड परियोजनाओं के लिए समर्थन',
                'विनिर्माण, सेवा, व्यापार क्षेत्र समर्थन',
                '7 साल तक की चुकौती अवधि',
                'standupmitra.in के माध्यम से ऑनलाइन मार्गदर्शन'
            ],
            progress: {
                accounts: '2.67 lakh',
                sanctioned: 'Rs. 60,504 crore',
                disbursed: 'Rs. 34,450 crore',
                womenAccounts: '1.99 lakh'
            },
            eligibility: 'SC/ST and Women entrepreneurs above 18 years',
            launchDate: '5.4.2016',
            category: 'Entrepreneurship'
        }
    ];

    // Language toggle function
    const toggleLanguage = () => {
        setCurrentLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    // Get text based on current language
    const getText = (englishText, hindiText) => {
        return currentLanguage === 'hi' ? hindiText : englishText;
    };

    // Speak the given text and resolve when done
    const speakText = (text) =>
        new Promise((resolve) => {
            if (!window.speechSynthesis) {
                resolve();
                return;
            }
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
            utterance.onend = resolve;
            utterance.onerror = resolve;
            window.speechSynthesis.speak(utterance);
        });

    // Speak prompt instructions for user commands
    const promptUserCommand = async () => {
        speakingRef.current = true;
        const promptMessage = currentLanguage === 'hi'
            ? "आप योजना का नाम बोलकर उसकी जानकारी सुन सकते हैं। या 'अप्लाई' के साथ योजना का नाम बोलकर आवेदन कर सकते हैं।"
            : "You can say a scheme name to hear its details. Or say 'apply' followed by the scheme name to apply.";
        await speakText(promptMessage);
        speakingRef.current = false;
    };

    // Start speech recognition
    const startRecognition = () => {
        if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            alert(currentLanguage === 'hi'
                ? 'इस ब्राउज़र में स्पीच रिकग्निशन API समर्थित नहीं है।'
                : 'Speech Recognition API is not supported in this browser.');
            setIsVoiceActive(false);
            return;
        }
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.lang = currentLanguage === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.continuous = true;
        recognition.interimResults = false;

        recognition.onstart = () => setRecognitionActive(true);
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                alert(currentLanguage === 'hi'
                    ? 'माइक्रोफोन की अनुमति नकारी गई।'
                    : 'Microphone permission denied.');
                stopVoice();
            }
        };
        recognition.onend = () => {
            setRecognitionActive(false);
            if (isVoiceActive && !speakingRef.current) {
                recognition.start(); // auto restart
            }
        };
        recognition.onresult = (event) => {
            const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
            console.log('Recognized:', transcript);
            handleVoiceCommand(transcript);
        };

        recognitionRef.current = recognition;
        recognition.start();
    };

    // Stop speech and voice recognition
    const stopVoice = () => {
        setIsVoiceActive(false);
        speakingRef.current = false;
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        window.speechSynthesis.cancel();
    };

    // Enhanced scheme matching function
    const findSchemeByVoice = (text) => {
        const lowerText = text.toLowerCase();

        return schemes.find(scheme => {
            // Check English keywords
            const englishMatch = scheme.keywords.some(keyword =>
                lowerText.includes(keyword.toLowerCase()) ||
                keyword.toLowerCase().split(' ').some(word => lowerText.includes(word))
            );

            // Check Hindi keywords
            const hindiMatch = scheme.keywordsHindi.some(keyword =>
                lowerText.includes(keyword) ||
                keyword.split(' ').some(word => lowerText.includes(word))
            );

            // Check scheme ID
            const idMatch = lowerText.includes(scheme.id.toLowerCase());

            return englishMatch || hindiMatch || idMatch;
        });
    };

    // Handle voice commands with enhanced matching
    const handleVoiceCommand = async (text) => {
        if (!text) return;

        const lowerText = text.toLowerCase();

        // Stop commands (English and Hindi)
        if (lowerText.includes('stop') || lowerText.includes('mute') ||
            lowerText.includes('रुको') || lowerText.includes('बंद') || lowerText.includes('रोको')) {
            speakingRef.current = false;
            window.speechSynthesis.cancel();
            stopVoice();
            return;
        }

        // Check for 'apply [scheme name]' or 'अप्लाई [scheme name]'
        const applyPatterns = [
            /apply\s(.+)/,
            /अप्लाई\s(.+)/,
            /आवेदन\s(.+)/
        ];

        for (const pattern of applyPatterns) {
            const match = lowerText.match(pattern);
            if (match) {
                const schemeName = match[1].trim();
                const matchedScheme = findSchemeByVoice(schemeName);
                if (matchedScheme) {
                    stopVoice();
                    navigate('/applyPMYojna', { state: { schemeId: matchedScheme.id } });
                    return;
                }
            }
        }

        // Otherwise treat input as scheme name to speak details
        const matchedScheme = findSchemeByVoice(text);
        if (matchedScheme) {
            setSelectedScheme(matchedScheme);
            speakingRef.current = true;

            const name = getText(matchedScheme.name, matchedScheme.nameHindi);
            const description = getText(matchedScheme.description, matchedScheme.descriptionHindi);
            const benefits = getText(matchedScheme.benefits, matchedScheme.benefitsHindi);
            const benefitsText = benefits ? benefits.join(', ') : '';

            const speechText = currentLanguage === 'hi'
                ? `${name}। ${description}। लाभों में शामिल हैं: ${benefitsText}।`
                : `${name}. ${description}. Benefits include: ${benefitsText}.`;

            await speakText(speechText);
            speakingRef.current = false;
            return;
        }

        // Optional: speak default message if no match found
        const noMatchMessage = currentLanguage === 'hi'
            ? "क्षमा करें, मैं समझ नहीं सका। कृपया योजना का नाम बोलें या 'अप्लाई' के साथ योजना का नाम बोलें।"
            : "Sorry, I did not understand. Please say a scheme name or say 'apply' followed by the scheme name.";
        await speakText(noMatchMessage);
    };

    // Toggle voice recognition on/off, speak prompt when starting
    const toggleVoice = async () => {
        if (isVoiceActive) {
            stopVoice();
        } else {
            setIsVoiceActive(true);
            await promptUserCommand();
            startRecognition();
        }
    };

    // Apply button handler
    const handlePmYojnaApply = () => {
        stopVoice();
        navigate('/applyPMYojna');
    };

    // SchemeCard component
    const SchemeCard = ({ scheme }) => (
        <div className="scheme-card" role="listitem" tabIndex={0}>
            <div className="scheme-header">
                <h3>{getText(scheme.name, scheme.nameHindi)}</h3>
                <span className={`category-badge ${scheme.category.toLowerCase()}`}>{scheme.category}</span>
            </div>
            <p className="scheme-description">{getText(scheme.description, scheme.descriptionHindi)}</p>
            <div className="scheme-footer">
                <span className="launch-date">
                    {currentLanguage === 'hi' ? 'लॉन्च:' : 'Launched:'} {scheme.launchDate}
                </span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScheme(scheme);
                        speakingRef.current = false;
                        window.speechSynthesis.cancel();
                    }}
                    className="view-details-btn"
                    aria-label={`View details of ${getText(scheme.name, scheme.nameHindi)}`}
                >
                    {currentLanguage === 'hi' ? 'विवरण देखें' : 'View Details'}
                </button>
                <button
                    onClick={handlePmYojnaApply}
                    className="view-details-btn"
                    aria-label={`Apply to ${getText(scheme.name, scheme.nameHindi)}`}
                >
                    {currentLanguage === 'hi' ? 'आवेदन करें' : 'Apply'}
                </button>
            </div>
        </div>
    );

    // SchemeModal component
    const SchemeModal = ({ scheme, onClose }) => {
        if (!scheme) return null;

        return (
            <div
                className="modal-overlay"
                onClick={onClose}
                role="dialog"
                aria-modal="true"
                aria-labelledby="scheme-modal-title"
            >
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2 id="scheme-modal-title">{getText(scheme.name, scheme.nameHindi)}</h2>
                        <button onClick={onClose} aria-label="Close modal" className="close-btn">
                            &times;
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{getText(scheme.description, scheme.descriptionHindi)}</p>
                        {scheme.benefits && (
                            <>
                                <h4>{currentLanguage === 'hi' ? 'मुख्य लाभ' : 'Key Benefits'}</h4>
                                <ul>
                                    {getText(scheme.benefits, scheme.benefitsHindi).map((benefit, idx) => (
                                        <li key={idx}>{benefit}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="schemes-overview">
            <header className="schemes-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div className="nav-left">
                        <Link to="/" className="logo">DbAwaaZ</Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                            onClick={toggleLanguage}
                            style={{
                                background: 'none',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '5px 10px',
                                cursor: 'pointer',
                                marginRight: '1rem',
                                fontSize: '0.9rem',
                                color: 'white'
                            }}
                        >
                            {currentLanguage === 'hi' ? 'English' : 'हिंदी'}
                        </button>

                        <button
                            aria-label={isVoiceActive ?
                                (currentLanguage === 'hi' ? 'आवाज़ पहचान बंद करें' : 'Mute voice recognition') :
                                (currentLanguage === 'hi' ? 'आवाज़ पहचान शुरू करें' : 'Start voice recognition')
                            }
                            onClick={toggleVoice}
                            aria-pressed={isVoiceActive}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '1.8rem',
                                color: isVoiceActive ? 'red' : 'white',
                                marginRight: '1rem',
                            }}
                        >
                            {isVoiceActive ?<FiMic /> : <FiMicOff />}
                        </button>

                        <Link to="/" className="nav-link" style={{ marginRight: '1rem' }}>
                            {currentLanguage === 'hi' ? 'होम' : 'Home'}
                        </Link>
                        {isAuthenticated ? (
                            <Link to="/dashboard" className="nav-link">
                                {currentLanguage === 'hi' ? 'डैशबोर्ड' : 'Dashboard'}
                            </Link>
                        ) : (
                            <button onClick={onLogin} className="auth-btn login-btn" aria-label="Log in">
                                {currentLanguage === 'hi' ? 'लॉगिन' : 'Login'}
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <div className="container">
            <div className="image">
                <header className="schemes-header">
                    <h1>{currentLanguage === 'hi' ? 'सरकारी वित्तीय योजनाएं' : 'Government Financial Schemes'}</h1>
                    <p>{currentLanguage === 'hi' ?
                        'प्रमुख वित्तीय समावेशन और सामाजिक सुरक्षा योजनाओं का व्यापक अवलोकन' :
                        'Comprehensive overview of flagship financial inclusion and social security schemes'
                    }</p>

                    <p style={{ fontStyle: 'italic', color: '#555' }}>
                        {isVoiceActive ? (
                            currentLanguage === 'hi' ?
                                '' :
                                ''
                        ) : (
                            currentLanguage === 'hi' ?
                                '' :
                                ''
                        )}
                    </p>

                    <p aria-live="polite">
                        {recognitionActive && (
                            <span style={{ color: 'green', fontWeight: 'bold' }}>
                                {currentLanguage === 'hi' ? 'सुन रहा हूँ...' : 'Listening...'}
                            </span>
                        )}
                    </p>
                </header>
                </div>
        <div className="schemes-stats">
          <div className="stat-card">
            <h3>54.97 Cr</h3>
            <p>PMJDY Accounts</p>
          </div>
          <div className="stat-card">
            <h3>₹2.52 L Cr</h3>
            <p>Total Deposits</p>
          </div>
          <div className="stat-card">
            <h3>7.47 Cr</h3>
            <p>APY Subscribers</p>
          </div>
          <div className="stat-card">
            <h3>52.07 Cr</h3>
            <p>MUDRA Loans</p>
          </div>
        </div>
                <div className="schemes-grid" aria-label="List of schemes" role="list">
                    {schemes.map(scheme => (
                        <SchemeCard key={scheme.id} scheme={scheme} />
                    ))}
                </div>

                {selectedScheme && <SchemeModal scheme={selectedScheme} onClose={() => setSelectedScheme(null)} />}
            </div>
        </div>
    );
};

export default SchemesOverview;