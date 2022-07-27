import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  UseDisclosureProps,
} from '@chakra-ui/react'
import { useState } from 'react'

import Input from 'components/Forms/Input'
import GovernanceVaultTooltip from 'components/Voting/GovernanceVaultTooltip'

import useGovernanceVault from 'hooks/useGovernanceVault'

import { StakingTypeProps } from 'models/voting'

import { useVotingContext } from 'store/contexts/votingContext'
import { useContractContext } from 'store/contexts/contractContext'

import DepositIcon from 'assets/icons/Deposit.svg'

interface StakingModalProps extends UseDisclosureProps {
  stakeAmount: number
  setStakeAmount: (stakeAmount: number) => void
  overlay: JSX.Element
}

const StakingModal: React.FC<StakingModalProps> = ({
  isOpen = false,
  onClose = () => {
    return null
  },
  overlay,
  stakeAmount,
  setStakeAmount,
}) => {
  const { allowance, updateState } = useVotingContext()
  const { contracts } = useContractContext()
  const governanceVault = useGovernanceVault(
    contracts?.NEWO,
    contracts?.GOVERNANCE_VAULT
  )
  const [stakingType, setStakingType] = useState<StakingTypeProps>('STAKING')

  return (
    <Modal
      isCentered
      motionPreset="scale"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={!governanceVault.loading}
    >
      {overlay}
      <ModalContent
        bgColor="gray.90"
        color="white"
        border="1px"
        borderRadius="md"
        borderColor="gray.90"
      >
        <ModalCloseButton
          mt="0.5"
          isDisabled={governanceVault.loading}
          _focus={{ boxShadow: 'none' }}
          _hover={{ color: 'brand.red' }}
        />
        <ModalBody py="4">
          <Flex
            w="full"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            mb="6"
          >
            <Box
              borderColor="gray.65"
              borderWidth="1px"
              borderRadius="full"
              fontSize="0.8rem"
            >
              <Button
                fontSize="0.8rem"
                h="28px"
                borderRadius="full"
                bg={stakingType === 'STAKING' ? 'green.80' : 'transparent'}
                borderColor={stakingType === 'STAKING' ? 'green.100' : 'none'}
                borderWidth={stakingType === 'STAKING' ? '2px' : '0'}
                _hover={{
                  bg: 'none',
                  color: 'green.100',
                }}
                isDisabled={
                  !allowance ||
                  Number(allowance) <= 0 ||
                  governanceVault.loading
                }
                onClick={() => {
                  return setStakingType('STAKING')
                }}
              >
                Staking
              </Button>
              <Button
                fontSize="0.8rem"
                h="28px"
                borderRadius="full"
                bg={stakingType === 'UNSTAKING' ? 'green.80' : 'transparent'}
                borderColor={stakingType === 'UNSTAKING' ? 'green.100' : 'none'}
                borderWidth={stakingType === 'UNSTAKING' ? '2px' : '0'}
                _hover={{
                  bg: 'none',
                  borderWidth: 'none',
                  color: 'green.100',
                }}
                isDisabled={
                  !allowance ||
                  Number(allowance) <= 0 ||
                  governanceVault.loading
                }
                onClick={() => {
                  return setStakingType('UNSTAKING')
                }}
              >
                Unstaking
              </Button>
            </Box>
          </Flex>
          {!allowance || Number(allowance) <= 0 ? (
            <Flex
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              gap="3"
            >
              <Text fontSize="sm">
                Approve the contract to spend your token
              </Text>
              <Button
                fontSize="0.8rem"
                fontWeight="bold"
                bg="gray.100"
                color="white"
                isLoading={governanceVault.loading}
                loadingText="Approving"
                disabled={governanceVault.loading}
                onClick={async () => {
                  if (!allowance || Number(allowance) <= 0) {
                    await governanceVault.approveVault()
                    await updateState?.()
                  } else {
                    if (stakingType === 'STAKING') {
                      await governanceVault
                        ?.stake(stakeAmount.toString())
                        .then(() => {
                          setStakeAmount(0)
                          onClose()
                        })
                    } else if (stakingType === 'UNSTAKING') {
                      await governanceVault
                        ?.unstake(stakeAmount.toString())
                        .then(() => {
                          setStakeAmount(0)
                          onClose()
                        })
                    }

                    await updateState?.()
                  }
                }}
                leftIcon={<Icon as={DepositIcon} />}
              >
                Approve
              </Button>
            </Flex>
          ) : (
            <Grid templateColumns={['2fr auto']}>
              <GridItem mr="2">
                <Input
                  formControlWidth="full"
                  formLabelColor="gray.60"
                  formLabelBgColor="gray.90"
                  id="stake-amount"
                  isDisabled={
                    !allowance ||
                    Number(allowance) <= 0 ||
                    governanceVault.loading
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    return setStakeAmount(parseFloat(e.target.value))
                  }}
                  type="number"
                  value={stakeAmount}
                  label={
                    stakingType === 'STAKING'
                      ? 'Staking Amount'
                      : 'Withdraw Amount'
                  }
                />
              </GridItem>
              <GridItem>
                <Button
                  fontSize="0.8rem"
                  fontWeight="bold"
                  bg="gray.100"
                  color="white"
                  isLoading={governanceVault.loading}
                  loadingText="Loading"
                  disabled={!stakeAmount || governanceVault.loading}
                  onClick={async () => {
                    if (stakingType === 'STAKING') {
                      await governanceVault
                        ?.stake(stakeAmount.toString())
                        .then(() => {
                          setStakeAmount(0)
                          onClose()
                        })
                    } else if (stakingType === 'UNSTAKING') {
                      await governanceVault
                        ?.unstake(stakeAmount.toString())
                        .then(() => {
                          setStakeAmount(0)
                          onClose()
                        })
                    }

                    await updateState?.()
                  }}
                  leftIcon={<Icon as={DepositIcon} />}
                >
                  {stakingType === 'STAKING' ? 'Stake' : 'Unstake'}
                </Button>
              </GridItem>
            </Grid>
          )}

          <GovernanceVaultTooltip />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default StakingModal
