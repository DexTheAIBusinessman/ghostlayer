import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
const baseUrl = 'https://ghostlayer-swart.vercel.app';

return [
{
url: `${baseUrl}/`,
lastModified: new Date(),
},
{
url: `${baseUrl}/dashboard`,
lastModified: new Date(),
},
{
url: `${baseUrl}/privacy`,
lastModified: new Date(),
},
{
url: `${baseUrl}/terms`,
lastModified: new Date(),
},
];
}
