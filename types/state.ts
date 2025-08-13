export interface State {
  id: string;
  name: string;
  createdAt?: Date;
  createdBy?: string | null;
  modifiedAt?: Date | null;
  modifiedBy?: string | null;
}
