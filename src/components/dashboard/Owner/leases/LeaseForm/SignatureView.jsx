'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

export default function SignatureView({ data, onSign, loading }) {
  const [tenantAgreed, setTenantAgreed] = useState(false);
  const [signature, setSignature] = useState('');

  return (
    <div className="bg-white rounded-xl shadow-lg border p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#1F3A34]">LEASE AGREEMENT - E-SIGNATURE</h1>
        <p className="text-gray-600 mt-2">Review and sign the lease agreement below</p>
      </div>

      <div className="space-y-6">
        {/* Agreement Summary */}
        <div className="bg-blue-50 p-6 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-4">Agreement Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Property</p>
              <p className="font-medium">{data.propertyAddress}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Monthly Rent</p>
              <p className="font-medium">${data.monthlyRent}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lease Term</p>
              <p className="font-medium">
                {new Date(data.startDate).toLocaleDateString()} - {new Date(data.endDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Security Deposit</p>
              <p className="font-medium">${data.securityDeposit}</p>
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="p-6 border rounded-lg">
          <label className="flex items-start">
            <input
              type="checkbox"
              checked={tenantAgreed}
              onChange={(e) => setTenantAgreed(e.target.checked)}
              className="mt-1 mr-3"
            />
            <div>
              <p className="font-medium text-gray-900">
                I have read and agree to all terms and conditions of this lease agreement
              </p>
              <p className="text-sm text-gray-600 mt-2">
                By checking this box and providing your signature, you agree to be legally bound by all terms of this agreement.
              </p>
            </div>
          </label>
        </div>

        {/* Signature Pad */}
        <div className="p-6 border rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4">Your Signature</h3>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 mb-4">
            {signature ? (
              <p className="text-3xl font-signature text-center">{signature}</p>
            ) : (
              <p className="text-gray-400 text-center mt-16">Draw your signature above</p>
            )}
          </div>
          <input
            type="text"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            placeholder="Type your full name as signature"
            className="w-full px-4 py-2 border rounded-lg mb-4"
          />
          <p className="text-sm text-gray-500">
            You can type your name or draw your signature in the box above
          </p>
        </div>

        {/* Sign Button */}
        <div className="text-center pt-6 border-t">
          <button
            onClick={onSign}
            disabled={!tenantAgreed || !signature || loading}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <span className="animate-spin mr-2">⟳</span>
                Signing...
              </>
            ) : (
              <>
                <CheckCircle className="inline-block mr-2 h-5 w-5" />
                Sign Lease Agreement
              </>
            )}
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Your IP address and timestamp will be recorded for security purposes
          </p>
        </div>
      </div>
    </div>
  );
}