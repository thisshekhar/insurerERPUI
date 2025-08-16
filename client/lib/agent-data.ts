// Agent types
export interface Agent {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  hireDate: string;
  status: "Active" | "Inactive" | "Suspended" | "Training";
  position: "Agent" | "Senior Agent" | "Team Lead" | "Manager" | "Director";
  department:
    | "Sales"
    | "Underwriting"
    | "Claims"
    | "Customer Service"
    | "Operations";
  territory: Territory;
  address: Address;
  emergencyContact: EmergencyContact;
  certifications: Certification[];
  performance: PerformanceMetrics;
  commissionStructure: CommissionStructure;
  targets: AgentTargets;
  qualifications: string[];
  notes: string;
  profilePhoto?: string;
  manager?: string;
  teamMembers?: string[];
}

export interface Territory {
  id: string;
  name: string;
  type: "Geographic" | "Product" | "Customer Segment";
  boundaries: string[];
  customerCount: number;
  potentialRevenue: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  status: "Valid" | "Expired" | "Pending Renewal";
  certificateNumber: string;
}

export interface PerformanceMetrics {
  currentPeriod: PeriodMetrics;
  previousPeriod: PeriodMetrics;
  yearToDate: PeriodMetrics;
  rating: number; // 1-5 scale
  rank: number;
  totalAgents: number;
}

export interface PeriodMetrics {
  policiesSold: number;
  premiumGenerated: number;
  commissionEarned: number;
  customerRetention: number;
  averageDealSize: number;
  conversionRate: number;
  customerSatisfaction: number;
  callsPerformed: number;
  meetingsScheduled: number;
  quotesGenerated: number;
}

export interface CommissionStructure {
  baseRate: number; // percentage
  tierRates: CommissionTier[];
  bonuses: CommissionBonus[];
  totalEarned: number;
  totalPaid: number;
  pending: number;
}

export interface CommissionTier {
  threshold: number;
  rate: number;
  description: string;
}

export interface CommissionBonus {
  id: string;
  name: string;
  type: "Volume" | "Quality" | "Retention" | "Special";
  amount: number;
  criteria: string;
  achievedDate?: string;
  status: "Achieved" | "Pending" | "Not Achieved";
}

export interface AgentTargets {
  monthly: {
    policiesTarget: number;
    premiumTarget: number;
    newCustomersTarget: number;
  };
  quarterly: {
    policiesTarget: number;
    premiumTarget: number;
    retentionTarget: number;
  };
  annual: {
    policiesTarget: number;
    premiumTarget: number;
    commissionTarget: number;
  };
}

export interface TrainingRecord {
  id: string;
  agentId: string;
  trainingName: string;
  trainingType: "Online" | "Classroom" | "Workshop" | "Certification";
  startDate: string;
  completionDate?: string;
  status: "Scheduled" | "In Progress" | "Completed" | "Failed";
  score?: number;
  instructor: string;
  notes?: string;
}

export interface AgentActivity {
  id: string;
  agentId: string;
  date: string;
  type:
    | "Call"
    | "Meeting"
    | "Email"
    | "Quote"
    | "Sale"
    | "Follow-up"
    | "Training";
  description: string;
  customerId?: string;
  policyId?: string;
  outcome:
    | "Successful"
    | "Follow-up Required"
    | "No Interest"
    | "Scheduled"
    | "Completed";
  duration?: number; // in minutes
  notes?: string;
}

