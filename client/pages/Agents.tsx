import { UserCheck } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage";

export default function Agents() {
  return (
    <PlaceholderPage
      title="Agent Management"
      description="Manage agent profiles, track performance, and calculate commissions."
      icon={UserCheck}
      features={[
        "Agent profile and certification management",
        "Performance tracking and analytics",
        "Commission calculation and payments",
        "Agent leaderboards and rankings",
        "Training and development tracking",
        "Territory and customer assignment"
      ]}
    />
  );
}
