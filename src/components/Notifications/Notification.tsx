import { AspectRatio, Icon, Image, Link, Stack, Text } from '@chakra-ui/react'
import { AiOutlineLink } from 'react-icons/ai'

import Card from 'components/Card'

import { EPNSNotification } from 'constants/notification'

const Notification: React.FC<EPNSNotification> = ({
  title,
  notification,
  cta,
  image,
}) => {
  return (
    <Card variant="simple" cursor="default">
      <Stack>
        {cta ? (
          <Link
            href={cta}
            isExternal
            color="green.100"
            _hover={{
              textDecoration: 'underline',
            }}
          >
            <Text fontSize="sm">
              {title}
              <Text as="span" pos="relative">
                <Icon
                  as={AiOutlineLink}
                  fontSize="md"
                  pos="absolute"
                  top="0.7px"
                />
              </Text>
            </Text>
          </Link>
        ) : (
          <Text fontSize="sm">{title}</Text>
        )}
        {image && (
          <AspectRatio ratio={16 / 9} position="relative" w="full" h="auto">
            <Image
              bg="gray.85"
              src={image}
              alt={title}
              w="full"
              h="full"
              objectFit="cover"
              maxW="full"
              objectPosition="center"
            />
          </AspectRatio>
        )}
        <Text fontSize="xs" color="gray.50">
          {notification.body}
        </Text>
      </Stack>
    </Card>
  )
}

export default Notification
