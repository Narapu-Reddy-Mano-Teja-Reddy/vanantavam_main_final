import { writeClient, client } from '../src/sanity/client';
import blogsData from '../src/data/blogsData.json';
import { normalizeBlogImagePath } from '../src/sanity/image';

async function syncSanityImages() {
  console.log('Fetching posts from Sanity...');
  try {
    const posts = await client.fetch('*[_type == "post"]{ _id, title, "slug": slug.current, img }');
    console.log(`Found ${posts.length} posts in Sanity.`);

    for (const p of posts) {
      const local = blogsData.find((b) => b.id === p.slug || b.id === p._id.replace('post-', ''));
      const targetImg = local?.img || normalizeBlogImagePath(p.img);

      if (targetImg && targetImg !== p.img) {
        console.log(`Updating ${p.slug || p._id} image to: ${targetImg}`);
        await writeClient.patch(p._id).set({ img: targetImg }).commit();
        console.log(`✓ Updated ${p.slug || p._id}`);
      } else {
        console.log(`- ${p.slug || p._id} already up to date: ${p.img}`);
      }
    }
  } catch (err) {
    console.warn('Sanity sync notice:', (err as Error).message);
  }
}

syncSanityImages();

