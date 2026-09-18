export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    Open: '#ef4444',
    'In Progress': '#f97316',
    Resolved: '#22c55e',
    Closed: '#6b7280',
    Pending: '#eab308',
    'Under Review': '#3b82f6',
    Approved: '#22c55e',
    Rejected: '#ef4444',
    Active: '#22c55e',
    Inactive: '#6b7280',
  };
  return colors[status] || '#6b7280';
};

export const getRiskColor = (risk: string): string => {
  const colors: Record<string, string> = {
    Low: '#22c55e',
    Medium: '#eab308',
    High: '#f97316',
    Critical: '#ef4444',
  };
  return colors[risk] || '#6b7280';
};

export const getRiskBgColor = (risk: string): string => {
  const colors: Record<string, string> = {
    Low: '#dcfce7',
    Medium: '#fef9c3',
    High: '#ffedd5',
    Critical: '#fee2e2',
  };
  return colors[risk] || '#f3f4f6';
};

export const getStatusBgColor = (status: string): string => {
  const colors: Record<string, string> = {
    Open: '#fee2e2',
    'In Progress': '#ffedd5',
    Resolved: '#dcfce7',
    Closed: '#f3f4f6',
    Pending: '#fef9c3',
    'Under Review': '#dbeafe',
    Approved: '#dcfce7',
    Rejected: '#fee2e2',
  };
  return colors[status] || '#f3f4f6';
};

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const generateId = () => Math.random().toString(36).substr(2, 9);
