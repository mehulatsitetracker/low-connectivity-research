// Admin / web-side configuration for the mobile search & filtering experience.
//
// Each row is a Salesforce object field that is set up for search indexing —
// meaning it is pulled into the mobile global search index AND offered as a
// filter in the mobile list views. Being in this list *is* the setting: there
// is no per-row "indexed" toggle, because an un-indexed field simply wouldn't
// be here.
//
// The admin supplies a Filter Name (the label shown in the mobile filter sheet)
// and the field's API Name. The field's Data Type is decided by the field's
// definition in the API — it is shown for reference, not edited here.
//
// Seeded to mirror the filters the mobile prototype already surfaces
// (see src/config/listConfigs.tsx), so the admin config and the mobile app
// tell one coherent story.

export const SEARCH_INDEX_OBJECTS = ['Job', 'Site', 'Project'] as const;
export type SearchIndexObject = (typeof SEARCH_INDEX_OBJECTS)[number];

export type FieldType =
  | 'Text'
  | 'Picklist'
  | 'Lookup (Reference)'
  | 'Number'
  | 'Currency'
  | 'Date'
  | 'Date/Time'
  | 'Checkbox';

export interface SearchIndexField {
  id: string;
  object: SearchIndexObject;
  /** Label shown for the filter in the mobile filter sheet / chips. */
  filterName: string;
  /** Salesforce API name of the field (entered by the admin). */
  fieldApiName: string;
  /** Decided by the field's API definition; shown for reference, not editable. */
  fieldType?: FieldType;
  /** Display order within the object's field group. */
  order: number;
}

export const SEARCH_INDEX_FIELDS: SearchIndexField[] = [
  // ── Job ────────────────────────────────────────────────────────────────
  { id: 'idx-job-status',    object: 'Job', filterName: 'Job Status',   fieldApiName: 'sitetracker__Status__c',            fieldType: 'Picklist',           order: 1 },
  { id: 'idx-job-site',      object: 'Job', filterName: 'Site',         fieldApiName: 'sitetracker__Site__c',              fieldType: 'Lookup (Reference)', order: 2 },
  { id: 'idx-job-template',  object: 'Job', filterName: 'Job Template', fieldApiName: 'sitetracker__Job_Template__c',      fieldType: 'Lookup (Reference)', order: 3 },
  { id: 'idx-job-contract',  object: 'Job', filterName: 'Contract',     fieldApiName: 'sitetracker__Contract__c',          fieldType: 'Picklist',           order: 4 },
  { id: 'idx-job-gtr',       object: 'Job', filterName: 'GTR',          fieldApiName: 'sitetracker__GTR__c',               fieldType: 'Text',               order: 5 },
  { id: 'idx-job-assignee',  object: 'Job', filterName: 'Assignee',     fieldApiName: 'sitetracker__Assigned_Resource__c', fieldType: 'Lookup (Reference)', order: 6 },

  // ── Site ───────────────────────────────────────────────────────────────
  { id: 'idx-site-status',   object: 'Site', filterName: 'Site Status', fieldApiName: 'sitetracker__Status__c',            fieldType: 'Picklist',           order: 1 },
  { id: 'idx-site-type',     object: 'Site', filterName: 'Site Type',   fieldApiName: 'sitetracker__Type__c',              fieldType: 'Picklist',           order: 2 },
  { id: 'idx-site-region',   object: 'Site', filterName: 'Region',      fieldApiName: 'sitetracker__Region__c',            fieldType: 'Picklist',           order: 3 },
  { id: 'idx-site-carrier',  object: 'Site', filterName: 'Carrier',     fieldApiName: 'sitetracker__Carrier__c',           fieldType: 'Picklist',           order: 4 },
  { id: 'idx-site-county',   object: 'Site', filterName: 'County',      fieldApiName: 'sitetracker__County__c',            fieldType: 'Text',               order: 5 },
  { id: 'idx-site-city',     object: 'Site', filterName: 'City',        fieldApiName: 'sitetracker__City__c',              fieldType: 'Text',               order: 6 },

  // ── Project ────────────────────────────────────────────────────────────
  { id: 'idx-proj-status',   object: 'Project', filterName: 'Project Status',   fieldApiName: 'sitetracker__Status__c',           fieldType: 'Picklist',           order: 1 },
  { id: 'idx-proj-type',     object: 'Project', filterName: 'Project Type',     fieldApiName: 'sitetracker__Type__c',             fieldType: 'Picklist',           order: 2 },
  { id: 'idx-proj-template', object: 'Project', filterName: 'Project Template', fieldApiName: 'sitetracker__Project_Template__c', fieldType: 'Lookup (Reference)', order: 3 },
  { id: 'idx-proj-site',     object: 'Project', filterName: 'Site',             fieldApiName: 'sitetracker__Site__c',             fieldType: 'Lookup (Reference)', order: 4 },
  { id: 'idx-proj-region',   object: 'Project', filterName: 'Region',           fieldApiName: 'sitetracker__Region__c',           fieldType: 'Picklist',           order: 5 },
  { id: 'idx-proj-pm',       object: 'Project', filterName: 'Program Manager',  fieldApiName: 'sitetracker__Program_Manager__c',  fieldType: 'Lookup (Reference)', order: 6 },
];

/** Badge color for an object type — mirrors the mobile menu tiles. */
export const OBJECT_COLORS: Record<SearchIndexObject, string> = {
  Job: '#00847C',
  Site: '#455A64',
  Project: '#1976D2',
};
