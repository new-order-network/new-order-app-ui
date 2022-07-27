import { SocialLinkProps } from 'models/socialMediaLinks'

import ExternalLink from 'constants/externalLink'

import TwitterIcon from 'assets/icons/socials/Twitter.svg'
import DiscordIcon from 'assets/icons/socials/Discord.svg'
import MediumIcon from 'assets/icons/socials/Medium.svg'
import GithubIcon from 'assets/icons/socials/Github.svg'

export const socialLinks: SocialLinkProps[] = [
  { url: ExternalLink.twitter, icon: TwitterIcon },
  { url: ExternalLink.discord, icon: DiscordIcon },
  {
    url: ExternalLink.medium,
    icon: MediumIcon,
  },
  {
    url: ExternalLink.github,
    icon: GithubIcon,
  },
]
