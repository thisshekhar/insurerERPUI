// Rider types
export interface Rider {
  id: string;
  name: string;
  type: string;
  category: "Protection" | "Savings" | "Health" | "Accident" | "Premium";
  description: string;
  coverage: number;
  premium: number;
  deductible?: number;
  waitingPeriod?: number; // in months
  maxAge?: number;
  minAge?: number;
  benefits: string[];
  exclusions: string[];
  terms: string;
  isOptional: boolean;
  isActive: boolean;
  effectiveDate?: string;
  expiryDate?: string;
}

export interface PolicyRider extends Rider {
  policyId: string;
  addedDate: string;
  addedBy: string;
  status: "Active" | "Pending" | "Cancelled" | "Expired";
  customTerms?: string;
  discountPercentage?: number;
}

// Available riders by policy type
export const availableRidersByPolicyType = {
  "Life Insurance": [
    {
      id: "RIDER-LIFE-001",
      name: "Accidental Death Benefit",
      type: "Accidental Death",
      category: "Protection" as const,
      description: "Additional death benefit if death occurs due to accident",
      coverage: 100000,
      premium: 120,
      benefits: [
        "Double death benefit for accidental death",
        "24/7 coverage worldwide",
        "No medical exam required",
      ],
      exclusions: [
        "Death due to suicide within 2 years",
        "Death while under influence of drugs/alcohol",
        "Death due to participation in hazardous activities",
      ],
      terms: "Coverage amount is additional to base policy death benefit",
      isOptional: true,
      isActive: true,
      maxAge: 65,
      minAge: 18,
    },
    {
      id: "RIDER-LIFE-002",
      name: "Waiver of Premium",
      type: "Premium Waiver",
      category: "Premium" as const,
      description: "Waives premium payments if insured becomes disabled",
      coverage: 0,
      premium: 180,
      waitingPeriod: 6,
      benefits: [
        "Premium payments waived during disability",
        "Policy remains in force",
        "Cash value continues to accumulate",
      ],
      exclusions: [
        "Self-inflicted injuries",
        "Disability due to war or military service",
        "Pre-existing conditions",
      ],
      terms: "Disability must last at least 6 months to qualify",
      isOptional: true,
      isActive: true,
      maxAge: 60,
      minAge: 18,
    },
    {
      id: "RIDER-LIFE-003",
      name: "Critical Illness",
      type: "Critical Illness",
      category: "Health" as const,
      description:
        "Lump sum payment upon diagnosis of covered critical illness",
      coverage: 250000,
      premium: 300,
      waitingPeriod: 3,
      benefits: [
        "Covers 25+ critical illnesses",
        "Lump sum payment on diagnosis",
        "Can be used for any purpose",
      ],
      exclusions: [
        "Pre-existing conditions",
        "Conditions diagnosed within waiting period",
        "Self-inflicted conditions",
      ],
      terms: "One-time benefit payment upon first diagnosis",
      isOptional: true,
      isActive: true,
      maxAge: 70,
      minAge: 18,
    },
    {
      id: "RIDER-LIFE-004",
      name: "Long Term Care",
      type: "Long Term Care",
      category: "Health" as const,
      description: "Coverage for long-term care expenses",
      coverage: 200000,
      premium: 400,
      waitingPeriod: 12,
      benefits: [
        "Nursing home care coverage",
        "Home health care benefits",
        "Adult day care services",
      ],
      exclusions: [
        "Care due to alcohol or drug abuse",
        "Self-inflicted injuries",
        "Mental disorders without organic cause",
      ],
      terms: "Benefits payable after 12-month waiting period",
      isOptional: true,
      isActive: true,
      maxAge: 75,
      minAge: 40,
    },
  ],
  "Health Insurance": [
    {
      id: "RIDER-HEALTH-001",
      name: "Dental Coverage",
      type: "Dental",
      category: "Health" as const,
      description: "Comprehensive dental care coverage",
      coverage: 5000,
      premium: 240,
      deductible: 100,
      benefits: [
        "Preventive care at 100%",
        "Basic procedures at 80%",
        "Major procedures at 50%",
      ],
      exclusions: [
        "Cosmetic procedures",
        "Orthodontics over age 19",
        "Experimental treatments",
      ],
      terms: "Annual maximum of $5,000 per person",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 0,
    },
    {
      id: "RIDER-HEALTH-002",
      name: "Vision Coverage",
      type: "Vision",
      category: "Health" as const,
      description: "Eye care and vision correction coverage",
      coverage: 2000,
      premium: 120,
      benefits: [
        "Annual eye exams",
        "Prescription glasses or contacts",
        "Vision correction surgery discount",
      ],
      exclusions: ["Sunglasses", "Safety glasses", "Experimental procedures"],
      terms: "Annual benefit limit of $2,000 per person",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 0,
    },
    {
      id: "RIDER-HEALTH-003",
      name: "Maternity Coverage",
      type: "Maternity",
      category: "Health" as const,
      description: "Comprehensive pregnancy and childbirth coverage",
      coverage: 50000,
      premium: 600,
      waitingPeriod: 12,
      benefits: [
        "Prenatal care",
        "Delivery and hospital costs",
        "Postnatal care for mother and baby",
      ],
      exclusions: [
        "Fertility treatments",
        "Surrogacy arrangements",
        "Complications from excluded procedures",
      ],
      terms: "12-month waiting period for new additions",
      isOptional: true,
      isActive: true,
      maxAge: 45,
      minAge: 18,
    },
    {
      id: "RIDER-HEALTH-004",
      name: "Mental Health Plus",
      type: "Mental Health",
      category: "Health" as const,
      description: "Enhanced mental health and behavioral coverage",
      coverage: 25000,
      premium: 180,
      benefits: [
        "Unlimited therapy sessions",
        "Inpatient psychiatric care",
        "Substance abuse treatment",
      ],
      exclusions: [
        "Court-ordered treatment",
        "Treatment while incarcerated",
        "Experimental therapies",
      ],
      terms: "Enhanced coverage beyond standard mental health benefits",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 12,
    },
  ],
  "Auto Insurance": [
    {
      id: "RIDER-AUTO-001",
      name: "Roadside Assistance",
      type: "Roadside Assistance",
      category: "Protection" as const,
      description: "24/7 emergency roadside assistance",
      coverage: 150,
      premium: 60,
      benefits: [
        "Towing service up to 15 miles",
        "Battery jump-start",
        "Flat tire service",
        "Lockout assistance",
      ],
      exclusions: [
        "Service beyond 15 miles",
        "Repeated service calls",
        "Commercial vehicles",
      ],
      terms: "Maximum 4 service calls per year",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 16,
    },
    {
      id: "RIDER-AUTO-002",
      name: "Rental Car Coverage",
      type: "Rental Reimbursement",
      category: "Protection" as const,
      description: "Rental car expenses while your car is being repaired",
      coverage: 1500,
      premium: 90,
      benefits: [
        "Up to $50 per day for rental",
        "Maximum 30 days per claim",
        "Covers collision and comprehensive claims",
      ],
      exclusions: [
        "Regular maintenance periods",
        "Elective repairs",
        "Luxury vehicle upgrades",
      ],
      terms: "Coverage begins after 24 hours of repair time",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 21,
    },
    {
      id: "RIDER-AUTO-003",
      name: "Gap Coverage",
      type: "Gap Insurance",
      category: "Protection" as const,
      description: "Covers difference between car value and loan balance",
      coverage: 25000,
      premium: 200,
      benefits: [
        "Covers loan/lease balance",
        "Protects against depreciation",
        "No deductible required",
      ],
      exclusions: [
        "Overdue payments",
        "Extended warranties",
        "Aftermarket accessories",
      ],
      terms: "Available for financed or leased vehicles only",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 18,
    },
  ],
  "Home Insurance": [
    {
      id: "RIDER-HOME-001",
      name: "Water Backup Coverage",
      type: "Water Backup",
      category: "Protection" as const,
      description: "Coverage for water damage from sewer or drain backup",
      coverage: 15000,
      premium: 150,
      deductible: 500,
      benefits: [
        "Sewer backup coverage",
        "Drain overflow protection",
        "Emergency water removal",
      ],
      exclusions: [
        "Flood damage",
        "Groundwater seepage",
        "Maintenance-related backup",
      ],
      terms: "Separate deductible applies",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 18,
    },
    {
      id: "RIDER-HOME-002",
      name: "Identity Theft Protection",
      type: "Identity Theft",
      category: "Protection" as const,
      description: "Coverage for identity theft recovery expenses",
      coverage: 25000,
      premium: 80,
      benefits: [
        "Legal fees coverage",
        "Lost wages reimbursement",
        "Credit monitoring service",
      ],
      exclusions: [
        "Business identity theft",
        "Pre-existing identity issues",
        "Fraudulent use by family members",
      ],
      terms: "Covers expenses to restore identity",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 18,
    },
    {
      id: "RIDER-HOME-003",
      name: "Equipment Breakdown",
      type: "Equipment Breakdown",
      category: "Protection" as const,
      description: "Coverage for breakdown of home equipment and appliances",
      coverage: 50000,
      premium: 120,
      deductible: 250,
      benefits: [
        "HVAC system coverage",
        "Major appliance protection",
        "Electronic equipment coverage",
      ],
      exclusions: [
        "Normal wear and tear",
        "Manufacturer defects under warranty",
        "Flood or earthquake damage",
      ],
      terms: "Covers sudden and accidental breakdown",
      isOptional: true,
      isActive: true,
      maxAge: 99,
      minAge: 18,
    },
  ],
};

