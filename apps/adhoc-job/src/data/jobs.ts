import type { JobData, FormItem, CrewMember } from '../types';

export const JOBS: JobData[] = [
  {
    id: 'J-000234',
    templateName: 'Antena installation template',
    siteName: 'PT - 100 PEARL STREET',
    address: '100 Pearl Street',
    city: 'Denver, Colorado 99999',
    status: 'Assigned',
    priority: 'High',
  },
  {
    id: 'J-000432',
    templateName: 'Antena installation template',
    siteName: 'PT - 100 PEARL STREET',
    address: '100 Pearl Street',
    city: 'Denver, Colorado 99999',
    status: 'Assigned',
    priority: 'Medium',
  },
  {
    id: 'J-000587',
    templateName: 'Cable routing template',
    siteName: 'PT - 100 PEARL STREET',
    address: '100 Pearl Street',
    city: 'Denver, Colorado 99999',
    status: 'Assigned',
    priority: 'Medium',
  },
  {
    id: 'J-000891',
    templateName: 'Site inspection template',
    siteName: 'PT - 100 PEARL STREET',
    address: '100 Pearl Street',
    city: 'Denver, Colorado 99999',
    status: 'Assigned',
    priority: 'Low',
  },
];

export const JOB_FORMS: FormItem[] = [
  { name: 'Safety Inspection', status: 'Not Started', icon: 'checklist' },
  { name: 'Equipment Checklist', status: 'Not Started', icon: 'clipboard' },
  { name: 'Daily Report', status: 'Not Started', icon: 'report' },
];

export const CREW_MEMBERS: CrewMember[] = [
  { name: 'You (Alex Rivera)', status: 'Not Started', isCurrentUser: true },
  { name: 'Jordan Chen', status: 'Not Started', isCurrentUser: false },
  { name: 'Sam Patel', status: 'Not Started', isCurrentUser: false },
  { name: 'Morgan Lee', status: 'Not Started', isCurrentUser: false },
];

export const CREW_SHIFT_1: CrewMember[] = [
  { name: 'You (Alex Rivera)', status: 'Not Started', isCurrentUser: true },
  { name: 'Jordan Chen', status: 'Not Started', isCurrentUser: false },
];

export const CREW_SHIFT_2: CrewMember[] = [
  { name: 'Taylor Kim', status: 'Not Started', isCurrentUser: false },
  { name: 'Casey Brooks', status: 'Not Started', isCurrentUser: false },
];

export const JOB_STATUSES = [
  'Scheduled',
  'In Progress',
  'Ready for review',
  'In Review',
  'Review Complete',
  'Completed',
] as const;
