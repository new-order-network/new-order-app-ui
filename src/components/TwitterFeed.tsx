import {
  Box,
  Flex,
  Icon,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import { useTheme } from '@chakra-ui/react'

import Card from 'components/Card'
import TwitterLoader from 'components/Loaders/TwitterLoader'

import TwitterFeedIcon from 'assets/icons/TwitterFeed.svg'

const TwitterFeed = () => {
  const theme = useTheme()

  return (
    <Tabs w="full" variant="greenTab">
      <Card
        header={
          <Flex
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="2"
          >
            <Box display="flex" alignItems="center">
              <Icon as={TwitterFeedIcon} fontSize="21" />
              <Text
                color="green.100"
                fontWeight="bold"
                fontSize="0.9rem"
                mx="2"
              >
                Twitter Feed
              </Text>
            </Box>
            <TabList>
              <Tab textTransform="uppercase">New Order</Tab>
            </TabList>
          </Flex>
        }
      >
        <Box
          p="3"
          maxH="2xl"
          minH="2xl"
          overflow="auto"
          sx={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray.80',
              borderRadius: '24px',
            },
          }}
        >
          <TabPanels w="full">
            <TabPanel p="0">
              <TwitterTimelineEmbed
                sourceType="profile"
                screenName="neworderDAO"
                theme="dark"
                noFooter
                transparent
                linkColor={theme.colors.green[100]}
                borderColor={theme.colors.gray[80]}
                onLoad={(element) => {
                  const htmlElement =
                    element.contentWindow.document.getElementsByTagName(
                      'html'
                    )[0]
                  htmlElement.style.background = theme.colors.gray[90]
                }}
                placeholder={
                  <Stack>
                    <TwitterLoader />
                    <TwitterLoader />
                    <TwitterLoader />
                    <TwitterLoader />
                  </Stack>
                }
              />
            </TabPanel>
          </TabPanels>
        </Box>
      </Card>
    </Tabs>
  )
}

export default TwitterFeed
