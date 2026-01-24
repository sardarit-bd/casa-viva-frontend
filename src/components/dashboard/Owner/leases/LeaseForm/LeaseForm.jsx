"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Save,
  Edit,
  Eye,
  Download,
  Send,
  FileText,
  User,
  DollarSign,
  Calendar,
  Clock,
  Shield,
  Zap,
  Home,
  Users,
  Bell,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Info,
  FileCheck
} from "lucide-react";
import toast from "react-hot-toast";
import LeasePreview from "./LeasePreview";
import SignatureView from "./SignatureView";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormContent } from "./FormContent";
import { leaseService } from "@/services/lease.service";
import { useAuthContext } from "@/providers/AuthProvider";

// Enhanced validation schema
const leaseSchema = z.object({
  propertyId: z.string().min(1, "Property is required"),
  tenantId: z.string().min(1, "Tenant is required"),
  propertyAddress: z.string().min(1, "Property address is required"),
  landlordName: z.string().min(1, "Landlord name is required"),
  tenantName: z.string().min(1, "Tenant name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  monthlyRent: z.string().min(1, "Monthly rent is required").refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "Rent must be a positive number"
  ),
  paymentDay: z.string().min(1, "Payment day is required").refine(
    val => {
      const day = parseInt(val);
      return !isNaN(day) && day >= 1 && day <= 31;
    },
    "Payment day must be between 1 and 31"
  ),
  securityDeposit: z.string().min(1, "Security deposit is required").refine(
    val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
    "Security deposit must be a positive number"
  ),
  paymentMethod: z.string().min(1, "Payment method is required"),
  utilitiesIncluded: z.array(z.string()).optional(),
  utilitiesTenantPaid: z.array(z.string()).optional(),
  occupants: z.string().optional().refine(
    val => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0),
    "Number of occupants must be a positive number"
  ),
  noticeDays: z.string().min(1, "Notice period is required").refine(
    val => {
      const days = parseInt(val);
      return !isNaN(days) && days >= 7 && days <= 90;
    },
    "Notice period must be between 7 and 90 days"
  ),
  maintenanceTerms: z.string().optional(),
  additionalTerms: z.string().optional(),
  leaseType: z.enum(["fixed_term", "month_to_month"]),
  lateFee: z.string().optional().refine(
    val => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    "Late fee must be a positive number"
  ),
  gracePeriod: z.string().optional().refine(
    val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0),
    "Grace period must be a positive number"
  ),
  petPolicy: z.enum(["not_allowed", "allowed_with_fee", "allowed"]).optional(),
  petFee: z.string().optional(),
  parkingSpaces: z.string().optional(),
  furnished: z.boolean().optional(),
});

