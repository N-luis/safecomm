export const VAWC_TYPES = [
  'Domestic Violence',
  'Physical Abuse',
  'Sexual Harassment',
  'Child Abuse',
  'Stalking',
  'Emotional Abuse',
  'Economic Abuse',
  'Sexual Violence',
  'Human Trafficking',
  'VAWC - Other',
] as const;

export type VawcCaseType = (typeof VAWC_TYPES)[number];

export const VAWC_RISK_LEVELS = ['Low', 'Medium', 'High', 'Critical'] as const;
export const VAWC_STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'] as const;
