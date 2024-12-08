export interface IJobPosting {
  id: number;
  title: string;
  description: string;
  address: string;
  createdAt: string;
  author: { companyName: string; email: string; phoneNumber: string };
  applicants: {
    username: string;
    id: number;
    fullname: string;
    phoneNumber: string;
    email: string;
  }[];
  postingStatus: string;
  status: string;
}