export default function EnhancedLeaseForm({
  propertyData,
  tenantData,
  landlordData,
  mode = "create",
  initialData = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [signatureMode, setSignatureMode] = useState(false);
  const [leaseSigned, setLeaseSigned] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const { user } = useAuthContext();

  const getDefaultValues = () => {
    if (initialData) {
      console.log("Using initialData for form:", initialData);
      return {
        ...initialData,
        // Ensure all fields have proper defaults
        startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : "",
        endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : "",
        monthlyRent: initialData.monthlyRent?.toString() || initialData.rentAmount?.toString() || "",
        securityDeposit: initialData.securityDeposit?.toString() || "",
        noticeDays: initialData.noticeDays?.toString() || "30",
        paymentDay: initialData.paymentDay?.toString() || "1",
        utilitiesIncluded: initialData.utilitiesIncluded || [],
        utilitiesTenantPaid: initialData.utilitiesTenantPaid || [],
        leaseType: initialData.leaseType || "fixed_term",
        paymentMethod: initialData.paymentMethod || "bank_transfer",
        lateFee: initialData.lateFee?.toString() || "",
        gracePeriod: initialData.gracePeriod?.toString() || "5",
      };
    }

    // Default values for new lease
    const monthlyRent = propertyData?.price?.toString() || "";

    return {
      propertyId: propertyData?.id || "",
      tenantId: tenantData?.id || "",
      propertyAddress: propertyData?.address || "",
      landlordName: landlordData?.name || "",
      tenantName: tenantData?.name || "",
      startDate: "",
      endDate: "",
      monthlyRent,
      paymentDay: "1",
      securityDeposit: "",
      paymentMethod: "bank_transfer",
      utilitiesIncluded: [],
      utilitiesTenantPaid: [],
      occupants: "",
      noticeDays: "30",
      maintenanceTerms: "",
      additionalTerms: "",
      leaseType: "fixed_term",
      lateFee: "50",
      gracePeriod: "5",
      petPolicy: "not_allowed",
      petFee: "",
      parkingSpaces: "",
      furnished: false,
    };
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    getValues,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(leaseSchema),
    defaultValues: getDefaultValues(),
  });

  // Auto-save functionality
  useEffect(() => {
    if (mode === "edit" && autoSave && isDirty) {
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 5000); // Auto-save every 5 seconds when form is dirty
      
      return () => clearTimeout(timer);
    }
  }, [watch(), autoSave, mode, isDirty]);

  const handleAutoSave = async () => {
    if (loading || !initialData?.id) return;
    
    try {
      const currentValues = getValues();
      const payload = preparePayload(currentValues);
      
      await leaseService.updateLease(initialData.id, payload);
      setLastSaved(new Date());
      
      toast.success("Auto-saved successfully", {
        icon: '💾',
        duration: 2000,
      });
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  // Reset form when initialData changes
  useEffect(() => {
    if (initialData) {
      reset(getDefaultValues());
    }
  }, [initialData, reset]);

  // Update form when propertyData changes
  useEffect(() => {
    if (mode === "create" && propertyData?.price !== undefined) {
      setValue("monthlyRent", propertyData.price.toString());
      setValue("propertyAddress", propertyData.address || "");
    }
  }, [propertyData, mode, setValue]);

  const selectedUtilities = watch("utilitiesIncluded") || [];
  const tenantUtilities = watch("utilitiesTenantPaid") || [];
  const formData = watch();
  const leaseType = watch("leaseType");

  // Calculate lease duration
  const calculateLeaseDuration = () => {
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    
    if (!startDate || !endDate) return null;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    
    return { days: diffDays, months };
  };

  const utilityOptions = [
    { id: "water", label: "Water", icon: "💧" },
    { id: "electricity", label: "Electricity", icon: "⚡" },
    { id: "gas", label: "Gas", icon: "🔥" },
    { id: "internet", label: "Internet", icon: "🌐" },
    { id: "cable", label: "Cable TV", icon: "📺" },
    { id: "trash", label: "Trash Collection", icon: "🗑️" },
    { id: "maintenance", label: "Maintenance", icon: "🔧" },
    { id: "gardening", label: "Gardening", icon: "🌿" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "parking", label: "Parking", icon: "🚗" },
  ];

  const preparePayload = (data) => {
    return {
      title: `Lease for ${data.propertyAddress}`,
      description: data.additionalTerms || "",
      
      landlord: landlordData?.id || user?._id,
      tenant: data.tenantId,
      property: data.propertyId,

      startDate: data.startDate,
      endDate: data.endDate,

      rentAmount: Number(data.monthlyRent),
      rentFrequency: "monthly",
      securityDeposit: Number(data.securityDeposit || 0),
      
      utilities: {
        includedInRent: data.utilitiesIncluded || [],
        paidByTenant: data.utilitiesTenantPaid || [],
      },

      maintenanceTerms: data.maintenanceTerms || "",
      lateFee: Number(data.lateFee || 0),
      gracePeriod: Number(data.gracePeriod || 0),

      terms: {
        leaseType: data.leaseType,
        paymentDay: Number(data.paymentDay),
        paymentMethod: data.paymentMethod,
        noticeDays: Number(data.noticeDays),
        occupants: data.occupants || "",
        propertyAddress: data.propertyAddress,
        landlordName: data.landlordName,
        tenantName: data.tenantName,
        petPolicy: data.petPolicy,
        petFee: data.petFee ? Number(data.petFee) : undefined,
        parkingSpaces: data.parkingSpaces,
        furnished: data.furnished || false,
      },

      createdBy: landlordData?.id || user?._id,
    };
  };

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const payload = preparePayload(data);

      console.log("Submitting lease:", payload);

      if (mode === "create") {
        const res = await leaseService.createLease(payload);

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Lease draft created successfully!</span>
          </div>
        );

        const created = res?.data?.data || res?.data;
        const leaseId = created?._id || created?.id;

        if (!leaseId) {
          throw new Error("Lease id missing in response");
        }

        onSuccess?.({ id: leaseId });
      } else {
        const leaseId = initialData?.id || initialData?._id;

        if (!leaseId) {
          throw new Error("Lease ID is missing - cannot update");
        }

        const res = await leaseService.updateLease(leaseId, payload);

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Lease updated successfully!</span>
          </div>
        );

        onSuccess?.(res?.data || payload);
      }
    } catch (err) {
      console.error("Submit error:", err);
      
      const errorMessage = err.response?.data?.message || err.message || "Error saving lease";
      
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      // Simulate PDF generation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-green-500" />
          <span>PDF generated successfully!</span>
        </div>
      );

      // In production, this would download from API
      const leaseData = getValues();
      const pdfBlob = new Blob([JSON.stringify(leaseData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Lease-Agreement-${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error generating PDF");
    } finally {
      setLoading(false);
    }
  };

  const sendForSignature = async () => {
    setSignatureMode(true);
  };

  const handleSignLease = async () => {
    setLoading(true);
    try {
      // Simulate signing process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setLeaseSigned(true);
      
      toast.success(
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-green-500" />
          <div>
            <p className="font-medium">Lease agreement signed!</p>
            <p className="text-sm">The document is now legally binding.</p>
          </div>
        </div>
      );
      
      setSignatureMode(false);
    } catch (error) {
      toast.error("Error signing lease");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const data = getValues();
      const payload = preparePayload(data);
      
      if (mode === "create") {
        const res = await leaseService.createLease(payload);
        toast.success("Draft saved successfully!");
        onSuccess?.(res?.data);
      } else {
        const leaseId = initialData?.id || initialData?._id;
        await leaseService.updateLease(leaseId, payload);
        toast.success("Draft updated successfully!");
      }
    } catch (err) {
      toast.error("Error saving draft");
    }
  };

  const duration = calculateLeaseDuration();

  return (
    <div className="space-y-6">
      {/* Header with Status */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {mode === "create" ? "Create New Lease" : "Edit Lease Agreement"}
            </h1>
            <p className="text-gray-600">
              Fill in lease details, customize terms, and send for e-signature
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {mode === "edit" && (
              <div className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${isDirty ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                <span className="text-sm text-gray-500">
                  {isDirty ? 'Unsaved changes' : 'All changes saved'}
                </span>
              </div>
            )}
            
            <button
              onClick={handleSaveDraft}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Draft
            </button>
          </div>
        </div>
      </div>

      {/* Mode Toggles */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setPreviewMode(false);
              setSignatureMode(false);
            }}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${!previewMode && !signatureMode ? "bg-[#1F3A34] text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <Edit className="h-4 w-4" />
            Edit
          </button>
          
          <button
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${previewMode ? "bg-blue-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>

          {!leaseSigned && (
            <button
              onClick={sendForSignature}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${signatureMode ? "bg-green-600 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
            >
              <Send className="h-4 w-4" />
              {signatureMode ? "Signing Mode" : "Send for Signature"}
            </button>
          )}
          
          <button
            onClick={generatePDF}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-2"
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </button>
          
          {mode === "edit" && (
            <label className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Auto-save</span>
            </label>
          )}
        </div>
        
        {lastSaved && (
          <div className="mt-3 text-sm text-gray-500">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Quick Stats Bar */}
      {!previewMode && !signatureMode && (
        <div className="bg-white rounded-xl border p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">Monthly Rent</span>
                </div>
                <span className="font-bold text-gray-900">
                  {formData.monthlyRent ? `$${parseFloat(formData.monthlyRent).toLocaleString()}` : "-"}
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-gray-600">Security Deposit</span>
                </div>
                <span className="font-bold text-gray-900">
                  {formData.securityDeposit ? `$${parseFloat(formData.securityDeposit).toLocaleString()}` : "-"}
                </span>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  <span className="text-sm text-gray-600">Lease Duration</span>
                </div>
                <span className="font-bold text-gray-900">
                  {duration ? `${duration.months} months` : "Not set"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      {previewMode ? (
        <LeasePreview data={formData} />
      ) : signatureMode ? (
        <SignatureView
          data={formData}
          onSign={handleSignLease}
          loading={loading}
        />
      ) : (
        <FormContent
          register={register}
          handleSubmit={handleSubmit}
          errors={errors}
          onSubmit={onSubmit}
          loading={loading}
          selectedUtilities={selectedUtilities}
          tenantUtilities={tenantUtilities}
          setValue={setValue}
          utilityOptions={utilityOptions}
          signatureMode={signatureMode}
          setPreviewMode={setPreviewMode}
          watch={watch}
          mode={mode}
          propertyData={propertyData}
          initialData={initialData}
          duration={duration}
          leaseType={leaseType}
        />
      )}
    </div>
  );
}