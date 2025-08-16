import { DollarSign } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Payments() {
  return (
    <PlaceholderPage
      title="Payments & Premiums"
      description="Track payment history, manage invoices, and handle premium collections."
      icon={DollarSign}
      features={[
        "Payment history and tracking",
        "Invoice generation and management",
        "Premium due notifications",
        "Payment gateway integration",
        "Automated payment reminders",
        "Financial reporting and analytics"
      ]}
    />
  );
}
