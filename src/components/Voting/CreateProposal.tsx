import { useForm } from 'react-hook-form'
import {
  Button,
  InputRightAddon,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { AiOutlineInfoCircle } from 'react-icons/ai'
import snapshot from '@snapshot-labs/snapshot.js'
import { useAccount } from 'wagmi'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers'

import Input from 'components/Forms/Input'

import { env } from 'lib/environment'

type FormData = {
  title: string
  description?: string
  discussion?: string
}

const CreateProposal = () => {
  const toast = useToast()
  const { address } = useAccount()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting, isValid },
    getValues,
    setValue,
  } = useForm<FormData>({ mode: 'onChange' })

  const getResults = async () => {
    console.log('getResults')
  }

  async function onSubmit(data: FormData) {
    // This submit function should cast a vote on snapshot
    console.log('Submitting data: ', data, ', Address: ', address)

    if (address && window.ethereum) {
      const hub = 'https://testnet.snapshot.org' // 'https://hub.snapshot.org'; for production
      // const snapshotClient = new snapshot.Client712(env.NEXT_PUBLIC_HUB_URL);
      const snapshotClient = new snapshot.Client712(
        hub || env.NEXT_PUBLIC_HUB_URL
      )

      const web3 = new Web3Provider(window.ethereum as ExternalProvider)
      const [account] = await web3.listAccounts()

      const receipt = await snapshotClient
        .proposal(web3, account, {
          space: 'neworderdao.xyz',
          type: 'single-choice',
          title: data.title,
          body: data.description || '',
          discussion: data.discussion || '',
          choices: ['Yes', 'No'],
          start: Math.round(Date.now() / 1e3),
          end: Math.round(Date.now() / 1e3) + 60 * 60 * 24 * 3,
          snapshot: 0,
          plugins: JSON.stringify({}),
          app: 'new-order-network/new-order-app-ui',
        })
        .then(() => {
          toast({
            title: 'Proposal Successfully Created',
            description: 'You have successfully created your proposal.',
            isClosable: true,
            position: 'top-right',
            status: 'success',
            variant: 'success',
          })
        })
        .catch(() => {
          toast({
            title: 'Proposal Failed to Create',
            description: 'Something went wrong! Please try again later.',
            isClosable: true,
            position: 'top-right',
            status: 'error',
            variant: 'error',
          })
        })
        .finally(() => {
          getResults()
          onClose()
        })
      console.log('receipt: ', receipt)
    }
  }

  function onError(errors: any, e: any) {
    console.log('onError function called. Errors: ', errors, ', Event: ', e)
    console.log('Current field values: ', getValues()) // get current form values
  }

  return (
    <>
      <Button
        fontSize="0.8rem"
        variant="outlineGreenRounded"
        cursor="default"
        onClick={onOpen}
        isDisabled={!address}
      >
        Create Proposal
        {!address && (
          <Tooltip label="Please login to create proposal">
            <span>
              <AiOutlineInfoCircle style={{ marginLeft: '0.5rem' }} />
            </span>
          </Tooltip>
        )}
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Snapshot Proposal</ModalHeader>
          <ModalCloseButton />

          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <ModalBody>
              <FormControl
                isInvalid={Boolean(
                  errors.title || errors.description || errors.discussion
                )}
              >
                <Stack spacing="8">
                  <Stack spacing="2">
                    <Text color="brand.green" fontSize="lg">
                      1. Title (*)
                    </Text>
                    <Input
                      id="snapshot-title"
                      label="Title"
                      formControlWidth="full"
                      formLabelColor="gray.60"
                      formLabelBgColor="black.85"
                      {...register('title', {
                        required: 'This field is required',
                        onChange: (e) => {
                          console.log('Title field changed: ', e.target.value)
                          setValue('title', e.target.value)
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.title && errors.title.message}
                    </FormErrorMessage>
                  </Stack>
                  <Stack spacing="2">
                    <Text color="brand.green" fontSize="lg">
                      2. Description (optional)
                    </Text>
                    <Text>0 / 14,400</Text>
                    <Input
                      id="snapshot-desc"
                      label="Description"
                      formControlWidth="full"
                      formLabelColor="gray.60"
                      formLabelBgColor="black.85"
                      {...register('description', {
                        maxLength: {
                          value: 14400,
                          message:
                            'Description cannot exceed 14,400 characters',
                        },
                        onChange: (e) => {
                          console.log(
                            'Description field changed: ',
                            e.target.value
                          )
                          setValue('description', e.target.value)
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.description && errors.description.message}
                    </FormErrorMessage>
                  </Stack>
                  <Stack spacing="2">
                    <Text color="brand.green" fontSize="lg">
                      3. Discussion (optional)
                    </Text>
                    <Text>e.g. https://forum.balancer.fi/proposal</Text>
                    <Input
                      id="snapshot-discussion"
                      label="Discussion"
                      formControlWidth="full"
                      formLabelColor="gray.60"
                      formLabelBgColor="black.85"
                      // Console log on change
                      inputRightAddOn={
                        <InputRightAddon
                          fontSize="0.7rem"
                          cursor="pointer"
                          _hover={{
                            bg: 'gray.60',
                          }}
                          // eslint-disable-next-line react/no-children-prop
                          children="URL"
                        />
                      }
                      {...register('discussion', {
                        onChange: (e) => {
                          console.log(
                            'Discussion field changed: ',
                            e.target.value
                          )
                          setValue('discussion', e.target.value)
                        },
                      })}
                    />
                  </Stack>
                </Stack>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                m="2"
                variant="greenButton"
                onClick={
                  // Console log on click
                  () => {
                    return console.log('Clicked Submit')
                  }
                }
                disabled={!isValid || isSubmitting}
                isLoading={isSubmitting}
                type="submit"
              >
                Submit
              </Button>
              <Button
                fontSize="0.8rem"
                variant="outlineGrayRounded"
                onClick={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateProposal
