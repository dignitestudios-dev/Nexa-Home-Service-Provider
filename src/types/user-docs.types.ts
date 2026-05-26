export type UserDocFile = {
  id: string;
  fileName: string;
  url: string;
  isVideo: boolean;
};

export type UserDocs = {
  portfolioMedia: UserDocFile[];
};
