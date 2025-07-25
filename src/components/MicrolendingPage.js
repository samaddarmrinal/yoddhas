import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import '../styles/MicrolendingPage.css';

// Government schemes with loan purposes and limits
const GOVT_SCHEMES = [
  {
    name: "MUDRA Shishu",
    loanPurpose: ["Startup or new business", "Purchasing trade items or inventory", "Street vending or hawker business support"],
    min: 1000, max: 50000,
    rate: "3.5%–8%",
    description: "Ideal for startups and street vendors seeking loans up to ₹50,000. No collateral.",
    url: "https://www.mudra.org.in/"
  },
  {
    name: "MUDRA Kishor",
    loanPurpose: ["Business expansion (equipment, stock, renovation)", "Working capital needs"],
    min: 50001, max: 500000,
    rate: "6%–10%",
    description: "For business expansion, working capital. Loan ₹50,001–₹5 lakh. No collateral.",
    url: "https://www.mudra.org.in/"
  },
  {
    name: "PM SVANidhi",
    loanPurpose: ["Street vending or hawker business support"],
    min: 10000, max: 50000,
    rate: "3%",
    description: "For urban street vendors: Quick, subsidized loans up to ₹50,000.",
    url: "https://pmsvanidhi.mohua.gov.in/"
  },
  {
    name: "Stand Up India",
    loanPurpose: ["Startup or new business", "Business expansion (equipment, stock, renovation)"],
    min: 1000000, max: 10000000,
    rate: "4%–6.5%",
    description: "For new enterprises by SC/ST & women entrepreneurs. Minimum ₹10 lakh.",
    url: "https://www.standupmitra.in/"
  },
  {
    name: "DAY-NULM",
    loanPurpose: ["Startup or new business", "Street vending or hawker business support", "Working capital needs"],
    min: 5000, max: 200000,
    rate: "~3%",
    description: "Interest subsidized loans up to ₹2 lakh for urban poor entrepreneurs.",
    url: "https://nulm.gov.in/"
  }
];

// Purpose options matching current financial norms
const PURPOSE_OPTIONS = [
  "Startup or new business",
  "Business expansion (equipment, stock, renovation)",
  "Working capital needs",
  "Agricultural or allied activities (purchase of livestock, dairy, farm tools)",
  "Purchasing trade items or inventory",
  "Education or skill training",
  "Healthcare emergency or medical expenses",
  "Home repairs/improvement (essential only)",
  "Street vending or hawker business support",
  "Personal emergency (within micro-lending rules)"
];

const INCOME_CEILING = 300000;

