export type JobStatus =
  | 'Need an expert right away'
  | 'Researching options'
  | 'Ready to hire'

export type JobType = 'One Time' | 'Applied' | 'Completed'

export interface Job {
  id: number
  title: string
  description: string
  date: string
  status: JobStatus
  tab: 'applied' | 'one-time' | 'completed'
}

export interface JobDetail extends Job {
  fullDescription: string
  postedDate: string
  jobType: JobType
  contactPreference: string
  badge?: string
  location: {
    label: string
    address: string
  }
  client: {
    name: string
    phone: string
    email: string
  }
  attachments: number
}

const SHORT_DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi.'

const FULL_DESCRIPTION =
  'Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi. Quis amet imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi. Quis amet imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur. Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus laoreet enim faucibus vitae facilisi. Quis amet imperdiet ut molestie luctus risus lacinia. Mauris vel mus at urna vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur.'

const FIGMA_STATUSES: JobStatus[] = [
  'Need an expert right away',
  'Researching options',
  'Ready to hire',
  'Need an expert right away',
  'Ready to hire',
  'Ready to hire',
  'Ready to hire',
  'Ready to hire',
  'Ready to hire',
  'Ready to hire',
  'Ready to hire',
  'Ready to hire',
]

function buildJobDetail(
  id: number,
  status: JobStatus,
  tab: Job['tab'],
  jobType: JobType,
  badge?: string,
): JobDetail {
  return {
    id,
    title: 'Service Name',
    description: SHORT_DESCRIPTION,
    date: 'Today, 11:30 AM',
    status,
    tab,
    fullDescription: FULL_DESCRIPTION,
    postedDate: '09/09/2025',
    jobType,
    contactPreference: 'Email',
    badge,
    location: {
      label: 'Office',
      address: '123 Bay Street, Downtown Toronto, ON M5J 2X8, Canada',
    },
    client: {
      name: 'Rayan Cooper',
      phone: '+1 987 876 98767',
      email: 'rayancooper@gmail.com',
    },
    attachments: 3,
  }
}

function buildJobs(
  startId: number,
  statuses: JobStatus[],
  tab: Job['tab'],
  jobType: JobType,
): JobDetail[] {
  return statuses.map((status, index) =>
    buildJobDetail(startId + index, status, tab, jobType, index === 0 ? 'Ongoing' : undefined),
  )
}

export const APPLIED_JOBS = buildJobs(
  1,
  [
    'Need an expert right away',
    'Researching options',
    'Ready to hire',
    'Need an expert right away',
    'Researching options',
    'Ready to hire',
    'Need an expert right away',
    'Researching options',
    'Ready to hire',
    'Need an expert right away',
    'Researching options',
    'Ready to hire',
    'Need an expert right away',
  ],
  'applied',
  'Applied',
)

export const ONE_TIME_JOBS = buildJobs(101, FIGMA_STATUSES, 'one-time', 'One Time')

export const COMPLETED_JOBS = buildJobs(
  201,
  Array.from({ length: 12 }, () => 'Ready to hire' as JobStatus),
  'completed',
  'Completed',
)

export const ALL_JOBS: JobDetail[] = [...APPLIED_JOBS, ...ONE_TIME_JOBS, ...COMPLETED_JOBS]

export function getJobById(id: number): JobDetail | undefined {
  return ALL_JOBS.find((job) => job.id === id)
}
