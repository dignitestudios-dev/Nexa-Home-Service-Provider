import type { JobDetail as MockJobDetail } from "@/app/my-jobs/_components/jobs-data";
import type { JobDetail } from "@/types/job-detail.types";

export function mapMockJobToDetail(job: MockJobDetail): JobDetail {
  return {
    id: String(job.id),
    categoryName: job.title,
    title: job.title,
    description: job.fullDescription,
    when: job.date,
    type: job.jobType === "One Time" ? "one-time" : job.jobType.toLowerCase(),
    status: job.status,
    jobProviderStatus: job.status.toLowerCase().replace(/\s+/g, "-"),
    postedDate: job.postedDate,
    contactPreferences: [job.contactPreference.toLowerCase()],
    attachments: Array.from({ length: job.attachments }, (_, index) => ({
      id: String(index),
      url: null,
      isVideo: index === 2,
    })),
    address: {
      label: job.location.label,
      address: job.location.address,
      city: "",
      state: "",
      country: "",
      zipCode: "",
      coordinates: null,
    },
    client: {
      id: "",
      name: job.client.name,
      email: job.client.email,
      phone: job.client.phone,
      profilePicture: null,
    },
    isLocked: false,
    hasApplied: job.tab === "applied",
    applicationDisplayStatus: "confirmed",
    leadCost: 0,
    creditsToDeduct: 500,
    badge: job.badge,
  };
}
