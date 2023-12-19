import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Admin Template'

//获取index的title
export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
