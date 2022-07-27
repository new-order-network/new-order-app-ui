import { render } from '@testing-library/react'
import dayjs from 'dayjs'

import VotingCard from 'components/Voting/VotingCard'

describe('VotingCard.tsx component', () => {
  const testProposalData = {
    author: 'Test Author',
    state: 'closed',
    title: 'Test Proposal',
    body: 'Test Body and Description',
    start: dayjs(new Date('2022-01-01')).startOf('day').unix(),
    id: '0xa1ec7fb2f9',
    choices: [0, 1, 2],
    end: dayjs(new Date('2022-02-02')).startOf('day').unix(),
    snapshot: 'testSnapshot',
    space: {
      id: 'neworderdao.xyz',
      name: 'New Order',
    },
  }
  const { container } = render(<VotingCard proposal={testProposalData} />)

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