// Mock Agents Data
export const mockAgents: Agent[] = [
  {
    id: "AGT-001",
    employeeId: "EMP-2023-001",
    firstName: "Mike",
    lastName: "Chen",
    email: "mike.chen@insureprp.com",
    phone: "+1-555-0101",
    dateOfBirth: "1985-03-15",
    hireDate: "2023-01-15",
    status: "Active",
    position: "Senior Agent",
    department: "Sales",
    territory: {
      id: "TER-001",
      name: "Northeast Metro",
      type: "Geographic",
      boundaries: ["New York", "New Jersey", "Connecticut"],
      customerCount: 45,
      potentialRevenue: 2500000,
    },
    address: {
      street: "123 Business Ave",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    emergencyContact: {
      name: "Linda Chen",
      relationship: "Spouse",
      phone: "+1-555-0102",
      email: "linda.chen@email.com",
    },
    certifications: [
      {
        id: "CERT-001",
        name: "Licensed Insurance Producer",
        issuer: "New York Department of Financial Services",
        issueDate: "2023-02-01",
        expiryDate: "2026-02-01",
        status: "Valid",
        certificateNumber: "NY-LIP-2023-001",
      },
      {
        id: "CERT-002",
        name: "Certified Professional Insurance Agent",
        issuer: "National Association of Insurance Agents",
        issueDate: "2023-06-15",
        expiryDate: "2025-06-15",
        status: "Valid",
        certificateNumber: "CPIA-2023-456",
      },
    ],
    performance: {
      currentPeriod: {
        policiesSold: 28,
        premiumGenerated: 156000,
        commissionEarned: 7800,
        customerRetention: 92,
        averageDealSize: 5571,
        conversionRate: 35,
        customerSatisfaction: 4.8,
        callsPerformed: 145,
        meetingsScheduled: 65,
        quotesGenerated: 80,
      },
      previousPeriod: {
        policiesSold: 24,
        premiumGenerated: 132000,
        commissionEarned: 6600,
        customerRetention: 89,
        averageDealSize: 5500,
        conversionRate: 32,
        customerSatisfaction: 4.6,
        callsPerformed: 128,
        meetingsScheduled: 58,
        quotesGenerated: 75,
      },
      yearToDate: {
        policiesSold: 156,
        premiumGenerated: 850000,
        commissionEarned: 42500,
        customerRetention: 91,
        averageDealSize: 5448,
        conversionRate: 34,
        customerSatisfaction: 4.7,
        callsPerformed: 780,
        meetingsScheduled: 340,
        quotesGenerated: 420,
      },
      rating: 4.8,
      rank: 1,
      totalAgents: 25,
    },
    commissionStructure: {
      baseRate: 5.0,
      tierRates: [
        { threshold: 100000, rate: 5.0, description: "Base rate up to $100K" },
        {
          threshold: 250000,
          rate: 6.0,
          description: "Enhanced rate $100K-$250K",
        },
        {
          threshold: 500000,
          rate: 7.0,
          description: "Premium rate $250K-$500K",
        },
        {
          threshold: 1000000,
          rate: 8.0,
          description: "Elite rate above $500K",
        },
      ],
      bonuses: [
        {
          id: "BON-001",
          name: "Top Performer Q1",
          type: "Quality",
          amount: 2500,
          criteria: "Highest customer satisfaction score",
          achievedDate: "2024-03-31",
          status: "Achieved",
        },
        {
          id: "BON-002",
          name: "Volume Bonus",
          type: "Volume",
          amount: 5000,
          criteria: "Exceed 150 policies in 6 months",
          status: "Achieved",
        },
      ],
      totalEarned: 50000,
      totalPaid: 42500,
      pending: 7500,
    },
    targets: {
      monthly: {
        policiesTarget: 25,
        premiumTarget: 140000,
        newCustomersTarget: 20,
      },
      quarterly: {
        policiesTarget: 75,
        premiumTarget: 420000,
        retentionTarget: 90,
      },
      annual: {
        policiesTarget: 300,
        premiumTarget: 1680000,
        commissionTarget: 84000,
      },
    },
    qualifications: [
      "Life Insurance Specialist",
      "Auto Insurance Expert",
      "Customer Relationship Management",
      "Sales Excellence Certification",
    ],
    notes:
      "Top performing agent with excellent customer satisfaction scores. Strong in life insurance sales.",
    manager: "John Smith",
  },
  {
    id: "AGT-002",
    employeeId: "EMP-2023-002",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah.williams@insureprp.com",
    phone: "+1-555-0201",
    dateOfBirth: "1990-07-22",
    hireDate: "2023-03-01",
    status: "Active",
    position: "Agent",
    department: "Sales",
    territory: {
      id: "TER-002",
      name: "West Coast",
      type: "Geographic",
      boundaries: ["California", "Oregon", "Washington"],
      customerCount: 38,
      potentialRevenue: 2200000,
    },
    address: {
      street: "456 Market St",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      country: "USA",
    },
    emergencyContact: {
      name: "David Williams",
      relationship: "Brother",
      phone: "+1-555-0202",
    },
    certifications: [
      {
        id: "CERT-003",
        name: "Licensed Insurance Producer",
        issuer: "California Department of Insurance",
        issueDate: "2023-03-15",
        expiryDate: "2026-03-15",
        status: "Valid",
        certificateNumber: "CA-LIP-2023-002",
      },
    ],
    performance: {
      currentPeriod: {
        policiesSold: 24,
        premiumGenerated: 132000,
        commissionEarned: 6600,
        customerRetention: 88,
        averageDealSize: 5500,
        conversionRate: 30,
        customerSatisfaction: 4.6,
        callsPerformed: 120,
        meetingsScheduled: 55,
        quotesGenerated: 80,
      },
      previousPeriod: {
        policiesSold: 20,
        premiumGenerated: 110000,
        commissionEarned: 5500,
        customerRetention: 85,
        averageDealSize: 5500,
        conversionRate: 28,
        customerSatisfaction: 4.4,
        callsPerformed: 110,
        meetingsScheduled: 50,
        quotesGenerated: 71,
      },
      yearToDate: {
        policiesSold: 128,
        premiumGenerated: 704000,
        commissionEarned: 35200,
        customerRetention: 87,
        averageDealSize: 5500,
        conversionRate: 29,
        customerSatisfaction: 4.5,
        callsPerformed: 650,
        meetingsScheduled: 290,
        quotesGenerated: 442,
      },
      rating: 4.6,
      rank: 2,
      totalAgents: 25,
    },
    commissionStructure: {
      baseRate: 5.0,
      tierRates: [
        { threshold: 100000, rate: 5.0, description: "Base rate up to $100K" },
        {
          threshold: 250000,
          rate: 6.0,
          description: "Enhanced rate $100K-$250K",
        },
        {
          threshold: 500000,
          rate: 7.0,
          description: "Premium rate $250K-$500K",
        },
      ],
      bonuses: [
        {
          id: "BON-003",
          name: "New Agent Excellence",
          type: "Special",
          amount: 1000,
          criteria: "Exceed targets in first 6 months",
          achievedDate: "2023-09-01",
          status: "Achieved",
        },
      ],
      totalEarned: 36200,
      totalPaid: 35200,
      pending: 1000,
    },
    targets: {
      monthly: {
        policiesTarget: 22,
        premiumTarget: 120000,
        newCustomersTarget: 18,
      },
      quarterly: {
        policiesTarget: 66,
        premiumTarget: 360000,
        retentionTarget: 85,
      },
      annual: {
        policiesTarget: 264,
        premiumTarget: 1440000,
        commissionTarget: 72000,
      },
    },
    qualifications: [
      "Auto Insurance Specialist",
      "Digital Sales Certification",
      "Customer Service Excellence",
    ],
    notes:
      "Promising new agent with strong digital sales skills. Focusing on auto insurance market.",
    manager: "John Smith",
  },
  {
    id: "AGT-003",
    employeeId: "EMP-2022-003",
    firstName: "James",
    lastName: "Brown",
    email: "james.brown@insureprp.com",
    phone: "+1-555-0301",
    dateOfBirth: "1982-11-08",
    hireDate: "2022-06-15",
    status: "Active",
    position: "Senior Agent",
    department: "Sales",
    territory: {
      id: "TER-003",
      name: "Midwest Region",
      type: "Geographic",
      boundaries: ["Illinois", "Ohio", "Michigan", "Indiana"],
      customerCount: 42,
      potentialRevenue: 2300000,
    },
    address: {
      street: "789 Commerce Dr",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
      country: "USA",
    },
    emergencyContact: {
      name: "Maria Brown",
      relationship: "Spouse",
      phone: "+1-555-0302",
      email: "maria.brown@email.com",
    },
    certifications: [
      {
        id: "CERT-004",
        name: "Licensed Insurance Producer",
        issuer: "Illinois Department of Insurance",
        issueDate: "2022-07-01",
        expiryDate: "2025-07-01",
        status: "Valid",
        certificateNumber: "IL-LIP-2022-003",
      },
      {
        id: "CERT-005",
        name: "Health Insurance Specialist",
        issuer: "National Health Insurance Association",
        issueDate: "2023-01-15",
        expiryDate: "2026-01-15",
        status: "Valid",
        certificateNumber: "HIS-2023-789",
      },
    ],
    performance: {
      currentPeriod: {
        policiesSold: 21,
        premiumGenerated: 118000,
        commissionEarned: 5900,
        customerRetention: 94,
        averageDealSize: 5619,
        conversionRate: 28,
        customerSatisfaction: 4.7,
        callsPerformed: 105,
        meetingsScheduled: 48,
        quotesGenerated: 75,
      },
      previousPeriod: {
        policiesSold: 19,
        premiumGenerated: 104500,
        commissionEarned: 5225,
        customerRetention: 92,
        averageDealSize: 5500,
        conversionRate: 26,
        customerSatisfaction: 4.5,
        callsPerformed: 98,
        meetingsScheduled: 45,
        quotesGenerated: 73,
      },
      yearToDate: {
        policiesSold: 118,
        premiumGenerated: 649000,
        commissionEarned: 32450,
        customerRetention: 93,
        averageDealSize: 5500,
        conversionRate: 27,
        customerSatisfaction: 4.6,
        callsPerformed: 580,
        meetingsScheduled: 265,
        quotesGenerated: 437,
      },
      rating: 4.7,
      rank: 3,
      totalAgents: 25,
    },
    commissionStructure: {
      baseRate: 5.0,
      tierRates: [
        { threshold: 100000, rate: 5.0, description: "Base rate up to $100K" },
        {
          threshold: 250000,
          rate: 6.0,
          description: "Enhanced rate $100K-$250K",
        },
        {
          threshold: 500000,
          rate: 7.0,
          description: "Premium rate $250K-$500K",
        },
      ],
      bonuses: [
        {
          id: "BON-004",
          name: "Retention Champion",
          type: "Retention",
          amount: 1500,
          criteria: "Achieve 95%+ customer retention",
          status: "Pending",
        },
      ],
      totalEarned: 32450,
      totalPaid: 30950,
      pending: 1500,
    },
    targets: {
      monthly: {
        policiesTarget: 20,
        premiumTarget: 110000,
        newCustomersTarget: 15,
      },
      quarterly: {
        policiesTarget: 60,
        premiumTarget: 330000,
        retentionTarget: 92,
      },
      annual: {
        policiesTarget: 240,
        premiumTarget: 1320000,
        commissionTarget: 66000,
      },
    },
    qualifications: [
      "Health Insurance Expert",
      "Customer Retention Specialist",
      "Team Leadership",
      "Regulatory Compliance",
    ],
    notes:
      "Experienced agent with excellent retention rates. Specializes in health insurance and complex cases.",
    manager: "John Smith",
  },
  {
    id: "AGT-004",
    employeeId: "EMP-2023-004",
    firstName: "Lisa",
    lastName: "Anderson",
    email: "lisa.anderson@insureprp.com",
    phone: "+1-555-0401",
    dateOfBirth: "1988-05-30",
    hireDate: "2023-08-01",
    status: "Training",
    position: "Agent",
    department: "Sales",
    territory: {
      id: "TER-004",
      name: "Southeast Region",
      type: "Geographic",
      boundaries: ["Florida", "Georgia", "South Carolina", "North Carolina"],
      customerCount: 25,
      potentialRevenue: 1800000,
    },
    address: {
      street: "321 Palm Beach Blvd",
      city: "Miami",
      state: "FL",
      zipCode: "33101",
      country: "USA",
    },
    emergencyContact: {
      name: "Robert Anderson",
      relationship: "Father",
      phone: "+1-555-0402",
    },
    certifications: [
      {
        id: "CERT-006",
        name: "Licensed Insurance Producer",
        issuer: "Florida Department of Financial Services",
        issueDate: "2023-08-15",
        expiryDate: "2026-08-15",
        status: "Valid",
        certificateNumber: "FL-LIP-2023-004",
      },
    ],
    performance: {
      currentPeriod: {
        policiesSold: 12,
        premiumGenerated: 65000,
        commissionEarned: 3250,
        customerRetention: 85,
        averageDealSize: 5417,
        conversionRate: 20,
        customerSatisfaction: 4.3,
        callsPerformed: 85,
        meetingsScheduled: 35,
        quotesGenerated: 60,
      },
      previousPeriod: {
        policiesSold: 8,
        premiumGenerated: 44000,
        commissionEarned: 2200,
        customerRetention: 80,
        averageDealSize: 5500,
        conversionRate: 18,
        customerSatisfaction: 4.1,
        callsPerformed: 75,
        meetingsScheduled: 30,
        quotesGenerated: 44,
      },
      yearToDate: {
        policiesSold: 20,
        premiumGenerated: 109000,
        commissionEarned: 5450,
        customerRetention: 83,
        averageDealSize: 5450,
        conversionRate: 19,
        customerSatisfaction: 4.2,
        callsPerformed: 160,
        meetingsScheduled: 65,
        quotesGenerated: 104,
      },
      rating: 4.0,
      rank: 4,
      totalAgents: 25,
    },
    commissionStructure: {
      baseRate: 5.0,
      tierRates: [
        { threshold: 100000, rate: 5.0, description: "Base rate up to $100K" },
        {
          threshold: 250000,
          rate: 6.0,
          description: "Enhanced rate $100K-$250K",
        },
      ],
      bonuses: [],
      totalEarned: 5450,
      totalPaid: 5450,
      pending: 0,
    },
    targets: {
      monthly: {
        policiesTarget: 15,
        premiumTarget: 80000,
        newCustomersTarget: 12,
      },
      quarterly: {
        policiesTarget: 45,
        premiumTarget: 240000,
        retentionTarget: 80,
      },
      annual: {
        policiesTarget: 180,
        premiumTarget: 960000,
        commissionTarget: 48000,
      },
    },
    qualifications: [
      "New Agent Training Program",
      "Property Insurance Basics",
      "Sales Fundamentals",
    ],
    notes:
      "New agent in training program. Showing good progress and potential. Requires mentoring support.",
    manager: "John Smith",
  },
  {
    id: "AGT-005",
    employeeId: "EMP-2022-005",
    firstName: "Robert",
    lastName: "Johnson",
    email: "robert.johnson@insureprp.com",
    phone: "+1-555-0501",
    dateOfBirth: "1975-09-14",
    hireDate: "2022-01-10",
    status: "Active",
    position: "Team Lead",
    department: "Sales",
    territory: {
      id: "TER-005",
      name: "Southwest Region",
      type: "Geographic",
      boundaries: ["Texas", "Arizona", "New Mexico", "Nevada"],
      customerCount: 55,
      potentialRevenue: 3200000,
    },
    address: {
      street: "654 Ranch Road",
      city: "Austin",
      state: "TX",
      zipCode: "73301",
      country: "USA",
    },
    emergencyContact: {
      name: "Jennifer Johnson",
      relationship: "Spouse",
      phone: "+1-555-0502",
      email: "jennifer.johnson@email.com",
    },
    certifications: [
      {
        id: "CERT-007",
        name: "Licensed Insurance Producer",
        issuer: "Texas Department of Insurance",
        issueDate: "2022-02-01",
        expiryDate: "2025-02-01",
        status: "Valid",
        certificateNumber: "TX-LIP-2022-005",
      },
      {
        id: "CERT-008",
        name: "Commercial Insurance Specialist",
        issuer: "Commercial Insurance Institute",
        issueDate: "2022-10-15",
        expiryDate: "2025-10-15",
        status: "Valid",
        certificateNumber: "CIS-2022-123",
      },
    ],
    performance: {
      currentPeriod: {
        policiesSold: 32,
        premiumGenerated: 185000,
        commissionEarned: 9250,
        customerRetention: 90,
        averageDealSize: 5781,
        conversionRate: 38,
        customerSatisfaction: 4.9,
        callsPerformed: 160,
        meetingsScheduled: 75,
        quotesGenerated: 84,
      },
      previousPeriod: {
        policiesSold: 28,
        premiumGenerated: 165000,
        commissionEarned: 8250,
        customerRetention: 88,
        averageDealSize: 5893,
        conversionRate: 35,
        customerSatisfaction: 4.7,
        callsPerformed: 145,
        meetingsScheduled: 68,
        quotesGenerated: 80,
      },
      yearToDate: {
        policiesSold: 178,
        premiumGenerated: 1025000,
        commissionEarned: 51250,
        customerRetention: 89,
        averageDealSize: 5758,
        conversionRate: 36,
        customerSatisfaction: 4.8,
        callsPerformed: 890,
        meetingsScheduled: 405,
        quotesGenerated: 495,
      },
      rating: 4.9,
      rank: 1,
      totalAgents: 25,
    },
    commissionStructure: {
      baseRate: 5.0,
      tierRates: [
        { threshold: 100000, rate: 5.0, description: "Base rate up to $100K" },
        {
          threshold: 250000,
          rate: 6.0,
          description: "Enhanced rate $100K-$250K",
        },
        {
          threshold: 500000,
          rate: 7.0,
          description: "Premium rate $250K-$500K",
        },
        {
          threshold: 1000000,
          rate: 8.0,
          description: "Elite rate above $500K",
        },
      ],
      bonuses: [
        {
          id: "BON-005",
          name: "Team Leadership Excellence",
          type: "Special",
          amount: 5000,
          criteria: "Lead team to exceed quarterly targets",
          achievedDate: "2024-03-31",
          status: "Achieved",
        },
        {
          id: "BON-006",
          name: "Commercial Sales Expert",
          type: "Volume",
          amount: 3000,
          criteria: "Exceed commercial insurance targets",
          achievedDate: "2024-06-30",
          status: "Achieved",
        },
      ],
      totalEarned: 59250,
      totalPaid: 51250,
      pending: 8000,
    },
    targets: {
      monthly: {
        policiesTarget: 30,
        premiumTarget: 175000,
        newCustomersTarget: 25,
      },
      quarterly: {
        policiesTarget: 90,
        premiumTarget: 525000,
        retentionTarget: 88,
      },
      annual: {
        policiesTarget: 360,
        premiumTarget: 2100000,
        commissionTarget: 105000,
      },
    },
    qualifications: [
      "Commercial Insurance Expert",
      "Team Leadership Certification",
      "Advanced Sales Management",
      "Business Development",
      "Mentor Certification",
    ],
    notes:
      "Exceptional team leader and top performer. Specializes in commercial insurance and mentors junior agents.",
    teamMembers: ["AGT-001", "AGT-002", "AGT-003", "AGT-004"],
  },
];

// Mock Training Records
export const mockTrainingRecords: TrainingRecord[] = [
  {
    id: "TRN-001",
    agentId: "AGT-004",
    trainingName: "New Agent Orientation",
    trainingType: "Classroom",
    startDate: "2023-08-01",
    completionDate: "2023-08-15",
    status: "Completed",
    score: 92,
    instructor: "John Smith",
    notes: "Excellent participation and understanding of basic concepts",
  },
  {
    id: "TRN-002",
    agentId: "AGT-004",
    trainingName: "Property Insurance Fundamentals",
    trainingType: "Online",
    startDate: "2023-09-01",
    completionDate: "2023-09-30",
    status: "Completed",
    score: 88,
    instructor: "Sarah Martinez",
  },
  {
    id: "TRN-003",
    agentId: "AGT-002",
    trainingName: "Advanced Sales Techniques",
    trainingType: "Workshop",
    startDate: "2024-01-15",
    completionDate: "2024-01-16",
    status: "Completed",
    score: 95,
    instructor: "Robert Johnson",
  },
];

// Mock Agent Activities
export const mockAgentActivities: AgentActivity[] = [
  {
    id: "ACT-001",
    agentId: "AGT-001",
    date: "2024-02-20",
    type: "Call",
    description:
      "Follow-up call with Alice Johnson regarding life insurance renewal",
    customerId: "CUST-001",
    policyId: "POL-001",
    outcome: "Successful",
    duration: 25,
    notes: "Customer agreed to premium increase for enhanced coverage",
  },
  {
    id: "ACT-002",
    agentId: "AGT-002",
    date: "2024-02-19",
    type: "Meeting",
    description:
      "Initial consultation with potential customer for auto insurance",
    outcome: "Follow-up Required",
    duration: 45,
    notes: "Customer requested time to compare quotes",
  },
  {
    id: "ACT-003",
    agentId: "AGT-003",
    date: "2024-02-18",
    type: "Sale",
    description: "Closed health insurance policy for family of four",
    customerId: "CUST-003",
    policyId: "POL-003",
    outcome: "Successful",
    notes: "Customer very satisfied with coverage options",
  },
];

// Utility functions
export const getAgentById = (id: string): Agent | undefined => {
  return mockAgents.find((agent) => agent.id === id);
};

export const getAgentsByStatus = (status: string): Agent[] => {
  return mockAgents.filter((agent) => agent.status === status);
};

export const getAgentsByDepartment = (department: string): Agent[] => {
  return mockAgents.filter((agent) => agent.department === department);
};

export const getAgentsByTeamLead = (teamLeadId: string): Agent[] => {
  const teamLead = mockAgents.find((agent) => agent.id === teamLeadId);
  if (!teamLead?.teamMembers) return [];
  return mockAgents.filter((agent) => teamLead.teamMembers?.includes(agent.id));
};

export const getTopPerformers = (limit: number = 5): Agent[] => {
  return mockAgents
    .sort((a, b) => b.performance.rating - a.performance.rating)
    .slice(0, limit);
};

export const calculateTeamMetrics = (teamLeadId: string) => {
  const teamMembers = getAgentsByTeamLead(teamLeadId);
  const teamLead = getAgentById(teamLeadId);
  const allTeamMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;

  return {
    totalPolicies: allTeamMembers.reduce(
      (sum, agent) => sum + agent.performance.yearToDate.policiesSold,
      0,
    ),
    totalPremium: allTeamMembers.reduce(
      (sum, agent) => sum + agent.performance.yearToDate.premiumGenerated,
      0,
    ),
    totalCommission: allTeamMembers.reduce(
      (sum, agent) => sum + agent.performance.yearToDate.commissionEarned,
      0,
    ),
    averageRating:
      allTeamMembers.reduce((sum, agent) => sum + agent.performance.rating, 0) /
      allTeamMembers.length,
    averageRetention:
      allTeamMembers.reduce(
        (sum, agent) => sum + agent.performance.yearToDate.customerRetention,
        0,
      ) / allTeamMembers.length,
    teamSize: allTeamMembers.length,
  };
};

export const getAgentTrainingRecords = (agentId: string): TrainingRecord[] => {
  return mockTrainingRecords.filter((record) => record.agentId === agentId);
};

export const getAgentActivities = (agentId: string): AgentActivity[] => {
  return mockAgentActivities.filter((activity) => activity.agentId === agentId);
};

export const calculateCommissionEarned = (agent: Agent): number => {
  const premium = agent.performance.yearToDate.premiumGenerated;
  let commission = 0;
  let remainingPremium = premium;

  for (const tier of agent.commissionStructure.tierRates) {
    if (remainingPremium <= 0) break;

    const tierAmount = Math.min(remainingPremium, tier.threshold);
    commission += tierAmount * (tier.rate / 100);
    remainingPremium -= tierAmount;
  }

  // Add bonuses
  const bonuses = agent.commissionStructure.bonuses
    .filter((bonus) => bonus.status === "Achieved")
    .reduce((sum, bonus) => sum + bonus.amount, 0);

  return commission + bonuses;
};

export const getExpiringCertifications = (
  daysFromNow: number = 30,
): { agent: Agent; certification: Certification }[] => {
  const today = new Date();
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysFromNow);

  const expiring: { agent: Agent; certification: Certification }[] = [];

  mockAgents.forEach((agent) => {
    agent.certifications.forEach((cert) => {
      if (cert.status === "Valid") {
        const expiryDate = new Date(cert.expiryDate);
        if (expiryDate <= targetDate && expiryDate >= today) {
          expiring.push({ agent, certification: cert });
        }
      }
    });
  });

  return expiring;
};

