import { Box, Button, Container, Flex, Heading } from '@chakra-ui/react'
import Link from 'next/link'
import { FiArrowLeft } from 'react-icons/fi'

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: (...args: Array<unknown>) => void
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = () => {
  return (
    <Box as="main" bgColor="black" minH="100vh" overflowX="hidden">
      <Box
        bgImage="url('/images/backgrounds/night-city-error.svg')"
        bgPosition={['left top', 'center top', 'center top']}
        bgRepeat="repeat-x"
        position="relative"
        minH="100vh"
      >
        <Container maxW="container.xl">
          <Flex direction="column" align="center" justify="center" minH="100vh">
            <Heading
              color="green.100"
              fontSize="4xl"
              textTransform="uppercase"
              textAlign="center"
            >
              Something went wrong, please reload or try again later.
            </Heading>
            <Link href="/" passHref>
              <Button
                leftIcon={<FiArrowLeft />}
                variant="outlineGreenBox"
                py="8"
                px="6"
                fontSize="lg"
                mt="8"
              >
                GO BACK TO HOME PAGE
              </Button>
            </Link>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
