export interface VotingProposalProps {
  author: string //address
  body: string
  choices: number[]
  end: number
  id: string
  snapshot: string
  space: {
    id: string
    name: string
  }
  start: number
  state: string
  title: string
}

export enum VotingStatus {
  ALL = 'all',
  CLOSED = 'closed',
  ACTIVE = 'active',
}

export type VotingStatusChoices =
  | VotingStatus.ALL
  | VotingStatus.ACTIVE
  | VotingStatus.CLOSED

export interface VotingFiltersProps {
  startDateFilter: Date | null
  endDateFilter: Date | null
  searchKeyFilter: string
}

export interface Voter {
  id: string
  voter: string
  choice: number
  vp: number
}

export type StakingTypeProps = 'STAKING' | 'UNSTAKING'
