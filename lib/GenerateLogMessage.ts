import { Action, AuditLog } from "@prisma/client";

export const generateLogMessage = (log: AuditLog) => {
  const { action, entityTitle, entityType } = log;

  switch(action) {
    case Action.CREATE:
      return `Created ${entityType.toLowerCase()} "${entityTitle}"`;
    case Action.UPDATE:
      return `Updated ${entityType.toLowerCase()} "${entityTitle}"`;
    case Action.DELETE:
      return `Deleted ${entityType.toLowerCase()} "${entityTitle}"`;
    default:
      return `unknown action ${entityType.toLowerCase()} "${entityTitle}"`;  
  };
};