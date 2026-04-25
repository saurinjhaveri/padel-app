const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const code = event.path.split('/').pop();
  if (!code) return { statusCode: 400, body: 'Missing tournament code' };

  const store = getStore({
    name: 'tournaments',
    siteID: process.env.NETLIFY_SITE_ID || 'cf02ba88-d713-4c27-9432-1d9249695e89',
    token: process.env.NETLIFY_AUTH_TOKEN,
  });

  if (event.httpMethod === 'GET') {
    try {
      const data = await store.get(code, { type: 'json' });
      if (!data) return { statusCode: 404, body: 'Not found' };
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      };
    } catch (e) {
      return { statusCode: 404, body: 'Not found' };
    }
  }

  if (event.httpMethod === 'PUT') {
    try {
      const body = JSON.parse(event.body);
      await store.setJSON(code, body);
      return { statusCode: 200, body: 'OK' };
    } catch (e) {
      return { statusCode: 500, body: 'Save failed: ' + e.message };
    }
  }

  return { statusCode: 405, body: 'Method not allowed' };
};
