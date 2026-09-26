import assert from 'node:assert/strict';
import worker from '../worker/index.mjs';

for (const origin of [
  'http://rominaveisy.com',
  'http://www.rominaveisy.com',
  'https://www.rominaveisy.com',
]) {
  for (const path of ['/', '/about/?from=launch&message=a%20b', '/work/samenstad/?a=1&a=2']) {
    const response = await worker.fetch(new Request(origin + path), {
      ASSETS: {
        fetch() {
          throw new Error('Redirect must run before assets');
        },
      },
    });
    assert.equal(response.status, 301);
    assert.equal(response.headers.get('location'), 'https://rominaveisy.com' + path);
  }
}
for (const origin of ['https://rominaveisy.com', 'http://127.0.0.1:8787']) {
  const request = new Request(origin + '/documents/romina-veisy-cv.pdf');
  const assetResponse = new Response('asset response', { headers: { 'X-Test': 'preserved' } });
  const response = await worker.fetch(request, {
    ASSETS: {
      fetch(received) {
        assert.equal(received, request);
        return assetResponse;
      },
    },
  });
  assert.equal(response, assetResponse);
}
console.log(
  'Canonical HTTP/www redirects preserve paths and queries; HTTPS and local requests preserve asset responses.',
);
