import {
  Badge,
  Box,
  Flex,
  Icon,
  ListItem,
  Text,
  Tooltip,
  UnorderedList,
} from '@chakra-ui/react'

import VotingIcon from 'assets/icons/Voting.svg'

const GovernanceVaultTooltip = () => {
  return (
    <Flex alignItems="center" justifyContent="center" mt="4">
      <Tooltip
        hasArrow
        label={
          <Box>
            <Text fontWeight="extrabold">Governance Vault: 0% APY</Text>
            <Text my="2">
              Staking in the governance vault is ONLY for voting purposes:
            </Text>
            <UnorderedList pl="4">
              <ListItem mb="2">
                Staking in the governance vault does
                <strong> not earn yield</strong>
              </ListItem>
              <ListItem>
                Tokens must be staked at the time of snapshot in order to have
                voting power
              </ListItem>
            </UnorderedList>
          </Box>
        }
      >
        <Badge variant="outline" color="white" cursor="default" px="2" py="1">
          <Flex alignItems="center" gap="1">
            <Icon
              as={VotingIcon}
              sx={{
                path: {
                  fill: 'white',
                },
              }}
              fontSize="20px"
            />
            <Text>Governance Vault 0% APY</Text>
          </Flex>
        </Badge>
      </Tooltip>
    </Flex>
  )
}
export default GovernanceVaultTooltip
