import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import {
  UserCheck,
  Plus,
  Eye,
  Edit,
  Trophy,
  Target,
  DollarSign,
  TrendingUp,
  Users,
  Award,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Briefcase,
  GraduationCap,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building,
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  mockAgents,
  mockTrainingRecords,
  mockAgentActivities,
  Agent,
  TrainingRecord,
  getAgentsByStatus,
  getTopPerformers,
  calculateTeamMetrics,
  getExpiringCertifications,
  calculateTeamTargetProgress,
} from "@/lib/agent-data";
import { cn } from "@/lib/utils";

const statusColors = {
  Active:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
  Suspended: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  Training: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
};

const positionColors = {
  Agent: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
  "Senior Agent":
    "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
  "Team Lead":
    "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
  Manager:
    "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Director: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
};

const certificationStatusColors = {
  Valid: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
  Expired: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
  "Pending Renewal":
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
};

const statusIcons = {
  Active: CheckCircle,
  Inactive: Clock,
  Suspended: AlertTriangle,
  Training: GraduationCap,
};

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [trainingRecords] = useState<TrainingRecord[]>(mockTrainingRecords);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showTrainingDialog, setShowTrainingDialog] = useState(false);
  const [formData, setFormData] = useState<Partial<Agent>>({});

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPercentage = (value: number, decimals: number = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  const handleAddAgent = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newAgent: Agent = {
      id: `AGT-${String(agents.length + 1).padStart(3, "0")}`,
      employeeId: `EMP-${new Date().getFullYear()}-${String(agents.length + 1).padStart(3, "0")}`,
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      dateOfBirth: formData.dateOfBirth || "",
      hireDate: formData.hireDate || new Date().toISOString().split("T")[0],
      status: "Training",
      position: (formData.position as any) || "Agent",
      department: (formData.department as any) || "Sales",
      territory: {
        id: `TER-${String(agents.length + 1).padStart(3, "0")}`,
        name: formData.territory?.name || "Unassigned",
        type: "Geographic",
        boundaries: [],
        customerCount: 0,
        potentialRevenue: 0,
      },
      address: formData.address || {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "USA",
      },
      emergencyContact: formData.emergencyContact || {
        name: "",
        relationship: "",
        phone: "",
      },
      certifications: [],
      performance: {
        currentPeriod: {
          policiesSold: 0,
          premiumGenerated: 0,
          commissionEarned: 0,
          customerRetention: 0,
          averageDealSize: 0,
          conversionRate: 0,
          customerSatisfaction: 0,
          callsPerformed: 0,
          meetingsScheduled: 0,
          quotesGenerated: 0,
        },
        previousPeriod: {
          policiesSold: 0,
          premiumGenerated: 0,
          commissionEarned: 0,
          customerRetention: 0,
          averageDealSize: 0,
          conversionRate: 0,
          customerSatisfaction: 0,
          callsPerformed: 0,
          meetingsScheduled: 0,
          quotesGenerated: 0,
        },
        yearToDate: {
          policiesSold: 0,
          premiumGenerated: 0,
          commissionEarned: 0,
          customerRetention: 0,
          averageDealSize: 0,
          conversionRate: 0,
          customerSatisfaction: 0,
          callsPerformed: 0,
          meetingsScheduled: 0,
          quotesGenerated: 0,
        },
        rating: 3.0,
        rank: agents.length + 1,
        totalAgents: agents.length + 1,
      },
      commissionStructure: {
        baseRate: 5.0,
        tierRates: [
          {
            threshold: 100000,
            rate: 5.0,
            description: "Base rate up to $100K",
          },
        ],
        bonuses: [],
        totalEarned: 0,
        totalPaid: 0,
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
      qualifications: [],
      notes: formData.notes || "",
      manager: formData.manager,
    };

    setAgents([...agents, newAgent]);
    setShowAddDialog(false);
    setFormData({});
    toast.success("Agent added successfully");
  };

  const handleEditAgent = () => {
    if (!selectedAgent || !formData.firstName || !formData.lastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    const updatedAgents = agents.map((agent) =>
      agent.id === selectedAgent.id ? { ...agent, ...formData } : agent,
    );

    setAgents(updatedAgents);
    setShowEditDialog(false);
    setSelectedAgent(null);
    setFormData({});
    toast.success("Agent updated successfully");
  };

  const openAddDialog = () => {
    setFormData({
      address: { street: "", city: "", state: "", zipCode: "", country: "USA" },
      emergencyContact: { name: "", relationship: "", phone: "" },
    });
    setShowAddDialog(true);
  };

  const openEditDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData(agent);
    setShowEditDialog(true);
  };

  const openDetailsDialog = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowDetailsDialog(true);
  };

  const agentColumns: ColumnDef<Agent>[] = [
    {
      accessorKey: "employeeId",
      header: "Employee ID",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600 dark:text-blue-400">
          {row.getValue("employeeId")}
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const agent = row.original;
        return (
          <div>
            <div className="font-medium">
              {agent.firstName} {agent.lastName}
            </div>
            <div className="text-sm text-muted-foreground">{agent.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => {
        const position = row.getValue(
          "position",
        ) as keyof typeof positionColors;
        return <Badge className={positionColors[position]}>{position}</Badge>;
      },
    },
    {
      accessorKey: "territory",
      header: "Territory",
      cell: ({ row }) => {
        const agent = row.original;
        return (
          <div>
            <div className="font-medium">{agent.territory.name}</div>
            <div className="text-sm text-muted-foreground">
              {agent.territory.customerCount} customers
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "performance",
      header: "Performance",
      cell: ({ row }) => {
        const agent = row.original;
        return (
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="font-medium">
                {agent.performance.rating.toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              #{agent.performance.rank}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "ytdPremium",
      header: "YTD Premium",
      cell: ({ row }) => {
        const agent = row.original;
        return formatCurrency(agent.performance.yearToDate.premiumGenerated);
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as keyof typeof statusColors;
        const Icon = statusIcons[status];
        return (
          <Badge className={statusColors[status]}>
            <Icon className="h-3 w-3 mr-1" />
            {status}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const agent = row.original;
        return (
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openDetailsDialog(agent);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                openEditDialog(agent);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  const renderAgentForm = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="firstName">First Name *</Label>
        <Input
          id="firstName"
          value={formData.firstName || ""}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          placeholder="Enter first name"
        />
      </div>
      <div>
        <Label htmlFor="lastName">Last Name *</Label>
        <Input
          id="lastName"
          value={formData.lastName || ""}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          placeholder="Enter last name"
        />
      </div>
      <div>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ""}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Enter email address"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          value={formData.phone || ""}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter phone number"
        />
      </div>
      <div>
        <Label htmlFor="position">Position</Label>
        <Select
          value={formData.position || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, position: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Agent">Agent</SelectItem>
            <SelectItem value="Senior Agent">Senior Agent</SelectItem>
            <SelectItem value="Team Lead">Team Lead</SelectItem>
            <SelectItem value="Manager">Manager</SelectItem>
            <SelectItem value="Director">Director</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="department">Department</Label>
        <Select
          value={formData.department || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, department: value as any })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Underwriting">Underwriting</SelectItem>
            <SelectItem value="Claims">Claims</SelectItem>
            <SelectItem value="Customer Service">Customer Service</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="hireDate">Hire Date</Label>
        <Input
          id="hireDate"
          type="date"
          value={formData.hireDate || ""}
          onChange={(e) =>
            setFormData({ ...formData, hireDate: e.target.value })
          }
        />
      </div>
      <div>
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth || ""}
          onChange={(e) =>
            setFormData({ ...formData, dateOfBirth: e.target.value })
          }
        />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes || ""}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the agent"
          rows={3}
        />
      </div>
    </div>
  );

  // Calculate statistics
  const activeAgents = getAgentsByStatus("Active");
  const topPerformers = getTopPerformers(3);
  const totalCommission = agents.reduce(
    (sum, agent) => sum + agent.performance.yearToDate.commissionEarned,
    0,
  );
  const totalPremium = agents.reduce(
    (sum, agent) => sum + agent.performance.yearToDate.premiumGenerated,
    0,
  );
  const averageRating =
    agents.reduce((sum, agent) => sum + agent.performance.rating, 0) /
    agents.length;
  const expiringCerts = getExpiringCertifications(30);

  // Team performance for team leads
  const teamLeads = agents.filter(
    (agent) => agent.position === "Team Lead" && agent.teamMembers,
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Agent Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage agent profiles, track performance, and calculate commissions.
          </p>
        </div>
        <Button onClick={openAddDialog} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Agent</span>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Agents
                </p>
                <p className="text-2xl font-bold">{agents.length}</p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>{activeAgents.length} active</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Premium
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalPremium)}
                </p>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>YTD Performance</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Commission
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalCommission)}
                </p>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <span>Earned this year</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Avg Rating
                </p>
                <p className="text-2xl font-bold">{averageRating.toFixed(1)}</p>
                <div className="flex items-center text-xs text-yellow-600 mt-1">
                  <Star className="h-3 w-3 mr-1" />
                  <span>Team performance</span>
                </div>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">All Agents</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
        </TabsList>

        <TabsContent value="agents">
          <Card>
            <CardHeader>
              <CardTitle>Agent Directory</CardTitle>
              <CardDescription>
                View and manage all agent profiles with performance metrics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={agentColumns}
                data={agents}
                searchPlaceholder="Search agents..."
                onRowClick={openDetailsDialog}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Top Performers</span>
                </CardTitle>
                <CardDescription>
                  Leading agents by performance rating
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((agent, index) => (
                    <div
                      key={agent.id}
                      className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full text-sm font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">
                            {agent.firstName} {agent.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agent.position}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">
                            {agent.performance.rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(
                            agent.performance.yearToDate.premiumGenerated,
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Team Performance Overview</CardTitle>
                <CardDescription>Aggregate performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Total Policies Sold</span>
                      <span>
                        {agents.reduce(
                          (sum, agent) =>
                            sum + agent.performance.yearToDate.policiesSold,
                          0,
                        )}
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Customer Retention</span>
                      <span>
                        {formatPercentage(
                          agents.reduce(
                            (sum, agent) =>
                              sum +
                              agent.performance.yearToDate.customerRetention,
                            0,
                          ) / agents.length,
                        )}
                      </span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conversion Rate</span>
                      <span>
                        {formatPercentage(
                          agents.reduce(
                            (sum, agent) =>
                              sum + agent.performance.yearToDate.conversionRate,
                            0,
                          ) / agents.length,
                        )}
                      </span>
                    </div>
                    <Progress value={32} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Customer Satisfaction</span>
                      <span>
                        {(
                          agents.reduce(
                            (sum, agent) =>
                              sum +
                              agent.performance.yearToDate.customerSatisfaction,
                            0,
                          ) / agents.length
                        ).toFixed(1)}
                        /5.0
                      </span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="teams">
          <div className="space-y-6">
            {teamLeads.map((teamLead) => {
              const teamMetrics = calculateTeamMetrics(teamLead.id);
              const targetProgress = calculateTeamTargetProgress(teamLead.id);

              return (
                <Card key={teamLead.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building className="h-5 w-5" />
                      <span>
                        {teamLead.firstName} {teamLead.lastName}'s Team
                      </span>
                    </CardTitle>
                    <CardDescription>
                      {teamMetrics.teamSize} team members •{" "}
                      {teamLead.territory.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h4 className="font-medium">Team Performance</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Total Policies:</span>
                            <span className="font-medium">
                              {teamMetrics.totalPolicies}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Premium:</span>
                            <span className="font-medium">
                              {formatCurrency(teamMetrics.totalPremium)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Average Rating:</span>
                            <span className="font-medium">
                              {teamMetrics.averageRating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Target Progress</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Policies</span>
                              <span>
                                {formatPercentage(
                                  targetProgress.policies.percentage,
                                )}
                              </span>
                            </div>
                            <Progress
                              value={targetProgress.policies.percentage}
                              className="h-2"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Premium</span>
                              <span>
                                {formatPercentage(
                                  targetProgress.premium.percentage,
                                )}
                              </span>
                            </div>
                            <Progress
                              value={targetProgress.premium.percentage}
                              className="h-2"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="font-medium">Team Members</h4>
                        <div className="space-y-2">
                          {teamLead.teamMembers?.map((memberId) => {
                            const member = agents.find(
                              (agent) => agent.id === memberId,
                            );
                            if (!member) return null;
                            return (
                              <div
                                key={memberId}
                                className="flex items-center justify-between text-sm"
                              >
                                <span>
                                  {member.firstName} {member.lastName}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500" />
                                  <span>
                                    {member.performance.rating.toFixed(1)}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="training">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Training Records */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Training</CardTitle>
                <CardDescription>
                  Latest training completions and certifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trainingRecords.slice(0, 5).map((record) => {
                    const agent = agents.find((a) => a.id === record.agentId);
                    return (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700"
                      >
                        <div>
                          <div className="font-medium">
                            {record.trainingName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agent?.firstName} {agent?.lastName} •{" "}
                            {formatDate(
                              record.completionDate || record.startDate,
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={cn(
                              record.status === "Completed" &&
                                "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400",
                              record.status === "In Progress" &&
                                "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
                              record.status === "Failed" &&
                                "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                            )}
                          >
                            {record.status}
                          </Badge>
                          {record.score && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Score: {record.score}%
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Expiring Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Expiring Certifications</CardTitle>
                <CardDescription>
                  Certifications expiring within 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expiringCerts.length > 0 ? (
                    expiringCerts.map(({ agent, certification }) => (
                      <div
                        key={`${agent.id}-${certification.id}`}
                        className="flex items-center justify-between p-3 border rounded-lg dark:border-gray-700 border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10"
                      >
                        <div>
                          <div className="font-medium">
                            {certification.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {agent.firstName} {agent.lastName}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                            Expires {formatDate(certification.expiryDate)}
                          </div>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400 mt-1">
                            Action Required
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No certifications expiring soon.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Agent Dialog */}
      <FormDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        title="Add New Agent"
        description="Enter agent information to create a new agent profile."
        onSubmit={handleAddAgent}
        maxWidth="max-w-2xl"
      >
        {renderAgentForm()}
      </FormDialog>

      {/* Edit Agent Dialog */}
      <FormDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        title="Edit Agent"
        description="Update agent information and details."
        onSubmit={handleEditAgent}
        maxWidth="max-w-2xl"
      >
        {renderAgentForm()}
      </FormDialog>

      {/* Agent Details Dialog */}
      <FormDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        title={
          selectedAgent
            ? `${selectedAgent.firstName} ${selectedAgent.lastName}`
            : "Agent Details"
        }
        description="View complete agent information and performance metrics."
        maxWidth="max-w-6xl"
      >
        {selectedAgent && (
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAgent.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAgent.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedAgent.territory.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Hired {formatDate(selectedAgent.hireDate)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Details</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Position:</span>
                    <Badge className={positionColors[selectedAgent.position]}>
                      {selectedAgent.position}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Department:</span>
                    <span>{selectedAgent.department}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Employee ID:</span>
                    <span>{selectedAgent.employeeId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Status:</span>
                    <Badge className={statusColors[selectedAgent.status]}>
                      {selectedAgent.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Performance</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Rating:</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">
                        {selectedAgent.performance.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rank:</span>
                    <span>
                      #{selectedAgent.performance.rank} of{" "}
                      {selectedAgent.performance.totalAgents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>YTD Premium:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        selectedAgent.performance.yearToDate.premiumGenerated,
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Commission:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        selectedAgent.performance.yearToDate.commissionEarned,
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Detailed Performance Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {selectedAgent.performance.yearToDate.policiesSold}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Policies Sold
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatPercentage(
                        selectedAgent.performance.yearToDate.customerRetention,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Retention Rate
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatPercentage(
                        selectedAgent.performance.yearToDate.conversionRate,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Conversion Rate
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {selectedAgent.performance.yearToDate.customerSatisfaction.toFixed(
                        1,
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Satisfaction
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Certifications */}
            {selectedAgent.certifications.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedAgent.certifications.map((cert) => (
                    <Card key={cert.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{cert.name}</h4>
                          <Badge
                            className={certificationStatusColors[cert.status]}
                          >
                            {cert.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Issuer: {cert.issuer}</div>
                          <div>Expires: {formatDate(cert.expiryDate)}</div>
                          <div>Certificate: {cert.certificateNumber}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedAgent.notes && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm">{selectedAgent.notes}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </FormDialog>
    </div>
  );
}
