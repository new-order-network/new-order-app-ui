import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Text,
} from '@chakra-ui/react'
import dayjs from 'dayjs'

interface NewsCardProps {
  news: {
    title: string
    dateTime: string
    webLink: string
    mediaLink: string
    type: string
    refSource: string
    description: string
  }
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const { title, mediaLink, type, refSource, description, dateTime, webLink } =
    news

  return (
    <Grid
      gridTemplateColumns={[
        '1fr',
        '1fr',
        '180px auto',
        '200px auto',
        '240px auto',
      ]}
      mb="4"
    >
      <GridItem>
        <Box w="full">
          <AspectRatio ratio={16 / 9} objectFit="cover" position="relative">
            <Image
              bg="gray.85"
              src={
                mediaLink
                  ? mediaLink
                  : 'images/backgrounds/image-placeholder.png'
              }
              alt={title}
            />
          </AspectRatio>
        </Box>
      </GridItem>
      <GridItem>
        <Flex ml={[0, 0, '3', '5']} mb="6" flexDirection="column">
          <Flex
            mb="3"
            w="full"
            mt={['4', '4', 0]}
            justifyContent="space-between"
            gap="2"
            flexWrap="wrap"
          >
            <Flex flexWrap="wrap" gap="2">
              <Button
                fontSize="0.65rem"
                fontWeight="bold"
                textTransform="uppercase"
                variant="greenSmallButton"
                cursor="default"
              >
                {type}
              </Button>
              <Text color="gray.65" fontSize="0.75rem">
                {refSource}
              </Text>
            </Flex>
            <Text fontSize="0.75rem" color="gray.65">
              {dayjs(new Date(dateTime)).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Flex>
          <Box pr="4">
            <Link isExternal href={webLink}>
              <Text
                mb="2"
                fontSize="0.9rem"
                lineHeight="1.2"
                fontWeight="extrabold"
                _hover={{
                  color: 'green.100',
                }}
              >
                {title}
              </Text>
            </Link>
            <Text fontSize="0.8rem" noOfLines={[3]}>
              {description}
            </Text>
          </Box>
        </Flex>
      </GridItem>
    </Grid>
  )
}
export default NewsCard