const MicrolendingPage =({isAuthenticated, currentUser, onLogin, onSignup, onLogout}) => {
  const [form, setForm] = useState(
    isAuthenticated
      ? {
          name: "Sita Devi",
          aadhaar: "123456789012",
          pan: "AFZPK7190K",
          income: "300000",
          existingLoan: "20000",
          purpose: "Street vending or hawker business support",
          amount: "",
          referred: "2",
        }
      : {
          name: "",
          aadhaar: "",
          pan: "",
          income: "",
          existingLoan: "",
          purpose: "",
          amount: "",
          referred: "",
        }
  );

  const [eligibility, setEligibility] = useState(null);
  const [matchingSchemes, setMatchingSchemes] = useState([]);
  const [modalContent, setModalContent] = React.useState(null);

  const handleChange = (e) => {
    setForm((prevForm) => ({
      ...prevForm,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApply = (schemeName) => {
   setTimeout(() => {
        const applicationNo = Math.floor(100000 + Math.random() * 900000);
        setModalContent(`Your loan for ${schemeName} has been applied successfully.\nApplication No: ${applicationNo}`);
   }, 1000);
   };

  const [voices, setVoices] = useState([]);

    useEffect(() => {
      const synth = window.speechSynthesis;

      const loadVoices = () => {
        const availableVoices = synth.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      synth.addEventListener("voiceschanged", loadVoices);

      return () => {
        synth.removeEventListener("voiceschanged", loadVoices);
      };
    }, []);

    // Helper to get a Hindi voice once voices are loaded
    const getHindiVoice = () => {
      return (
        voices.find(
          (voice) =>
            voice.lang.toLowerCase().startsWith("hi") ||
            voice.name.toLowerCase().includes("hindi")
        ) || null
      );
    };

   const speakResultsHindi = () => {
     if (!eligibility) {
       alert("कृपया परिणाम प्राप्त करने के लिए पहले पात्रता जांच करें।");
       return;
     }

     let text = "";
     text += `स्थिति: ${eligibility.eligible ? "पात्र" : "अयोग्य"}. `;
     text += `टिप्पणी: ${eligibility.message
       .replace("Eligible government schemes displayed below.", "नीचे पात्र सरकारी योजनाएं दी गई हैं।")
       .replace(
         "No government scheme matches this loan purpose and amount.",
         "इस ऋण उद्देश्य और राशि के लिए कोई सरकारी योजना उपयुक्त नहीं है।"
       )}। `;

     if (eligibility.eligible && eligibility.message.includes("Eligible")) {
       text += `अधिकतम पात्र ऋण राशि ₹${eligibility.amount.toLocaleString("en-IN")} है। `;
     }

     if (matchingSchemes.length > 0) {
       text += `आप निम्नलिखित सरकारी योजनाओं के लिए पात्र हैं: `;
       matchingSchemes.forEach((s) => {
         text += `${s.name}, ऋण सीमा ₹${s.min.toLocaleString("en-IN")} से ₹${s.max.toLocaleString(
           "en-IN"
         )}, ब्याज दर ${s.rate}। `;
       });
     }

     const utterance = new window.SpeechSynthesisUtterance(text);

     // Select Hindi voice if available
     const voices = window.speechSynthesis.getVoices();
     const hindiVoice =
       voices.find(
         (voice) =>
           voice.lang.toLowerCase().startsWith("hi") || voice.name.toLowerCase().includes("hindi")
       ) || null;

     if (hindiVoice) {
       utterance.voice = hindiVoice;
     } else {
       alert(
         "आपके सिस्टम पर हिंदी आवाज़ उपलब्ध नहीं है। डिफ़ॉल्ट आवाज़ का उपयोग किया जाएगा।"
       );
     }

     window.speechSynthesis.speak(utterance);
   };

  const checkEligibility = (e) => {
    e.preventDefault();
    setTimeout(() => {
        const income = Number(form.income);
        const existingLoan = Number(form.existingLoan) || 0;
        const requestedAmount = Number(form.amount);
        const { purpose } = form;

        // Basic checks
        if (income > INCOME_CEILING) {
          setEligibility({ eligible: false, message: "Annual income exceeds ₹3 lakh ceiling.", amount: 0 });
          setMatchingSchemes([]);
          return;
        }

        // 25% of income minus existing loans (realistic norm)
        const maxUserAmount = Math.max(0, income * 0.25 - existingLoan);
        if (requestedAmount > maxUserAmount) {
          setEligibility({ eligible: false, message: `Eligible loan amount is ₹${maxUserAmount.toLocaleString("en-IN")}. Requested exceeds this limit.`, amount: maxUserAmount });
          setMatchingSchemes([]);
          return;
        }

        // Find relevant schemes
        const matched = GOVT_SCHEMES.filter(
          s => s.loanPurpose.includes(purpose) && requestedAmount >= s.min && requestedAmount <= s.max
        );

        setEligibility({
          eligible: maxUserAmount > 0 && matched.length > 0,
          message: matched.length > 0
            ? "Eligible government schemes displayed below."
            : "No government scheme matches this loan purpose and amount.",
          amount: maxUserAmount
        });
        setMatchingSchemes(matched);
    }, 1000);
  };

  const speakResults = () => {
    let text = "";
    if (eligibility) {
      text += `Status: ${eligibility.eligible ? "Eligible" : "Not Eligible"}. `;
      text += `Note: ${eligibility.message}. `;
      if (eligibility.eligible) {
        text += `Maximum eligible loan amount is ₹${eligibility.amount.toLocaleString("en-IN")}. `;
      }
      if (matchingSchemes.length > 0) {
        text += `You are eligible for the following government schemes: `;
        matchingSchemes.forEach((s) => {
          text += `${s.name}, loan range ₹${s.min.toLocaleString("en-IN")} to ₹${s.max.toLocaleString("en-IN")}, interest rate ${s.rate}. `;
        });
      }
    } else {
      text = "Please check eligibility first to get your results.";
    }
    const utterance = new window.SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
  };



  return (
  <div className="microlending-page">
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

         <section className="heroic">
                <div className="container">
                  <div className="hero-content">
                  </div>
                </div>
              </section>

    <div style={{
        display: "flex",
        maxWidth: 1100,
        margin: "40px auto",
        background: "#f6faff",
        borderRadius: 14,
        boxShadow: "0 6px 22px rgba(30,82,174,0.08)"
      }}>
        {/* Left Sidebar */}
        <div style={{
          flex: "0 0 330px",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          padding: "28px 22px 28px 38px",
          background: "#e7f3f7",
          borderTopLeftRadius: 14,
          borderBottomLeftRadius: 14,
          minHeight: "100%"
        }}>

          <h1 style={{ color: "#173c64", marginBottom: 18, textAlign: "center" }}>About Microlending</h1>
            <section style={{
                  marginBottom: 22,
                  fontSize: 15.5,
                  background: "linear-gradient(90deg, #e3f0fc 60%, #f6faff 100%)",
                  borderRadius: 10,
                  padding: "18px 22px",
                  color: "#234265"
                }}>
                  Micro-lending empowers grassroots entrepreneurs with accessible loans and simple documentation. Tap into government-backed schemes that offer low interest, support for women and startups, and promote self-reliance.
            </section>
          {/* What are Government Micro-Loan Schemes? */}
          <section style={{ marginTop: 8, marginBottom: 0 }}>
            <h4 style={{ marginBottom: 7, color: "#2867b7" }}>What are Government Micro-Loan Schemes?</h4>
            <ul style={{ fontSize: 14, color: "#2b3f60", paddingLeft: 16 }}>
              <li>
                <b>MUDRA:</b> Wide access for small traders, startups, vendors (Shishu & Kishor tiers).
              </li>
              <li>
                <b>PM SVANidhi:</b> Especially for urban street vendors and hawkers; incentivized repayments.
              </li>
              <li>
                <b>Stand Up India:</b> For women, SC/ST entrepreneurs opening new businesses.
              </li>
              <li>
                <b>DAY-NULM:</b> For urban micro-entrepreneurs, with interest subsidy.
              </li>
            </ul>
            <div style={{ marginTop: 10, fontSize: 13, color: "#384d6b" }}>
              <b>Note:</b> Private and digital micro-lenders may have different criteria and higher rates.
            </div>
          </section>
        </div>
    <div
      style={{
        flex: 1,
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column", // vertical stack for children
      }}
    >
      <form onSubmit={checkEligibility} style={{
        padding: 18,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 2px 12px #c7daea36",
        marginBottom: 30
      }}>
        <label>Full Name<br />
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          /></label>
        <br />
        <label>Aadhaar Number<br />
          <input
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleChange}
            required
            maxLength={12}
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          /></label>
        <br />
        <label>PAN Number<br />
          <input
            name="pan"
            value={form.pan}
            onChange={handleChange}
            required
            maxLength={10}
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          /></label>
        <br />
        <label>Annual Income (INR)<br />
          <input
            name="income"
            type="number"
            min={0}
            value={form.income}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          /></label>
        <br />
        <label>Existing Loan Amount (INR)<br />
          <input
            name="existingLoan"
            type="number"
            min={0}
            value={form.existingLoan}
            onChange={handleChange}
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          /></label>
        <br />
        <label>Purpose of Loan<br />
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          >
            <option value="">-- Select purpose --</option>
            {PURPOSE_OPTIONS.map(option =>
              <option key={option} value={option}>{option}</option>
            )}
          </select>
        </label>
        <br />
        <label>Requested Loan Amount (INR)<br />
          <input
            name="amount"
            type="number"
            min={1000}
            step={100}
            value={form.amount}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
          /></label>
        <br />
        <label>No. of Existing customer referred<br />
           <input
              name="referred"
              value={form.referred}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 8, margin: "7px 0 13px", borderRadius: 4, border: "1.2px solid #b6c1dc" }}
        /></label>
        <br />
        <div style={{ display: 'flex', gap: '12px', marginTop: 10 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                backgroundColor: "#2867b7",
                color: "#fff",
                padding: "11px 24px",
                fontWeight: "bold",
                border: "none",
                borderRadius: 7,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(40,103,183,0.4)",
                transition: "background-color 0.3s ease",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#1f508e")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#2867b7")}
              aria-label="Check micro-loan eligibility"
            >
              Check Eligibility
            </button>

            <button
              type="button"
              style={{
                flex: 1,
                backgroundColor: "#115199",
                color: "#fff",
                padding: "11px 24px",
                fontWeight: "bold",
                border: "none",
                borderRadius: 7,
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 2px 8px #c7daeaa2",
                transition: "background-color 0.3s ease",
              }}
              onClick={speakResults}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#0c3a71")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#115199")}
              aria-label="Speak eligibility results"
              disabled={!eligibility}
              title={eligibility ? "Speak eligibility results" : "Check eligibility first"}
            >
              🔊 Speak Results
            </button>

            <button
              type="button"
              onClick={speakResultsHindi}
              style={{
                backgroundColor: "#007b33",
                color: "white",
                padding: "11px 24px",
                borderRadius: 7,
                border: "none",
                fontWeight: "bold",
                fontSize: 15,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0, 123, 51, 0.5)",
                marginLeft: 12,
              }}
              aria-label="Eligibility results हिंदी में सुनें"
            >
              🔊 हिंदी में सुनें
            </button>

            <button
              type="button"
                onClick={stopSpeaking}
                style={{
                  flex: 1,
                  backgroundColor: "#9e2a2a",
                  color: "#fff",
                  padding: "11px 24px",
                  fontWeight: "bold",
                  border: "none",
                  borderRadius: 7,
                  fontSize: 15,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #c74b4b",
                  transition: "background-color 0.3s ease",
                }}
                aria-label="Stop speaking"
              >
              ⏹ Stop
            </button>
        </div>
      </form>

      {/* Eligibility Result */}
      {eligibility && (
        <div style={{ marginTop: 24 }}>
          <div><b>Status:</b> {eligibility.eligible ? "Eligible: Customer Referred ID - 234965 " : "Not Eligible"}</div>
          <div><b>Note:</b> {eligibility.message}</div>
          {eligibility.eligible &&
            <div> <b>Max Eligible Loan:</b> ₹{eligibility.amount.toLocaleString("en-IN")}</div>
          }
        </div>
      )}

      {/* Matching Schemes */}
      {matchingSchemes.length > 0 && (
        <section style={{ marginTop: 32 }}>
          <h3 style={{ color: "#115199", marginBottom: 10 }}>Eligible Government Schemes</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "#f7fbff", borderRadius: 10 }}>
            <thead>
              <tr style={{ background: "#bee1f7" }}>
                <th style={{ padding: 9, border: "1px solid #d7eaf8" }}>Scheme</th>
                <th style={{ padding: 9, border: "1px solid #d7eaf8" }}>Loan Range</th>
                <th style={{ padding: 9, border: "1px solid #d7eaf8" }}>Interest Rate</th>
                <th style={{ padding: 9, border: "1px solid #d7eaf8" }}>Description</th>
                <th style={{ padding: 9, border: "1px solid #d7eaf8", textAlign: "center" }}>Apply</th>
              </tr>
            </thead>
            <tbody>
              {matchingSchemes.map((s, idx) =>
                <tr key={s.name} style={{ background: idx % 2 ? "#f0f8fc" : "#fafcfd" }}>
                  <td style={{ padding: 9, border: "1px solid #d7eaf8", fontWeight: "bold" }}>{s.name}</td>
                  <td style={{ padding: 9, border: "1px solid #d7eaf8" }}>
                    ₹{s.min.toLocaleString("en-IN")} – ₹{s.max.toLocaleString("en-IN")}
                  </td>
                  <td style={{ padding: 9, border: "1px solid #d7eaf8" }}>{s.rate}</td>
                  <td style={{ padding: 9, border: "1px solid #d7eaf8" }}>{s.description}</td>
                  <td style={{ padding: 9, border: "1px solid #d7eaf8", textAlign: "center" }}>
                     <button
                            onClick={() => handleApply(s.name)}
                            style={{
                              backgroundColor: "#198754",
                              color: "white",
                              border: "none",
                              padding: "6px 12px",
                              borderRadius: 6,
                              cursor: "pointer",
                              fontWeight: "600",
                            }}
                            aria-label={`Apply for ${s.name}`}
                          >
                            Apply
                     </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <ul style={{ fontSize: 14.5, color: "#395677", marginTop: 20 }}>
            <li>For further details and online applications, visit respective scheme websites (see government portals).</li>
            <li>Meeting eligibility does not guarantee sanction; final approval is at lender discretion as per latest policy.</li>
          </ul>
        </section>
      )}
      {modalContent && (
            <div
              onClick={() => setModalContent(null)} // close modal on background click
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 9999,
                padding: "10px",
                boxSizing: "border-box",
              }}
            >
              <div
                onClick={(e) => e.stopPropagation()} // prevent modal close on modal content click
                style={{
                  backgroundColor: "white",
                  borderRadius: "10px",
                  padding: "25px 30px",
                  maxWidth: "400px",
                  width: "100%",
                  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                  textAlign: "center",
                  whiteSpace: "pre-line", // respect line breaks
                  fontSize: 16,
                  color: "#333",
                }}
              >
                <p>{modalContent}</p>
                <button
                  onClick={() => setModalContent(null)}
                  style={{
                    marginTop: 20,
                    backgroundColor: "#287b4e",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    padding: "10px 24px",
                    fontSize: 15,
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
      )}
      </div>
    </div>
</div>
  );
}

export default MicrolendingPage;