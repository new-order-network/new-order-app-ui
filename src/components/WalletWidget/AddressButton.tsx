import { useAccount, useEnsName } from 'wagmi'
import {
  Center,
  Divider,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { FiMoreVertical } from 'react-icons/fi'

import NetworkButton from 'components/WalletWidget/NetworkButton'
import BuyNewoButton from 'components/WalletWidget/BuyNewoButton'

import { numberFormatter, shortAddress } from 'lib/utils/format'
import { getIconForConnector } from 'lib/utils/wallet'

import { useNewoContext } from 'store/contexts/newoContext'

const AddressButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { data: accountData } = useAccount()
  const { data: ensName } = useEnsName()
  const { newoBalance, disconnectWallet } = useNewoContext()

  return (
    <Flex flexWrap="wrap" gap={['4', '1']} ml={['3', 0]}>
      <NetworkButton />

      <Menu isOpen={isOpen} placement="bottom-end" closeOnSelect>
        <MenuButton
          mx={1}
          py={[1, 2, 2]}
          px={4}
          borderRadius="full"
          backgroundColor="gray.85"
          _hover={{
            svg: {
              color: 'green.100',
            },
          }}
          fontWeight="normal"
          onClick={isOpen ? onClose : onOpen}
        >
          <Flex alignItems="center">
            <Text fontSize={['0.8rem', '1rem']} px="3" fontWeight="extrabold">
              {numberFormatter(newoBalance, 4)} NEWO
            </Text>
            <Center mx="4" height="30px">
              <Divider orientation="vertical" />
            </Center>
            {accountData?.connector?.id && (
              <Icon
                fontSize="20"
                fill="white"
                as={getIconForConnector(accountData?.connector?.id)}
              />
            )}
            <Text fontSize={['0.8rem', '1rem']} pl="3" pr="6">
              {shortAddress(ensName ?? accountData?.address)}
            </Text>

            <Icon
              fontSize="18"
              fill="gray.40"
              cursor="pointer"
              _hover={{
                color: 'green.100',
              }}
              as={FiMoreVertical}
            />
          </Flex>
        </MenuButton>

        <MenuList backgroundColor="gray.75" fontSize="0.8rem" border="none">
          <MenuItem
            onClick={() => {
              return disconnectWallet?.()
            }}
            _hover={{
              color: 'brand.orange',
            }}
          >
            Disconnect from {accountData?.connector?.name || 'Wallet'}
          </MenuItem>
          <BuyNewoButton />
        </MenuList>
      </Menu>
    </Flex>
  )
}
export default AddressButton
