
import { createClient } from 'next-sanity';

const projectId = 'zc2umfrr';
const dataset = 'production';
const apiVersion = '2024-01-01';
const token = 'skepybKtLTfgsw7YAXSUTvTCnNRIOEhVF3WrFrMfAH1NSWNL904qlba9J4Xtor7G7gLidMxvdM53nCgXIGiDy54ox3OImrJAjwoi7Re9EF4UVm7obyeTiu62gE2ApwuBczGlkvpEvYcSJ0AlDVDonYlRWAoU65mZhBQxYM6KXfNCl7GpRTTW';

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
  perspective: 'previewDrafts'
});

async function run() {
  console.log('START_DEBUG');
  const items = await client.fetch(`*[_type == "newTechnologyItem"] {
    _id,
    title,
    isActive,
    product->{name}
  }`);
  console.log(JSON.stringify(items, null, 2));
  console.log('END_DEBUG');
}

run();
