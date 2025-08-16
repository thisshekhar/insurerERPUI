import { FolderOpen } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Documents() {
  return (
    <PlaceholderPage
      title="Document Management"
      description="Upload, organize, and manage all insurance-related documents."
      icon={FolderOpen}
      features={[
        "Document upload and storage",
        "Document categorization and tagging",
        "Version control and history",
        "Document preview and download",
        "Digital signature integration",
        "Document search and retrieval"
      ]}
    />
  );
}