export const calculateTeamTargetProgress = (teamLeadId: string) => {
  const teamMembers = getAgentsByTeamLead(teamLeadId);
  const teamLead = getAgentById(teamLeadId);
  const allTeamMembers = teamLead ? [teamLead, ...teamMembers] : teamMembers;

  const totalTargets = allTeamMembers.reduce(
    (acc, agent) => {
      acc.policies += agent.targets.annual.policiesTarget;
      acc.premium += agent.targets.annual.premiumTarget;
      acc.commission += agent.targets.annual.commissionTarget;
      return acc;
    },
    { policies: 0, premium: 0, commission: 0 },
  );

  const totalActual = allTeamMembers.reduce(
    (acc, agent) => {
      acc.policies += agent.performance.yearToDate.policiesSold;
      acc.premium += agent.performance.yearToDate.premiumGenerated;
      acc.commission += agent.performance.yearToDate.commissionEarned;
      return acc;
    },
    { policies: 0, premium: 0, commission: 0 },
  );

  return {
    policies: {
      target: totalTargets.policies,
      actual: totalActual.policies,
      percentage: (totalActual.policies / totalTargets.policies) * 100,
    },
    premium: {
      target: totalTargets.premium,
      actual: totalActual.premium,
      percentage: (totalActual.premium / totalTargets.premium) * 100,
    },
    commission: {
      target: totalTargets.commission,
      actual: totalActual.commission,
      percentage: (totalActual.commission / totalTargets.commission) * 100,
    },
  };
};
