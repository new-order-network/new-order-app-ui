import { FormEvent, useEffect, useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  HStack,
  Icon,
  InputRightAddon,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Text,
  Tooltip,
} from '@chakra-ui/react'
import { MdOutlineInfo } from 'react-icons/md'
import { FaRegCheckCircle } from 'react-icons/fa'
import dayjs from 'dayjs'
import { useAccount } from 'wagmi'

import Card from 'components/Card'
import Input from 'components/Forms/Input'
import { Table, Tbody, Th, Thead, Tr } from 'components/Table'
import CustomDatePicker from 'components/Forms/DatePicker'
import RegistrationReward from 'components/VeNewo/RegistrationReward'
import ConnectOverlay from 'components/ConnectOverlay'

import useVeToken from 'hooks/useVeToken'
import useVeVault from 'hooks/useVeVault'

import { numberFormatter } from 'lib/utils/format'
import { getKeyByValue } from 'lib/utils/data'

import { LOCK_ACTIONS } from 'models/types'

import { useContractContext } from 'store/contexts/contractContext'
import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useNewoContext } from 'store/contexts/newoContext'

import { lockTimeTable } from 'constants/venewo'

const LockForm = () => {
  const { allowance, unlockDate, totalSupply, totalAssets, updateState } =
    useVeNewoContext()
  const { newoBalance } = useNewoContext()
  const { contracts } = useContractContext()
  const { address } = useAccount()
  const veNewo = useVeToken(contracts.VENEWO, contracts.NEWO)

  const veNewoUsdcVault = useVeVault(
    contracts.VE_NEWO_USDC_LP_VAULT,
    contracts.NEWO_USDC_LP,
    contracts.NEWO,
    contracts.USDC
  )
  const veNewoWavaxVault = useVeVault(
    contracts.VE_NEWO_WAVAX_LP_VAULT,
    contracts.NEWO_WAVAX_LP,
    contracts.NEWO,
    contracts.WAVAX
  )

  const [amount, setAmount] = useState('')
  const [lockTime, setLockTime] = useState(dayjs().add(91, 'd').toDate())
  const [lockTimeDuration, setLockTimeDuration] = useState(0)
  const [minLockTime, setMinLockTime] = useState(dayjs().add(91, 'd').toDate())
  const [projectedMultiplier, setProjectedMultiplier] = useState('1.00')
  const [averageLockTime, setAverageLockTime] = useState('0')
  const [newoShare, setNewoShare] = useState('')

  const [actionType, setActionType] = useState<LOCK_ACTIONS>()

  const getNewoShare = async () => {
    if (veNewoUsdcVault && address) {
      const newoShare = await veNewoUsdcVault?.getNewoShare(address)
      setNewoShare(newoShare)
    } else if (veNewoWavaxVault && address) {
      const newoShare = await veNewoWavaxVault?.getNewoShare(address)
      setNewoShare(newoShare)
    }
  }

  useEffect(() => {
    getNewoShare()
    // eslint-disable-next-line
  }, [address])

  useEffect(() => {
    if (unlockDate !== 0 && dayjs.unix(unlockDate).isAfter(lockTime)) {
      const newMinLockTime = dayjs.unix(unlockDate).add(10, 'second').toDate()
      setLockTime(newMinLockTime)
      setMinLockTime(newMinLockTime)
    } else {
      setLockTime(dayjs().add(91, 'd').toDate())
      setMinLockTime(dayjs().add(91, 'd').toDate())
    }
    // eslint-disable-next-line
  }, [unlockDate])

  useEffect(() => {
    if (lockTime) {
      const duration = dayjs(lockTime).diff(dayjs(), 'day')
      const multiplier = getKeyByValue(lockTimeTable, duration)

      if (multiplier) {
        setProjectedMultiplier(multiplier)
      }
    }
  }, [lockTime])

  useEffect(() => {
    if (totalSupply && totalAssets) {
      const averageMultiplier = Number(totalSupply) / Number(totalAssets)
      const averageLockTimeKey = Object.keys(lockTimeTable).reduce(
        (prev, curr) => {
          return Math.abs(Number(curr) - averageMultiplier) <
            Math.abs(Number(prev) - averageMultiplier)
            ? curr
            : prev
        }
      )
      const averageLockTime =
        lockTimeTable[Number(averageLockTimeKey) as keyof typeof lockTimeTable]
      setAverageLockTime(String(averageLockTime))
    }
  }, [totalSupply, totalAssets])

  const onSubmit = async () => {
    setActionType(LOCK_ACTIONS.LOCK)
    if (address) {
      await veNewo.deposit(amount, address, lockTime)
    }
  }

  const onAmountInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(String(evt.target.value))
  }

  const onAmountSliderChange = (value: number) => {
    setAmount(String(value))
  }

  const onLockTimeInputChange = (
    date: Date | null | FormEvent<HTMLDivElement>
  ) => {
    setLockTime(dayjs(date as Date).toDate())
  }

  const onLockTimeSliderChange = (value: number) => {
    if (value === 0) {
      setLockTime(dayjs(minLockTime).add(10, 'second').toDate())
    } else {
      setLockTime(dayjs(minLockTime).add(value, 'd').toDate())
    }
    setLockTimeDuration(value)
  }

  const handleApproveVeNewo = async () => {
    setActionType(LOCK_ACTIONS.APPROVE)
    await veNewo.approveVeToken()
    await updateState?.()
  }

  return (
    <Stack spacing="1">
      <Text fontSize="lg">Lock your tokens</Text>
      <Text color="gray.50" fontSize="md">
        Maximize yield and voting power by locking NEWO.
      </Text>
      <ConnectOverlay isConnected={!!address}>
        <Card border="1px solid" borderColor="gray.80" p="5">
          <Box as="form">
            <Stack spacing="1">
              <Text color="brand.green" fontSize="lg">
                Step 1
              </Text>
              <Text>Approve the contract to spend your token</Text>
            </Stack>

            <Button
              w="full"
              mt="2"
              variant="greenButton"
              onClick={handleApproveVeNewo}
              isDisabled={Number(allowance) > 0 || !address}
              loadingText="Approving"
              isLoading={veNewo.loading && actionType === LOCK_ACTIONS.APPROVE}
              rightIcon={
                Number(allowance) > 0 ? (
                  <Icon as={FaRegCheckCircle} w="4" h="4" />
                ) : (
                  <></>
                )
              }
            >
              {Number(allowance) > 0 ? 'Approved' : 'Approve'}
            </Button>

            <Divider my="3" bgColor="brand.green" />

            <Box as="form">
              <Stack spacing="1">
                <Text color="brand.green" fontSize="lg">
                  Step 2
                </Text>
                <Text>Set an amount and duration and lock your tokens</Text>
              </Stack>

              <Stack spacing="3" my="2">
                <Flex align="center" justify="space-between">
                  <Text>Amount</Text>
                  <Text fontSize="sm">
                    Balance: {numberFormatter(newoBalance, 4)}
                  </Text>
                </Flex>

                <Slider
                  aria-label="amount-slider"
                  variant="greenSlider"
                  defaultValue={0}
                  max={Number(newoBalance)}
                  onChange={onAmountSliderChange}
                  value={Number(amount)}
                  focusThumbOnChange={false}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>

                <Input
                  formControlWidth="full"
                  formLabelColor="gray.60"
                  formLabelBgColor="gray.90"
                  id="amount"
                  label="Amount"
                  inputRightAddOn={
                    <InputRightAddon
                      onClick={async () => {
                        setAmount(newoBalance)
                      }}
                      fontSize="0.7rem"
                      cursor="pointer"
                      _hover={{
                        bg: 'gray.60',
                      }}
                      // eslint-disable-next-line react/no-children-prop
                      children="MAX"
                    />
                  }
                  max={Number(allowance)}
                  value={amount}
                  onChange={onAmountInputChange}
                />
              </Stack>

              <Stack spacing="3" my="4">
                <Flex align="center" justify="space-between">
                  <HStack spacing="1">
                    <Text>Duration</Text>
                    <Tooltip
                      hasArrow
                      label="If you only want to extend your locking period, simply set the amount to 0 and then choose your desired locking date. If you have previously locked, your minimum lock time should be greater than your previous deposit's lock time."
                    >
                      <Flex as="span" align="center">
                        <Icon as={MdOutlineInfo} w="4" h="4" />
                      </Flex>
                    </Tooltip>
                  </HStack>
                  <Text fontSize="sm">
                    Duration (in days): {dayjs(lockTime).diff(dayjs(), 'day')}
                  </Text>
                </Flex>

                <Slider
                  aria-label="duration-slider"
                  variant="greenSlider"
                  value={lockTimeDuration}
                  onChange={onLockTimeSliderChange}
                  max={dayjs().add(1095, 'd').diff(minLockTime, 'd')}
                  focusThumbOnChange={false}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb />
                </Slider>
                <CustomDatePicker
                  placeholder=""
                  onChange={(date) => {
                    onLockTimeInputChange(date)
                  }}
                  selected={lockTime}
                  minDate={minLockTime}
                  maxDate={dayjs().add(1095, 'd').toDate()}
                />
                <Stack spacing="0">
                  <HStack align="center" color="gray.30">
                    <Text>Projected Multiplier: {projectedMultiplier}x</Text>
                    <Tooltip
                      hasArrow
                      label="This will show your expected multiplier depending on how long you will lock your NEWO"
                    >
                      <Flex as="span" align="center">
                        <Icon as={MdOutlineInfo} w="4" h="4" />
                      </Flex>
                    </Tooltip>
                  </HStack>

                  <HStack align="center" color="gray.30">
                    <Text>AVG Lock Time: {averageLockTime} days</Text>
                    <Tooltip
                      hasArrow
                      label="This will show your expected multiplier depending on how long you will lock your NEWO"
                    >
                      <Flex as="span" align="center">
                        <Icon as={MdOutlineInfo} w="4" h="4" />
                      </Flex>
                    </Tooltip>
                  </HStack>
                </Stack>

                <Button
                  variant="greenButton"
                  onClick={onSubmit}
                  loadingText="Creating Lock"
                  isLoading={veNewo.loading && actionType === LOCK_ACTIONS.LOCK}
                  isDisabled={!amount || !address}
                >
                  Create Lock
                </Button>
              </Stack>
            </Box>

            <Divider my="3" bgColor="brand.green" />

            <Stack spacing="1">
              <HStack>
                <Text color="brand.green" fontSize="lg">
                  Step 3
                </Text>

                <Tooltip
                  hasArrow
                  label={
                    <Box>
                      <Text
                        as="span"
                        mr="1"
                        color="brand.orange"
                        fontWeight="extrabold"
                      >
                        NOTE:
                      </Text>
                      <Text as="span">
                        You can deposit and register on the various rewards
                        here. You will need to press on the register button
                        again if you locked more NEWO for veNEWO to get a higher
                        boost.
                      </Text>
                    </Box>
                  }
                >
                  <Flex as="span" align="center">
                    <Icon as={MdOutlineInfo} w="4" h="4" color="brand.green" />
                  </Flex>
                </Tooltip>
              </HStack>
              <Text>Deposit and Register for various rewards</Text>
            </Stack>

            <Box
              border="1px solid"
              borderColor="gray.80"
              borderRadius="8"
              my="4"
              overflow="hidden"
            >
              <Table variant="grayStriped" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>AVG APR</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <RegistrationReward
                    columns={['name', 'apr', 'actions']}
                    actions={['register']}
                    veVaultAddress={contracts.VE_NEWO_SINGLE_SIDE_VAULT}
                    tokenAddress={contracts.NEWO}
                  />
                </Tbody>
              </Table>
            </Box>

            <Divider my="3" bgColor="brand.green" />

            <Stack spacing="1">
              <Text color="brand.green" fontSize="lg">
                Optional Step: for LP Providers
              </Text>
              <Text fontSize="sm">
                MIN locked NEWO for LP boost: {Number(newoShare).toFixed(4)}
              </Text>
            </Stack>

            <Box
              border="1px solid"
              borderColor="gray.80"
              borderRadius="8"
              my="4"
              overflow="hidden"
            >
              <Table variant="grayStriped" size="sm">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>AVG APR</Th>
                    <Th>Boost</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {contracts.VE_NEWO_USDC_LP_VAULT && (
                    <RegistrationReward
                      columns={['name', 'apr', 'boost', 'actions']}
                      actions={['deposit', 'register']}
                      veVaultAddress={contracts.VE_NEWO_USDC_LP_VAULT}
                      tokenAddress={contracts.NEWO_USDC_LP}
                      token0={contracts.NEWO}
                      token1={contracts.USDC}
                    />
                  )}

                  {contracts.VE_NEWO_WAVAX_LP_VAULT && (
                    <RegistrationReward
                      columns={['name', 'apr', 'boost', 'actions']}
                      actions={['deposit', 'register']}
                      veVaultAddress={contracts.VE_NEWO_WAVAX_LP_VAULT}
                      tokenAddress={contracts.NEWO_WAVAX_LP}
                      token0={contracts.NEWO}
                      token1={contracts.WAVAX}
                    />
                  )}
                </Tbody>
              </Table>
            </Box>
          </Box>
        </Card>
      </ConnectOverlay>
    </Stack>
  )
}

export default LockForm
