import {
  FormControl,
  FormLabel,
  Input as ChakraInput,
  InputGroup,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'

interface InputProps extends ChakraInputProps {
  id: string
  label: string
  formControlWidth: string | string[]
  formLabelColor: string
  formLabelBgColor: string
  formLabelFontSize?: string | string[]
  inputRightAddOn?: JSX.Element
  inputLeftAddOn?: JSX.Element
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  formControlWidth,
  formLabelColor,
  formLabelBgColor,
  formLabelFontSize = '0.9rem',
  inputRightAddOn,
  inputLeftAddOn,
  ...props
}) => {
  return (
    <FormControl w={formControlWidth} variant="floating" id={id}>
      <InputGroup>
        {inputLeftAddOn && inputLeftAddOn}
        <ChakraInput
          placeholder=" "
          borderColor="gray.65"
          _focus={{ borderColor: 'brand.purple' }}
          _hover={{
            borderColor: 'gray.60',
          }}
          {...props}
        />
        <FormLabel
          color={formLabelColor}
          bg={formLabelBgColor}
          fontSize={formLabelFontSize}
          _focus={{
            color: 'brand.purple',
          }}
          _hover={{
            color: 'gray.60',
          }}
        >
          {label}
        </FormLabel>
        {inputRightAddOn && inputRightAddOn}
      </InputGroup>
    </FormControl>
  )
}
export default Input
