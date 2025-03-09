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
  applications: IApplication[];
}

export interface IApplication {
  id: number;
  applicant: IApplicant;
  applicantId: number;
  jobPosting: IJobPosting;
  jobPostingId: number;
  resumeData: string;
  age: number;
  previousExperience: string;
  wageExpectation: string;
  availability: string;
  resumeName: string;
  createdAt: string;
}

export interface IApplicant {
  id: number;
  email: string | null;
  fullname: string;
  username: string;
  phoneNumber: string | null;
  password: string;
  applications: IApplication[];
}

export interface IChat {
  id: number;
  content: IChatContent[];
  userType: string;
  title: string;
}

export interface IChatContent {
  role: string;
  content: string;
}
