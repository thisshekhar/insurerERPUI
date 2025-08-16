import { CreditCard } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Claims() {
  return (
    <PlaceholderPage
      title="Claims Management"
      description="Process insurance claims, track status, and manage approval workflows."
      icon={CreditCard}
      features={[
        "New claim intake and registration",
        "Claims status tracking and updates",
        "Approval workflow management",
        "Claims document handling",
        "Settlement processing",
        "Claims analytics and fraud detection"
      ]}
    />
  );
}
