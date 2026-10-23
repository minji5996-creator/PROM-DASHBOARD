"""Import supplied observation data without synthesizing daily events."""
import csv, io, json, zipfile, pathlib, hashlib

ROOT = pathlib.Path(__file__).resolve().parent
archive = pathlib.Path(r'C:\Users\USER\Downloads\SNS_KPI_2026-10-23.zip')
out = ROOT / 'data'
out.mkdir(exist_ok=True)
with zipfile.ZipFile(archive) as z:
    raw = json.loads(z.read('sns-observations-2026-10-23.json'))
    for name in ['01_accounts.csv','02_period_metrics.csv','03_all_observed_metrics.csv','05_audience_and_activity.csv']:
        (out / name).write_bytes(z.read(name))

posts = {}
def put(platform, ident, title, published=None, url=None):
    key = platform + ':' + (ident or 'unresolved:' + title)
    if key not in posts:
        posts[key] = dict(key=key, platform=platform, id=ident, title=title, published=published, url=url, observations=[])
    p = posts[key]
    if published: p['published'] = published
    if url: p['url'] = url
    return p

for period in raw['youtube']['periods']:
    days = 7 if period['label']=='last 7 days' else 28
    for row in period['content']:
        p=put('youtube',row.get('videoId'),row['title'],row.get('publishedDate'),row.get('url'))
        p['observations'].append(dict(days=days,scope='period',label=f"{period['start']} ~ {period['end']} ({days}일)",views=row.get('views'),comments=None,saves=None,shares=None,reposts=None,clicks=None))
for row in raw['youtube']['inventory']:
    p=put('youtube',row['videoId'],row['title'],row.get('publishedDate'),row.get('url'))
    p['observations'].append(dict(days=0,scope='lifetime',label='게시 후 누적 · Studio 인벤토리',views=row.get('lifetimeViews'),comments=row.get('lifetimeComments'),saves=None,shares=None,reposts=None,clicks=None))

def value(row,k):
    v=row.get(k)
    return v.get('value') if isinstance(v,dict) else v if isinstance(v,(int,float)) else None

for platform in ['instagram','threads']:
    entries=raw[platform]['posts'] + (raw[platform].get('otherObservedPosts',[]) if platform=='threads' else [])
    for row in entries:
        ident=row.get('postId') or row['url'].rstrip('/').split('/')[-1]
        url=row.get('url') or f'https://www.threads.com/@ai.prom.record/post/{ident}'
        title=platform.title()+' · '+ident
        if platform=='threads':
            sidebar=next((x['text'] for x in raw['threads']['insightSidebar'] if ident in x['url']),None)
            if sidebar: title=sidebar.split('\n')[0][:130]
        p=put(platform,ident,title,row.get('publishedAt') or row.get('date'),url)
        p['observations'].append(dict(days=0,scope='lifetime',label='게시 후 누적 · 수집 시점',views=value(row,'views'),comments=value(row,'comments' if platform=='instagram' else 'replies'),saves=value(row,'saves'),shares=value(row,'shares'),reposts=value(row,'reposts'),clicks=None))
for row in raw['x']['timeline']['tweets']:
    p=put('x',row['id'],row['text'].split('\n')[0],row['createdAt'],'https://x.com/promrecord/status/'+row['id'])
    p['observations'].append(dict(days=0,scope='lifetime',label='게시 후 누적 · 공개 조회수',views=row.get('views'),comments=row.get('replies'),saves=row.get('bookmarks'),shares=None,reposts=row.get('retweets'),clicks=None))

data=dict(asOfDate=raw['asOfDate'],preparedAt=raw['preparedAt'],archiveSha256=hashlib.sha256(archive.read_bytes()).hexdigest(),accounts=raw['accounts'],periodMetrics=[r for r in raw['metricRows'] if r['scope']=='period' and not r.get('postId') and not r.get('title')],metricRows=raw['metricRows'],audienceRows=raw['audienceRows'],posts=list(posts.values()),youtubeLatest=raw['youtube']['latest'],limitations=raw['limitations'])
# Executable wrapper keeps the dashboard usable as a standalone static page.
(ROOT/'data.js').write_text('window.SNS_DATA = '+json.dumps(data,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print(json.dumps(dict(posts=len(posts),identified=sum(bool(p['id']) for p in posts.values()),metricRows=len(data['metricRows']),accounts=len(data['accounts'])),ensure_ascii=False))
