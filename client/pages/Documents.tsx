import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  FolderOpen,
  Plus,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  File,
  FileText,
  Image,
  Archive,
  Share,
  Trash2,
  Calendar,
  User,
  Tag,
  Lock,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreHorizontal,
  Folder,
  Star,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DataTable } from "@/components/ui/data-table";
import { FormDialog } from "@/components/ui/form-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  mockDocuments,
  mockFolders,
  mockTemplates,
  Document,
  DocumentFolder,
  DocumentTemplate,
  getDocumentsByType,
  getDocumentsByCategory,
  getDocumentsByStatus,
  getRecentDocuments,
  getPopularDocuments,
  getExpiringDocuments,
  searchDocuments,
  formatFileSize,
  getFileIcon,
  getDocumentStats,
} from "@/lib/document-data";
import { cn } from "@/lib/utils";

const statusColors = {
  Active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Archived: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  Deleted: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "Under Review":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
};

const accessLevelColors = {
  Public:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Internal: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  Confidential:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Restricted: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const statusIcons = {
  Active: CheckCircle,
  Archived: Archive,
  Deleted: Trash2,
  "Under Review": AlertTriangle,
};

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [folders] = useState<DocumentFolder[]>(mockFolders);
  const [templates] = useState<DocumentTemplate[]>(mockTemplates);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(
    null,
  );
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showDocumentDetailsDialog, setShowDocumentDetailsDialog] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [formData, setFormData] = useState<any>({});
  const [view, setView] = useState<"grid" | "list">("list");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleUploadDocument = () => {
    if (!formData.name || !formData.type || !formData.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newDocument: Document = {
      id: `DOC-${String(documents.length + 1).padStart(3, "0")}`,
      name: formData.name,
      originalName: formData.originalName || formData.name,
      type: formData.type,
      category: formData.category,
      tags: formData.tags
        ? formData.tags.split(",").map((tag: string) => tag.trim())
        : [],
      description: formData.description || "",
      fileSize: formData.fileSize || 1048576,
      mimeType: formData.mimeType || "application/pdf",
      url: `/documents/${formData.name}`,
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      uploadedBy: "Current User",
      status: "Active",
      accessLevel: formData.accessLevel || "Internal",
      relatedEntities: [],
      versions: [
        {
          id: `VER-${String(documents.length + 1).padStart(3, "0")}`,
          version: "1.0",
          uploadDate: new Date().toISOString(),
          uploadedBy: "Current User",
          fileSize: formData.fileSize || 1048576,
          url: `/documents/${formData.name}`,
          changeNotes: "Initial upload",
          isActive: true,
        },
      ],
      metadata: {
        author: "Current User",
        createdDate: new Date().toISOString().split("T")[0],
        subject: formData.name,
        keywords: formData.tags
          ? formData.tags.split(",").map((tag: string) => tag.trim())
          : [],
        language: "English",
      },
      permissions: [],
      comments: [],
      downloadCount: 0,
      isEncrypted:
        formData.accessLevel === "Confidential" ||
        formData.accessLevel === "Restricted",
      checksum: `sha256:${Math.random().toString(36).substring(2, 15)}`,
    };

    setDocuments([...documents, newDocument]);
    setShowUploadDialog(false);
    setFormData({});
    toast.success("Document uploaded successfully");
  };

  const handleDownloadDocument = (document: Document) => {
    // Update download count
    const updatedDocuments = documents.map((doc) =>
      doc.id === document.id
        ? {
            ...doc,
            downloadCount: doc.downloadCount + 1,
            lastAccessed: new Date().toISOString(),
          }
        : doc,
    );
    setDocuments(updatedDocuments);
    toast.success(`Downloading ${document.name}`);
  };

  const handleDeleteDocument = (document: Document) => {
    const updatedDocuments = documents.map((doc) =>
      doc.id === document.id ? { ...doc, status: "Deleted" as const } : doc,
    );
    setDocuments(updatedDocuments);
    toast.success("Document moved to trash");
  };

  const openDocumentDetails = (document: Document) => {
    setSelectedDocument(document);
    setShowDocumentDetailsDialog(true);
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter((doc) => {
    if (searchQuery && !searchDocuments(searchQuery).includes(doc))
      return false;
    if (selectedCategory !== "All" && doc.category !== selectedCategory)
      return false;
    if (selectedType !== "All" && doc.type !== selectedType) return false;
    return doc.status === "Active"; // Only show active documents by default
  });

  const documentColumns: ColumnDef<Document>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const document = row.original;
        const icon = getFileIcon(document.mimeType);
        return (
          <div className="flex items-center space-x-3">
            <div className="text-xl">{icon}</div>
            <div>
              <div className="font-medium">{document.name}</div>
              <div className="text-sm text-muted-foreground">
                {document.type}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("category")}</Badge>
      ),
    },
    {
      accessorKey: "fileSize",
      header: "Size",
      cell: ({ row }) => formatFileSize(row.getValue("fileSize")),
    },
    {
      accessorKey: "uploadDate",
      header: "Upload Date",
      cell: ({ row }) => formatDate(row.getValue("uploadDate")),
    },
    {
      accessorKey: "uploadedBy",
      header: "Uploaded By",
    },
    {
      accessorKey: "accessLevel",
      header: "Access",
      cell: ({ row }) => {
        const accessLevel = row.getValue(
          "accessLevel",
        ) as keyof typeof accessLevelColors;
        return (
          <Badge className={accessLevelColors[accessLevel]}>
            <Lock className="h-3 w-3 mr-1" />
            {accessLevel}
          </Badge>
        );
      },
    },
    {
      accessorKey: "downloadCount",
      header: "Downloads",
      cell: ({ row }) => (
        <div className="text-center">{row.getValue("downloadCount")}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const document = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openDocumentDetails(document)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDownloadDocument(document)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteDocument(document)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Calculate statistics
  const stats = getDocumentStats();
  const recentDocs = getRecentDocuments(5);
  const popularDocs = getPopularDocuments(5);
  const expiringDocs = getExpiringDocuments(30);

  const categories = Array.from(new Set(documents.map((doc) => doc.category)));
  const types = Array.from(new Set(documents.map((doc) => doc.type)));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Document Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Upload, organize, and manage all insurance-related documents.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateFolderDialog(true)}
            className="flex items-center space-x-2"
          >
            <Folder className="h-4 w-4" />
            <span>New Folder</span>
          </Button>
          <Button
            onClick={() => setShowUploadDialog(true)}
            className="flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Document</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Documents
                </p>
                <p className="text-2xl font-bold">{stats.totalDocuments}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>{stats.recentUploads} this week</span>
                </div>
              </div>
              <File className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Storage Used
                </p>
                <p className="text-2xl font-bold">{stats.totalSize}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>across all documents</span>
                </div>
              </div>
              <Archive className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Folders
                </p>
                <p className="text-2xl font-bold">{folders.length}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>organized collections</span>
                </div>
              </div>
              <FolderOpen className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Expiring Soon
                </p>
                <p className="text-2xl font-bold">{expiringDocs.length}</p>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  <span>require attention</span>
                </div>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different views */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="folders">Folders</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>
                Complete document library with search and filtering
                capabilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={documentColumns}
                data={filteredDocuments}
                searchPlaceholder="Search documents..."
                onRowClick={openDocumentDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Documents</CardTitle>
              <CardDescription>
                Recently uploaded and modified documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentDocs.map((doc) => (
                  <Card
                    key={doc.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openDocumentDetails(doc)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">
                          {getFileIcon(doc.mimeType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">{doc.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {doc.category}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">
                              {formatDate(doc.uploadDate)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(doc.fileSize)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular">
          <Card>
            <CardHeader>
              <CardTitle>Popular Documents</CardTitle>
              <CardDescription>
                Most downloaded and accessed documents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularDocs.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                    onClick={() => openDocumentDetails(doc)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="text-xl">{getFileIcon(doc.mimeType)}</div>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {doc.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {doc.downloadCount} downloads
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(doc.fileSize)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="folders">
          <Card>
            <CardHeader>
              <CardTitle>Folder Structure</CardTitle>
              <CardDescription>
                Organized document collections and categories.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <FolderOpen className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{folder.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {folder.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{folder.documentCount} documents</span>
                        <span>{folder.subfolderCount} folders</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Document Templates</CardTitle>
              <CardDescription>
                Pre-configured templates for common document types.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {template.description}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline">{template.category}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Used {template.usageCount} times
                        </span>
                        <Button size="sm" variant="outline">
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Document Dialog */}
      <FormDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        title="Upload Document"
        description="Upload a new document to the system."
        onSubmit={handleUploadDocument}
        maxWidth="max-w-2xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Document Name *</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Enter document name"
            />
          </div>
          <div>
            <Label htmlFor="type">Document Type *</Label>
            <Select
              value={formData.type || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                {types.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="accessLevel">Access Level</Label>
            <Select
              value={formData.accessLevel || ""}
              onValueChange={(value) =>
                setFormData({ ...formData, accessLevel: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select access level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Public">Public</SelectItem>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="Confidential">Confidential</SelectItem>
                <SelectItem value="Restricted">Restricted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={formData.tags || ""}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="Enter tags separated by commas"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter document description"
              rows={3}
            />
          </div>
        </div>
      </FormDialog>

      {/* Document Details Dialog */}
      <FormDialog
        open={showDocumentDetailsDialog}
        onOpenChange={setShowDocumentDetailsDialog}
        title={selectedDocument ? selectedDocument.name : "Document Details"}
        description="View complete document information and metadata."
        maxWidth="max-w-4xl"
      >
        {selectedDocument && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Document Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type:</span>
                    <span>{selectedDocument.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Category:
                    </span>
                    <Badge variant="outline">{selectedDocument.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Size:</span>
                    <span>{formatFileSize(selectedDocument.fileSize)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Status:
                    </span>
                    <Badge className={statusColors[selectedDocument.status]}>
                      {selectedDocument.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Access Level:
                    </span>
                    <Badge
                      className={
                        accessLevelColors[selectedDocument.accessLevel]
                      }
                    >
                      <Lock className="h-3 w-3 mr-1" />
                      {selectedDocument.accessLevel}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Uploaded By:
                    </span>
                    <span>{selectedDocument.uploadedBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Upload Date:
                    </span>
                    <span>{formatDate(selectedDocument.uploadDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Last Modified:
                    </span>
                    <span>{formatDate(selectedDocument.lastModified)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Downloads:
                    </span>
                    <span>{selectedDocument.downloadCount}</span>
                  </div>
                  {selectedDocument.lastAccessed && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Accessed:
                      </span>
                      <span>{formatDate(selectedDocument.lastAccessed)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {selectedDocument.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">{selectedDocument.description}</p>
                </div>
              </div>
            )}

            {/* Tags */}
            {selectedDocument.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedDocument.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center space-x-1"
                    >
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Related Entities */}
            {selectedDocument.relatedEntities.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Related Entities</h3>
                <div className="space-y-2">
                  {selectedDocument.relatedEntities.map((entity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                    >
                      <div>
                        <div className="font-medium">{entity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {entity.type}
                        </div>
                      </div>
                      <Badge variant="outline">{entity.id}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Version History */}
            {selectedDocument.versions.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Version History</h3>
                <div className="space-y-3">
                  {selectedDocument.versions.map((version) => (
                    <div
                      key={version.id}
                      className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-3">
                        <History className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            Version {version.version}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {version.changeNotes}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm">
                          {formatDate(version.uploadDate)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {version.uploadedBy}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex space-x-2 pt-4 border-t">
              <Button onClick={() => handleDownloadDocument(selectedDocument)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        )}
      </FormDialog>
    </div>
  );
}
