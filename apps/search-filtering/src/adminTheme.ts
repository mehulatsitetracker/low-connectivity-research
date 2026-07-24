// Salesforce (SLDS-inspired) palette for the admin / web-side prototype.
// Deliberately kept separate from the mobile theme (src/theme.ts) so the two
// surfaces read as distinct products: teal Sitetracker mobile vs. blue Salesforce
// Setup on the web. Includes both Lightning header tokens and the classic
// Setup detail-page tokens used by the Custom Metadata Types page.

export const sf = {
  // Brand / links
  brand: '#0176D3',
  brandHover: '#014486',
  link: '#0070D2',
  cloud: '#00A1E0',

  // Surfaces
  pageBg: '#F3F3F3',
  cardBg: '#FFFFFF',
  headerBg: '#FFFFFF',
  tableHeaderBg: '#FAFAF9',
  rowHover: '#F3F3F3',

  // Borders
  border: '#DDDBDA',
  borderLight: '#E5E5E5',

  // Text
  text: '#080707',
  textWeak: '#3E3E3C',
  textMuted: '#706E6B',

  // Status / accents
  success: '#2E844A',
  info: '#0176D3',
  infoBg: '#EEF4FF',
  infoBorder: '#C9E0FF',
  required: '#EA001E',

  // Classic Setup detail page
  setupBlue: '#005FB2',            // "SETUP" eyebrow + accents
  headerCardBg: '#F3F3F3',
  bannerBg: '#FCF9E9',             // managed-package yellow note
  bannerBorder: '#E4DFC6',
  labelText: '#3E3E3C',            // right-aligned bold field labels
  detailRowBorder: '#EEF0F2',
  sectionBorder: '#C7C5C3',        // heavy rule under section titles
  listHeaderBg: '#F2F3F3',         // related-list column header row
  listHeaderBorder: '#B0ADAB',
  listRowBorder: '#EDEDED',
  relatedBorder: '#D8DDE6',
  btnFrom: '#FFFFFF',
  btnTo: '#F2F3F3',
  btnBorder: '#C4C7C9',
  btnText: '#16325C',
  treeActiveBg: '#F0F6FF',
  treeActiveBar: '#0070D2',
  searchHighlight: '#FFF1A8',      // yellow match highlight in Setup tree

  // Object badge colors (echo the mobile menu tiles)
  objJob: '#00847C',
  objSite: '#455A64',
  objProject: '#1976D2',
  toggleOff: '#C9C7C5',

  font: "'Salesforce Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
  radius: 4,
} as const;
