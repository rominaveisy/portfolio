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
    assert.equal(
      response.headers.get('strict-transport-security'),
      origin.startsWith('https:') ? 'max-age=86400' : null,
    );
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
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('x-test'), 'preserved');
  assert.equal(await response.text(), 'asset response');
  assert.equal(
    response.headers.get('strict-transport-security'),
    origin.startsWith('https:') ? 'max-age=86400' : null,
  );
}
const missing = await worker.fetch(new Request('https://rominaveisy.com/missing/'), {
  ASSETS: { fetch: () => new Response('Not found', { status: 404 }) },
});
assert.equal(missing.status, 404);
assert.equal(await missing.text(), 'Not found');
assert.equal(missing.headers.get('strict-transport-security'), 'max-age=86400');
console.log(
  'Canonical redirects preserve paths and queries; HTTPS policy covers both public hosts; asset bodies, status codes and headers are preserved.',
);
