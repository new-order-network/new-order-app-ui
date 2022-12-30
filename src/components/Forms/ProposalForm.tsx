import React from 'react'
import dynamic from 'next/dynamic'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Input,
  Box,
  ModalCloseButton,
  Button,
  TagLabel,
  Tag,
  TagCloseButton,
  useToast,
} from '@chakra-ui/react'
import { useAccount } from 'wagmi'
import snapshot from '@snapshot-labs/snapshot.js'
import { useFormik } from 'formik'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers'
import { Proposal } from '@snapshot-labs/snapshot.js/dist/sign/types'
import * as Yup from 'yup'

import { env } from 'lib/environment'

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
  ssr: false,
})

export const ProposalModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const toast = useToast()
  const { address } = useAccount()
  const hub = `${env.NEXT_PUBLIC_HUB_URL}`
  const client = new snapshot.Client712(hub)

  const formik = useFormik({
    initialValues: {
      title: '',
      body: '',
      discussion: '',
      start: 0,
      end: 0,
      snapshot: Date.parse(`${new Date()}`),
      choices: ['for', 'abstain', 'against'],
      space: `${env.NEXT_PUBLIC_SNAPSHOT_SPACE}`,
      type: 'single-choice',
      plugins: JSON.stringify({}),
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .min(2, 'Must be 2 characters or More')
        .required('Required'),
      body: Yup.string()
        .min(2, 'Must be 2 characters or More')
        .required('Required'),
      start: Yup.number()
        .min(
          Date.parse(`${new Date()}`) - 10000,
          `Date must be greater than ${new Date()}`
        )
        .required('Required'),
      end: Yup.number()
        .min(
          Date.parse(`${new Date()}`) - 10000,
          `Date must be greater than ${new Date()}`
        )
        .required('Required'),
      choices: Yup.array().min(2, `2 choices or more must be provided`),
    }),
    onSubmit: async (values: Proposal) => {
      console.log(values)
      try {
        if (address && window.ethereum) {
          const web3 = new Web3Provider(window.ethereum as ExternalProvider)
          const [account] = await web3.listAccounts()

          await client.proposal(web3, account, values)
        }
      } catch (error) {
        toast({
          title: 'Proposal Failed',
          description: 'Something went wrong! Please try again later.',
          isClosable: true,
          position: 'top-right',
          status: 'error',
          variant: 'error',
        })
      }

      return null
    },
  })

  const [items, setItems] = React.useState<string[]>(formik.values.choices)

  const addItem = (item: string) => {
    item = item.trim()
    if (item === '' || items.includes(item)) {
      toast({
        title: 'choice not added',
        description: 'choice input is empty or it exists',
        isClosable: true,
        position: 'top-right',
        status: 'error',
        variant: 'error',
      })
      return null
    } else {
      setItems([...items, item])
    }

    return null
  }

  const remove = (id: number) => {
    const filtered = items.filter((value: string, index: number) => {
      return index !== id
    })
    setItems([...filtered])
  }

  React.useEffect(() => {
    formik.values.choices = items
  }, [items])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={'lg'}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create Proposal</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={formik.handleSubmit}>
            <Box margin={5}>
              <label htmlFor="title">Title</label>
              <Input id="title" name="title" onChange={formik.handleChange} />
            </Box>

            <Box margin={5} flex={1}>
              <label htmlFor="body">Content</label>
              <QuillNoSSRWrapper
                id="body"
                theme="snow"
                onChange={(event) => {
                  formik.values.body = event
                }}
              />
            </Box>

            <Box margin={5}>
              <label htmlFor="startDate">Start</label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                onChange={(event) => {
                  formik.values.start = Date.parse(
                    `${event.currentTarget.value}`
                  )
                }}
              />
            </Box>

            <Box margin={5}>
              <label htmlFor="startDate">End</label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                onChange={(event) => {
                  formik.values.end = Date.parse(`${event.currentTarget.value}`)
                }}
              />
            </Box>

            <Box margin={5}>
              <label htmlFor="startDate">Choices</label>
              <Box>
                {items.map((item: string, index: number) => {
                  return (
                    <Tag
                      key={index}
                      margin={2}
                      cursor="pointer"
                      colorScheme="cyan"
                    >
                      <TagLabel>{item}</TagLabel>
                      <TagCloseButton
                        onClick={() => {
                          remove(index)
                        }}
                      />
                    </Tag>
                  )
                })}
              </Box>

              <Input
                id="choice"
                name="coice"
                type="choice"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addItem(e.currentTarget.value)
                  }
                }}
              />
            </Box>

            <Box margin={5}>
              <Button
                onClick={() => {
                  formik.submitForm()
                }}
                fontSize="0.8rem"
                fontWeight="bold"
                variant="greenButton"
              >
                Submit Proposal
              </Button>
            </Box>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default ProposalModal
