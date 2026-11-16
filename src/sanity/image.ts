import { createImageUrlBuilder } from '@sanity/image-url'
import { dataset, projectId } from './env'

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export type SanityImageSource = Parameters<typeof imageBuilder.image>[0]

export const urlForImage = (source: SanityImageSource) => {
  return imageBuilder?.image(source).auto('format').fit('max')
}

export const FALLBACK_BLOG_IMAGE =
  '/Blogs-content/May-2022/vt-blog-1-the-vanatvam-philosophy.webp'

export function normalizeBlogImagePath(src: string | undefined | null): string {
  if (!src) return FALLBACK_BLOG_IMAGE
  let clean = src.trim()
  if (clean.includes('/Blogs-content/May 2022/') || clean.includes('/Blogs-content/May%202022/')) {
    clean = clean.replace(/\/Blogs-content\/May(%20| )2022\//g, '/Blogs-content/May-2022/')
  }
  if (clean.includes('/Blogs-content/June 2022/') || clean.includes('/Blogs-content/June%202022/')) {
    clean = clean.replace(/\/Blogs-content\/June(%20| )2022\//g, '/Blogs-content/June-2022/')
  }
  if (clean.includes('/Event images/') || clean.includes('/Event%20images/')) {
    clean = clean.replace(/\/Event(%20| )images\//g, '/event-images/')
  }
  if (clean.includes('/assets/images/question.png')) {
    clean = clean.replace('/assets/images/question.png', '/assets/images/question.webp')
  }
  if (clean.includes('/assets/images/Strategic.png') || clean.includes('/assets/images/strategic.png')) {
    clean = clean.replace(/\/assets\/images\/(Strategic|strategic)\.png/g, '/assets/images/strategic.webp')
  }

  // Normalize legacy uppercase VT_Blog_* filenames to lowercase hyphenated
  const legacyFilenames: Record<string, string> = {
    'VT_Blog_1_The_Vanatvam_Philosophy.webp': 'vt-blog-1-the-vanatvam-philosophy.webp',
    'VT_Blog_3_Farm_House_vs_City_Lifestyle.webp': 'vt-blog-3-farm-house-vs-city-lifestyle.webp',
    'VT_Blog_4_Easy_Way_to_Own_a_Farmhouse_Community.webp': 'vt-blog-4-easy-way-to-own-a-farmhouse-community.webp',
    'VT_Blog_5_Going_Back_to_Our_Roots.webp': 'vt-blog-5-going-back-to-our-roots.webp',
    'VT_Blog_7_Fulfil_Your_Dream_of_Owning_a_Farmland.webp': 'vt-blog-7-fulfil-your-dream-of-owning-a-farmland.webp',
    'VT_Blog_1_Essence_of_Life_Enhanced_in_Nature.webp': 'vt-blog-1-essence-of-life-enhanced-in-nature.webp',
    'VT_Blog_2_Getting_Children_Out_of_the_Virtual_World.webp': 'vt-blog-2-getting-children-out-of-the-virtual-world.webp',
    'VT_Blog_3_Importance_of_Educating_Newer_Generation.webp': 'vt-blog-3-importance-of-educating-newer-generation.webp',
    'VT_Blog_4_Is_Farmland_a_Wise_Investment.webp': 'vt-blog-4-is-farmland-a-wise-investment.webp',
    'VT_Blog_6_Benefits_of_Living_Amidst_Nature.webp': 'vt-blog-6-benefits-of-living-amidst-nature.webp',
  }
  for (const [oldName, newName] of Object.entries(legacyFilenames)) {
    if (clean.includes(oldName)) {
      clean = clean.replace(oldName, newName)
    }
  }

  return clean
}

export function resolvePostImage(post: {
  id?: string
  coverImage?: SanityImageSource | string | null
  coverImageUrl?: string | null
  img?: string
}): string {
  if (post.coverImageUrl && typeof post.coverImageUrl === 'string' && post.coverImageUrl.trim()) {
    const cleanUrl = post.coverImageUrl.trim()
    if (cleanUrl.startsWith('http')) return cleanUrl
    return normalizeBlogImagePath(cleanUrl)
  }
  if (typeof post.coverImage === 'string' && post.coverImage.trim()) {
    const cleanUrl = post.coverImage.trim()
    if (cleanUrl.startsWith('http')) return cleanUrl
    return normalizeBlogImagePath(cleanUrl)
  }
  if (post.coverImage && typeof post.coverImage === 'object' && (post.coverImage as { asset?: unknown })?.asset) {
    try {
      const url = urlForImage(post.coverImage)?.url()
      if (url && url.startsWith('http')) return url
    } catch {
      // fall back to string img
    }
  }
  if (post.img) {
    return normalizeBlogImagePath(post.img)
  }
  return FALLBACK_BLOG_IMAGE
}
