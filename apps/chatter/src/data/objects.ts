import type { Job, Site, Project } from '../types';

export const JOBS: Job[] = [
  { id: 'J-004892', templateName: 'Site Survey', siteName: 'Pine Valley Tower', address: '1200 Pine Valley Rd', city: 'Denver', status: 'In Progress' },
  { id: 'J-004885', templateName: 'Equipment Install', siteName: '100 Pearl Street', address: '100 Pearl St', city: 'New York', status: 'Scheduled' },
  { id: 'J-004901', templateName: 'Fiber Splice', siteName: 'Oakridge Cell Site', address: '450 Oak Ridge Dr', city: 'Portland', status: 'In Progress' },
  { id: 'J-004910', templateName: 'Tower Inspection', siteName: 'Downtown Hub', address: '88 Main St', city: 'Chicago', status: 'Completed' },
];

export const SITES: Site[] = [
  { id: 'site-1', name: 'San Diego - Depot II', county: '--', city: '--', status: 'Active', type: 'Warehouse' },
  { id: 'site-2', name: '100 PEARL STREET', county: 'New York County', city: 'New York', status: 'On-Air', type: '--' },
  { id: 'site-3', name: 'Bristol Court 8350', county: '--', city: 'Jessup', status: 'On-Air', type: '--' },
  { id: 'site-4', name: 'Mahwah - 100 Corporate Drive', county: 'NJ', city: 'Mahwah', status: 'On-Air', type: 'Macro' },
];

export const PROJECTS: Project[] = [
  { id: 'P-000008', templateName: 'New Build', siteName: '100 PEARL STREET', status: 'Initiation', type: 'New Build' },
  { id: 'P-000011', templateName: 'New Build', siteName: 'Bristol Court 8350', status: 'Pending NTP', type: 'New Build' },
  { id: 'P-000007', templateName: 'New Build', siteName: '100 Park Lane Rd (Rte 202)', status: 'Pending NTP', type: 'New Build' },
  { id: 'P-000092', templateName: 'New Build', siteName: '300 Broad Hollow Rd (Corp HQ)', status: 'Complete', type: 'New Build' },
  { id: 'P-000099', templateName: 'New Build', siteName: 'Greenfield — No Messages Yet', status: 'Initiation', type: 'New Build' },
];

export function getObjectName(objectId: string, objectType: string): string {
  if (objectType === 'job') {
    const job = JOBS.find(j => j.id === objectId);
    return job ? job.id : objectId;
  }
  if (objectType === 'site') {
    const site = SITES.find(s => s.id === objectId);
    return site ? site.name : objectId;
  }
  if (objectType === 'project') {
    const proj = PROJECTS.find(p => p.id === objectId);
    return proj ? proj.id : objectId;
  }
  return objectId;
}
