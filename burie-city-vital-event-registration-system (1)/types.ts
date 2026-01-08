
export enum UserRole {
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  DATA_CLERK = 'DATA_CLERK',
  CITIZEN = 'CITIZEN'
}

export enum EventType {
  BIRTH = 'BIRTH',
  DEATH = 'DEATH',
  MARRIAGE = 'MARRIAGE',
  DIVORCE = 'DIVORCE'
}

export enum RegistrationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
  kebele?: string;
  fullName: string;
}

export interface VitalEventRecord {
  id: string;
  type: EventType;
  kebele: string;
  status: RegistrationStatus;
  registrationDate: string;
  applicantId: string;
  data: any;
  documents: { name: string; type: string; url: string }[];
  certificateNumber?: string;
  rejectionReason?: string;
  auditTrail: AuditLog[];
}

export interface AuditLog {
  id?: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
}

export interface KebeleInfo {
  id: string;
  name: string;
}
