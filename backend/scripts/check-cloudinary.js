const { createHash } = require('crypto');
const { readFileSync } = require('fs');

for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
  if (!line || line.trim().startsWith('#')) continue;
  const separator = line.indexOf('=');
  if (separator > 0) process.env[line.slice(0, separator)] = line.slice(separator + 1).replace(/^"|"$/g, '');
}

async function main() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) throw new Error('Cloudinary variables are missing from backend/.env.');

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'task-management/attachments';
  const signature = createHash('sha1').update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest('hex');
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScLzXwAAAABJRU5ErkJggg==', 'base64');
  const form = new FormData();
  form.append('file', new Blob([image], { type: 'image/png' }), 'cloudinary-check.png');
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('folder', folder);
  form.append('signature', signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, { method: 'POST', body: form });
  const body = await response.json().catch(() => ({}));
  console.log(`Cloudinary status: ${response.status}`);
  console.log(response.ok ? 'Cloudinary upload configuration is valid.' : `Cloudinary error: ${body.error?.message ?? 'Unknown provider error.'}`);
  process.exitCode = response.ok ? 0 : 1;
}

main().catch((error) => { console.error(`Cloudinary diagnostic failed: ${error.message}`); process.exitCode = 1; });
