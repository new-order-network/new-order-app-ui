import { Flex, Icon, Link } from '@chakra-ui/react'

import { SocialLinkProps } from 'models/socialMediaLinks'

import { socialLinks } from 'constants/socialMediaLinks'

const SocialMediaFooter: React.FC = () => {
  return (
    <Flex flexDirection={['row', 'row', 'column']} px="6" py="4">
      {socialLinks?.map((socialLink: SocialLinkProps, i) => {
        return (
          <Link key={i} isExternal href={socialLink.url}>
            <Icon
              mr="4"
              my="1"
              fontSize="20"
              fill="gray.40"
              cursor="pointer"
              _hover={{
                path: {
                  fill: 'green.100',
                },
              }}
              as={socialLink.icon}
            />
          </Link>
        )
      })}
    </Flex>
  )
}

export default SocialMediaFooter
