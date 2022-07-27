import ExternalLink from 'constants/externalLink'

import HomeIcon from 'assets/icons/Home.svg'
import VotingIcon from 'assets/icons/Voting.svg'
import AirdropIcon from 'assets/icons/Airdrop.svg'
import MigrateIcon from 'assets/icons/Migrate.svg'
import VaultIcon from 'assets/icons/Vault.svg'
import LockIcon from 'assets/icons/Lock.svg'

export const SidebarMenuItems = [
  {
    label: 'DAO',
    items: [
      { label: 'Home', icon: HomeIcon, href: '/' },
      { label: 'Voting', icon: VotingIcon, href: '/voting' },
      { label: 'Airdrops', icon: AirdropIcon, href: '/airdrops' },
      {
        label: 'V2 Migration',
        icon: MigrateIcon,
        href: `${ExternalLink.legacyApp}/migrate`,
        isExternal: true,
      },
    ],
  },
  {
    label: 'Marketplace',
    items: [
      { label: 'Vault', icon: VaultIcon, href: '/invest' },
      { label: 'veNEWO', icon: LockIcon, href: '/venewo' },
    ],
  },
]
