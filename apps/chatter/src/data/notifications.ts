import type { Notification } from '../types';

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1', objectId: 'J-004892', objectType: 'job', objectName: 'J-004892',
    senderName: 'Jane Smith', senderInitials: 'JS',
    messagePreview: 'Walk-through is still on for 2pm if that works.',
    timestamp: '2m ago', isRead: false,
  },
  {
    id: 'n2', objectId: 'J-004901', objectType: 'job', objectName: 'J-004901',
    senderName: 'David Kim', senderInitials: 'DK',
    messagePreview: '@Priya Patel check the OTDR readings before proceeding.',
    timestamp: '15m ago', isRead: false,
  },
  {
    id: 'n3', objectId: 'P-000008', objectType: 'project', objectName: 'P-000008',
    senderName: 'Sarah Chen', senderInitials: 'SC',
    messagePreview: 'Done. Updated schedule attached.',
    timestamp: '1h ago', isRead: false,
  },
  {
    id: 'n4', objectId: 'site-1', objectType: 'site', objectName: 'San Diego - Depot II',
    senderName: 'Mike Torres', senderInitials: 'MT',
    messagePreview: 'Parking area is limited. Use the east entrance.',
    timestamp: '2h ago', isRead: true,
  },
  {
    id: 'n5', objectId: 'J-004885', objectType: 'job', objectName: 'J-004885',
    senderName: 'Sarah Chen', senderInitials: 'SC',
    messagePreview: 'Equipment delivery confirmed for Thursday morning.',
    timestamp: '3h ago', isRead: true,
  },
  {
    id: 'n6', objectId: 'P-000011', objectType: 'project', objectName: 'P-000011',
    senderName: 'Jane Smith', senderInitials: 'JS',
    messagePreview: 'Will follow up with the county this week.',
    timestamp: 'Yesterday', isRead: true,
  },
  {
    id: 'n7', objectId: 'site-2', objectType: 'site', objectName: '100 Pearl Street',
    senderName: 'Priya Patel', senderInitials: 'PP',
    messagePreview: 'I\'ll bring the safety gear.',
    timestamp: 'Yesterday', isRead: true,
  },
];
