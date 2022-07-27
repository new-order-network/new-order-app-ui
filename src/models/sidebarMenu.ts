import { As, IconProps } from '@chakra-ui/react'

export interface LinkProps extends IconProps {
  label: string
  href: string
  icon: As
  isExternal?: boolean
}

export interface SidebarMenuItemsProps {
  label: string
  items: LinkProps[]
}
