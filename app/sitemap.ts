import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
const baseUrl = 'https://ghostlayerhq.com';

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
{
url: `${baseUrl}/refund-policy`,
lastModified: new Date(),
},
{
url: `${baseUrl}/service-agreement`,
lastModified: new Date(),
},
];
}
