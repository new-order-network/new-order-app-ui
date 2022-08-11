import {
  ApolloClient,
  InMemoryCache,
  gql,
  createHttpLink,
} from '@apollo/client'

import { env } from 'lib/environment'

const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: `${env.NEXT_PUBLIC_HUB_URL}/graphql`,
})

export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
})

export const snapshotProposalQuery = gql`
query Proposals($first: Int!, $skip: Int!) {
	proposals (
		first: $first,
		skip: $skip,
		where: {
			space_in: ["${env.NEXT_PUBLIC_SNAPSHOT_SPACE}"],
		},
		orderBy: "created",
		orderDirection: desc
	) {
		id
		title
		body
		choices
    scores
		start
		end
		snapshot
		state
		author
		space {
			id
			name
		}
	}
}
`

export const snapshotProposalCountQuery = gql`
  query Space {
    space(id: "${env.NEXT_PUBLIC_SNAPSHOT_SPACE}") {
      id
      proposalsCount
    }
  }
`

export const snapshotSingleProposalQuery = gql`
  query Proposal($id: String!) {
    proposal(id: $id) {
      id
      title
      body
      choices
      start
      end
      snapshot
      scores
      state
      author
      space {
        id
        name
      }
      strategies {
        name
        network
        params
      }
    }
  }
`

export const proposalVotesQuery = gql`
  query Votes($id: String!) {
    votes(where: { proposal: $id }) {
      id
      voter
      choice
      vp
    }
  }
`
