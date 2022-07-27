import { Flex, Icon, Link as ChakraLink, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'

import { LinkProps } from 'models/sidebarMenu'

import MainMenuMarkerIcon from 'assets/icons/MainMenuMarker.svg'

interface NavLinkProps {
  link: LinkProps
}
const NavLink: React.FC<NavLinkProps> = ({ link, ...rest }) => {
  const router = useRouter()
  const { label, icon, href, isExternal = false } = link
  const currentLocation = router.pathname?.toLowerCase()?.split('/')[1]
  const isActive =
    currentLocation?.length === 0
      ? router.pathname === href
      : href?.includes(currentLocation)

  return (
    <NextLink href={href} passHref>
      <ChakraLink
        isExternal={isExternal}
        href={href}
        _hover={{
          textDecoration: 'none',
        }}
      >
        <Flex
          align="center"
          role="group"
          pl="6"
          pr="4"
          py="1.5"
          backgroundColor={isActive ? 'gray.85' : 'transparent'}
          color={isActive ? 'green.100' : 'white'}
          cursor="pointer"
          _hover={{
            bg: 'gray.60',
            color: 'white',
          }}
          position="relative"
          {...rest}
        >
          {isActive && (
            <Icon
              as={MainMenuMarkerIcon}
              position="absolute"
              top="0"
              left="0"
              h="auto"
            />
          )}
          {icon && (
            <Icon
              mr="4"
              fontSize="16"
              sx={{
                path: {
                  fill: isActive ? 'green.100' : 'gray.40',
                },
              }}
              _groupHover={{
                path: {
                  fill: 'white',
                },
              }}
              as={icon}
            />
          )}
          <Text fontSize="0.95rem">{label}</Text>
        </Flex>
      </ChakraLink>
    </NextLink>
  )
}

export default NavLink
