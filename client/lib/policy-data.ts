// Policy types
export interface Policy {
  id: string;
  policyNumber: string;
  customerId: string;
  customerName: string;
  agentId: string;
  agentName: string;
  policyType:
    | "Life Insurance"
    | "Health Insurance"
    | "Auto Insurance"
    | "Home Insurance"
    | "Travel Insurance"
    | "Business Insurance";
  coverageType: string;
  status: "Active" | "Pending" | "Expired" | "Cancelled" | "Under Review";
  issueDate: string;
  effectiveDate: string;
  expiryDate: string;
  renewalDate: string;
  premiumAmount: number;
  premiumFrequency: "Monthly" | "Quarterly" | "Semi-Annual" | "Annual";
  coverageAmount: number;
  deductible: number;
  beneficiaries: Beneficiary[];
  coverageDetails: CoverageDetail[];
  documents: PolicyDocument[];
  payments: PolicyPayment[];
  renewalHistory: RenewalRecord[];
  riders?: PolicyRider[];
  notes: string;
  riskAssessment: "Low" | "Medium" | "High";
  commissionRate: number;
}

export interface PolicyRider {
  id: string;
  name: string;
  type: string;
  category: 'Protection' | 'Savings' | 'Health' | 'Accident' | 'Premium';
  description: string;
  coverage: number;
  premium: number;
  deductible?: number;
  status: 'Active' | 'Pending' | 'Cancelled' | 'Expired';
  addedDate: string;
  addedBy: string;
  effectiveDate?: string;
  expiryDate?: string;
  customTerms?: string;
  discountPercentage?: number;
}

export interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  percentage: number;
  contactInfo: {
    phone: string;
    email: string;
  };
}

export interface CoverageDetail {
  type: string;
  description: string;
  limit: number;
  deductible: number;
  covered: boolean;
}

export interface PolicyDocument {
  id: string;
  name: string;
  type:
    | "Policy Document"
    | "Terms & Conditions"
    | "Amendment"
    | "Certificate"
    | "Claim Form";
  uploadDate: string;
  size: string;
  url: string;
}

export interface PolicyPayment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: "Pending" | "Paid" | "Overdue" | "Partial";
  paymentMethod?: string;
  transactionId?: string;
}

export interface RenewalRecord {
  renewalDate: string;
  previousPremium: number;
  newPremium: number;
  changes: string[];
  status: "Completed" | "Pending" | "Declined";
}

