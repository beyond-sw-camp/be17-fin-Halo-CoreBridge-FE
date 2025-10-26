export type Audience = 'ALL' | 'ADMIN' | 'CUSTOM';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  audience: Audience;
  files: Array<{ name: string; size: number }>;
  status: 'POSTED' | 'SCHEDULED' | 'DRAFT';
  startAt?: string; // ISO
  endAt?: string;   // ISO
  createdAt: string; // ISO
  createdBy: string; // 이름/이니셜
  isNew?: boolean;
}