// Sample policy riders for existing policies
export const mockPolicyRiders: PolicyRider[] = [
  {
    id: "RIDER-LIFE-001",
    policyId: "POL-001",
    name: "Accidental Death Benefit",
    type: "Accidental Death",
    category: "Protection",
    description: "Additional death benefit if death occurs due to accident",
    coverage: 100000,
    premium: 120,
    benefits: [
      "Double death benefit for accidental death",
      "24/7 coverage worldwide",
      "No medical exam required",
    ],
    exclusions: [
      "Death due to suicide within 2 years",
      "Death while under influence of drugs/alcohol",
      "Death due to participation in hazardous activities",
    ],
    terms: "Coverage amount is additional to base policy death benefit",
    isOptional: true,
    isActive: true,
    maxAge: 65,
    minAge: 18,
    addedDate: "2024-02-01",
    addedBy: "Mike Chen",
    status: "Active",
    effectiveDate: "2024-02-01",
  },
  {
    id: "RIDER-HEALTH-001",
    policyId: "POL-003",
    name: "Dental Coverage",
    type: "Dental",
    category: "Health",
    description: "Comprehensive dental care coverage",
    coverage: 5000,
    premium: 240,
    deductible: 100,
    benefits: [
      "Preventive care at 100%",
      "Basic procedures at 80%",
      "Major procedures at 50%",
    ],
    exclusions: [
      "Cosmetic procedures",
      "Orthodontics over age 19",
      "Experimental treatments",
    ],
    terms: "Annual maximum of $5,000 per person",
    isOptional: true,
    isActive: true,
    maxAge: 99,
    minAge: 0,
    addedDate: "2024-01-01",
    addedBy: "James Brown",
    status: "Active",
    effectiveDate: "2024-01-01",
  },
];

