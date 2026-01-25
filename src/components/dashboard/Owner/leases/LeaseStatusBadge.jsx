'use client';

import React from 'react';
import {
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  XCircle,
  Edit,
  Send,
  FileSignature,
  Shield,
  Calendar,
  RefreshCw,
  Ban
} from 'lucide-react';

const statusConfig = {
  pending_request: {
    label: 'Pending Approval',
    icon: <Clock className="h-3 w-3" />,
    color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconColor: 'text-yellow-600',
    description: 'Waiting for landlord approval'
  },
  // Draft Status
  draft: {
    label: 'Draft',
    icon: <Edit className="h-3 w-3" />,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600',
    description: 'Lease is in draft mode'
  },

  // Sent for Signature
  sent_to_tenant: {
    label: 'Sent for Signature',
    icon: <Send className="h-3 w-3" />,
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Sent to tenant for signature'
  },
  sent_to_landlord: {
    label: 'Sent to Landlord',
    icon: <Send className="h-3 w-3" />,
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    iconColor: 'text-blue-600',
    description: 'Sent to landlord for signature'
  },

  // Signature in Progress
  awaiting_signature: {
    label: 'Awaiting Signature',
    icon: <Clock className="h-3 w-3" />,
    color: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconColor: 'text-yellow-600',
    description: 'Waiting for signatures'
  },
  partially_signed: {
    label: 'Partially Signed',
    icon: <FileSignature className="h-3 w-3" />,
    color: 'bg-purple-50 text-purple-800 border-purple-200',
    iconColor: 'text-purple-600',
    description: 'Partially signed by parties'
  },

  // Signed Status
  signed_by_tenant: {
    label: 'Tenant Signed',
    icon: <CheckCircle className="h-3 w-3" />,
    color: 'bg-green-50 text-green-800 border-green-200',
    iconColor: 'text-green-600',
    description: 'Signed by tenant'
  },
  signed_by_landlord: {
    label: 'Landlord Signed',
    icon: <CheckCircle className="h-3 w-3" />,
    color: 'bg-green-50 text-green-800 border-green-200',
    iconColor: 'text-green-600',
    description: 'Signed by landlord'
  },
  fully_executed: {
    label: 'Fully Executed',
    icon: <Shield className="h-3 w-3" />,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconColor: 'text-emerald-600',
    description: 'Fully signed and active'
  },

  // Changes Requested
  changes_requested: {
    label: 'Changes Requested',
    icon: <AlertCircle className="h-3 w-3" />,
    color: 'bg-orange-50 text-orange-800 border-orange-200',
    iconColor: 'text-orange-600',
    description: 'Changes requested by party'
  },
  under_review: {
    label: 'Under Review',
    icon: <FileText className="h-3 w-3" />,
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    iconColor: 'text-amber-600',
    description: 'Currently under review'
  },

  // Cancelled/Expired
  cancelled: {
    label: 'Cancelled',
    icon: <XCircle className="h-3 w-3" />,
    color: 'bg-red-50 text-red-800 border-red-200',
    iconColor: 'text-red-600',
    description: 'Lease has been cancelled'
  },
  expired: {
    label: 'Expired',
    icon: <Calendar className="h-3 w-3" />,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600',
    description: 'Lease term has expired'
  },
  terminated: {
    label: 'Terminated',
    icon: <Ban className="h-3 w-3" />,
    color: 'bg-red-100 text-red-800 border-red-200',
    iconColor: 'text-red-600',
    description: 'Lease was terminated early'
  },

  // Renewal Status
  renewal_pending: {
    label: 'Renewal Pending',
    icon: <RefreshCw className="h-3 w-3" />,
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    iconColor: 'text-indigo-600',
    description: 'Renewal is pending'
  },
  renewal_offered: {
    label: 'Renewal Offered',
    icon: <RefreshCw className="h-3 w-3" />,
    color: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    iconColor: 'text-indigo-600',
    description: 'Renewal has been offered'
  },

  // Default
  default: {
    label: 'Unknown',
    icon: <AlertCircle className="h-3 w-3" />,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    iconColor: 'text-gray-600',
    description: 'Status unknown'
  }
};

