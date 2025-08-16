// Document types
export interface Document {
  id: string;
  name: string;
  originalName: string;
  type: DocumentType;
  category: DocumentCategory;
  tags: string[];
  description: string;
  fileSize: number;
  mimeType: string;
  url: string;
  thumbnailUrl?: string;
  uploadDate: string;
  lastModified: string;
  uploadedBy: string;
  status: 'Active' | 'Archived' | 'Deleted' | 'Under Review';
  accessLevel: 'Public' | 'Internal' | 'Confidential' | 'Restricted';
  relatedEntities: RelatedEntity[];
  versions: DocumentVersion[];
  metadata: DocumentMetadata;
  permissions: DocumentPermission[];
  comments: DocumentComment[];
  downloadCount: number;
  lastAccessed?: string;
  expiryDate?: string;
  isEncrypted: boolean;
  checksum: string;
}

export type DocumentType = 
  | 'Policy Document'
  | 'Claim Document'
  | 'Customer Document'
  | 'Agent Document'
  | 'Legal Document'
  | 'Financial Document'
  | 'Form'
  | 'Certificate'
  | 'Report'
  | 'Image'
  | 'Other';

export type DocumentCategory = 
  | 'KYC Documents'
  | 'Policy Papers'
  | 'Claims Evidence'
  | 'Financial Records'
  | 'Legal Agreements'
  | 'Certificates'
  | 'Forms & Applications'
  | 'Reports & Analytics'
  | 'Communication'
  | 'Training Materials'
  | 'Compliance'
  | 'Marketing Materials';

export interface RelatedEntity {
  type: 'Customer' | 'Policy' | 'Claim' | 'Agent' | 'Payment' | 'Invoice';
  id: string;
  name: string;
}

export interface DocumentVersion {
  id: string;
  version: string;
  uploadDate: string;
  uploadedBy: string;
  fileSize: number;
  url: string;
  changeNotes: string;
  isActive: boolean;
}

export interface DocumentMetadata {
  author?: string;
  createdDate?: string;
  subject?: string;
  keywords?: string[];
  pageCount?: number;
  language?: string;
  security?: string;
  customFields?: Record<string, any>;
}

export interface DocumentPermission {
  userId: string;
  userName: string;
  permission: 'View' | 'Download' | 'Edit' | 'Delete' | 'Share';
  grantedBy: string;
  grantedDate: string;
  expiryDate?: string;
}

export interface DocumentComment {
  id: string;
  userId: string;
  userName: string;
  comment: string;
  timestamp: string;
  isInternal: boolean;
}

export interface DocumentFolder {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  path: string;
  createdBy: string;
  createdDate: string;
  permissions: FolderPermission[];
  documentCount: number;
  subfolderCount: number;
}

export interface FolderPermission {
  userId: string;
  userName: string;
  permission: 'View' | 'Upload' | 'Manage';
  grantedBy: string;
  grantedDate: string;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: DocumentCategory;
  templateUrl: string;
  fields: TemplateField[];
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  usageCount: number;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox' | 'signature';
  required: boolean;
  defaultValue?: string;
  options?: string[];
  validation?: string;
}

// Mock Documents Data
export const mockDocuments: Document[] = [
  {
    id: "DOC-001",
    name: "Life Insurance Policy - Alice Johnson",
    originalName: "LIF-2024-001-AL_Policy.pdf",
    type: "Policy Document",
    category: "Policy Papers",
    tags: ["Life Insurance", "Active Policy", "Term Life"],
    description: "Complete life insurance policy document for Alice Johnson including terms, conditions, and coverage details.",
    fileSize: 2621440, // 2.5 MB
    mimeType: "application/pdf",
    url: "/documents/policy/LIF-2024-001-AL_Policy.pdf",
    thumbnailUrl: "/thumbnails/DOC-001.jpg",
    uploadDate: "2024-01-15T10:30:00Z",
    lastModified: "2024-01-15T10:30:00Z",
    uploadedBy: "Mike Chen",
    status: "Active",
    accessLevel: "Confidential",
    relatedEntities: [
      { type: "Customer", id: "CUST-001", name: "Alice Johnson" },
      { type: "Policy", id: "POL-001", name: "LIF-2024-001-AL" },
      { type: "Agent", id: "AGT-001", name: "Mike Chen" }
    ],
    versions: [
      {
        id: "VER-001",
        version: "1.0",
        uploadDate: "2024-01-15T10:30:00Z",
        uploadedBy: "Mike Chen",
        fileSize: 2621440,
        url: "/documents/policy/LIF-2024-001-AL_Policy_v1.pdf",
        changeNotes: "Initial policy document",
        isActive: true
      }
    ],
    metadata: {
      author: "InsurePro System",
      createdDate: "2024-01-15",
      subject: "Life Insurance Policy",
      keywords: ["life insurance", "term life", "policy"],
      pageCount: 12,
      language: "English",
      security: "Password Protected"
    },
    permissions: [
      {
        userId: "USR-001",
        userName: "Alice Johnson",
        permission: "View",
        grantedBy: "Mike Chen",
        grantedDate: "2024-01-15T10:30:00Z"
      },
      {
        userId: "AGT-001",
        userName: "Mike Chen",
        permission: "Edit",
        grantedBy: "System",
        grantedDate: "2024-01-15T10:30:00Z"
      }
    ],
    comments: [
      {
        id: "CMT-001",
        userId: "AGT-001",
        userName: "Mike Chen",
        comment: "Policy approved and sent to customer for review.",
        timestamp: "2024-01-15T11:00:00Z",
        isInternal: true
      }
    ],
    downloadCount: 3,
    lastAccessed: "2024-02-20T14:30:00Z",
    isEncrypted: true,
    checksum: "sha256:a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
  },
  {
    id: "DOC-002",
    name: "Drivers License - Alice Johnson",
    originalName: "alice_johnson_drivers_license.jpg",
    type: "Customer Document",
    category: "KYC Documents",
    tags: ["KYC", "ID Verification", "Drivers License"],
    description: "Copy of driver's license for KYC verification purposes.",
    fileSize: 1048576, // 1 MB
    mimeType: "image/jpeg",
    url: "/documents/kyc/alice_johnson_drivers_license.jpg",
    thumbnailUrl: "/thumbnails/DOC-002.jpg",
    uploadDate: "2024-01-15T09:15:00Z",
    lastModified: "2024-01-15T09:15:00Z",
    uploadedBy: "Alice Johnson",
    status: "Active",
    accessLevel: "Confidential",
    relatedEntities: [
      { type: "Customer", id: "CUST-001", name: "Alice Johnson" }
    ],
    versions: [
      {
        id: "VER-002",
        version: "1.0",
        uploadDate: "2024-01-15T09:15:00Z",
        uploadedBy: "Alice Johnson",
        fileSize: 1048576,
        url: "/documents/kyc/alice_johnson_drivers_license.jpg",
        changeNotes: "Initial KYC document upload",
        isActive: true
      }
    ],
    metadata: {
      author: "Alice Johnson",
      createdDate: "2024-01-15",
      subject: "Driver's License",
      keywords: ["kyc", "identification", "license"],
      language: "English"
    },
    permissions: [
      {
        userId: "USR-001",
        userName: "Alice Johnson",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-01-15T09:15:00Z"
      },
      {
        userId: "AGT-001",
        userName: "Mike Chen",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-01-15T09:15:00Z"
      }
    ],
    comments: [
      {
        id: "CMT-002",
        userId: "AGT-001",
        userName: "Mike Chen",
        comment: "Document verified and approved for KYC.",
        timestamp: "2024-01-15T10:00:00Z",
        isInternal: true
      }
    ],
    downloadCount: 1,
    lastAccessed: "2024-01-15T10:00:00Z",
    isEncrypted: true,
    checksum: "sha256:b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7"
  },
  {
    id: "DOC-003",
    name: "Claim Evidence - Fire Damage Photos",
    originalName: "kitchen_fire_damage_photos.zip",
    type: "Claim Document",
    category: "Claims Evidence",
    tags: ["Claims", "Fire Damage", "Evidence", "Photos"],
    description: "Photographic evidence of kitchen fire damage for home insurance claim CLM-003.",
    fileSize: 15728640, // 15 MB
    mimeType: "application/zip",
    url: "/documents/claims/kitchen_fire_damage_photos.zip",
    thumbnailUrl: "/thumbnails/DOC-003.jpg",
    uploadDate: "2024-02-22T16:45:00Z",
    lastModified: "2024-02-22T16:45:00Z",
    uploadedBy: "David Wilson",
    status: "Under Review",
    accessLevel: "Internal",
    relatedEntities: [
      { type: "Customer", id: "CUST-004", name: "David Wilson" },
      { type: "Claim", id: "CLM-003", name: "CLM-003 - Kitchen Fire" },
      { type: "Policy", id: "POL-004", name: "HOM-2024-004-DW" }
    ],
    versions: [
      {
        id: "VER-003",
        version: "1.0",
        uploadDate: "2024-02-22T16:45:00Z",
        uploadedBy: "David Wilson",
        fileSize: 15728640,
        url: "/documents/claims/kitchen_fire_damage_photos.zip",
        changeNotes: "Initial evidence submission",
        isActive: true
      }
    ],
    metadata: {
      author: "David Wilson",
      createdDate: "2024-02-22",
      subject: "Fire Damage Evidence",
      keywords: ["fire", "damage", "claim", "evidence"],
      language: "English"
    },
    permissions: [
      {
        userId: "USR-004",
        userName: "David Wilson",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-02-22T16:45:00Z"
      },
      {
        userId: "ADJ-001",
        userName: "Robert Lee",
        permission: "Edit",
        grantedBy: "System",
        grantedDate: "2024-02-22T16:45:00Z"
      }
    ],
    comments: [
      {
        id: "CMT-003",
        userId: "ADJ-001",
        userName: "Robert Lee",
        comment: "Photos received. Scheduling site inspection for detailed assessment.",
        timestamp: "2024-02-22T17:00:00Z",
        isInternal: true
      }
    ],
    downloadCount: 2,
    lastAccessed: "2024-02-22T17:00:00Z",
    isEncrypted: false,
    checksum: "sha256:c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8"
  },
  {
    id: "DOC-004",
    name: "Medical Report - Carol Davis",
    originalName: "carol_davis_medical_report_2024.pdf",
    type: "Claim Document",
    category: "Claims Evidence",
    tags: ["Medical", "Health Insurance", "Report"],
    description: "Medical report and diagnosis for health insurance claim submission.",
    fileSize: 3145728, // 3 MB
    mimeType: "application/pdf",
    url: "/documents/claims/carol_davis_medical_report_2024.pdf",
    thumbnailUrl: "/thumbnails/DOC-004.jpg",
    uploadDate: "2024-02-20T11:20:00Z",
    lastModified: "2024-02-20T11:20:00Z",
    uploadedBy: "Carol Davis",
    status: "Active",
    accessLevel: "Confidential",
    relatedEntities: [
      { type: "Customer", id: "CUST-003", name: "Carol Davis" },
      { type: "Claim", id: "CLM-002", name: "CLM-002 - Medical Checkup" },
      { type: "Policy", id: "POL-003", name: "HLT-2024-003-CD" }
    ],
    versions: [
      {
        id: "VER-004",
        version: "1.0",
        uploadDate: "2024-02-20T11:20:00Z",
        uploadedBy: "Carol Davis",
        fileSize: 3145728,
        url: "/documents/claims/carol_davis_medical_report_2024.pdf",
        changeNotes: "Initial medical report submission",
        isActive: true
      }
    ],
    metadata: {
      author: "Dr. Smith Medical Center",
      createdDate: "2024-02-18",
      subject: "Medical Examination Report",
      keywords: ["medical", "health", "examination"],
      pageCount: 8,
      language: "English"
    },
    permissions: [
      {
        userId: "USR-003",
        userName: "Carol Davis",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-02-20T11:20:00Z"
      },
      {
        userId: "ADJ-002",
        userName: "Maria Rodriguez",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-02-20T11:20:00Z"
      }
    ],
    comments: [],
    downloadCount: 1,
    lastAccessed: "2024-02-21T09:30:00Z",
    isEncrypted: true,
    checksum: "sha256:d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9"
  },
  {
    id: "DOC-005",
    name: "Agent Certification - Mike Chen",
    originalName: "mike_chen_insurance_license.pdf",
    type: "Agent Document",
    category: "Certificates",
    tags: ["Certification", "Agent License", "Professional"],
    description: "Licensed Insurance Producer certification for Mike Chen.",
    fileSize: 524288, // 512 KB
    mimeType: "application/pdf",
    url: "/documents/agents/mike_chen_insurance_license.pdf",
    thumbnailUrl: "/thumbnails/DOC-005.jpg",
    uploadDate: "2023-02-01T14:00:00Z",
    lastModified: "2023-02-01T14:00:00Z",
    uploadedBy: "Mike Chen",
    status: "Active",
    accessLevel: "Internal",
    relatedEntities: [
      { type: "Agent", id: "AGT-001", name: "Mike Chen" }
    ],
    versions: [
      {
        id: "VER-005",
        version: "1.0",
        uploadDate: "2023-02-01T14:00:00Z",
        uploadedBy: "Mike Chen",
        fileSize: 524288,
        url: "/documents/agents/mike_chen_insurance_license.pdf",
        changeNotes: "Initial certification upload",
        isActive: true
      }
    ],
    metadata: {
      author: "New York Department of Financial Services",
      createdDate: "2023-02-01",
      subject: "Insurance Producer License",
      keywords: ["license", "certification", "insurance"],
      pageCount: 2,
      language: "English"
    },
    permissions: [
      {
        userId: "AGT-001",
        userName: "Mike Chen",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2023-02-01T14:00:00Z"
      },
      {
        userId: "MGR-001",
        userName: "John Smith",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2023-02-01T14:00:00Z"
      }
    ],
    comments: [],
    downloadCount: 5,
    lastAccessed: "2024-01-15T10:00:00Z",
    expiryDate: "2026-02-01",
    isEncrypted: false,
    checksum: "sha256:e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  },
  {
    id: "DOC-006",
    name: "Policy Application Form - Bob Smith",
    originalName: "auto_insurance_application_bob_smith.pdf",
    type: "Form",
    category: "Forms & Applications",
    tags: ["Application", "Auto Insurance", "Form"],
    description: "Completed auto insurance application form for Bob Smith.",
    fileSize: 1572864, // 1.5 MB
    mimeType: "application/pdf",
    url: "/documents/forms/auto_insurance_application_bob_smith.pdf",
    thumbnailUrl: "/thumbnails/DOC-006.jpg",
    uploadDate: "2024-02-01T13:45:00Z",
    lastModified: "2024-02-01T13:45:00Z",
    uploadedBy: "Bob Smith",
    status: "Active",
    accessLevel: "Internal",
    relatedEntities: [
      { type: "Customer", id: "CUST-002", name: "Bob Smith" },
      { type: "Policy", id: "POL-002", name: "AUT-2024-002-BS" },
      { type: "Agent", id: "AGT-002", name: "Sarah Williams" }
    ],
    versions: [
      {
        id: "VER-006",
        version: "1.0",
        uploadDate: "2024-02-01T13:45:00Z",
        uploadedBy: "Bob Smith",
        fileSize: 1572864,
        url: "/documents/forms/auto_insurance_application_bob_smith.pdf",
        changeNotes: "Initial application submission",
        isActive: true
      }
    ],
    metadata: {
      author: "Bob Smith",
      createdDate: "2024-02-01",
      subject: "Auto Insurance Application",
      keywords: ["application", "auto", "insurance"],
      pageCount: 6,
      language: "English"
    },
    permissions: [
      {
        userId: "USR-002",
        userName: "Bob Smith",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-02-01T13:45:00Z"
      },
      {
        userId: "AGT-002",
        userName: "Sarah Williams",
        permission: "Edit",
        grantedBy: "System",
        grantedDate: "2024-02-01T13:45:00Z"
      }
    ],
    comments: [
      {
        id: "CMT-004",
        userId: "AGT-002",
        userName: "Sarah Williams",
        comment: "Application reviewed and approved. Policy issued.",
        timestamp: "2024-02-01T15:00:00Z",
        isInternal: true
      }
    ],
    downloadCount: 2,
    lastAccessed: "2024-02-01T15:00:00Z",
    isEncrypted: false,
    checksum: "sha256:f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1"
  },
  {
    id: "DOC-007",
    name: "Monthly Sales Report - January 2024",
    originalName: "sales_report_january_2024.xlsx",
    type: "Report",
    category: "Reports & Analytics",
    tags: ["Sales Report", "Monthly", "Analytics"],
    description: "Comprehensive sales performance report for January 2024.",
    fileSize: 2097152, // 2 MB
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    url: "/documents/reports/sales_report_january_2024.xlsx",
    thumbnailUrl: "/thumbnails/DOC-007.jpg",
    uploadDate: "2024-02-01T09:00:00Z",
    lastModified: "2024-02-01T09:00:00Z",
    uploadedBy: "John Smith",
    status: "Active",
    accessLevel: "Internal",
    relatedEntities: [],
    versions: [
      {
        id: "VER-007",
        version: "1.0",
        uploadDate: "2024-02-01T09:00:00Z",
        uploadedBy: "John Smith",
        fileSize: 2097152,
        url: "/documents/reports/sales_report_january_2024.xlsx",
        changeNotes: "Monthly report generation",
        isActive: true
      }
    ],
    metadata: {
      author: "InsurePro Analytics",
      createdDate: "2024-02-01",
      subject: "Sales Performance Report",
      keywords: ["sales", "report", "analytics", "performance"],
      language: "English"
    },
    permissions: [
      {
        userId: "MGR-001",
        userName: "John Smith",
        permission: "Edit",
        grantedBy: "System",
        grantedDate: "2024-02-01T09:00:00Z"
      },
      {
        userId: "AGT-001",
        userName: "Mike Chen",
        permission: "View",
        grantedBy: "John Smith",
        grantedDate: "2024-02-01T09:00:00Z"
      }
    ],
    comments: [],
    downloadCount: 8,
    lastAccessed: "2024-02-15T11:30:00Z",
    isEncrypted: false,
    checksum: "sha256:g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2"
  },
  {
    id: "DOC-008",
    name: "Company Privacy Policy",
    originalName: "insure_pro_privacy_policy_2024.pdf",
    type: "Legal Document",
    category: "Legal Agreements",
    tags: ["Privacy Policy", "Legal", "Compliance"],
    description: "Updated company privacy policy and data protection guidelines.",
    fileSize: 1048576, // 1 MB
    mimeType: "application/pdf",
    url: "/documents/legal/insure_pro_privacy_policy_2024.pdf",
    thumbnailUrl: "/thumbnails/DOC-008.jpg",
    uploadDate: "2024-01-01T12:00:00Z",
    lastModified: "2024-01-01T12:00:00Z",
    uploadedBy: "Legal Department",
    status: "Active",
    accessLevel: "Public",
    relatedEntities: [],
    versions: [
      {
        id: "VER-008",
        version: "2.0",
        uploadDate: "2024-01-01T12:00:00Z",
        uploadedBy: "Legal Department",
        fileSize: 1048576,
        url: "/documents/legal/insure_pro_privacy_policy_2024.pdf",
        changeNotes: "Updated for 2024 compliance requirements",
        isActive: true
      },
      {
        id: "VER-008-OLD",
        version: "1.0",
        uploadDate: "2023-01-01T12:00:00Z",
        uploadedBy: "Legal Department",
        fileSize: 950000,
        url: "/documents/legal/insure_pro_privacy_policy_2023.pdf",
        changeNotes: "Initial version",
        isActive: false
      }
    ],
    metadata: {
      author: "InsurePro Legal Department",
      createdDate: "2024-01-01",
      subject: "Privacy Policy",
      keywords: ["privacy", "policy", "legal", "compliance"],
      pageCount: 15,
      language: "English"
    },
    permissions: [
      {
        userId: "ALL",
        userName: "All Users",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-01-01T12:00:00Z"
      }
    ],
    comments: [],
    downloadCount: 45,
    lastAccessed: "2024-02-20T16:00:00Z",
    isEncrypted: false,
    checksum: "sha256:h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3"
  }
];

// Mock Document Folders
export const mockFolders: DocumentFolder[] = [
  {
    id: "FOLD-001",
    name: "Customer Documents",
    description: "All customer-related documents including KYC and personal documents",
    path: "/Customer Documents",
    createdBy: "System",
    createdDate: "2024-01-01T00:00:00Z",
    permissions: [
      {
        userId: "ALL-AGENTS",
        userName: "All Agents",
        permission: "View",
        grantedBy: "System",
        grantedDate: "2024-01-01T00:00:00Z"
      }
    ],
    documentCount: 15,
    subfolderCount: 3
  },
  {
    id: "FOLD-002",
    name: "Policy Documents",
    description: "Insurance policy documents and related paperwork",
    path: "/Policy Documents",
    createdBy: "System",
    createdDate: "2024-01-01T00:00:00Z",
    permissions: [
      {
        userId: "ALL-AGENTS",
        userName: "All Agents",
        permission: "Upload",
        grantedBy: "System",
        grantedDate: "2024-01-01T00:00:00Z"
      }
    ],
    documentCount: 22,
    subfolderCount: 5
  },
  {
    id: "FOLD-003",
    name: "Claims Documentation",
    description: "Claim-related documents, evidence, and processing files",
    path: "/Claims Documentation",
    createdBy: "System",
    createdDate: "2024-01-01T00:00:00Z",
    permissions: [
      {
        userId: "CLAIMS-TEAM",
        userName: "Claims Team",
        permission: "Manage",
        grantedBy: "System",
        grantedDate: "2024-01-01T00:00:00Z"
      }
    ],
    documentCount: 8,
    subfolderCount: 2
  }
];

// Mock Document Templates
export const mockTemplates: DocumentTemplate[] = [
  {
    id: "TMPL-001",
    name: "Auto Insurance Application",
    description: "Standard application form for auto insurance policies",
    category: "Forms & Applications",
    templateUrl: "/templates/auto_insurance_application.pdf",
    fields: [
      {
        id: "field-001",
        name: "applicant_name",
        label: "Applicant Name",
        type: "text",
        required: true
      },
      {
        id: "field-002",
        name: "vehicle_year",
        label: "Vehicle Year",
        type: "number",
        required: true
      },
      {
        id: "field-003",
        name: "coverage_type",
        label: "Coverage Type",
        type: "dropdown",
        required: true,
        options: ["Liability", "Collision", "Comprehensive", "Full Coverage"]
      }
    ],
    isActive: true,
    createdBy: "System",
    createdDate: "2024-01-01T00:00:00Z",
    usageCount: 45
  },
  {
    id: "TMPL-002",
    name: "Claim Report Form",
    description: "Standard form for filing insurance claims",
    category: "Claims Evidence",
    templateUrl: "/templates/claim_report_form.pdf",
    fields: [
      {
        id: "field-004",
        name: "claim_type",
        label: "Claim Type",
        type: "dropdown",
        required: true,
        options: ["Auto", "Home", "Health", "Life", "Travel"]
      },
      {
        id: "field-005",
        name: "incident_date",
        label: "Incident Date",
        type: "date",
        required: true
      },
      {
        id: "field-006",
        name: "description",
        label: "Incident Description",
        type: "text",
        required: true
      }
    ],
    isActive: true,
    createdBy: "Claims Department",
    createdDate: "2024-01-01T00:00:00Z",
    usageCount: 28
  }
];

// Utility functions
export const getDocumentById = (id: string): Document | undefined => {
  return mockDocuments.find(doc => doc.id === id);
};

export const getDocumentsByType = (type: DocumentType): Document[] => {
  return mockDocuments.filter(doc => doc.type === type);
};

export const getDocumentsByCategory = (category: DocumentCategory): Document[] => {
  return mockDocuments.filter(doc => doc.category === category);
};

export const getDocumentsByStatus = (status: string): Document[] => {
  return mockDocuments.filter(doc => doc.status === status);
};

export const getDocumentsByAccessLevel = (accessLevel: string): Document[] => {
  return mockDocuments.filter(doc => doc.accessLevel === accessLevel);
};

export const getDocumentsByTag = (tag: string): Document[] => {
  return mockDocuments.filter(doc => doc.tags.includes(tag));
};

export const getDocumentsByRelatedEntity = (entityType: string, entityId: string): Document[] => {
  return mockDocuments.filter(doc => 
    doc.relatedEntities.some(entity => entity.type === entityType && entity.id === entityId)
  );
};

export const searchDocuments = (query: string): Document[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockDocuments.filter(doc => 
    doc.name.toLowerCase().includes(lowercaseQuery) ||
    doc.description.toLowerCase().includes(lowercaseQuery) ||
    doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    doc.metadata.keywords?.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
};

export const getRecentDocuments = (limit: number = 10): Document[] => {
  return mockDocuments
    .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())
    .slice(0, limit);
};

export const getPopularDocuments = (limit: number = 10): Document[] => {
  return mockDocuments
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, limit);
};

