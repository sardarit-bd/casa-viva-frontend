// app/dashboard/tenant/leases/[id]/review/page.js
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  Edit, 
  AlertCircle,
  Loader2,
  Home,
  DollarSign,
  Calendar,
  Shield,
  MapPin,
  Bed,
  Bath,
  Ruler,
  Users,
  Clock,
  Zap,
  Droplets,
  Flame,
  Wifi,
  Tv,
  Trash2,
  ChevronDown,
  ChevronUp,
  PenTool,
  MessageCircle,
  Download,
  Building,
  Sparkles,
  Thermometer,
  Snowflake,
  TreePine,
  Car,
  Dumbbell,
  Coffee,
  PawPrint,
  Cloud,
  Bell,
  Waves,
  Utensils
} from "lucide-react";
import { leaseService } from "@/services/lease.service";
import toast from "react-hot-toast";

export default function TenantReviewLeasePage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [lease, setLease] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [action, setAction] = useState("approve");
  const [changes, setChanges] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    terms: true,
    property: false,
    utilities: false,
    additional: false
  });

  useEffect(() => {
    fetchLease();
  }, [id]);

  const fetchLease = async () => {
    try {
      setLoading(true);
      const res = await leaseService.getLeaseById(id);
      if (res.success) {
        setLease(res.data);
      } else {
        toast.error("Lease not found");
        router.back();
      }
    } catch (err) {
      toast.error("Failed to load lease details");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const res = await leaseService.tenantReviewLease(
        id,
        action,
        action === "request_changes" ? changes : "",
        action === "approve" 
          ? "I have reviewed and approved the lease agreement"
          : "I have requested changes to the lease"
      );
      
      if (res.success) {
        toast.success(
          action === "approve" 
            ? "Lease approved successfully!" 
            : "Change request submitted!"
        );
        
        // যদি landlord ইতিমধ্যে sign করে থাকে, তাহলে sign page-এ redirect
        if (action === "approve" && lease.signatures?.landlord?.signedAt) {
          router.push(`/dashboard/tenant/leases/${id}/sign`);
        } else {
          router.push(`/dashboard/tenant/leases/${id}`);
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignNow = () => {
    router.push(`/dashboard/tenant/leases/${id}/sign`);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Helper functions
  const getUtilityIcon = (utility) => {
    const iconMap = {
      electricity: <Zap className="h-5 w-5 text-yellow-600" />,
      water: <Droplets className="h-5 w-5 text-blue-600" />,
      gas: <Flame className="h-5 w-5 text-orange-600" />,
      heating: <Thermometer className="h-5 w-5 text-red-600" />,
      cooling: <Snowflake className="h-5 w-5 text-cyan-600" />,
      internet: <Wifi className="h-5 w-5 text-purple-600" />,
      cable_tv: <Tv className="h-5 w-5 text-indigo-600" />,
      trash: <Trash2 className="h-5 w-5 text-gray-600" />,
      sewage: <Waves className="h-5 w-5 text-teal-600" />,
    };
    
    return iconMap[utility] || <CheckCircle className="h-5 w-5 text-green-600" />;
  };

  const getAmenityIcon = (amenity) => {
    const amenityLower = amenity.toLowerCase();
    const iconMap = {
      parking: <Car className="h-5 w-5 text-blue-600" />,
      garage: <Car className="h-5 w-5 text-blue-700" />,
      'swimming pool': <Waves className="h-5 w-5 text-cyan-600" />,
      gym: <Dumbbell className="h-5 w-5 text-red-600" />,
      'fitness center': <Dumbbell className="h-5 w-5 text-red-500" />,
      laundry: <Waves className="h-5 w-5 text-purple-600" />,
      dishwasher: <Utensils className="h-5 w-5 text-green-600" />,
      'air conditioning': <Snowflake className="h-5 w-5 text-cyan-600" />,
      heating: <Thermometer className="h-5 w-5 text-orange-600" />,
      balcony: <TreePine className="h-5 w-5 text-emerald-600" />,
      garden: <TreePine className="h-5 w-5 text-green-600" />,
      terrace: <TreePine className="h-5 w-5 text-amber-600" />,
      security: <Shield className="h-5 w-5 text-gray-700" />,
      elevator: <ChevronUp className="h-5 w-5 text-gray-600" />,
      furnished: <Home className="h-5 w-5 text-amber-600" />,
      wifi: <Wifi className="h-5 w-5 text-purple-600" />,
      'cable tv': <Tv className="h-5 w-5 text-indigo-600" />,
      'pets allowed': <PawPrint className="h-5 w-5 text-amber-600" />,
      'smoking allowed': <Cloud className="h-5 w-5 text-gray-600" />,
      cafe: <Coffee className="h-5 w-5 text-amber-600" />,
      concierge: <Bell className="h-5 w-5 text-yellow-600" />,
      'doorman': <Users className="h-5 w-5 text-blue-600" />,
      '24/7 security': <Shield className="h-5 w-5 text-red-600" />,
      'storage': <Building className="h-5 w-5 text-gray-600" />,
      'bike storage': <Car className="h-5 w-5 text-green-600" />,
      'rooftop': <TreePine className="h-5 w-5 text-orange-600" />,
      'pool': <Waves className="h-5 w-5 text-cyan-600" />,
      'spa': <Droplets className="h-5 w-5 text-teal-600" />,
      'sauna': <Thermometer className="h-5 w-5 text-red-700" />,
      'jacuzzi': <Droplets className="h-5 w-5 text-purple-600" />,
      'bbq area': <Flame className="h-5 w-5 text-orange-500" />,
      'playground': <Users className="h-5 w-5 text-green-500" />,
      'tennis court': <Dumbbell className="h-5 w-5 text-green-600" />,
      'basketball court': <Dumbbell className="h-5 w-5 text-orange-600" />,
    };
    
    return iconMap[amenityLower] || <Home className="h-5 w-5 text-gray-600" />;
  };

  const formatUtilityName = (utility) => {
    return utility
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatAmenityName = (amenity) => {
    return amenity
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#1F3A34] mx-auto mb-4" />
          <p className="text-gray-600">Loading lease details...</p>
        </div>
      </div>
    );
  }

  if (!lease) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-2xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
            <h3 className="text-lg font-semibold text-red-800">Lease Not Found</h3>
          </div>
          <p className="text-red-600 mb-4">The lease you're looking for could not be found.</p>
          <button
            onClick={() => router.push("/dashboard/tenant/leases")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Leases
          </button>
        </div>
      </div>
    );
  }

  const isSignedByLandlord = lease.signatures?.landlord?.signedAt;
  const canSignNow = isSignedByLandlord && lease.status === "signed_by_landlord";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                disabled={submitting}
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review Lease Agreement</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Please review all terms carefully before proceeding
                </p>
              </div>
            </div>
            
            {canSignNow && (
              <button
                onClick={handleSignNow}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <PenTool size={18} />
                Sign Now
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT COLUMN - Lease Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Important Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Important Notice</p>
                    <p className="text-sm text-blue-600 mt-1">
                      This is a legally binding document. Please review all terms carefully before approving. 
                      Once approved, the lease will be sent to the landlord for signature.
                    </p>
                  </div>
                </div>
              </div>

              {/* Lease Terms Section */}
              <div className="bg-white border rounded-xl">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection('terms')}
                >
                  <h2 className="text-xl font-semibold text-[#1F3A34]">Lease Terms & Conditions</h2>
                  {expandedSections.terms ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                
                {expandedSections.terms && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <DollarSign className="h-6 w-6 text-blue-600" />
                          <div>
                            <p className="text-sm text-gray-500">Monthly Rent</p>
                            <p className="text-2xl font-bold text-[#1F3A34]">
                              ${lease.rentAmount?.toLocaleString() ?? "0"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Due on day {lease.paymentSettings?.dueDate || 1} of each month
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Shield className="h-6 w-6 text-green-600" />
                          <div>
                            <p className="text-sm text-gray-500">Security Deposit</p>
                            <p className="text-2xl font-bold text-green-800">
                              ${lease.securityDeposit?.toLocaleString() ?? "0"}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">
                          Refundable at end of lease term
                        </p>
                      </div>

                      <div className="p-4 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="h-6 w-6 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-500">Lease Duration</p>
                            <p className="font-bold text-purple-800">
                              {lease.startDate 
                                ? new Date(lease.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : "N/A"} - {lease.endDate 
                                ? new Date(lease.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        {lease.startDate && lease.endDate && (
                          <p className="text-sm text-gray-600">
                            {Math.ceil((new Date(lease.endDate) - new Date(lease.startDate)) / (1000 * 60 * 60 * 24 * 30))} months
                          </p>
                        )}
                      </div>

                      {lease.lateFee && (
                        <div className="p-4 bg-orange-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Clock className="h-6 w-6 text-orange-600" />
                            <div>
                              <p className="text-sm text-gray-500">Late Fee</p>
                              <p className="text-xl font-bold text-orange-800">${lease.lateFee}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            After {lease.gracePeriod || 5} days grace period
                          </p>
                        </div>
                      )}

                      {lease.terms?.noticeDays && (
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="h-6 w-6 text-yellow-600" />
                            <div>
                              <p className="text-sm text-gray-500">Notice Period</p>
                              <p className="text-xl font-bold text-yellow-800">{lease.terms.noticeDays} days</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Required for termination
                          </p>
                        </div>
                      )}

                      {lease.terms?.occupants && (
                        <div className="p-4 bg-indigo-50 rounded-lg">
                          <div className="flex items-center gap-3 mb-3">
                            <Users className="h-6 w-6 text-indigo-600" />
                            <div>
                              <p className="text-sm text-gray-500">Max Occupants</p>
                              <p className="text-xl font-bold text-indigo-800">{lease.terms.occupants}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Maximum number of residents
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment Method */}
                    {lease.terms?.paymentMethod && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800 mb-2">Payment Method</p>
                        <p className="text-gray-600">
                          {lease.terms.paymentMethod === "bank_transfer" && "Bank Transfer"}
                          {lease.terms.paymentMethod === "check" && "Check"}
                          {lease.terms.paymentMethod === "cash" && "Cash"}
                          {lease.terms.paymentMethod === "online" && "Online Payment"}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Property Details Section */}
              <div className="bg-white border rounded-xl">
                <div 
                  className="p-6 cursor-pointer flex justify-between items-center"
                  onClick={() => toggleSection('property')}
                >
                  <h2 className="text-xl font-semibold text-[#1F3A34]">Property Details</h2>
                  {expandedSections.property ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                
                {expandedSections.property && (
                  <div className="px-6 pb-6 space-y-6">
                    {/* Property Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Home className="h-6 w-6 text-blue-600" />
                        <div>
                          <h3 className="font-bold text-lg">{lease.property?.title}</h3>
                          <p className="text-gray-600 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {lease.property?.address}
                          </p>
                        </div>
                      </div>

                      {/* Property Specifications */}
                      <div className="grid grid-cols-3 gap-4">
                        {lease.property?.bedrooms && (
                          <div className="text-center p-4 bg-blue-50 rounded-xl">
                            <Bed className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Bedrooms</p>
                            <p className="text-xl font-bold text-blue-800">{lease.property.bedrooms}</p>
                          </div>
                        )}
                        
                        {lease.property?.bathrooms && (
                          <div className="text-center p-4 bg-green-50 rounded-xl">
                            <Bath className="h-6 w-6 text-green-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Bathrooms</p>
                            <p className="text-xl font-bold text-green-800">{lease.property.bathrooms}</p>
                          </div>
                        )}
                        
                        {lease.property?.area && (
                          <div className="text-center p-4 bg-purple-50 rounded-xl">
                            <Ruler className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Area</p>
                            <p className="text-xl font-bold text-purple-800">{lease.property.area} sq ft</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Amenities */}
                    {lease.property?.amenities?.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Sparkles className="h-5 w-5 text-indigo-600" />
                          <h3 className="font-medium text-gray-800">Amenities Included</h3>
                          <span className="ml-2 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full">
                            {lease.property.amenities.length} amenities
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                          {lease.property.amenities.map((amenity, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                              <div className="flex-shrink-0">
                                {getAmenityIcon(amenity)}
                              </div>
                              <span className="text-sm font-medium text-gray-800">
                                {formatAmenityName(amenity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Utilities Section */}
              {(lease.utilities?.includedInRent?.length > 0 || lease.utilities?.paidByTenant?.length > 0) && (
                <div className="bg-white border rounded-xl">
                  <div 
                    className="p-6 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection('utilities')}
                  >
                    <h2 className="text-xl font-semibold text-[#1F3A34]">Utilities & Services</h2>
                    {expandedSections.utilities ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.utilities && (
                    <div className="px-6 pb-6">
                      {/* Included in Rent */}
                      {lease.utilities?.includedInRent?.length > 0 && (
                        <div className="mb-8">
                          <div className="flex items-center gap-2 mb-4">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                            <p className="font-medium text-green-700">Included in Rent</p>
                            <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {lease.utilities.includedInRent.length} items
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {lease.utilities.includedInRent.map((utility, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  {getUtilityIcon(utility)}
                                </div>
                                <span className="text-sm font-medium text-green-800">
                                  {formatUtilityName(utility)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Paid by Tenant */}
                      {lease.utilities?.paidByTenant?.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <p className="font-medium text-blue-700">Paid by Tenant</p>
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {lease.utilities.paidByTenant.length} items
                            </span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            {lease.utilities.paidByTenant.map((utility, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                              >
                                <div className="flex-shrink-0">
                                  {getUtilityIcon(utility)}
                                </div>
                                <span className="text-sm font-medium text-blue-800">
                                  {formatUtilityName(utility)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Additional Terms */}
              {lease.description && (
                <div className="bg-white border rounded-xl">
                  <div 
                    className="p-6 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSection('additional')}
                  >
                    <h2 className="text-xl font-semibold text-[#1F3A34]">Additional Terms & Conditions</h2>
                    {expandedSections.additional ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  
                  {expandedSections.additional && (
                    <div className="px-6 pb-6">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-line">
                          {lease.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN - Action Panel */}
            <div className="space-y-6">
              {/* Review Action Card */}
              <div className="bg-white border rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-4">Take Action</h2>
                
                <div className="space-y-4">
                  {/* Action Options */}
                  <div className="space-y-3">
                    <div 
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${action === "approve" ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-300"}`}
                      onClick={() => setAction("approve")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${action === "approve" ? "border-green-500 bg-green-500" : "border-gray-400"}`}>
                          {action === "approve" && <CheckCircle className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium">Approve Lease</p>
                          <p className="text-sm text-gray-600">
                            I agree to all terms and conditions
                          </p>
                        </div>
                      </div>
                    </div>

                    <div 
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${action === "request_changes" ? "border-yellow-500 bg-yellow-50" : "border-gray-300 hover:border-yellow-300"}`}
                      onClick={() => setAction("request_changes")}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${action === "request_changes" ? "border-yellow-500 bg-yellow-500" : "border-gray-400"}`}>
                          {action === "request_changes" && <Edit className="h-4 w-4 text-white" />}
                        </div>
                        <div>
                          <p className="font-medium">Request Changes</p>
                          <p className="text-sm text-gray-600">
                            I need modifications before approving
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Changes Textarea */}
                  {action === "request_changes" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        What changes do you need?
                      </label>
                      <textarea
                        rows={4}
                        value={changes}
                        onChange={(e) => setChanges(e.target.value)}
                        className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Please describe the specific changes you need..."
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        The landlord will review your request and update the lease accordingly.
                      </p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || (action === "request_changes" && !changes.trim())}
                    className={`w-full py-3 text-white rounded-lg font-medium flex items-center justify-center gap-2 ${action === "approve" ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : action === "approve" ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Approve Lease Agreement
                      </>
                    ) : (
                      <>
                        <Edit className="h-5 w-5" />
                        Submit Change Request
                      </>
                    )}
                  </button>

                  {/* Sign Now Button (if landlord already signed) */}
                  {canSignNow && (
                    <>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">OR</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleSignNow}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
                      >
                        <PenTool className="h-5 w-5" />
                        Sign Lease Now
                      </button>
                      
                      <p className="text-xs text-gray-500 text-center mt-2">
                        Landlord has already signed. You can sign directly.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Quick Info Card */}
              <div className="bg-white border rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4">Quick Info</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Lease Status</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${lease.status === "sent_to_tenant" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                      <div className={`h-2 w-2 rounded-full ${lease.status === "sent_to_tenant" ? "bg-purple-500" : "bg-blue-400"}`} />
                      {lease.status === "sent_to_tenant" ? "Awaiting Your Review" : "Under Review"}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Landlord Signature</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${isSignedByLandlord ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                      <div className={`h-2 w-2 rounded-full ${isSignedByLandlord ? "bg-green-500" : "bg-yellow-400"}`} />
                      {isSignedByLandlord ? "Signed" : "Not Signed Yet"}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Your Signature</p>
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${lease.signatures?.tenant?.signedAt ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                      <div className={`h-2 w-2 rounded-full ${lease.signatures?.tenant?.signedAt ? "bg-green-500" : "bg-gray-400"}`} />
                      {lease.signatures?.tenant?.signedAt ? "Signed" : "Not Signed"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}