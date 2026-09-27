export type ContactStatus = "new" | "read" | "replied" | "archived";

export interface Contact {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: ContactStatus;
  createdAt: string;
}

export const CONTACT_STATUSES: ContactStatus[] = ["new", "read", "replied", "archived"];

export const statusTone: Record<ContactStatus, "blue" | "amber" | "green" | "neutral"> = {
  new: "blue",
  read: "amber",
  replied: "green",
  archived: "neutral",
};
