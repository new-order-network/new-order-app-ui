import {
  Button,
  Divider,
  HStack,
  InputRightAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Stack,
  Text,
  UseDisclosureProps,
} from '@chakra-ui/react'

import Input from 'components/Forms/Input'

import { numberFormatter } from 'lib/utils/format'

interface WithdrawModalProps extends UseDisclosureProps {
  overlay: JSX.Element
  currentDeposit: string
  tokenSymbol: string
  withdrawAmount: string
  setWithdrawAmount: (withdrawAmount: string) => void
  withdrawTokens: () => void
  loading: boolean
}
const WithdrawModal: React.FC<WithdrawModalProps> = ({
  isOpen = false,
  onClose = () => {
    return null
  },
  overlay,
  currentDeposit,
  tokenSymbol,
  withdrawAmount,
  setWithdrawAmount,
  withdrawTokens,
  loading,
}) => {
  const onMax = async () => {
    setWithdrawAmount(currentDeposit)
  }
  return (
    <Modal
      isCentered
      motionPreset="scale"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={loading}
    >
      {overlay}
      <ModalContent
        bgColor="gray.90"
        color="white"
        border="1px"
        borderRadius="md"
        borderColor="gray.90"
      >
        <ModalHeader fontSize="0.9rem">Withdraw {tokenSymbol}</ModalHeader>
        <ModalCloseButton
          mt="0.5"
          isDisabled={loading}
          _focus={{ boxShadow: 'none' }}
          _hover={{ color: 'brand.red' }}
        />
        <Divider h="1px" bg="gray.65" />
        <ModalBody py="4">
          <Stack spacing="8">
            <Text>
              Current Deposit:{' '}
              {`${numberFormatter(currentDeposit, 4)} ${tokenSymbol}`}
            </Text>
            <Input
              formControlWidth="full"
              formLabelColor="gray.60"
              formLabelBgColor="gray.90"
              id="vault-withdraw-amount"
              value={withdrawAmount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                return setWithdrawAmount(e.target.value)
              }}
              // isDisabled={!accountData?.address || loading ? true : false}
              type="number"
              formLabelFontSize="0.8rem"
              label="Withdraw Amount"
              inputRightAddOn={
                <InputRightAddon
                  onClick={async () => {
                    await onMax()
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
            />
            <HStack>
              <Button
                fontSize="0.8rem"
                variant="outlineGrayRounded"
                w="full"
                justifyContent={['flex-start', 'center']}
                onClick={() => {
                  onClose()
                }}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                fontSize="0.8rem"
                variant="greenButton"
                w="full"
                fontWeight="bold"
                justifyContent={['flex-start', 'center']}
                py="1"
                disabled={
                  !withdrawAmount || loading || Number(currentDeposit) === 0
                }
                isLoading={loading}
                loadingText="Withdrawing"
                onClick={async () => {
                  withdrawTokens()
                }}
              >
                Withdraw
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default WithdrawModal
