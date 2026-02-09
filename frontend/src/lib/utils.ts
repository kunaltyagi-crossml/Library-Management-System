import { format, parseISO, differenceInDays } from 'date-fns';

export const formatDate = (date: string | Date) => {
  if (!date) return 'N/A';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy');
};

export const formatDateTime = (date: string | Date) => {
  if (!date) return 'N/A';
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'MMM dd, yyyy HH:mm');
};

export const getDaysUntil = (date: string | Date) => {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(targetDate, new Date());
};

export const getBookStatusBadge = (status: string) => {
  const badges: Record<string, { text: string; className: string }> = {
    available: { text: 'Available', className: 'badge-success' },
    issued: { text: 'Issued', className: 'badge-warning' },
    reserved: { text: 'Reserved', className: 'badge-info' },
    maintenance: { text: 'Maintenance', className: 'badge-danger' },
    lost: { text: 'Lost', className: 'badge-danger' },
  };
  return badges[status] || { text: status, className: 'badge-secondary' };
};

export const getTransactionStatusBadge = (status: string) => {
  const badges: Record<string, { text: string; className: string }> = {
    issued: { text: 'Issued', className: 'badge-info' },
    returned: { text: 'Returned', className: 'badge-success' },
    overdue: { text: 'Overdue', className: 'badge-danger' },
    lost: { text: 'Lost', className: 'badge-danger' },
  };
  return badges[status] || { text: status, className: 'badge-secondary' };
};

export const getUserTypeBadge = (userType: string) => {
  const badges: Record<string, { text: string; className: string }> = {
    staff: { text: 'Staff', className: 'badge-danger' },
    student: { text: 'Student', className: 'badge-info' },
    external: { text: 'External', className: 'badge-warning' },
    faculty: { text: 'Faculty', className: 'badge-success' },
  };
  return badges[userType] || { text: userType, className: 'badge-secondary' };
};

export const truncateText = (text: string, maxLength: number = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const cn = (...classes: (string | boolean | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};