// Mock Policies Data
export const mockPolicies: Policy[] = [
  {
    id: "POL-001",
    policyNumber: "LIF-2024-001-AL",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    agentId: "AGT-001",
    agentName: "Mike Chen",
    policyType: "Life Insurance",
    coverageType: "Term Life",
    status: "Active",
    issueDate: "2024-01-15",
    effectiveDate: "2024-02-01",
    expiryDate: "2034-02-01",
    renewalDate: "2025-02-01",
    premiumAmount: 2400,
    premiumFrequency: "Annual",
    coverageAmount: 500000,
    deductible: 0,
    beneficiaries: [
      {
        id: "BEN-001",
        name: "John Johnson",
        relationship: "Spouse",
        percentage: 70,
        contactInfo: { phone: "+1-555-0200", email: "john.johnson@email.com" },
      },
      {
        id: "BEN-002",
        name: "Emma Johnson",
        relationship: "Daughter",
        percentage: 30,
        contactInfo: { phone: "+1-555-0201", email: "emma.johnson@email.com" },
      },
    ],
    coverageDetails: [
      {
        type: "Death Benefit",
        description: "Lump sum payment to beneficiaries upon death",
        limit: 500000,
        deductible: 0,
        covered: true,
      },
      {
        type: "Accidental Death",
        description: "Additional coverage for accidental death",
        limit: 100000,
        deductible: 0,
        covered: true,
      },
    ],
    documents: [
      {
        id: "DOC-001",
        name: "Life Insurance Policy.pdf",
        type: "Policy Document",
        uploadDate: "2024-01-15",
        size: "2.5 MB",
        url: "/documents/life-policy-001.pdf",
      },
    ],
    payments: [
      {
        id: "PAY-001",
        amount: 2400,
        dueDate: "2024-02-01",
        paidDate: "2024-01-28",
        status: "Paid",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN-001-2024",
      },
      {
        id: "PAY-002",
        amount: 2400,
        dueDate: "2025-02-01",
        status: "Pending",
      },
    ],
    renewalHistory: [],
    riders: [
      {
        id: "RIDER-LIFE-001",
        name: "Accidental Death Benefit",
        type: "Accidental Death",
        category: "Protection",
        description: "Additional death benefit if death occurs due to accident",
        coverage: 100000,
        premium: 120,
        status: "Active",
        addedDate: "2024-02-01",
        addedBy: "Mike Chen",
        effectiveDate: "2024-02-01"
      }
    ],
    notes: "Customer opted for maximum coverage with accidental death benefit.",
    riskAssessment: "Low",
    commissionRate: 5.0,
  },
  {
    id: "POL-002",
    policyNumber: "AUT-2024-002-BS",
    customerId: "CUST-002",
    customerName: "Bob Smith",
    agentId: "AGT-002",
    agentName: "Sarah Williams",
    policyType: "Auto Insurance",
    coverageType: "Comprehensive",
    status: "Active",
    issueDate: "2024-02-01",
    effectiveDate: "2024-02-15",
    expiryDate: "2025-02-15",
    renewalDate: "2025-02-15",
    premiumAmount: 1200,
    premiumFrequency: "Annual",
    coverageAmount: 50000,
    deductible: 500,
    beneficiaries: [],
    coverageDetails: [
      {
        type: "Liability Coverage",
        description: "Bodily injury and property damage liability",
        limit: 100000,
        deductible: 0,
        covered: true,
      },
      {
        type: "Collision Coverage",
        description: "Damage to your vehicle from collision",
        limit: 50000,
        deductible: 500,
        covered: true,
      },
      {
        type: "Comprehensive Coverage",
        description: "Non-collision damage (theft, vandalism, weather)",
        limit: 50000,
        deductible: 250,
        covered: true,
      },
    ],
    documents: [
      {
        id: "DOC-002",
        name: "Auto Insurance Policy.pdf",
        type: "Policy Document",
        uploadDate: "2024-02-01",
        size: "1.8 MB",
        url: "/documents/auto-policy-002.pdf",
      },
    ],
    payments: [
      {
        id: "PAY-003",
        amount: 1200,
        dueDate: "2024-02-15",
        paidDate: "2024-02-10",
        status: "Paid",
        paymentMethod: "Credit Card",
        transactionId: "TXN-002-2024",
      },
    ],
    renewalHistory: [],
    notes: "Comprehensive coverage for 2019 Honda Civic. Clean driving record.",
    riskAssessment: "Low",
    commissionRate: 3.5,
  },
  {
    id: "POL-003",
    policyNumber: "HLT-2024-003-CD",
    customerId: "CUST-003",
    customerName: "Carol Davis",
    agentId: "AGT-003",
    agentName: "James Brown",
    policyType: "Health Insurance",
    coverageType: "Family Plan",
    status: "Active",
    issueDate: "2023-12-10",
    effectiveDate: "2024-01-01",
    expiryDate: "2024-12-31",
    renewalDate: "2024-12-31",
    premiumAmount: 4800,
    premiumFrequency: "Annual",
    coverageAmount: 1000000,
    deductible: 2000,
    beneficiaries: [],
    coverageDetails: [
      {
        type: "Hospitalization",
        description: "In-patient hospital treatment and surgery",
        limit: 500000,
        deductible: 2000,
        covered: true,
      },
      {
        type: "Outpatient Care",
        description: "Doctor visits, diagnostics, and specialist consultations",
        limit: 200000,
        deductible: 500,
        covered: true,
      },
      {
        type: "Prescription Drugs",
        description: "Medication coverage",
        limit: 50000,
        deductible: 100,
        covered: true,
      },
      {
        type: "Preventive Care",
        description: "Annual checkups, vaccinations, screenings",
        limit: 10000,
        deductible: 0,
        covered: true,
      },
    ],
    documents: [
      {
        id: "DOC-003",
        name: "Health Insurance Policy.pdf",
        type: "Policy Document",
        uploadDate: "2023-12-10",
        size: "3.2 MB",
        url: "/documents/health-policy-003.pdf",
      },
    ],
    payments: [
      {
        id: "PAY-004",
        amount: 1200,
        dueDate: "2024-01-01",
        paidDate: "2023-12-28",
        status: "Paid",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN-003-2024",
      },
      {
        id: "PAY-005",
        amount: 1200,
        dueDate: "2024-04-01",
        paidDate: "2024-03-25",
        status: "Paid",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN-004-2024",
      },
      {
        id: "PAY-006",
        amount: 1200,
        dueDate: "2024-07-01",
        status: "Pending",
      },
    ],
    renewalHistory: [
      {
        renewalDate: "2024-01-01",
        previousPremium: 4200,
        newPremium: 4800,
        changes: [
          "Increased coverage limit",
          "Added prescription drug coverage",
        ],
        status: "Completed",
      },
    ],
    riders: [
      {
        id: "RIDER-HEALTH-001",
        name: "Dental Coverage",
        type: "Dental",
        category: "Health",
        description: "Comprehensive dental care coverage",
        coverage: 5000,
        premium: 240,
        deductible: 100,
        status: "Active",
        addedDate: "2024-01-01",
        addedBy: "James Brown",
        effectiveDate: "2024-01-01"
      }
    ],
    notes:
      "Family health plan covering spouse and two children. Includes dental coverage.",
    riskAssessment: "Medium",
    commissionRate: 4.0,
  },
  {
    id: "POL-004",
    policyNumber: "HOM-2024-004-DW",
    customerId: "CUST-004",
    customerName: "David Wilson",
    agentId: "AGT-004",
    agentName: "Lisa Anderson",
    policyType: "Home Insurance",
    coverageType: "Homeowner's",
    status: "Under Review",
    issueDate: "2024-01-20",
    effectiveDate: "2024-02-01",
    expiryDate: "2025-02-01",
    renewalDate: "2025-02-01",
    premiumAmount: 1800,
    premiumFrequency: "Annual",
    coverageAmount: 400000,
    deductible: 1000,
    beneficiaries: [],
    coverageDetails: [
      {
        type: "Dwelling Coverage",
        description: "Structure of the home and attached structures",
        limit: 400000,
        deductible: 1000,
        covered: true,
      },
      {
        type: "Personal Property",
        description: "Contents and personal belongings",
        limit: 200000,
        deductible: 500,
        covered: true,
      },
      {
        type: "Liability Protection",
        description: "Personal liability and medical payments",
        limit: 300000,
        deductible: 0,
        covered: true,
      },
      {
        type: "Additional Living Expenses",
        description: "Temporary housing if home is uninhabitable",
        limit: 80000,
        deductible: 0,
        covered: true,
      },
    ],
    documents: [
      {
        id: "DOC-004",
        name: "Home Insurance Application.pdf",
        type: "Policy Document",
        uploadDate: "2024-01-20",
        size: "2.1 MB",
        url: "/documents/home-policy-004.pdf",
      },
    ],
    payments: [
      {
        id: "PAY-007",
        amount: 1800,
        dueDate: "2024-02-01",
        status: "Pending",
      },
    ],
    renewalHistory: [],
    notes: "Home insurance for newly purchased property. Inspection pending.",
    riskAssessment: "Medium",
    commissionRate: 4.5,
  },
  {
    id: "POL-005",
    policyNumber: "LIF-2023-005-EB",
    customerId: "CUST-005",
    customerName: "Emma Brown",
    agentId: "AGT-001",
    agentName: "Mike Chen",
    policyType: "Life Insurance",
    coverageType: "Whole Life",
    status: "Active",
    issueDate: "2023-11-05",
    effectiveDate: "2023-12-01",
    expiryDate: "2073-12-01",
    renewalDate: "2024-12-01",
    premiumAmount: 3600,
    premiumFrequency: "Annual",
    coverageAmount: 750000,
    deductible: 0,
    beneficiaries: [
      {
        id: "BEN-003",
        name: "Michael Brown",
        relationship: "Spouse",
        percentage: 100,
        contactInfo: { phone: "+1-555-0300", email: "michael.brown@email.com" },
      },
    ],
    coverageDetails: [
      {
        type: "Death Benefit",
        description: "Guaranteed death benefit",
        limit: 750000,
        deductible: 0,
        covered: true,
      },
      {
        type: "Cash Value",
        description: "Investment component with guaranteed growth",
        limit: 0,
        deductible: 0,
        covered: true,
      },
    ],
    documents: [
      {
        id: "DOC-005",
        name: "Whole Life Policy.pdf",
        type: "Policy Document",
        uploadDate: "2023-11-05",
        size: "4.1 MB",
        url: "/documents/whole-life-policy-005.pdf",
      },
    ],
    payments: [
      {
        id: "PAY-008",
        amount: 3600,
        dueDate: "2023-12-01",
        paidDate: "2023-11-28",
        status: "Paid",
        paymentMethod: "Bank Transfer",
        transactionId: "TXN-005-2023",
      },
      {
        id: "PAY-009",
        amount: 3600,
        dueDate: "2024-12-01",
        status: "Pending",
      },
    ],
    renewalHistory: [],
    notes:
      "Young professional seeking long-term financial protection and investment.",
    riskAssessment: "Low",
    commissionRate: 6.0,
  },
  {
    id: "POL-006",
    policyNumber: "TRV-2024-006-AL",
    customerId: "CUST-001",
    customerName: "Alice Johnson",
    agentId: "AGT-002",
    agentName: "Sarah Williams",
    policyType: "Travel Insurance",
    coverageType: "International Travel",
    status: "Expired",
    issueDate: "2024-01-10",
    effectiveDate: "2024-01-15",
    expiryDate: "2024-01-30",
    renewalDate: "N/A",
    premiumAmount: 150,
    premiumFrequency: "One-time",
    coverageAmount: 100000,
    deductible: 100,
    beneficiaries: [],
    coverageDetails: [
      {
        type: "Medical Emergency",
        description: "Emergency medical treatment abroad",
        limit: 100000,
        deductible: 100,
        covered: true,
      },
      {
        type: "Trip Cancellation",
        description: "Non-refundable trip costs if cancelled",
        limit: 10000,
        deductible: 0,
        covered: true,
      },
      {
        type: "Lost Luggage",
        description: "Compensation for lost or delayed luggage",
        limit: 2000,
        deductible: 0,
        covered: true,
      },
    ],
    documents: [
      {
        id: "DOC-006",
        name: "Travel Insurance Certificate.pdf",
        type: "Certificate",
        uploadDate: "2024-01-10",
        size: "0.8 MB",
        url: "/documents/travel-cert-006.pdf",
      },
    ],
    payments: [
      {
        id: "PAY-010",
        amount: 150,
        dueDate: "2024-01-10",
        paidDate: "2024-01-10",
        status: "Paid",
        paymentMethod: "Credit Card",
        transactionId: "TXN-006-2024",
      },
    ],
    renewalHistory: [],
    notes: "Short-term travel insurance for European vacation.",
    riskAssessment: "Low",
    commissionRate: 10.0,
  },
];

