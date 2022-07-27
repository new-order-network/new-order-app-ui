import { render } from '@testing-library/react'
import dayjs from 'dayjs'

import NewsCard from 'components/NewsCard'

import { NEWS_TYPES } from 'models/types'

describe('NewsCard.tsx component', () => {
  const newsData = {
    title: 'Sample News Update 1',
    dateTime: dayjs(new Date('2022-01-01'))
      .startOf('day')
      .format('DD.MM.YYYY HH:mm'),
    webLink: '',
    mediaLink: '',
    type: NEWS_TYPES.ARTICLE,
    refSource: 'Test Source',
    description: 'Test Description',
  }
  const { container } = render(<NewsCard news={newsData} />)

  test('match to snapshot', () => {
    expect(container).toMatchSnapshot()
  })
})
