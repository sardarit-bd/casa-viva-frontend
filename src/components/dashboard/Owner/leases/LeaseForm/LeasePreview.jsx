'use client';

import React from 'react';

export default function LeasePreview({ data }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1F3A34]">RESIDENTIAL LEASE AGREEMENT</h1>
        <p className="text-gray-600 mt-2">This Residential Lease Agreement ("Agreement") is made on {formatDate(new Date())}</p>
      </div>

      <div className="space-y-8">
        {/* Section 1: Property */}
        <section>
          <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">1. PROPERTY</h2>
          <p className="text-gray-700">
            The Landlord hereby leases to the Tenant the residential property located at:
          </p>
          <p className="font-medium text-gray-900 mt-2">
            {data.propertyAddress || '[Property Address]'}
          </p>
        </section>

        {/* Section 2: Lease Term */}
        <section>
          <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">2. LEASE TERM</h2>
          <p className="text-gray-700">
            The lease shall begin on <span className="font-medium">{formatDate(data.startDate)}</span> and end on <span className="font-medium">{formatDate(data.endDate)}</span>.
          </p>
          <div className="mt-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.leaseType === 'fixed_term'}
                readOnly
                className="mr-2"
              />
              Fixed-term lease
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={data.leaseType === 'month_to_month'}
                readOnly
                className="mr-2"
              />
              Month-to-month lease
            </label>
          </div>
        </section>

        {/* Section 3: Rent */}
        <section>
          <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">3. RENT</h2>
          <p className="text-gray-700">
            The Tenant agrees to pay rent in the amount of:
          </p>
          <p className="font-medium text-gray-900 mt-2">
            Monthly Rent: {formatCurrency(data.monthlyRent)}
          </p>
          <p className="text-gray-700 mt-2">
            Rent is due on the <span className="font-medium">{data.paymentDay}</span> of each month.
          </p>
          <p className="text-gray-700">
            Payment Method: <span className="font-medium">{data.paymentMethod?.replace('_', ' ').toUpperCase() || 'Bank Transfer'}</span>
          </p>
        </section>

        {/* Section 4: Security Deposit */}
        <section>
          <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">4. SECURITY DEPOSIT</h2>
          <p className="text-gray-700">
            The Tenant shall pay a security deposit of:
          </p>
          <p className="font-medium text-gray-900 mt-2">
            Deposit Amount: {formatCurrency(data.securityDeposit)}
          </p>
          <p className="text-gray-700 mt-2">
            The deposit will be returned at the end of the lease, subject to deductions for damages beyond normal wear and tear.
          </p>
        </section>

        {/* Section 5: Utilities */}
        <section>
          <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">5. UTILITIES</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Included in Rent:</h4>
              <ul className="text-gray-600 list-disc pl-4">
                {data.utilitiesIncluded?.map(util => (
                  <li key={util}>{util.charAt(0).toUpperCase() + util.slice(1)}</li>
                )) || <li>None specified</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Paid by Tenant:</h4>
              <ul className="text-gray-600 list-disc pl-4">
                {data.utilitiesTenantPaid?.map(util => (
                  <li key={util}>{util.charAt(0).toUpperCase() + util.slice(1)}</li>
                )) || <li>None specified</li>}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 6: Notice Period */}
        <section>
          <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">6. NOTICE PERIOD</h2>
          <p className="text-gray-700">
            Either party must provide <span className="font-medium">{data.noticeDays || '30'}</span> days written notice prior to termination.
          </p>
        </section>

        {/* Section 7: Additional Terms */}
        {data.additionalTerms && (
          <section>
            <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">7. ADDITIONAL TERMS</h2>
            <p className="text-gray-700 whitespace-pre-line">{data.additionalTerms}</p>
          </section>
        )}

        {/* Section 8: Occupants */}
        {data.occupants && (
          <section>
            <h2 className="text-lg font-semibold text-[#1F3A34] mb-3">8. OCCUPANTS</h2>
            <p className="text-gray-700">
              The property shall be occupied only by: {data.occupants}
            </p>
          </section>
        )}
        
        {/* Signatures Section */}
        <section className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">LANDLORD</h3>
              <p className="text-gray-700 mb-2">Name: {data.landlordName || '[Landlord Name]'}</p>
              <div className="mt-6">
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-gray-500 text-sm">Signature: ________________</p>
                  <p className="text-gray-500 text-sm mt-2">Date: ________________</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">TENANT</h3>
              <p className="text-gray-700 mb-2">Name: {data.tenantName || '[Tenant Name]'}</p>
              <div className="mt-6">
                <div className="border-t border-gray-300 pt-4">
                  <p className="text-gray-500 text-sm">Signature: ________________</p>
                  <p className="text-gray-500 text-sm mt-2">Date: ________________</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}