// Utility functions
export const getRidersByPolicyType = (policyType: string): Rider[] => {
  return (
    availableRidersByPolicyType[
      policyType as keyof typeof availableRidersByPolicyType
    ] || []
  );
};

export const getRidersByPolicy = (policyId: string): PolicyRider[] => {
  return mockPolicyRiders.filter((rider) => rider.policyId === policyId);
};

export const getRiderById = (riderId: string): Rider | undefined => {
  for (const policyType in availableRidersByPolicyType) {
    const riders =
      availableRidersByPolicyType[
        policyType as keyof typeof availableRidersByPolicyType
      ];
    const rider = riders.find((r) => r.id === riderId);
    if (rider) return rider;
  }
  return undefined;
};

export const calculateRiderPremium = (riders: PolicyRider[]): number => {
  return riders.reduce((total, rider) => {
    if (rider.status === "Active") {
      const discount = rider.discountPercentage || 0;
      return total + rider.premium * (1 - discount / 100);
    }
    return total;
  }, 0);
};

export const calculateTotalCoverageWithRiders = (
  baseCoverage: number,
  riders: PolicyRider[],
): number => {
  const riderCoverage = riders.reduce((total, rider) => {
    if (rider.status === "Active" && rider.category === "Protection") {
      return total + rider.coverage;
    }
    return total;
  }, 0);
  return baseCoverage + riderCoverage;
};

export const isRiderEligible = (rider: Rider, customerAge: number): boolean => {
  if (rider.minAge && customerAge < rider.minAge) return false;
  if (rider.maxAge && customerAge > rider.maxAge) return false;
  return rider.isActive;
};
