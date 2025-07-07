import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://scottish-terrier-kennel.com'
  
  // 設置不同頁面的實際更新時間
  // 可以從數據庫或配置文件中獲取這些時間
  const now = new Date()
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const lastMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: lastWeek, // 首頁內容相對穩定，但有新動態時會更新
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about/`,
      lastModified: lastMonth, // 關於我們頁面較少更改
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/environment/`,
      lastModified: lastMonth, // 環境介紹相對穩定
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/diary/`,
      lastModified: now, // 日誌頁面經常更新
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/puppies/`,
      lastModified: lastWeek, // 幼犬資訊會定期更新
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact/`,
      lastModified: lastMonth, // 聯絡資訊相對穩定
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // TODO: 未來可以添加動態路由，例如：
  // - 個別日誌文章: /diary/[slug]
  // - 個別幼犬頁面: /puppies/[id]
  // - 從數據庫動態獲取這些路由
  
  // TODO: 可以從數據庫獲取實際的內容更新時間
  // const diaryPosts = await getDiaryPosts()
  // const dynamicRoutes = diaryPosts.map(post => ({
  //   url: `${baseUrl}/diary/${post.slug}/`,
  //   lastModified: new Date(post.updatedAt),
  //   changeFrequency: 'monthly',
  //   priority: 0.5,
  // }))

  return staticRoutes
} 