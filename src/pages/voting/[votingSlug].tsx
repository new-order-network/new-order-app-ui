import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Icon,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  useToast,
} from '@chakra-ui/react'
import { FiChevronLeft } from 'react-icons/fi'
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/client'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import snapshot from '@snapshot-labs/snapshot.js'
import { useAccount } from 'wagmi'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers'

import Card from 'components/Card'
import MemberHash from 'components/Voting/MemberHash'
import FormattedDate from 'components/Voting/FormattedDate'
import VotingDetailLoader from 'components/Loaders/VotingDetailLoader'

import {
  proposalVotesQuery,
  snapshotSingleProposalQuery,
} from 'api/snapshotApi'

import { env } from 'lib/environment'

import {
  Voter,
  VotingStatus,
  VotingOutcomes,
  VotingChoices,
} from 'models/voting'

import { DEFAULT_NETWORK } from 'constants/network'

import Layout from 'layout'

const VotingDetail = () => {
  const router = useRouter()
  const toast = useToast()
  const { votingSlug } = router.query
  const { data: proposalData, loading } = useQuery(
    snapshotSingleProposalQuery,
    {
      variables: { id: votingSlug },
    }
  )
  const { data: votesData } = useQuery(proposalVotesQuery, {
    variables: { id: votingSlug },
  })
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm()
  const { address } = useAccount()
  const [votingProposalDetails, setVotingProposalDetails] =
    useState(proposalData)
  const [result, setResult] = useState(null)
  const [votingPower, setVotingPower] = useState(0)
  const [stateText, setStateText] = useState(votingProposalDetails?.state)

  const voteHref = `https://snapshot.org/#/${env.NEXT_PUBLIC_SNAPSHOT_SPACE}/proposal/${votingSlug}`
  const snapshotClient = new snapshot.Client712(env.NEXT_PUBLIC_HUB_URL)

  const getResults = async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results: any = {}

    proposalData.proposal.choices.forEach((choice: string) => {
      results[choice] = 0
    })

    votesData.votes.forEach((vote: Voter) => {
      const choiceKey = vote.choice - 1
      const choiceValue = Object.keys(results)[choiceKey]
      results[choiceValue] += vote.vp
    })

    setResult(results)
  }

  const getVotingPower = async () => {
    const strategies = proposalData?.proposal.strategies

    const votingPower = await snapshot.utils.getVp(
      String(address),
      `${DEFAULT_NETWORK.id}`,
      strategies,
      proposalData.proposal.snapshot,
      env.NEXT_PUBLIC_SNAPSHOT_SPACE,
      true
    )

    if (votingPower) {
      setVotingPower(votingPower.vp)
    }
  }

  useEffect(() => {
    if (proposalData) {
      setVotingProposalDetails(proposalData?.proposal)
      getVotingPower()
    }

    // eslint-disable-next-line
  }, [proposalData, address])

  useEffect(() => {
    if (votesData && proposalData) {
      getResults()
    }
    // eslint-disable-next-line
  }, [votesData, proposalData])

  const onSubmit = handleSubmit(async (data) => {
    // This submit function should cast a vote on snapshot

    if (address && window.ethereum) {
      const choiceIndex = votingProposalDetails?.choices.indexOf(data.choice)
      const web3 = new Web3Provider(window.ethereum as ExternalProvider)
      const [account] = await web3.listAccounts()

      await snapshotClient
        .vote(web3, account, {
          space: env.NEXT_PUBLIC_SNAPSHOT_SPACE,
          proposal: votingProposalDetails?.id,
          type: 'single-choice',
          choice: choiceIndex + 1,
        })
        .then(() => {
          toast({
            title: 'Voting Successful',
            description: 'You have successfully casted your vote.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
        })
        .catch(() => {
          toast({
            title: 'Voting Failed',
            description: 'Something went wrong! Please try again later.',
            isClosable: true,
            position: 'top-right',
            status: 'error',
            variant: 'error',
          })
        })
        .finally(() => {
          getResults()
        })
    }
  })

  useEffect(() => {
    if (votingProposalDetails?.state === VotingStatus.CLOSED) {
      const highestVotedIndex = votingProposalDetails?.scores.indexOf(
        Math.max(...votingProposalDetails?.scores)
      )
      if (
        votingProposalDetails.choices[highestVotedIndex] === VotingChoices.FOR
      ) {
        setStateText(VotingOutcomes.PASSED)
      } else if (
        votingProposalDetails.choices[highestVotedIndex] ===
        VotingChoices.AGAINST
      ) {
        setStateText(VotingOutcomes.FAILED)
      } else {
        setStateText(votingProposalDetails.choices[highestVotedIndex])
      }
    } else {
      setStateText(votingProposalDetails?.state)
    }
    // eslint-disable-next-line
  }, [votingProposalDetails?.state])

  return (
    <Layout>
      <Flex
        flexDirection="column"
        flexWrap="wrap"
        gap="4"
        p={['28px 24px', '28px 40px', '28px 40px']}
      >
        <Flex
          alignItems="center"
          flexWrap="wrap"
          justifyContent={['flex-start', 'space-between']}
          gap="2"
        >
          <Flex alignItems="center">
            <Flex alignItems="center">
              <Button
                variant="backButton"
                fontSize="sm"
                leftIcon={
                  <Icon color="gray.40" fontSize="20" as={FiChevronLeft} />
                }
                onClick={() => {
                  return router.push('/voting')
                }}
              >
                Back
              </Button>
            </Flex>
            <Text ml="4" fontSize="1.5rem" fontWeight="extrabold">
              Voting
            </Text>
          </Flex>

          <Flex align="center" gap="4" flexWrap="wrap">
            <Tooltip
              label={`This is your voting power on the block number the snapshot was posted. Block Number: ${proposalData?.proposal.snapshot}`}
            >
              <Button
                fontSize={['0.7rem', '0.9rem']}
                variant="outlineGreenRounded"
                h="100%"
              >
                Voting Power: {votingPower.toFixed(2)}
              </Button>
            </Tooltip>

            <Link isExternal href={voteHref}>
              <Button fontSize={['0.7rem', '0.9rem']} variant="greenButton">
                Snapshot Proposal
              </Button>
            </Link>
          </Flex>
        </Flex>

        {loading ? (
          <VotingDetailLoader />
        ) : (
          <>
            <Card
              w={['full', 'xs']}
              header={
                <Flex
                  minW="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap="3"
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    flexWrap="wrap"
                    gap="2"
                    w="full"
                    justifyContent={['space-between']}
                    px="3"
                  >
                    <Text color="gray.50" fontWeight="bold" fontSize="0.9rem">
                      Status
                    </Text>
                    <Button
                      fontSize="0.75rem"
                      h="6"
                      fontWeight="bold"
                      variant="greenSmallButton"
                      textTransform="uppercase"
                    >
                      {stateText}
                    </Button>
                  </Box>
                </Flex>
              }
            >
              <Box px="6" py="4" overflow="auto">
                <Flex
                  flexWrap="wrap"
                  gap="2"
                  alignItems="center"
                  mb="6"
                  justifyContent={['flex-start', 'space-between']}
                >
                  <Text fontSize="x-small" color="gray.50">
                    Vote completion date
                  </Text>
                  <FormattedDate date={votingProposalDetails?.end} />
                </Flex>
                <Flex
                  flexWrap="wrap"
                  gap="2"
                  alignItems="center"
                  justifyContent={['flex-start', 'space-between']}
                >
                  <Text fontSize="x-small" color="gray.50">
                    Vote ID
                  </Text>
                  <MemberHash
                    id={votingProposalDetails?.id}
                    hashSum={votingProposalDetails?.id}
                  />
                </Flex>
              </Box>
            </Card>
            <Card
              header={
                <Text fontSize="xl" fontWeight="extrabold" color="white">
                  {votingProposalDetails?.title}
                </Text>
              }
            >
              <Box p="6">
                <Grid
                  gap="2"
                  templateColumns={['1fr', '1fr', '1fr', '4fr 1fr 1fr']}
                >
                  <GridItem pr={[0, 0, 0, '6']}>
                    <Text fontSize="x-small" color="gray.50" mb="2">
                      Description
                    </Text>
                    <ReactMarkdown
                      className="react-markdown"
                      remarkPlugins={[gfm]}
                      transformImageUri={(uri) => {
                        const coreURI = uri.split('ipfs://')

                        return uri.startsWith('ipfs')
                          ? `${env.NEXT_PUBLIC_IMAGE_BASE_URL}/ipfs/${coreURI[1]}`
                          : uri
                      }}
                    >
                      {votingProposalDetails?.body}
                    </ReactMarkdown>
                  </GridItem>
                  <GridItem>
                    <Text fontSize="x-small" color="gray.50" mb="2">
                      Created by
                    </Text>
                    <MemberHash
                      id={votingProposalDetails?.id}
                      hashSum={votingProposalDetails?.author}
                    />
                  </GridItem>
                  <GridItem>
                    <Text fontSize="x-small" color="gray.50" mb="2">
                      Vote Launch
                    </Text>
                    <FormattedDate date={votingProposalDetails?.start} />
                  </GridItem>
                </Grid>

                <Divider my="6" />

                <Box as="form" onSubmit={onSubmit}>
                  <FormControl>
                    <FormLabel fontSize="x-small" color="gray.50" mb="2">
                      Vote
                    </FormLabel>

                    {votingProposalDetails && (
                      <RadioGroup
                        name="choice"
                        defaultValue={votingProposalDetails.choices[0]}
                        isDisabled={
                          votingProposalDetails?.state === 'closed' ||
                          votingPower <= 0
                        }
                      >
                        <Stack spacing="3">
                          {votingProposalDetails.choices.map(
                            (choice: string) => {
                              return (
                                <Radio
                                  variant="greenButton"
                                  value={choice}
                                  key={choice}
                                  {...register('choice', {
                                    required: 'This is required',
                                  })}
                                >
                                  {choice}
                                </Radio>
                              )
                            }
                          )}
                        </Stack>
                      </RadioGroup>
                    )}
                  </FormControl>

                  <Button
                    variant="greenButton"
                    w="full"
                    type="submit"
                    my="4"
                    disabled={
                      votingProposalDetails?.state === 'closed' ||
                      votingPower <= 0
                    }
                    isLoading={isSubmitting}
                  >
                    Submit
                  </Button>
                </Box>

                <Divider my="6" />

                <Box>
                  <Text fontSize="x-small" color="gray.50" mb="2">
                    Result
                  </Text>

                  <Grid
                    templateColumns={['1fr', '1fr', 'repeat(3,1fr)']}
                    bgColor="gray.80"
                    py="4"
                    px={['4', '4', 0]}
                    borderRadius={['md', 'md', 'full']}
                    border="1px solid"
                    borderColor="gray.60"
                  >
                    {result &&
                      Object.keys(result).map((resultLabel: string, index) => {
                        const resultVote = result[resultLabel]

                        return (
                          <Stack
                            key={resultLabel}
                            align={['flex-start', 'flex-start', 'center']}
                            spacing="0"
                            borderLeft={[
                              'none',
                              'none',
                              `${index !== 0 ? '1px solid' : 'none'}`,
                            ]}
                            borderColor="gray.60"
                          >
                            <Text>{resultLabel}</Text>
                            <Text color="green.100">
                              {Number(resultVote).toFixed(2)}
                            </Text>
                          </Stack>
                        )
                      })}
                  </Grid>
                </Box>
              </Box>
            </Card>
          </>
        )}
      </Flex>
    </Layout>
  )
}

export default VotingDetail
