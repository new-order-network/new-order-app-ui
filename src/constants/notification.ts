export interface EPNSNotification {
  cta: string
  title: string
  message: string
  icon: string
  url: string
  sid: string
  app: string
  image: string
  blockchain: string
  notification: Notification
  secret: string
}
export interface Notification {
  body: string
  title: string
}
