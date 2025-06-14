export interface Testimony {
  id: string;
  investorName: string;
  comment: string;
  rating: number;
  location: string;
  isApproved: boolean;
  createdById: string;
  createdBy: { name: string | null };
  createdOn: string;
  modifiedById: string;
  modifiedBy: { name: string | null };
  modifiedOn: string;
}

export interface FormData {
  investorName: string;
  comment: string;
  rating: number;
  location: string;
  isApproved: boolean;
}
