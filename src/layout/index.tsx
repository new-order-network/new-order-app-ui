import Head from 'next/head'
import {
  Box,
  BoxProps,
  Drawer,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react'

import Header from 'layout/Header'
import Sidebar from 'layout/Sidebar'

interface LayoutProps extends BoxProps {
  pageTitle?: string
  children: JSX.Element
}

const Layout: React.FC<LayoutProps> = ({ pageTitle, children, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <Box minH="100vh" bg="gray.100" {...props}>
        <Sidebar onClose={onClose} display={['none', 'none', 'flex']} />
        <Drawer
          autoFocus={false}
          isOpen={isOpen}
          placement="left"
          onClose={onClose}
          returnFocusOnClose={false}
          onOverlayClick={onClose}
          size="full"
        >
          <DrawerContent>
            <Sidebar onClose={onClose} />
          </DrawerContent>
        </Drawer>

        <Header onOpen={onOpen} />
        <Box ml={[0, 0, 48]}>{children}</Box>
      </Box>
    </>
  )
}

Layout.defaultProps = {
  pageTitle: 'New Order | DAO',
}

export default Layout
