import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormErrorMessage,
  HStack,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { useVeNewoContext } from 'store/contexts/veNewoContext'

interface DeclarationModalProps {
  isOpen: boolean
  onClose: () => void
  submitFn?: () => Promise<void>
}

const urlRegex = /(https?:\/\/[^\s]+)/g

const DeclarationModal: React.FC<DeclarationModalProps> = ({
  isOpen,
  onClose,
  submitFn,
}) => {
  const { declaration } = useVeNewoContext()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm()
  const [link, setLink] = useState('')

  useEffect(() => {
    if (declaration) {
      const url = declaration.match(urlRegex)

      if (url) {
        setLink(url[0])
      }
    }
  }, [declaration])

  const onSubmit = handleSubmit(async (data) => {
    const { declaration } = data
    if (declaration) {
      await submitFn?.()
      onClose()
    }
  })

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Declaration</ModalHeader>
        <ModalCloseButton />

        <ModalBody p="6">
          <Box as="form" onSubmit={onSubmit}>
            <Stack spacing="4">
              <FormControl isInvalid={!!errors.declaration}>
                <Checkbox
                  {...register('declaration', {
                    required: {
                      value: true,
                      message: 'This field is required',
                    },
                  })}
                  colorScheme="green"
                  spacing="4"
                >
                  {declaration.replace(urlRegex, '')}{' '}
                  <Link
                    href={link}
                    isExternal
                    variant="orangeTransition"
                    textDecor="underline"
                  >
                    {link}
                  </Link>
                </Checkbox>
                <FormErrorMessage>
                  {errors.declaration && (errors.declaration.message as string)}
                </FormErrorMessage>
              </FormControl>

              <HStack w="full">
                <Button
                  variant="greenButton"
                  type="submit"
                  w="full"
                  isDisabled={!watch('declaration')}
                  isLoading={isSubmitting}
                >
                  Submit
                </Button>
                <Button
                  variant="outlineGreenRounded"
                  w="full"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </HStack>
            </Stack>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default DeclarationModal
