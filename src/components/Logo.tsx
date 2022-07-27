import { AspectRatio, AspectRatioProps } from '@chakra-ui/react'
import Image from 'next/image'

const Logo: React.FC<AspectRatioProps> = ({ ...props }) => {
  return (
    <AspectRatio ratio={237 / 56} position="relative" {...props}>
      <Image src="/images/logos/logo.svg" alt="frogs-logo" layout="fill" />
    </AspectRatio>
  )
}

export default Logo
