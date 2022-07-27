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
import { useEffect, useState } from 'react'
import removeMd from 'remove-markdown'

import Card from 'components/Card'
import NewsCard from 'components/NewsCard'
import NewsLoader from 'components/Loaders/NewsLoader'

import mediumApi from 'api/mediumApi'
import frogsAnonymousApi from 'api/frogsAnonymousApi'

import { NEWS_TYPES } from 'models/types'
import {
  ArticleProps,
  FrogsAnonymousArticleProps,
  MediumArticleProps,
} from 'models/article'

import NewsFeedIcon from 'assets/icons/NewsFeed.svg'

const NewsFeed = () => {
  const [articles, setArticles] = useState([])
  const [isNewsLoading, setIsNewsLoading] = useState(false)

  const getArticles = async () => {
    setIsNewsLoading(true)
    const newOrderMediumContent = await mediumApi
      .get('')
      .then((res) => {
        const data = res.data.items

        if (!data) {
          return null
        }

        return data.map((article: MediumArticleProps) => {
          const placeholderThumbnail =
            '/images/backgrounds/image-placeholder.png'
          return {
            id: article.guid,
            title: article.title,
            dateTime: article.pubDate,
            webLink: article.link,
            mediaLink: article.thumbnail
              ? article.thumbnail.includes('cdn-images')
                ? article.thumbnail
                : placeholderThumbnail
              : placeholderThumbnail,
            description: removeMd(article.description)
              .replace('\n', '')
              .substring(0, 200),
            type: NEWS_TYPES.ARTICLE,
            refSource: 'Medium.com',
          }
        })
      })
      .catch((err) => {
        console.error('[NEWSFEED ERROR]', err)
      })

    const frogsAnonContent = await frogsAnonymousApi
      .getEntries({
        content_type: 'blogPost',
        order: '-fields.publishDate',
      })
      .then((res) => {
        const data = res.items

        if (!data) {
          return null
        }

        return (data as FrogsAnonymousArticleProps[]).map((article) => {
          return {
            id: article.sys.id,
            title: article.fields.title,
            dateTime: article.fields.publishDate,
            webLink: `https://frogsanon.neworder.network/articles/${article.fields.slug}/
    				`,
            mediaLink: `https:${article.fields.heroImage.fields.file.url}`,
            description: removeMd(article.fields.leadingParagraph)
              .replace('\n', '')
              .substring(0, 300),
            type: NEWS_TYPES.ARTICLE,
            refSource: 'Frogs Anonymous',
          }
        })
      })
      .catch((err) => {
        console.error('[NEWSFEED ERROR]', err)
      })

    // Combine all articles
    const allArticles = [...newOrderMediumContent, ...(frogsAnonContent as [])]

    // Sort date from latest to oldest
    const sortedByDate = allArticles.sort(function (a, b) {
      const diff = +new Date(b.dateTime) - +new Date(a.dateTime)
      return diff
    })

    setArticles(sortedByDate as [])
    setIsNewsLoading(false)
  }

  useEffect(() => {
    getArticles()
  }, [])

  const newLoader = () => {
    return (
      <Stack>
        <NewsLoader />
        <NewsLoader />
        <NewsLoader />
        <NewsLoader />
        <NewsLoader />
      </Stack>
    )
  }

  return (
    <Tabs w="full" minW="100%" variant="greenTab">
      <Card
        header={
          <Flex
            minW="100%"
            alignItems="center"
            justifyContent="space-between"
            flexWrap="wrap"
            gap="3"
          >
            <Box display="flex" alignItems="center">
              <Icon as={NewsFeedIcon} fontSize="21" />
              <Text
                color="green.100"
                fontWeight="bold"
                fontSize="0.9rem"
                mx="2"
              >
                Updates
              </Text>
            </Box>
            <TabList>
              <Tab>All</Tab>
              <Tab>Articles</Tab>
              <Tab>Videos</Tab>
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
            <TabPanel>
              {/* TODO UPDATE SO IT WILL ALSO INCLUDE VIDEO HERE */}

              {isNewsLoading
                ? newLoader()
                : articles
                    ?.filter((article: ArticleProps) => {
                      return article.type === NEWS_TYPES.ARTICLE
                    })
                    ?.map((article: ArticleProps) => {
                      return <NewsCard key={article.id} news={article} />
                    })}
            </TabPanel>
            <TabPanel w="full">
              {isNewsLoading
                ? newLoader()
                : articles
                    ?.filter((article: ArticleProps) => {
                      return article.type === NEWS_TYPES.ARTICLE
                    })
                    ?.map((article: ArticleProps) => {
                      return <NewsCard key={article.id} news={article} />
                    })}
            </TabPanel>
            <TabPanel w="full">
              {isNewsLoading
                ? newLoader()
                : articles
                    ?.filter((article: ArticleProps) => {
                      return article.type === NEWS_TYPES.VIDEO
                    })
                    ?.map((article: ArticleProps) => {
                      return <NewsCard key={article.id} news={article} />
                    })}
            </TabPanel>
          </TabPanels>
        </Box>
      </Card>
    </Tabs>
  )
}

export default NewsFeed
