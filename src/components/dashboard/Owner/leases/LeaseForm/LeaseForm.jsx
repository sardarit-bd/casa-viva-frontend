'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Save,
  Edit,
  Eye,
  Download,
  Send,
  FileText,
  User,
  DollarSign
} from 'lucide-react';
import toast from 'react-hot-toast';
import LeasePreview from './LeasePreview';
import SignatureView from './SignatureView';

// Validation schema
const leaseSchema = z.object({
  propertyAddress: z.string().min(1, 'Property address is required'),
  landlordName: z.string().min(1, 'Landlord name is required'),
  tenantName: z.string().min(1, 'Tenant name is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  monthlyRent: z.string().min(1, 'Monthly rent is required'),
  paymentDay: z.string().min(1, 'Payment day is required'),
  securityDeposit: z.string().min(1, 'Security deposit is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  utilitiesIncluded: z.array(z.string()).optional(),
  utilitiesTenantPaid: z.array(z.string()).optional(),
  occupants: z.string().optional(),
  noticeDays: z.string().min(1, 'Notice period is required'),
  additionalTerms: z.string().optional(),
  leaseType: z.enum(['fixed_term', 'month_to_month']),
});

export default function LeaseForm({ 
  propertyData, 
  tenantData, 
  landlordData,
  mode = 'create',
  initialData = null 
}) {
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [signatureMode, setSignatureMode] = useState(false);
  const [leaseSigned, setLeaseSigned] = useState(false);

  const defaultValues = initialData || {
    propertyAddress: propertyData?.address || '',
    landlordName: landlordData?.name || '',
    tenantName: tenantData?.name || '',
    startDate: '',
    endDate: '',
    monthlyRent: propertyData?.rent || '',
    paymentDay: '1',
    securityDeposit: '',
    paymentMethod: 'bank_transfer',
    utilitiesIncluded: ['water', 'electricity'],
    utilitiesTenantPaid: ['internet', 'cable'],
    occupants: '',
    noticeDays: '30',
    additionalTerms: '',
    leaseType: 'fixed_term',
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaseSchema),
    defaultValues,
  });

  const selectedUtilities = watch('utilitiesIncluded') || [];
  const tenantUtilities = watch('utilitiesTenantPaid') || [];
  const formData = watch();

  const utilityOptions = [
    { id: 'water', label: 'Water' },
    { id: 'electricity', label: 'Electricity' },
    { id: 'gas', label: 'Gas' },
    { id: 'internet', label: 'Internet' },
    { id: 'cable', label: 'Cable TV' },
    { id: 'trash', label: 'Trash Collection' },
    { id: 'maintenance', label: 'Maintenance Fee' },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'create') {
        toast.success('Lease draft created successfully!');
      } else {
        toast.success('Lease updated successfully!');
      }
      
      if (signatureMode) {
        toast.success('Lease sent to tenant for signature!');
        setSignatureMode(false);
      }
    } catch (error) {
      toast.error('Error saving lease');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('PDF generated successfully!');
      
      const blob = new Blob(['Simulated PDF content'], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Lease-Agreement-${new Date().getTime()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error generating PDF');
    } finally {
      setLoading(false);
    }
  };

  const sendForSignature = async () => {
    setSignatureMode(true);
    toast.success('Ready to send for signature! Click "Save & Send" to proceed.');
  };

  const handleSignLease = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLeaseSigned(true);
      toast.success('Lease signed successfully!');
    } catch (error) {
      toast.error('Error signing lease');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1F3A34] mb-2">
          {mode === 'create' ? 'Create New Lease' : 'Edit Lease Agreement'}
        </h1>
        <p className="text-gray-600">
          Fill in lease details, customize terms, and send for e-signature
        </p>
      </div>

      {/* Mode Toggles */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => {
            setPreviewMode(false);
            setSignatureMode(false);
          }}
          className={`px-4 py-2 rounded-lg ${!previewMode && !signatureMode ? 'bg-[#1F3A34] text-white' : 'bg-gray-100'}`}
        >
          <Edit className="inline-block mr-2 h-4 w-4" />
          Edit
        </button>
        <button
          onClick={() => setPreviewMode(true)}
          className={`px-4 py-2 rounded-lg ${previewMode ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
        >
          <Eye className="inline-block mr-2 h-4 w-4" />
          Preview
        </button>
        
        {!leaseSigned && (
          <button
            onClick={sendForSignature}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
          >
            <Send className="inline-block mr-2 h-4 w-4" />
            Send for Signature
          </button>
        )}
        <button
          onClick={generatePDF}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          disabled={loading}
        >
          <Download className="inline-block mr-2 h-4 w-4" />
          Download PDF
        </button>
      </div>

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
        />
      )}
    </div>
  );
}

// Sub-component for form content
function FormContent({
  register,
  handleSubmit,
  errors,
  onSubmit,
  loading,
  selectedUtilities,
  tenantUtilities,
  setValue,
  utilityOptions,
  signatureMode,
  setPreviewMode
}) {
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <FileText className="mr-3 h-5 w-5" />
          Basic Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Property Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Address *
            </label>
            <input
              {...register('propertyAddress')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#1F3A34] focus:border-transparent"
              placeholder="Full property address"
            />
            {errors.propertyAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.propertyAddress.message}</p>
            )}
          </div>

          {/* Lease Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lease Type *
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="fixed_term"
                  {...register('leaseType')}
                  className="mr-2"
                />
                Fixed Term
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="month_to_month"
                  {...register('leaseType')}
                  className="mr-2"
                />
                Month-to-Month
              </label>
            </div>
          </div>

          {/* Dates */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              {...register('startDate')}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date *
            </label>
            <input
              type="date"
              {...register('endDate')}
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Parties Information */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <User className="mr-3 h-5 w-5" />
          Parties Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Landlord Name *
            </label>
            <input
              {...register('landlordName')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Full name of landlord"
            />
            {errors.landlordName && (
              <p className="text-red-500 text-sm mt-1">{errors.landlordName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant Name(s) *
            </label>
            <input
              {...register('tenantName')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Full name(s) of tenant(s)"
            />
            {errors.tenantName && (
              <p className="text-red-500 text-sm mt-1">{errors.tenantName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occupants
            </label>
            <textarea
              {...register('occupants')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="List all occupants (e.g., John Doe, Jane Doe)"
              rows="3"
            />
          </div>
        </div>
      </div>

      {/* Financial Terms */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6 flex items-center">
          <DollarSign className="mr-3 h-5 w-5" />
          Financial Terms
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Monthly Rent *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                {...register('monthlyRent')}
                className="w-full pl-8 pr-4 py-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            {errors.monthlyRent && (
              <p className="text-red-500 text-sm mt-1">{errors.monthlyRent.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Day *
            </label>
            <select
              {...register('paymentDay')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Security Deposit *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2">$</span>
              <input
                {...register('securityDeposit')}
                className="w-full pl-8 pr-4 py-2 border rounded-lg"
                placeholder="0.00"
              />
            </div>
            {errors.securityDeposit && (
              <p className="text-red-500 text-sm mt-1">{errors.securityDeposit.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              {...register('paymentMethod')}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="digital_payment">Digital Payment</option>
              <option value="check">Check</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Utilities */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6">Utilities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-gray-700 mb-4">Included in Rent</h3>
            <div className="space-y-2">
              {utilityOptions.map(utility => (
                <label key={utility.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={utility.id}
                    checked={selectedUtilities.includes(utility.id)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...selectedUtilities, utility.id]
                        : selectedUtilities.filter(id => id !== utility.id);
                      setValue('utilitiesIncluded', newValue);
                    }}
                    className="mr-3"
                  />
                  {utility.label}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-700 mb-4">Paid by Tenant</h3>
            <div className="space-y-2">
              {utilityOptions.map(utility => (
                <label key={utility.id} className="flex items-center">
                  <input
                    type="checkbox"
                    value={utility.id}
                    checked={tenantUtilities.includes(utility.id)}
                    onChange={(e) => {
                      const newValue = e.target.checked
                        ? [...tenantUtilities, utility.id]
                        : tenantUtilities.filter(id => id !== utility.id);
                      setValue('utilitiesTenantPaid', newValue);
                    }}
                    className="mr-3"
                  />
                  {utility.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Terms */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-[#1F3A34] mb-6">
          Additional Terms & Conditions
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notice Period (Days) *
            </label>
            <input
              {...register('noticeDays')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="30"
            />
            {errors.noticeDays && (
              <p className="text-red-500 text-sm mt-1">{errors.noticeDays.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Terms (Optional)
            </label>
            <textarea
              {...register('additionalTerms')}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="Add any custom terms or conditions here..."
              rows="6"
            />
            <p className="text-sm text-gray-500 mt-2">
              This section is editable by both parties before signing
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 pt-6 border-t">
        <button
          type="button"
          onClick={() => setPreviewMode(true)}
          className="px-6 py-3 border rounded-lg hover:bg-gray-50"
        >
          Preview
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-[#1F3A34] text-white rounded-lg hover:bg-[#2a4d45] disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Saving...
            </>
          ) : (
            <>
              <Save className="inline-block mr-2 h-4 w-4" />
              {signatureMode ? 'Save & Send for Signature' : 'Save Draft'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}