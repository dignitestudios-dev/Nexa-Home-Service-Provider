export type JobDetailClient = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profilePicture: string | null;
};

export type JobDetailAddress = {
  label: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  coordinates: [number, number] | null;
};

export type JobDetailAttachment = {
  id: string;
  url: string | null;
  isVideo: boolean;
};

export type JobDetail = {
  id: string;
  categoryName: string;
  title: string;
  description: string;
  when: string;
  type: string;
  status: string;
  jobProviderStatus: string;
  postedDate: string;
  contactPreferences: string[];
  attachments: JobDetailAttachment[];
  address: JobDetailAddress;
  client: JobDetailClient;
  isLocked: boolean;
  hasApplied: boolean;
  applicationDisplayStatus: string;
  leadCost: number;
  creditsToDeduct: number;
  badge?: string;
};
