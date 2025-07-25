import React, { useState } from 'react';
import '../styles/FinancialDetailsModal.css';

const FinancialDetailsModal = ({ loanType, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    panNumber: '',
    aadhaarNumber: '',
    
    // Financial Information
    monthlyIncome: '',
    employmentType: '',
    companyName: '',
    workExperience: '',
    existingEMIs: '',
    bankName: '',
    accountType: '',
    
    // Loan Details
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    
    // Additional Information
    familyIncome: '',
    dependents: '',
    propertyOwned: '',
    vehicleOwned: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.fullName) newErrors.fullName = 'Full name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone || formData.phone.length !== 10) {
        newErrors.phone = 'Valid 10-digit phone number is required';
      }
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.panNumber || formData.panNumber.length !== 10) {
        newErrors.panNumber = 'Valid PAN number is required';
      }
      if (!formData.aadhaarNumber || formData.aadhaarNumber.length !== 12) {
        newErrors.aadhaarNumber = 'Valid 12-digit Aadhaar number is required';
      }
    }

    if (currentStep === 2) {
      if (!formData.monthlyIncome || parseInt(formData.monthlyIncome) < 15000) {
        newErrors.monthlyIncome = 'Minimum monthly income of Rs. 15,000 required';
      }
      if (!formData.employmentType) newErrors.employmentType = 'Employment type is required';
      if (!formData.companyName) newErrors.companyName = 'Company/Business name is required';
      if (!formData.workExperience) newErrors.workExperience = 'Work experience is required';
      if (!formData.bankName) newErrors.bankName = 'Bank name is required';
      if (!formData.accountType) newErrors.accountType = 'Account type is required';
    }

    if (currentStep === 3) {
      if (!formData.loanAmount || parseInt(formData.loanAmount) < 10000) {
        newErrors.loanAmount = 'Minimum loan amount is Rs. 10,000';
      }
      if (loanType && parseInt(formData.loanAmount) > loanType.maxAmount) {
        newErrors.loanAmount = `Maximum amount for ${loanType.name} is Rs. ${loanType.maxAmount.toLocaleString()}`;
      }
      if (!formData.loanPurpose) newErrors.loanPurpose = 'Loan purpose is required';
      if (!formData.tenure) newErrors.tenure = 'Loan tenure is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      onSubmit(formData);
    }
  };

  const calculateEMI = () => {
    const principal = parseInt(formData.loanAmount) || 0;
    const rate = loanType ? parseFloat(loanType.interestRate.split('-')[0]) / 100 / 12 : 0.01;
    const tenure = parseInt(formData.tenure) || 12;
    
    const emi = (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
    return Math.round(emi);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="financial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Loan Application - {loanType?.name}</h2>
          <div className="step-indicator">
            <span className={step >= 1 ? 'active' : ''}>1</span>
            <span className={step >= 2 ? 'active' : ''}>2</span>
            <span className={step >= 3 ? 'active' : ''}>3</span>
          </div>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="financial-form">
          {step === 1 && (
            <div className="form-step">
              <h3>Personal Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                  />
                  {errors.fullName && <span className="error-text">{errors.fullName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    maxLength="10"
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
                
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className={errors.dateOfBirth ? 'error' : ''}
                  />
                  {errors.dateOfBirth && <span className="error-text">{errors.dateOfBirth}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>PAN Number *</label>
                  <input
                    type="text"
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleInputChange}
                    maxLength="10"
                    placeholder="ABCDE1234F"
                    className={errors.panNumber ? 'error' : ''}
                  />
                  {errors.panNumber && <span className="error-text">{errors.panNumber}</span>}
                </div>
                
                <div className="form-group">
                  <label>Aadhaar Number *</label>
                  <input
                    type="text"
                    name="aadhaarNumber"
                    value={formData.aadhaarNumber}
                    onChange={handleInputChange}
                    maxLength="12"
                    className={errors.aadhaarNumber ? 'error' : ''}
                  />
                  {errors.aadhaarNumber && <span className="error-text">{errors.aadhaarNumber}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h3>Financial Information</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Monthly Income (₹) *</label>
                  <input
                    type="number"
                    name="monthlyIncome"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                    className={errors.monthlyIncome ? 'error' : ''}
                  />
                  {errors.monthlyIncome && <span className="error-text">{errors.monthlyIncome}</span>}
                </div>
                
                <div className="form-group">
                  <label>Employment Type *</label>
                  <select
                    name="employmentType"
                    value={formData.employmentType}
                    onChange={handleInputChange}
                    className={errors.employmentType ? 'error' : ''}
                  >
                    <option value="">Select Employment Type</option>
                    <option value="salaried">Salaried</option>
                    <option value="self-employed">Self Employed</option>
                    <option value="business">Business Owner</option>
                    <option value="freelancer">Freelancer</option>
                  </select>
                  {errors.employmentType && <span className="error-text">{errors.employmentType}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company/Business Name *</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className={errors.companyName ? 'error' : ''}
                  />
                  {errors.companyName && <span className="error-text">{errors.companyName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Work Experience (Years) *</label>
                  <select
                    name="workExperience"
                    value={formData.workExperience}
                    onChange={handleInputChange}
                    className={errors.workExperience ? 'error' : ''}
                  >
                    <option value="">Select Experience</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                  {errors.workExperience && <span className="error-text">{errors.workExperience}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Existing EMIs (₹)</label>
                  <input
                    type="number"
                    name="existingEMIs"
                    value={formData.existingEMIs}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Family Income (₹)</label>
                  <input
                    type="number"
                    name="familyIncome"
                    value={formData.familyIncome}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Bank Name *</label>
                  <select
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleInputChange}
                    className={errors.bankName ? 'error' : ''}
                  >
                    <option value="">Select Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.bankName && <span className="error-text">{errors.bankName}</span>}
                </div>
                
                <div className="form-group">
                  <label>Account Type *</label>
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className={errors.accountType ? 'error' : ''}
                  >
                    <option value="">Select Account Type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                    <option value="salary">Salary</option>
                  </select>
                  {errors.accountType && <span className="error-text">{errors.accountType}</span>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h3>Loan Details</h3>
              
              <div className="loan-info-card">
                <h4>{loanType?.name}</h4>
                <div className="loan-details">
                  <div className="detail-item">
                    <span>Interest Rate:</span>
                    <span>{loanType?.interestRate}</span>
                  </div>
                  <div className="detail-item">
                    <span>Max Amount:</span>
                    <span>₹{loanType?.maxAmount.toLocaleString()}</span>
                  </div>
                  <div className="detail-item">
                    <span>Processing Fee:</span>
                    <span>{loanType?.processingFee}</span>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Loan Amount (₹) *</label>
                  <input
                    type="number"
                    name="loanAmount"
                    value={formData.loanAmount}
                    onChange={handleInputChange}
                    className={errors.loanAmount ? 'error' : ''}
                    max={loanType?.maxAmount}
                  />
                  {errors.loanAmount && <span className="error-text">{errors.loanAmount}</span>}
                </div>
                
                <div className="form-group">
                  <label>Loan Tenure (Months) *</label>
                  <select
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    className={errors.tenure ? 'error' : ''}
                  >
                    <option value="">Select Tenure</option>
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                  {errors.tenure && <span className="error-text">{errors.tenure}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Loan Purpose *</label>
                <textarea
                  name="loanPurpose"
                  value={formData.loanPurpose}
                  onChange={handleInputChange}
                  className={errors.loanPurpose ? 'error' : ''}
                  rows="3"
                  placeholder="Describe the purpose of the loan"
                />
                {errors.loanPurpose && <span className="error-text">{errors.loanPurpose}</span>}
              </div>

              {formData.loanAmount && formData.tenure && (
                <div className="emi-calculator">
                  <h4>EMI Calculation</h4>
                  <div className="emi-result">
                    <span>Monthly EMI: ₹{calculateEMI().toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="form-actions">
            {step > 1 && (
              <button type="button" onClick={handlePrevious} className="btn-secondary">
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="btn-primary">
                Next
              </button>
            ) : (
              <button type="submit" className="btn-primary">
                Submit Application
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialDetailsModal;
