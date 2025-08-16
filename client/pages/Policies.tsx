import { FileText } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Policies() {
  return (
    <PlaceholderPage
      title="Policy Management"
      description="Create, update, and manage insurance policies for customers and agents."
      icon={FileText}
      features={[
        "Create and update insurance policies",
        "Policy renewal management",
        "Premium calculation and tracking",
        "Policy document generation",
        "Bulk policy operations",
        "Policy analytics and reporting"
      ]}
    />
  );
}
