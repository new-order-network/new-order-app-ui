/* eslint-disable @typescript-eslint/no-empty-function */
import { render } from '@testing-library/react'

import VotingStatusFilter from 'components/Voting/VotingStatusFilter'

import { VotingStatus } from 'models/voting'

describe('VotingStatusFilter.tsx component', () => {
  const testProposalData = [
    {
      author: 'Test Author 1',
      state: 'active',
      title: 'Test Proposal',
      body: 'Test Body and Description',
      start: 1656351904,
      id: '0xa1ec7fb2f7',
      choices: [0, 1, 2],
      end: 1656524705,
      snapshot: 'testSnapshot',
      space: {
        id: 'neworderdao.xyz',
        name: 'New Order',
      },
    },
    {
      author: 'Test Author 2',
      state: 'closed',
      title: 'Test Proposal',
      body: 'Test Body and Description',
      start: 1656351904,
      id: '0xa1ec7fb2f8',
      choices: [0, 1, 2],
      end: 1656524705,
      snapshot: 'testSnapshot',
      space: {
        id: 'neworderdao.xyz',
        name: 'New Order',
      },
    },
    {
      author: 'Test Author 3',
      state: 'closed',
      title: 'Test Proposal',
      body: 'Test Body and Description',
      start: 1656351904,
      id: '0xa1ec7fb2f9',
      choices: [0, 1, 2],
      end: 1656524705,
      snapshot: 'testSnapshot',
      space: {
        id: 'neworderdao.xyz',
        name: 'New Order',
      },
    },
  ]

  test('match to snapshot all closed proposals', () => {
    const { container } = render(
      <VotingStatusFilter
        votingProposals={testProposalData}
        status={VotingStatus.CLOSED}
        setStatus={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })

  test('match to snapshot all active proposals', () => {
    const { container } = render(
      <VotingStatusFilter
        votingProposals={testProposalData}
        status={VotingStatus.ACTIVE}
        setStatus={() => {}}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
