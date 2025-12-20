// hooks/useLeaseSignature.js
import { useState } from 'react';

export function useLeaseSignature() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendForSignature = async (leaseId, recipientEmail) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/leases/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaseId,
          recipientEmail,
          action: 'send_for_signature',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send for signature');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signLease = async (leaseId, signatureData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/leases/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leaseId,
          signature: signatureData.signature,
          ipAddress: signatureData.ip,
          timestamp: new Date().toISOString(),
          action: 'sign',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to sign lease');
      }

      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSignatureStatus = async (leaseId) => {
    try {
      const response = await fetch(`/api/leases/${leaseId}/status`);
      if (!response.ok) {
        throw new Error('Failed to get signature status');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    loading,
    error,
    sendForSignature,
    signLease,
    getSignatureStatus,
  };
}