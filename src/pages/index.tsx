import {
  Box,
  Button,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Link,
  Grid,
  GridItem,
} from '@chakra-ui/react'

import NewsFeed from 'components/NewsFeed'
import TwitterFeed from 'components/TwitterFeed'

import ExternalLink from 'constants/externalLink'

import Layout from 'layout'

const Home = () => {
  return (
    <Layout>
      <Stack spacing="4">
        <Box position="relative">
          <Flex
            flexWrap="wrap"
            position={['static', 'absolute', 'absolute']}
            right="40px"
            top="6"
            gap="3"
            p={['24px 24px 12px', '0', '0']}
          >
            <Link href={ExternalLink.linktree} isExternal>
              <Button
                fontSize="0.8rem"
                fontWeight="bold"
                variant="outlineGrayRounded"
              >
                Community
              </Button>
            </Link>
            <Link href={ExternalLink.dework} isExternal>
              <Button
                fontSize="0.8rem"
                fontWeight="bold"
                variant="outlineGrayRounded"
              >
                Contributor Bounties
              </Button>
            </Link>
          </Flex>
          <Tabs w="full" variant="pinkTab">
            <TabList p={['0 24px', '28px 40px 0', '28px 40px 0']}>
              <Tab>News</Tab>
            </TabList>

            <TabPanels p={['12px 24px 0', '12px 40px 0', '28px 40px 0']}>
              <TabPanel p="0">
                <Tabs
                  p="0"
                  display={['block', 'block', 'block', 'none', 'none']}
                  w="full"
                  variant="pinkPillTab"
                >
                  <TabList>
                    <Tab>Updates</Tab>
                    <Tab>Twitter Feed</Tab>
                  </TabList>
                  <TabPanels py="4">
                    <TabPanel p="0">
                      <NewsFeed />
                    </TabPanel>
                    <TabPanel p="0">
                      <TwitterFeed />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
                <Grid
                  display={['none', 'none', 'none', 'grid', 'grid']}
                  gridTemplateColumns={[
                    '1fr',
                    '1fr',
                    '1fr',
                    '2fr 1fr',
                    '2fr 1fr',
                  ]}
                  gap="5"
                >
                  <GridItem>
                    <NewsFeed />
                  </GridItem>
                  <GridItem>
                    <TwitterFeed />
                  </GridItem>
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Stack>
    </Layout>
  )
}

export default Home
