"use client";

import { useState, useEffect } from "react";
import { toast } from 'react-hot-toast';
import { 
  Home, FileText, Calendar, DollarSign, User, 
  Clock, CheckCircle, AlertCircle, MapPin, 
  Bed, Bath, Users, Eye, Download, 
  MessageSquare, ChevronRight, MoreVertical,
  Building, Lock, PenSquare
} from "lucide-react";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Icons
import { Search } from "lucide-react";
import { leaseService } from "@/services/lease.service";
import { useRouter } from "next/navigation";

export default function TenantLeasesPropertiesPage() {
  const router = useRouter();
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedLease, setSelectedLease] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const FILTERS = [
    { key: "all", label: "All Leases" },
    { key: "active", label: "Active Leases" },
    { key: "pending_request", label: "Pending Requests" },
    { key: "sent_to_tenant", label: "Action Required" },
    { key: "signed_by_landlord", label: "Awaiting Your Signature" },
    { key: "fully_executed", label: "Fully Executed" },
    { key: "cancelled", label: "Cancelled" },
    { key: "expired", label: "Expired" }
  ];

  useEffect(() => {
    fetchLeases();
  }, [filter]);

  const fetchLeases = async () => {
    try {
      setLoading(true);
      const res = await leaseService.getMyLeases({
        role: "tenant",
        status: filter !== "all" ? filter : undefined,
      });

      console.log("Tenant leases response:", res.data);

      if (res.success) {

        setLeases(res.data || []);
      } else {
        toast.error(res.message || "Failed to load leases");
      }
    } catch (err) {
      console.error("Error fetching leases:", err);
      toast.error("Failed to load lease information");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const config = {
      pending_request: { label: "Pending Request", color: "bg-yellow-100 text-yellow-800" },
      draft: { label: "Draft", color: "bg-gray-100 text-gray-800" },
      sent_to_tenant: { label: "Action Required", color: "bg-blue-100 text-blue-800" },
      sent_to_landlord: { label: "Sent to Landlord", color: "bg-purple-100 text-purple-800" },
      changes_requested: { label: "Changes Requested", color: "bg-orange-100 text-orange-800" },
      signed_by_landlord: { label: "Landlord Signed", color: "bg-green-100 text-green-800" },
      signed_by_tenant: { label: "You Signed", color: "bg-green-100 text-green-800" },
      fully_executed: { label: "Active Lease", color: "bg-green-100 text-green-800" },
      cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
      expired: { label: "Expired", color: "bg-gray-100 text-gray-800" }
    };

    const statusConfig = config[status] || { label: status, color: "bg-gray-100 text-gray-800" };
    
    return (
      <Badge className={`${statusConfig.color} capitalize text-xs px-2 py-1`}>
        {statusConfig.label}
      </Badge>
    );
  };

  const getNextAction = (lease) => {
    if (lease.status === "sent_to_tenant") {
      return { 
        text: "Review & Respond", 
        color: "text-blue-600", 
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        icon: AlertCircle 
      };
    }
    if (lease.status === "signed_by_landlord") {
      return { 
        text: "Sign Lease Now", 
        color: "text-green-600", 
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: PenSquare 
      };
    }
    if (lease.status === "changes_requested") {
      return { 
        text: "Waiting for Landlord", 
        color: "text-orange-600", 
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        icon: Clock 
      };
    }
    return null;
  };

  const getPrimaryActionButton = (lease) => {
    const nextAction = getNextAction(lease);
    
    if (lease.status === "sent_to_tenant" || lease.status === "signed_by_landlord") {
      return (
        <Button
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => router.push(`/dashboard/tenant/leases/${lease._id}`)}
        >
          {lease.status === "signed_by_landlord" ? (
            <PenSquare className="h-4 w-4 mr-2" />
          ) : (
            <Eye className="h-4 w-4 mr-2" />
          )}
          {nextAction?.text || "Take Action"}
        </Button>
      );
    }
    
    return null;
  };

  // Helper function to render icon component
  const renderIcon = (IconComponent) => {
    if (!IconComponent) return null;
    return <IconComponent className="h-4 w-4 mr-2" />;
  };

  const getSecondaryActions = (lease) => {
    const actions = [];
    
    // Always show Details button
    actions.push({
      label: "View Details",
      icon: Eye,
      onClick: () => handleViewDetails(lease),
      variant: "outline"
    });

    // Add specific actions based on status
    if (lease.status === "fully_executed") {
      actions.push({
        label: "Download PDF",
        icon: Download,
        onClick: () => {
          console.log("Download lease:", lease._id);
          toast.success("Download started");
        },
        variant: "outline"
      });
    }

    if (["sent_to_tenant", "signed_by_landlord", "changes_requested"].includes(lease.status)) {
      actions.push({
        label: "Message Landlord",
        icon: MessageSquare,
        onClick: () => {
          // Message logic
          toast.success("Message dialog will open");
        },
        variant: "outline"
      });
    }

    return actions;
  };

  const filteredLeases = leases.filter(lease => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      lease.property?.title?.toLowerCase().includes(searchLower) ||
      lease.property?.address?.toLowerCase().includes(searchLower) ||
      lease.landlord?.name?.toLowerCase().includes(searchLower) ||
      lease.status?.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetails = (lease) => {
    setSelectedLease(lease);
    setDetailsDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1F3A34]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#113B28]">
            My Lease Agreements
          </h1>
          <CardDescription>
            Manage and track all your rental lease agreements
          </CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm">
            <span className="font-semibold text-[#113B28]">{filteredLeases.length}</span> lease(s)
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Leases</p>
                <p className="text-2xl font-bold">{leases.length}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Leases</p>
                <p className="text-2xl font-bold text-green-600">
                  {leases.filter(l => l.status === "fully_executed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Action Required</p>
                <p className="text-2xl font-bold text-blue-600">
                  {leases.filter(l => ["sent_to_tenant", "signed_by_landlord"].includes(l.status)).length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {leases.filter(l => ["pending_request", "changes_requested", "draft"].includes(l.status)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search leases by property, landlord, or status..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  {FILTERS.map((f) => (
                    <SelectItem key={f.key} value={f.key}>
                      {f.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lease Cards Grid */}
      {filteredLeases.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <CardDescription className="mb-6 max-w-md mx-auto">
            {searchQuery ? `No leases match "${searchQuery}". Try different keywords.` : 'You don\'t have any lease agreements yet.'}
          </CardDescription>
          {!searchQuery && (
            <Button 
              onClick={() => router.push('/')}
              className="bg-[#113B28] hover:bg-[#0e2f1f] text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Browse Available Properties
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeases.map((lease) => {
            const nextAction = getNextAction(lease);
            const primaryAction = getPrimaryActionButton(lease);
            const secondaryActions = getSecondaryActions(lease);
            const firstAction = secondaryActions[0];
            
            return (
              <Card key={lease._id} className="overflow-hidden hover:shadow-lg transition-shadow border flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 truncate">
                        {lease.property?.title || "Lease Agreement"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-1 truncate">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="text-xs truncate">{lease.property?.address || "Address not available"}</span>
                      </CardDescription>
                    </div>
                    <div className="flex-shrink-0 ml-2">
                      {getStatusBadge(lease.status)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pb-3 flex-1">
                  {/* Property Basic Info */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="font-semibold text-sm">{formatCurrency(lease.rentAmount)}</span>
                      <span className="text-xs text-gray-500 ml-1">/month</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{formatDate(lease.startDate)}</span>
                    </div>
                  </div>

                  {/* Landlord Info */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      {lease.landlord?.profilePicture ? (
                        <img 
                          src={lease.landlord.profilePicture} 
                          alt={lease.landlord.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <Building className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{lease.landlord?.name || "Landlord"}</p>
                      <p className="text-xs text-gray-500 truncate">Property Owner</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                  </div>

                  {/* Next Action (if any) */}
                  {nextAction && (
                    <div className={`p-3 rounded-lg mb-4 ${nextAction.bgColor} border ${nextAction.borderColor}`}>
                      <div className="flex items-center gap-2">
                        {nextAction.icon && <nextAction.icon className={`h-4 w-4 ${nextAction.color}`} />}
                        <p className={`text-sm font-medium ${nextAction.color}`}>{nextAction.text}</p>
                      </div>
                    </div>
                  )}

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-2 bg-gray-50 rounded">
                      <Bed className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">{lease.property?.bedrooms || "N/A"}</p>
                      <p className="text-xs text-gray-500">Beds</p>
                    </div>
                    <div className="p-2 bg-gray-50 rounded">
                      <Bath className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">{lease.property?.bathrooms || "N/A"}</p>
                      <p className="text-xs text-gray-500">Baths</p>
                    </div>
                    {/* <div className="p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-gray-500 mx-auto mb-1" />
                      <p className="text-xs font-medium">{lease.property?.maxOccupancy || "N/A"}</p>
                      <p className="text-xs text-gray-500">Guests</p>
                    </div> */}
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t mt-auto">
                  <div className="w-full space-y-2">
                    {/* Primary Action Button */}
                    {primaryAction && primaryAction}
                    
                    {/* Secondary Actions */}
                    <div className="flex gap-2">
                      {secondaryActions.length === 1 ? (
                        <Button
                          variant={firstAction.variant || "outline"}
                          size="sm"
                          className="flex-1"
                          onClick={firstAction.onClick}
                        >
                          {firstAction.icon === Eye && <Eye className="h-4 w-4 mr-2" />}
                          {firstAction.icon === Download && <Download className="h-4 w-4 mr-2" />}
                          {firstAction.icon === MessageSquare && <MessageSquare className="h-4 w-4 mr-2" />}
                          {firstAction.label}
                        </Button>
                      ) : secondaryActions.length > 1 ? (
                        <>
                          <Button
                            variant={firstAction.variant || "outline"}
                            size="sm"
                            className="flex-1"
                            onClick={firstAction.onClick}
                          >
                            {firstAction.icon === Eye && <Eye className="h-4 w-4 mr-2" />}
                            {firstAction.icon === Download && <Download className="h-4 w-4 mr-2" />}
                            {firstAction.icon === MessageSquare && <MessageSquare className="h-4 w-4 mr-2" />}
                            {firstAction.label}
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="px-3">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>More Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              {secondaryActions.slice(1).map((action, index) => (
                                <DropdownMenuItem 
                                  key={index}
                                  onClick={action.onClick}
                                  className="cursor-pointer"
                                >
                                  {action.icon === Eye && <Eye className="h-4 w-4 mr-2" />}
                                  {action.icon === Download && <Download className="h-4 w-4 mr-2" />}
                                  {action.icon === MessageSquare && <MessageSquare className="h-4 w-4 mr-2" />}
                                  {action.label}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </>
                      ) : null}
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Lease Details Modal */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] xl:max-w-[1200px] max-h-[90vh] overflow-y-auto p-4 md:p-6">
          {selectedLease && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lease Details
                </DialogTitle>
                <DialogDescription>
                  Complete information about your lease agreement
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Property Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Property Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Property Name</p>
                      <p className="font-medium">{selectedLease.property?.title || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">{selectedLease.property?.address || "N/A"}</p>
                      <p className="text-sm text-gray-500">
                        {selectedLease.property?.city}, {selectedLease.property?.state} {selectedLease.property?.zipCode}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Property Type</p>
                      <p className="font-medium capitalize">{selectedLease.property?.type || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amenities</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedLease.property?.amenities?.slice(0, 3).map((amenity, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                        {selectedLease.property?.amenities?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{selectedLease.property.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lease Terms Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Lease Terms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Rent</p>
                      <p className="font-medium text-lg">{formatCurrency(selectedLease.rentAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Security Deposit</p>
                      <p className="font-medium">{formatCurrency(selectedLease.securityDeposit)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lease Term</p>
                      <p className="font-medium">
                        {formatDate(selectedLease.startDate)} - {formatDate(selectedLease.endDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      {getStatusBadge(selectedLease.status)}
                    </div>
                  </div>
                </div>

                {/* Parties Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Parties Involved</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Landlord</p>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {selectedLease.landlord?.profilePicture ? (
                            <img 
                              src={selectedLease.landlord.profilePicture} 
                              alt={selectedLease.landlord.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{selectedLease.landlord?.name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{selectedLease.landlord?.email || "N/A"}</p>
                          <p className="text-sm text-gray-500">{selectedLease.landlord?.phone || ""}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Tenant (You)</p>
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                          {selectedLease.tenant?.profilePicture ? (
                            <img 
                              src={selectedLease.tenant.profilePicture} 
                              alt={selectedLease.tenant.name}
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <User className="h-6 w-6 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{selectedLease.tenant?.name || "N/A"}</p>
                          <p className="text-sm text-gray-500">{selectedLease.tenant?.email || "N/A"}</p>
                          <p className="text-sm text-gray-500">{selectedLease.tenant?.phone || ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Signatures Section */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Signatures</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Landlord Signature</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${selectedLease.signatures?.landlord?.signedAt ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>
                          {selectedLease.signatures?.landlord?.signedAt 
                            ? `Signed on ${formatDate(selectedLease.signatures.landlord.signedAt)}`
                            : "Awaiting signature"
                          }
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Your Signature</p>
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${selectedLease.signatures?.tenant?.signedAt ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <span>
                          {selectedLease.signatures?.tenant?.signedAt 
                            ? `Signed on ${formatDate(selectedLease.signatures.tenant.signedAt)}`
                            : "Not signed yet"
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setDetailsDialogOpen(false);
                      router.push(`/dashboard/tenant/leases/${selectedLease._id}`);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Lease
                  </Button>
                  
                  {(selectedLease.status === "sent_to_tenant" || selectedLease.status === "signed_by_landlord") && (
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        setDetailsDialogOpen(false);
                        router.push(`/dashboard/tenant/leases/${selectedLease._id}`);
                      }}
                    >
                      {selectedLease.status === "signed_by_landlord" ? (
                        <PenSquare className="h-4 w-4 mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Take Action
                    </Button>
                  )}
                  
                  {selectedLease.status === "fully_executed" && (
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        console.log("Download lease:", selectedLease._id);
                        toast.success("Download started");
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}