export const getExpiringDocuments = (daysFromNow: number = 30): Document[] => {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + daysFromNow);
  
  return mockDocuments.filter(doc => {
    if (!doc.expiryDate) return false;
    const expiryDate = new Date(doc.expiryDate);
    return expiryDate <= targetDate && expiryDate >= new Date();
  });
};

export const calculateStorageUsed = (): number => {
  return mockDocuments.reduce((total, doc) => total + doc.fileSize, 0);
};

export const getDocumentsByUploader = (uploader: string): Document[] => {
  return mockDocuments.filter(doc => doc.uploadedBy === uploader);
};

export const getFolderById = (id: string): DocumentFolder | undefined => {
  return mockFolders.find(folder => folder.id === id);
};

export const getTemplateById = (id: string): DocumentTemplate | undefined => {
  return mockTemplates.find(template => template.id === id);
};

export const getActiveTemplates = (): DocumentTemplate[] => {
  return mockTemplates.filter(template => template.isActive);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileIcon = (mimeType: string): string => {
  if (mimeType.includes('pdf')) return '📄';
  if (mimeType.includes('image')) return '🖼️';
  if (mimeType.includes('video')) return '🎥';
  if (mimeType.includes('audio')) return '🎵';
  if (mimeType.includes('zip') || mimeType.includes('compressed')) return '📦';
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
  if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
  if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
  return '📄';
};

export const getDocumentStats = () => {
  return {
    totalDocuments: mockDocuments.length,
    totalSize: formatFileSize(calculateStorageUsed()),
    byType: Object.entries(
      mockDocuments.reduce((acc, doc) => {
        acc[doc.type] = (acc[doc.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ),
    byCategory: Object.entries(
      mockDocuments.reduce((acc, doc) => {
        acc[doc.category] = (acc[doc.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ),
    recentUploads: getRecentDocuments(5).length,
    expiringCount: getExpiringDocuments().length
  };
};