// Progress indicators for multi-step statuses
const progressConfig = {
  sent_to_tenant: {
    progress: 1,
    total: 3,
    steps: ['Drafted', 'Sent', 'Signed']
  },
  signed_by_tenant: {
    progress: 2,
    total: 3,
    steps: ['Drafted', 'Sent', 'Signed']
  },
  fully_executed: {
    progress: 3,
    total: 3,
    steps: ['Drafted', 'Sent', 'Signed']
  }
};

export default function LeaseStatusBadge({
  status,
  showProgress = false,
  size = 'md',
  className = ''
}) {
  const config = statusConfig[status] || statusConfig.default;
  const progress = progressConfig[status];

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex flex-col gap-1 ${className}`}>
      {/* Main Badge */}
      <div className={`inline-flex items-center gap-2 ${sizeClasses[size]} rounded-full border ${config.color}`}>
        <span className={config.iconColor}>
          {config.icon}
        </span>
        <span className="font-medium">{config.label}</span>
      </div>

      {/* Progress Bar (if enabled and available) */}
      {showProgress && progress && (
        <div className="mt-1">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-1">
            {progress.steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div className={`h-2 w-2 rounded-full ${index < progress.progress ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="text-xs text-gray-500 mt-1">{step}</span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(progress.progress / progress.total) * 100}%` }}
            />
          </div>

          {/* Progress Text */}
          <div className="text-xs text-gray-500 text-center mt-1">
            Step {progress.progress} of {progress.total}
          </div>
        </div>
      )}

      {/* Status Description Tooltip (on hover) */}
      <div className="relative group">
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
          {config.description}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Optional: Lease Status Timeline Component
export function LeaseStatusTimeline({ lease, className = '' }) {
  const statusHistory = lease?.statusHistory || [
    { status: 'draft', date: '2024-01-15', user: 'System' },
    { status: 'sent_to_tenant', date: '2024-01-16', user: 'Landlord' },
    { status: 'signed_by_tenant', date: '2024-01-17', user: 'Tenant' },
    { status: 'fully_executed', date: '2024-01-18', user: 'System' },
  ];

  return (
    <div className={`bg-white rounded-lg border p-4 ${className}`}>
      <h3 className="font-medium text-gray-900 mb-4">Lease Status Timeline</h3>

      <div className="space-y-4">
        {statusHistory.map((item, index) => {
          const config = statusConfig[item.status] || statusConfig.default;
          const isLast = index === statusHistory.length - 1;

          return (
            <div key={index} className="flex items-start">
              {/* Timeline line */}
              <div className="flex flex-col items-center mr-4">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${config.color} ${config.iconColor}`}>
                  {config.icon}
                </div>
                {!isLast && (
                  <div className="w-0.5 h-8 bg-gray-300 mt-1" />
                )}
              </div>

              {/* Timeline content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{config.label}</p>
                    <p className="text-sm text-gray-500">{item.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">{item.date}</span>
                </div>
                {item.note && (
                  <p className="text-sm text-gray-600 mt-1">{item.note}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Optional: Lease Status Filter Component
export function LeaseStatusFilter({ selectedStatus, onStatusChange, className = '' }) {
  const mainStatuses = [
    'draft',
    'sent_to_tenant',
    'awaiting_signature',
    'signed_by_tenant',
    'fully_executed',
    'changes_requested',
    'cancelled',
    'expired'
  ];

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      <button
        onClick={() => onStatusChange('all')}
        className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedStatus === 'all'
            ? 'bg-[#1F3A34] text-white border-[#1F3A34]'
            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
      >
        All Statuses
      </button>

      {mainStatuses.map(status => {
        const config = statusConfig[status] || statusConfig.default;

        return (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm border transition-colors ${selectedStatus === status
                ? `${config.color.replace('50', '100').replace('border-', 'border-').split(' ')[0]} border-current`
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
          >
            <span className={config.iconColor}>
              {config.icon}
            </span>
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}