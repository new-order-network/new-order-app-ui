import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import dayjs from 'dayjs'
import { useAccount } from 'wagmi'

import { Td, Tr } from 'components/Table'
import ModalOverlay from 'components/ModalOverlay'
import DeclarationModal from 'components/VeNewo/DeclarationModal'

import useVeToken from 'hooks/useVeToken'

import { useVeNewoContext } from 'store/contexts/veNewoContext'
import { useContractContext } from 'store/contexts/contractContext'

interface LockedTokenProps {
  veTokenAddress: `0x${string}`
  tokenAddress: `0x${string}`
}

const LockedToken: React.FC<LockedTokenProps> = ({
  veTokenAddress,
  tokenAddress,
}) => {
  const {
    isOpen: declarationModalIsOpen,
    onOpen: declarationModalOnOpen,
    onClose: declarationModalOnClose,
  } = useDisclosure()
  const { contracts } = useContractContext()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { address } = useAccount()
  const {
    assetBalance,
    unlockDate,
    totalRewardsEarned,
    exitAllRewards,
    updateState,
  } = useVeNewoContext()
  const veToken = useVeToken(veTokenAddress, tokenAddress)

  const exit = async () => {
    if (contracts.VENEWO === veTokenAddress) {
      await exitAllRewards?.()
    } else {
      await veToken.exit()
    }
    await updateState?.()
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay />
        <ModalContent
          bgColor="gray.90"
          color="white"
          border="1px"
          borderRadius="md"
          borderColor="gray.90"
        >
          <ModalCloseButton
            mt="0.5"
            _focus={{ boxShadow: 'none' }}
            _hover={{ color: 'brand.red' }}
          />

          <ModalBody pt="12" pb="8" h="fit-content">
            <Stack spacing="8">
              <Alert
                status="info"
                w="full"
                pos="static"
                alignItems="flex-start"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>Info</AlertTitle>
                  <AlertDescription>
                    This action will remove you from veNEWO rewards and will
                    claim{' '}
                    <Text as="span" fontWeight="800">
                      {Number(totalRewardsEarned).toFixed(4)} NEWO
                    </Text>{' '}
                    from the vaults
                  </AlertDescription>
                </Box>
              </Alert>

              <Button
                variant="greenButton"
                onClick={() => {
                  onClose()
                  declarationModalOnOpen()
                }}
                w="full"
              >
                Withdraw from veNEWO
              </Button>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>

      <DeclarationModal
        isOpen={declarationModalIsOpen}
        onClose={declarationModalOnClose}
        submitFn={exit}
      />

      <Tr>
        <Td>NEWO</Td>
        <Td>{Number(assetBalance).toFixed(4)}</Td>
        <Td>{dayjs.unix(unlockDate).format('MMM DD YYYY')}</Td>
        <Td>
          <Tooltip
            hasArrow
            label="You can't withdraw your funds before the unlock date"
            isDisabled={dayjs().isAfter(dayjs.unix(unlockDate))}
          >
            <Button
              variant="greenButton"
              isDisabled={
                !address ||
                dayjs().isBefore(dayjs.unix(unlockDate)) ||
                Number(assetBalance) <= 0
              }
              onClick={onOpen}
              isLoading={veToken.loading}
            >
              Withdraw
            </Button>
          </Tooltip>
        </Td>
      </Tr>
    </>
  )
}

export default LockedToken
