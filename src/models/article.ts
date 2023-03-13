export interface Author {
  sys: {
    id: string
  }
  fields: {
    name: string
    shortBio: string
    twitter: string
    image?: {
      fields: {
        file: {
          url: string
          title: string
          description: string
        }
      }
    }
  }
}

export interface FrogsAnonymousArticleProps {
  sys: {
    id: string
  }
  fields: {
    title: string
    slug: string
    leadingParagraph: string
    body: string
    description: string
    authors: Author[]
    heroImage: {
      fields: {
        file: {
          url: string
          title?: string
          description?: string
        }
      }
    }
    publishDate: string
    featuredArticle: boolean
  }
}

export interface MediumArticleProps {
  guid: string
  title: string
  pubDate: string
  link: string
  thumbnail: string
  description: string
}

export interface YoutubeVideoSnippet {
  publishedAt: string
  title: string
  description: string
  thumbnails: {
    medium: YoutubeThumbnail
  }
  resourceId: {
    videoId: string
  }
}

export interface YoutubeThumbnail {
  url: string
  width: number
  height: number
}

export interface YoutubeArticleProps {
  id: string
  snippet: YoutubeVideoSnippet
}

export interface ArticleProps {
  id: string
  title: string
  dateTime: string
  webLink: string
  mediaLink: string
  description: string
  type: string
  refSource: string
}
