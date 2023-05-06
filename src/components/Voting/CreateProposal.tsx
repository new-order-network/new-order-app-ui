import {
  Button,
  InputRightAddon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
// import snapshot from '@snapshot-labs/snapshot.js';

import Input from 'components/Forms/Input'

// const hub = 'https://hub.snapshot.org'; // or https://testnet.snapshot.org for testnet
// const client = new snapshot.Client712(hub);

const CreateProposal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button
        fontSize="0.8rem"
        variant="outlineGreenRounded"
        cursor="default"
        onClick={onOpen}
      >
        Create Proposal
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Snapshot Proposal</ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Stack spacing="8">
              <Stack spacing="2">
                <Text color="brand.green" fontSize="lg">
                  1. Title
                </Text>
                <Text>Required</Text>
                <Input
                  id="snapshot-title"
                  label="Title"
                  formControlWidth="full"
                  formLabelColor="gray.60"
                  formLabelBgColor="black.85"
                />
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
                />
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
                />
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button m="2" variant="greenButton" onClick={onClose}>
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
        </ModalContent>
      </Modal>
    </>
  )
}

export default CreateProposal
