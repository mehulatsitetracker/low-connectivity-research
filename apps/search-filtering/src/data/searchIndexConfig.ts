// Admin / web-side configuration for the mobile search & filtering experience.
//
// Each row marks a Salesforce object field as part of search indexing: the field
// is pulled into the mobile global search index AND offered as a filter in the
// mobile list views. (These were originally two toggles — indexed vs. filterable —
// but in this product they always move together, so they're a single flag.)
//
// Seeded to mirror the filters the mobile prototype already surfaces
// (see src/config/listConfigs.tsx), so the admin config and the mobile app
// tell one coherent story.

export const SEARCH_INDEX_OBJECTS = ['Job', 'Site', 'Project'] as const;
export type SearchIndexObject = (typeof SEARCH_INDEX_OBJECTS)[number];

export const FIELD_TYPES = [
  'Text',
  'Picklist',
  'Lookup (Reference)',
  'Number',
  'Currency',
  'Date',
  'Date/Time',
  'Checkbox',
] as const;
export type FieldType = (typeof FIELD_TYPES)[number];

export interface SearchIndexField {
  id: string;
  object: SearchIndexObject;
  /** Human label shown in the mobile filter sheet / chips. */
  fieldLabel: string;
  /** Salesforce API name of the field. */
  fieldApiName: string;
  fieldType: FieldType;
  /** Indexed for search and available for filtering in the mobile app. */
  indexed: boolean;
  /** Display order within the object's field group. */
  order: number;
}

export const SEARCH_INDEX_FIELDS: SearchIndexField[] = [
  // ── Job ────────────────────────────────────────────────────────────────
  { id: 'idx-job-status',    object: 'Job', fieldLabel: 'Job Status',   fieldApiName: 'sitetracker__Status__c',            fieldType: 'Picklist',           indexed: true,  order: 1 },
  { id: 'idx-job-site',      object: 'Job', fieldLabel: 'Site',         fieldApiName: 'sitetracker__Site__c',              fieldType: 'Lookup (Reference)', indexed: true,  order: 2 },
  { id: 'idx-job-template',  object: 'Job', fieldLabel: 'Job Template', fieldApiName: 'sitetracker__Job_Template__c',      fieldType: 'Lookup (Reference)', indexed: true,  order: 3 },
  { id: 'idx-job-contract',  object: 'Job', fieldLabel: 'Contract',     fieldApiName: 'sitetracker__Contract__c',          fieldType: 'Picklist',           indexed: true,  order: 4 },
  { id: 'idx-job-gtr',       object: 'Job', fieldLabel: 'GTR',          fieldApiName: 'sitetracker__GTR__c',               fieldType: 'Text',               indexed: true,  order: 5 },
  { id: 'idx-job-assignee',  object: 'Job', fieldLabel: 'Assignee',     fieldApiName: 'sitetracker__Assigned_Resource__c', fieldType: 'Lookup (Reference)', indexed: true,  order: 6 },
  { id: 'idx-job-address',   object: 'Job', fieldLabel: 'Address',      fieldApiName: 'sitetracker__Address__c',           fieldType: 'Text',               indexed: false, order: 7 },

  // ── Site ───────────────────────────────────────────────────────────────
  { id: 'idx-site-name',     object: 'Site', fieldLabel: 'Site Name',   fieldApiName: 'Name',                              fieldType: 'Text',               indexed: true,  order: 1 },
  { id: 'idx-site-status',   object: 'Site', fieldLabel: 'Site Status', fieldApiName: 'sitetracker__Status__c',            fieldType: 'Picklist',           indexed: true,  order: 2 },
  { id: 'idx-site-type',     object: 'Site', fieldLabel: 'Site Type',   fieldApiName: 'sitetracker__Type__c',              fieldType: 'Picklist',           indexed: true,  order: 3 },
  { id: 'idx-site-region',   object: 'Site', fieldLabel: 'Region',      fieldApiName: 'sitetracker__Region__c',            fieldType: 'Picklist',           indexed: true,  order: 4 },
  { id: 'idx-site-carrier',  object: 'Site', fieldLabel: 'Carrier',     fieldApiName: 'sitetracker__Carrier__c',           fieldType: 'Picklist',           indexed: true,  order: 5 },
  { id: 'idx-site-county',   object: 'Site', fieldLabel: 'County',      fieldApiName: 'sitetracker__County__c',            fieldType: 'Text',               indexed: true,  order: 6 },
  { id: 'idx-site-city',     object: 'Site', fieldLabel: 'City',        fieldApiName: 'sitetracker__City__c',              fieldType: 'Text',               indexed: true,  order: 7 },

  // ── Project ────────────────────────────────────────────────────────────
  { id: 'idx-proj-status',   object: 'Project', fieldLabel: 'Project Status',   fieldApiName: 'sitetracker__Status__c',           fieldType: 'Picklist',           indexed: true,  order: 1 },
  { id: 'idx-proj-type',     object: 'Project', fieldLabel: 'Project Type',     fieldApiName: 'sitetracker__Type__c',             fieldType: 'Picklist',           indexed: true,  order: 2 },
  { id: 'idx-proj-template', object: 'Project', fieldLabel: 'Project Template', fieldApiName: 'sitetracker__Project_Template__c', fieldType: 'Lookup (Reference)', indexed: true,  order: 3 },
  { id: 'idx-proj-site',     object: 'Project', fieldLabel: 'Site',             fieldApiName: 'sitetracker__Site__c',             fieldType: 'Lookup (Reference)', indexed: true,  order: 4 },
  { id: 'idx-proj-region',   object: 'Project', fieldLabel: 'Region',           fieldApiName: 'sitetracker__Region__c',           fieldType: 'Picklist',           indexed: true,  order: 5 },
  { id: 'idx-proj-pm',       object: 'Project', fieldLabel: 'Program Manager',  fieldApiName: 'sitetracker__Program_Manager__c',  fieldType: 'Lookup (Reference)', indexed: true,  order: 6 },
  { id: 'idx-proj-priority', object: 'Project', fieldLabel: 'Priority',         fieldApiName: 'sitetracker__Priority__c',         fieldType: 'Picklist',           indexed: false, order: 7 },
];

/** Badge color for an object type — mirrors the mobile menu tiles. */
export const OBJECT_COLORS: Record<SearchIndexObject, string> = {
  Job: '#00847C',
  Site: '#455A64',
  Project: '#1976D2',
};
