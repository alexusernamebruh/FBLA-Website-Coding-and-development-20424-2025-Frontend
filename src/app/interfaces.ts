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
  applicantsCanInterview: IApplicant[];
  interviewSlots: IInterviewSlot[];
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

export interface IInterviewSlot {
  id: number;
  startTime: string;
  endTime: string;
  jobPostingId: number;
  jobPosting: IJobPosting;
  applicantId: number;
  applicant: IApplicant;
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

export interface IEmployerAnnouncement {
  id: number;
  title: string;
  content: string;
  employerId: number;
  createdAt: string;
  announceTo: string;
  jobPosting: IJobPosting;
  jobPostingId: number;
  employer: IEmployer;
}

export interface IEmployer {
  id: number;
  email?: string;
  companyName: string;
  username: string;
  phoneNumber?: string;
  jobPostings: IJobPosting[];
  employerAnnouncements: IEmployerAnnouncement[];
}

export interface IEmployerApplicantChat {
  id: number;
  content: string;
  employerId: number;
  employer: IEmployer;
  applicant: IApplicant;
  applicantId: number;
}
