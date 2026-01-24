"use client";

import React from "react";
import {
  CheckCircle,
  Clock,
  FileText,
  AlertCircle,
  Send,
  Edit,
  XCircle,
  Home,
  UserCheck,
  FileCheck,
  Calendar,
  ChevronRight
} from "lucide-react";

const LeaseStatusTimeline = ({ lease }) => {
  if (!lease?.statusHistory?.length) {
    return (
      <div className="bg-white border rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Status Timeline</h3>
        <p className="text-gray-500 text-sm">No status history available</p>
      </div>
    );
  }

  // Sort by date (newest first)
  const sortedHistory = [...lease.statusHistory].sort(
    (a, b) => new Date(b.changedAt) - new Date(a.changedAt)
  );

  // Get status icon and color
  const getStatusConfig = (status) => {
    const config = {
      pending_request: {
        icon: <Clock className="h-5 w-5 text-yellow-600" />,
        color: "text-yellow-600 bg-yellow-50",
        borderColor: "border-yellow-200",
        label: "Pending Request"
      },
      under_review: {
        icon: <FileText className="h-5 w-5 text-orange-600" />,
        color: "text-orange-600 bg-orange-50",
        borderColor: "border-orange-200",
        label: "Under Review"
      },
      approved: {
        icon: <CheckCircle className="h-5 w-5 text-blue-600" />,
        color: "text-blue-600 bg-blue-50",
        borderColor: "border-blue-200",
        label: "Approved"
      },
      draft: {
        icon: <Edit className="h-5 w-5 text-gray-600" />,
        color: "text-gray-600 bg-gray-50",
        borderColor: "border-gray-200",
        label: "Draft"
      },
      sent_to_tenant: {
        icon: <Send className="h-5 w-5 text-purple-600" />,
        color: "text-purple-600 bg-purple-50",
        borderColor: "border-purple-200",
        label: "Sent to Tenant"
      },
      changes_requested: {
        icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
        color: "text-orange-600 bg-orange-50",
        borderColor: "border-orange-200",
        label: "Changes Requested"
      },
      sent_to_landlord: {
        icon: <Send className="h-5 w-5 text-blue-600" />,
        color: "text-blue-600 bg-blue-50",
        borderColor: "border-blue-200",
        label: "Sent to Landlord"
      },
      signed_by_landlord: {
        icon: <UserCheck className="h-5 w-5 text-indigo-600" />,
        color: "text-indigo-600 bg-indigo-50",
        borderColor: "border-indigo-200",
        label: "Landlord Signed"
      },
      signed_by_tenant: {
        icon: <UserCheck className="h-5 w-5 text-green-600" />,
        color: "text-green-600 bg-green-50",
        borderColor: "border-green-200",
        label: "Tenant Signed"
      },
      fully_executed: {
        icon: <FileCheck className="h-5 w-5 text-green-600" />,
        color: "text-green-600 bg-green-50",
        borderColor: "border-green-200",
        label: "Fully Executed"
      },
      active: {
        icon: <Home className="h-5 w-5 text-green-600" />,
        color: "text-green-600 bg-green-50",
        borderColor: "border-green-200",
        label: "Active"
      },
      cancelled: {
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        color: "text-red-600 bg-red-50",
        borderColor: "border-red-200",
        label: "Cancelled"
      },
      expired: {
        icon: <Calendar className="h-5 w-5 text-gray-600" />,
        color: "text-gray-600 bg-gray-50",
        borderColor: "border-gray-200",
        label: "Expired"
      },
      rejected: {
        icon: <XCircle className="h-5 w-5 text-red-600" />,
        color: "text-red-600 bg-red-50",
        borderColor: "border-red-200",
        label: "Rejected"
      }
    };

    return config[status] || {
      icon: <FileText className="h-5 w-5 text-gray-600" />,
      color: "text-gray-600 bg-gray-50",
      borderColor: "border-gray-200",
      label: status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
  };

  return (
    <div className="bg-white border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="h-5 w-5 text-gray-500" />
        Status Timeline
      </h3>

      <div className="space-y-4">
        {sortedHistory.map((item, index) => {
          const config = getStatusConfig(item.status);
          const isCurrent = index === 0;
          const date = new Date(item.changedAt);
          const formattedDate = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });
          const formattedTime = date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          });

          return (
            <div key={index} className="relative">
              {/* Timeline line except for last item */}
              {index !== sortedHistory.length - 1 && (
                <div className="absolute left-5 top-8 bottom-0 w-0.5 bg-gray-200" />
              )}

              <div className="flex gap-4">
                {/* Timeline dot */}
                <div className={`relative z-10 flex-shrink-0 ${isCurrent ? 'mt-1' : 'mt-1.5'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.color} ${config.borderColor} border-2 ${isCurrent ? 'ring-2 ring-offset-2 ring-opacity-50' : ''}`}>
                    {config.icon}
                  </div>
                  {isCurrent && (
                    <div className="absolute -top-1 -right-1">
                      <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="h-2 w-2 bg-white rounded-full" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div>
                      <h4 className={`font-semibold ${isCurrent ? 'text-gray-900' : 'text-gray-700'}`}>
                        {config.label}
                      </h4>
                      {item.changedBy?.name && (
                        <p className="text-sm text-gray-500 mt-1">
                          By {item.changedBy.name}
                        </p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span>{formattedDate}</span>
                      <span className="mx-2">•</span>
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  {item.reason && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        {item.reason}
                      </p>
                    </div>
                  )}

                  {/* Show signatures if applicable */}
                  {item.status === 'signed_by_landlord' && lease.signatures?.landlord && (
                    <div className="mt-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                      <p className="text-sm text-blue-800 font-medium">Landlord Signed</p>
                      <p className="text-xs text-blue-600 mt-1">
                        Signed at: {new Date(lease.signatures.landlord.signedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {item.status === 'signed_by_tenant' && lease.signatures?.tenant && (
                    <div className="mt-3 bg-green-50 p-3 rounded-lg border border-green-100">
                      <p className="text-sm text-green-800 font-medium">You Signed</p>
                      <p className="text-xs text-green-600 mt-1">
                        Signed at: {new Date(lease.signatures.tenant.signedAt).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Current Status</p>
            <p className="font-semibold text-lg text-gray-900">
              {getStatusConfig(lease.status).label}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Last Updated</p>
            <p className="font-medium text-gray-900">
              {new Date(lease.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaseStatusTimeline;