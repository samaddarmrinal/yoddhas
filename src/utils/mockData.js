export const mockSchemes = [
  {
    "id": "mgnrega",
      "name": "Mahatma Gandhi National Rural Employment Guarantee Act (MGNREGA)",
      "description": "Wage employment scheme ensuring 100 days of guaranteed work to rural households",
      category: 'Financial',
      "eligibility": "Rural households in India",
      "documents": ["Aadhaar Card", "Job Card"],
      "benefits": [
        "Guarantees 100 days of wage employment in a financial year to every rural household",
        "Focuses on unskilled manual work for livelihood security",
        "Empowers rural women through inclusive participation",
        "Promotes sustainable rural infrastructure like ponds, roads, plantations",
        "Wages paid directly to bank or post office accounts"
      ],
       processingTime: '7-15 working days',
      contactInfo: 'Toll-free: 1800-11-0001'
  },
    {
      id: 'pmjdy',
      name: 'Pradhan Mantri Jan Dhan Yojana (PMJDY)',
      description: 'Financial inclusion scheme providing universal access to banking facilities',
      category: 'Financial',
      benefits: [
        'Basic bank account without minimum balance requirement',
        'Free RuPay debit card with Rs. 2 lakh accident insurance',
        'Overdraft facility up to Rs. 10,000',
        'Access to banking services in rural areas through Bank Mitras'
      ],
      eligibility: 'All citizens above 10 years of age',
      documents: ['Aadhaar Card', 'Identity Proof', 'Address Proof'],
      processingTime: '7-15 working days',
      contactInfo: 'Toll-free: 1800-11-0001'
    },
    {
      id: 'pmsby',
      name: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
      description: 'Personal accident insurance scheme offering coverage for death/disability',
      category: 'Insurance',
      benefits: [
        'Rs. 2 lakh coverage for death or permanent total disability',
        'Rs. 1 lakh coverage for partial disability',
        'Annual premium of Rs. 20 only',
        'Simple claim settlement process'
      ],
      eligibility: 'Age 18-70 years with bank account',
      documents: ['Bank Account', 'Aadhaar Card', 'Consent Form'],
    processingTime: '1-2 working days',
    contactInfo: 'Toll-free: 1800-180-1111'
    },
    {
      id: 'pmjjby',
      name: 'Pradhan Mantri Jeevan Jyoti Bima Yojana (PMJJBY)',
      description: 'Life insurance scheme providing coverage for death due to any reason',
      category: 'Insurance',
      benefits: [
        'Rs. 2 lakh life insurance coverage',
        'Annual premium of Rs. 436',
        'Coverage for death due to any reason',
        'Auto-debit from bank account'
      ],
      eligibility: 'Age 18-50 years with bank account',
      documents: ['Bank Account', 'Aadhaar Card', 'Nominee Details'],
      processingTime: '1-2 working days',
      contactInfo: 'Toll-free: 1800-180-1111'
    },
    {
      id: 'apy',
      name: 'Atal Pension Yojana (APY)',
      description: 'Pension scheme for unorganized sector workers',
      category: 'Pension',
      benefits: [
        'Fixed pension: Rs. 1,000 to Rs. 5,000 per month at age 60',
        'Government guarantee on minimum pension',
        'Flexible contribution options',
        'Death benefit for spouse'
      ],
      eligibility: 'Age 18-40 years, minimum 20 years contribution',
      documents: ['Bank Account', 'Aadhaar Card', 'Mobile Number'],
      processingTime: '5-10 working days',
      contactInfo: 'Toll-free: 1800-222-080'
    },
    {
      id: 'pmmy',
      name: 'Pradhan Mantri MUDRA Yojana (PMMY)',
      description: 'Collateral-free credit scheme for micro enterprises',
      category: 'Credit',
      benefits: [
        'Loans up to Rs. 20 lakh without collateral',
        'Support for non-agricultural activities',
        'Three categories: Shishu, Kishore, Tarun',
        'Working capital and term loan both supported'
      ],
      eligibility: 'Non-agricultural income generating activities',
      documents: ['Business Plan', 'Identity Proof', 'Address Proof', 'Bank Statements'],
      processingTime: '15-30 working days',
      contactInfo: 'Toll-free: 1800-180-MUDRA'
    },
    {
      id: 'supi',
      name: 'Stand Up India Scheme (SUPI)',
      description: 'Entrepreneurship scheme for SC/ST and Women',
      category: 'Entrepreneurship',
      benefits: [
        'Loans between Rs. 10 lakh to Rs. 1 crore',
        'Support for greenfield projects',
        'Manufacturing, services, trading sector support',
        'Repayment period up to 7 years'
      ],
      eligibility: 'SC/ST and Women entrepreneurs above 18 years',
      documents: ['Caste Certificate', 'Project Report', 'Identity Proof', 'Address Proof'],
      processingTime: '30-45 working days',
      contactInfo: 'Toll-free: 1800-180-1111'
    }
  ];

  export const extraSchemes = [
    {
      id: 'pmkvy',
      name: 'Pradhan Mantri Kaushal Vikas Yojana (PMKVY)',
      description: 'Skill-development incentives for youth',
      category: 'Skill',
      benefits: ['NSQF certified training', '₹8,000 average reward'],
      eligibility: 'Age 18–45, Aadhaar linked',
      documents: ['Aadhaar', 'Bank pass-book']
    },
    {
      id: 'nsc',
      name: 'National Savings Certificate (NSC)',
      description: 'Guaranteed return small-savings bond (5-year)',
      category: 'Savings',
      benefits: ['7.7 % interest (compounded)', '80C tax deduction'],
      eligibility: 'Indian residents',
      documents: ['ID proof', 'Address proof']
    }
  ];

  export const loanTypes = [
    {
      id: 'microloan',
      name: 'Microlending',
      description: 'Quick loans up to Rs. 50,000 for immediate needs',
      maxAmount: 50000,
      interestRate: '12-18% per annum',
      tenure: '6-24 months',
      processingFee: '1-2% of loan amount',
      eligibility: ['Age 21-65 years', 'Minimum income Rs. 15,000/month', 'CIBIL score 650+']
    },
    {
      id: 'mudra',
      name: 'MUDRA Business Loan',
      description: 'Business loans up to Rs. 20 lakh without collateral',
      maxAmount: 2000000,
      interestRate: '8-12% per annum',
      tenure: '12-84 months',
      processingFee: 'NIL',
      eligibility: ['Business registration', 'Minimum 2 years operation', 'Good credit history']
    },
    {
      id: 'personal',
      name: 'Personal Loan',
      description: 'Unsecured loans for personal expenses',
      maxAmount: 1000000,
      interestRate: '10-16% per annum',
      tenure: '12-60 months',
      processingFee: '1-3% of loan amount',
      eligibility: ['Age 21-60 years', 'Minimum income Rs. 25,000/month', 'Stable employment']
    }
  ];
  
  export const creditTips = [
    'Pay every bill before its due date',
    'Keep credit utilisation below 30 %',
    'Avoid multiple loan enquiries in a short span',
    'Maintain older credit lines—age improves score'
  ];
  
  export const mockUser = {
    userId: 'USER001',
    name: 'Test User',
    creditScore: 720,
    isNewUser: false,
    availableSchemes: 6,
    appliedSchemes: [
      {
        id: 'pmjdy',
        status: 'Active',
        appliedDate: '2024-01-15',
        benefits: 'Account opened, RuPay card issued'
      }
    ]
  };
  