// Utility functions
export const getPolicyById = (id: string): Policy | undefined => {
  return mockPolicies.find((policy) => policy.id === id);
};

export const getPoliciesByCustomer = (customerId: string): Policy[] => {
  return mockPolicies.filter((policy) => policy.customerId === customerId);
};

export const getPoliciesByAgent = (agentName: string): Policy[] => {
  return mockPolicies.filter((policy) => policy.agentName === agentName);
};

export const getPoliciesByType = (policyType: string): Policy[] => {
  return mockPolicies.filter((policy) => policy.policyType === policyType);
};

export const getPoliciesByStatus = (status: string): Policy[] => {
  return mockPolicies.filter((policy) => policy.status === status);
};

export const getExpiringPolicies = (daysFromNow: number = 30): Policy[] => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysFromNow);

  return mockPolicies.filter((policy) => {
    const expiryDate = new Date(policy.expiryDate);
    return expiryDate <= targetDate && policy.status === "Active";
  });
};

export const calculateTotalPremiums = (policies: Policy[]): number => {
  return policies.reduce((total, policy) => total + policy.premiumAmount, 0);
};

export const calculateTotalCoverage = (policies: Policy[]): number => {
  return policies.reduce((total, policy) => total + policy.coverageAmount, 0);
};

// Policy type configurations
export const policyTypeConfigs = {
  "Life Insurance": {
    color: "blue",
    icon: "Heart",
    coverageTypes: [
      "Term Life",
      "Whole Life",
      "Universal Life",
      "Variable Life",
    ],
    typicalCoverage: { min: 50000, max: 5000000 },
    typicalPremium: { min: 500, max: 10000 },
  },
  "Health Insurance": {
    color: "green",
    icon: "Cross",
    coverageTypes: [
      "Individual",
      "Family Plan",
      "Group Plan",
      "Medicare Supplement",
    ],
    typicalCoverage: { min: 100000, max: 2000000 },
    typicalPremium: { min: 1200, max: 8000 },
  },
  "Auto Insurance": {
    color: "orange",
    icon: "Car",
    coverageTypes: [
      "Liability Only",
      "Collision",
      "Comprehensive",
      "Full Coverage",
    ],
    typicalCoverage: { min: 25000, max: 500000 },
    typicalPremium: { min: 800, max: 3000 },
  },
  "Home Insurance": {
    color: "purple",
    icon: "Home",
    coverageTypes: ["Homeowner's", "Condo", "Renter's", "Landlord"],
    typicalCoverage: { min: 100000, max: 2000000 },
    typicalPremium: { min: 800, max: 5000 },
  },
  "Travel Insurance": {
    color: "teal",
    icon: "Plane",
    coverageTypes: [
      "Domestic",
      "International",
      "Business Travel",
      "Adventure Travel",
    ],
    typicalCoverage: { min: 50000, max: 500000 },
    typicalPremium: { min: 50, max: 1000 },
  },
  "Business Insurance": {
    color: "indigo",
    icon: "Building",
    coverageTypes: [
      "General Liability",
      "Professional Liability",
      "Property",
      "Workers' Comp",
    ],
    typicalCoverage: { min: 500000, max: 10000000 },
    typicalPremium: { min: 2000, max: 25000 },
  },
};
