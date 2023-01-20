import {
  Box,
  Button,
  Flex,
  Icon,
  Link,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import { HiOutlineQuestionMarkCircle } from 'react-icons/hi'

import Locker from 'components/VeNewo/Locker'
import Claim from 'components/VeNewo/Claim'

import { VeNewoProvider } from 'store/contexts/veNewoContext'

import ExternalLink from 'constants/externalLink'

import Layout from 'layout'

const Page = () => {
  return (
    <VeNewoProvider>
      <Layout pageTitle="New Order | veNEWO">
        <Stack spacing="4">
          <Box position="relative">
            <Flex
              flexWrap="wrap"
              position={['static', 'absolute', 'absolute']}
              right="40px"
              top="5"
              gap="3"
              p={['24px 24px 12px', '0', '0']}
            >
              <Link href={ExternalLink.veNewoFAQ} isExternal>
                <Button
                  fontSize="0.8rem"
                  fontWeight="bold"
                  variant="outlineGrayRounded"
                  leftIcon={
                    <Icon
                      as={HiOutlineQuestionMarkCircle}
                      fontSize="18"
                      color="gray.20"
                    />
                  }
                >
                  Frequently Asked Questions
                </Button>
              </Link>
            </Flex>

            <Tabs w="full" variant="pinkTab" pt="6">
              <TabList px={['4', '4', '8']}>
                <Tab>Locker</Tab>
                <Tab>Claim</Tab>
              </TabList>

              <TabPanels>
                <TabPanel p={['4', '4', '8']}>
                  <Locker />
                </TabPanel>

                <TabPanel p={['4', '4', '8']}>
                  <Claim />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Stack>
      </Layout>
    </VeNewoProvider>
  )
}

export default Page
