import { Users } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Customers() {
  return (
    <PlaceholderPage
      title="Customer Management"
      description="Manage customer information, KYC documents, and policy assignments."
      icon={Users}
      features={[
        "Customer registration and profile management",
        "KYC document upload and verification",
        "Policy assignment and tracking",
        "Customer communication history",
        "Advanced search and filtering",
        "Customer analytics and insights"
      ]}
    />
  );
}
