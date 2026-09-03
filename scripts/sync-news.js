const admin = require('firebase-admin');
const Parser = require('rss-parser');
const crypto = require('crypto');

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
};

if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
  throw new Error('Missing FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, or FIREBASE_PRIVATE_KEY.');
}

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();
const parser = new Parser({ timeout: 15000 });
const feeds = [
  { url: 'https://punchng.com/feed/', category: 'Nigeria', source: 'The Punch' },
  { url: 'https://www.vanguardngr.com/feed/', category: 'Nigeria', source: 'Vanguard Nigeria' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World', source: 'BBC News' },
  { url: 'https://techcrunch.com/feed/', category: 'Tech', source: 'TechCrunch' }
];

const clean = (value = '') => String(value).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const summary = (item) => {
  const text = clean(item.contentSnippet || item.summary || item.content || item.description || '');
  return text.length > 260 ? `${text.slice(0, 257).trim()}...` : text;
};
const normalizeLink = (link) => String(link).trim().replace(/#.*$/, '').replace(/\/$/, '');
const storyKey = (title, link) => `${clean(title).toLowerCase()}|${normalizeLink(link)}`;
const documentIdFor = (link) => `gnews-${crypto.createHash('sha256').update(normalizeLink(link)).digest('hex').slice(0, 40)}`;

async function syncNews() {
  const existingSnapshot = await db.collection('posts').get();
  const existing = new Set(existingSnapshot.docs.map((doc) => {
    const data = doc.data();
    return storyKey(data.title || '', data.link || data.externalUrl || '');
  }));
  const batch = db.batch();
  let added = 0;

  for (const feed of feeds) {
    try {
      const parsed = await parser.parseURL(feed.url);
      for (const item of (parsed.items || []).slice(0, 8)) {
        const title = clean(item.title || '');
        const link = item.link || '';
        const key = storyKey(title, link);
        if (!title || !link || existing.has(key)) continue;
        const ref = db.collection('posts').doc(documentIdFor(link));
        batch.set(ref, {
          title,
          summary: summary(item),
          content: summary(item),
          link,
          externalUrl: link,
          category: feed.category,
          source: feed.source,
          origin: 'gnews',
          author: 'Seun Web News',
          imageUrl: item.enclosure?.url || '',
          status: 'Published',
          createdAt: admin.firestore.Timestamp.fromDate(new Date(item.isoDate || Date.now())),
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        existing.add(key);
        added += 1;
      }
    } catch (error) {
      console.error(`Failed to fetch ${feed.url}:`, error.message);
    }
  }

  if (added) await batch.commit();
  console.log(`News sync complete: ${added} new stories.`);
}

syncNews().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});