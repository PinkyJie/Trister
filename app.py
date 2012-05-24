from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, send_from_directory
import tweepy
import urllib,urllib2,re,os,json,datetime,re

     
CONSUMER_KEY = 'D7JSMFuPyFRUIKLz0vKTw'
CONSUMER_SECRET = 'OthracjKzuvRYbnWUyJRYeMnLELf7xxmSNmCv78qPnk'
AUTHORIZE_URL = 'https://twitter.com/oauth/authorize'
DEBUG = True

app = Flask(__name__)
app.config.from_object(__name__)


def rebuild_api():
    twit = tweepy.OAuthHandler(app.config['CONSUMER_KEY'],app.config['CONSUMER_SECRET'])
    twit.set_access_token(session.get('trister_access_key'),session.get('trister_access_secret'))
    return tweepy.API(twit)


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')
                               
@app.before_request
def before_request():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        g.twit_api = rebuild_api()
    
@app.route('/')
def index():
    return render_template('index.html')
    
@app.route('/is_login')
def is_login():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        return json.dumps({'is_login':1})
    else:
        return json.dumps({'is_login':0})
        
@app.route('/login', methods=['POST'])
def oauth_login():
    twit = tweepy.OAuthHandler(app.config['CONSUMER_KEY'],app.config['CONSUMER_SECRET'])
    try:
        twitter_auth_url = twit.get_authorization_url()
    except tweepy.TweepError,e:
        return json.dumps({'success':'true','status': 'error','content':'Failed to get request token. Check your network state!'})
    else:
        auth_src = urllib.urlopen(twitter_auth_url).read()
        authenticity_token = re.compile(r'<input name="authenticity_token" type="hidden" value="(.*)" />').findall(auth_src)[0]
        oauth_token = twit.request_token.key
        post_data = {
            'session[username_or_email]': request.form['name'],
            'session[password]':  request.form['password'],
            'authenticity_token': authenticity_token,
            'oauth_token': oauth_token
        }
        myCookie = urllib2.HTTPCookieProcessor()
        opener = urllib2.build_opener(myCookie)
        req = urllib2.Request(app.config['AUTHORIZE_URL'],urllib.urlencode(post_data))
        verifier_src = opener.open(req).read()
        verifier = re.compile(r'<kbd aria-labelledby="code-desc"><code>(.*)</code></kbd>').findall(verifier_src)
        if len(verifier) == 0:
            return json.dumps({'success':'true','status': 'error','content':'Check your Twitter name or password!'})
        try:
            twit.get_access_token(verifier[0])
        except tweepy.TweepError,e:
            return json.dumps({'success':'true','status': 'error','content':'Failed to get access token. Check your network state!'})
        else:
            session['trister_access_key'] = twit.access_token.key
            session['trister_access_secret'] = twit.access_token.secret
            return json.dumps({'success': 'true','status': 'success','content':''})
            
def process_tweet(t):
    tweet_fields = [
        'created_at', 'id_str', 'text', 'source', 'in_reply_to_status_id_str',
        'in_reply_to_user_id_str', 'in_reply_to_screen_name', 'retweet_count',
        'favorited', 'retweeted'
    ]
    user_fields = [
        'id_str', 'name', 'screen_name', 'location', 'description', 'url', 'protected',
        'followers_count', 'friends_count', 'listed_count', 'created_at',
        'favourites_count', 'statuses_count',
        'profile_background_image_url_https', 'profile_image_url_https',
        'verified'
    ]
    t_dict = {}
    for f in tweet_fields:
        if isinstance(eval('t.' + f),datetime.datetime):
            t_dict[f] = str(eval('t.' + f) +  + datetime.timedelta(hours=+8))
        elif f == 'text':
            t_dict[f] = expand_url(eval('t.' + f))
            t_dict['entity'], t_dict[f] = gen_entity(t_dict[f])
        else:
            t_dict[f] = eval('t.' + f)
    t_dict['user'] = {}
    for f in user_fields:
        if isinstance(eval('t.author.' + f),datetime.datetime):
            t_dict['user'][f] = str(eval('t.author.' + f) + datetime.timedelta(hours=+8))
        else:
            t_dict['user'][f] = eval('t.author.' + f)
    
    return t_dict
    
def gen_entity(text):
    re_user = re.compile('@[a-z|A-Z|0-9|_]+')
    re_tag = re.compile('#[^\s#]+')
    re_link = re.compile(u'http.?://[^"\ \u201d]+')
    re_obj = {
        'user': re_user,
        'tag': re_tag,
        'link': re_link
    }
    entity = {}
    for key in re_obj:
        matches = list(set(re_obj[key].findall(text)))
        if len(matches) > 0:
            entity[key] = []
            for m in matches:
                text = text.replace(m,'<span class="t-%s">%s</span>' % (key,m))
                entity[key].append(m)
    return entity,text
    
def expand_url(text):
    re_url = re.compile(u'http.?://[^"\ \u201d]+')
    matches = re_url.findall(text)
    if len(matches) > 0:
        app.logger.debug(text)
        for m in matches:
            json_res = urllib.urlopen('http://api.longurl.org/v2/expand?url=%s&format=json' % m).read()
            res = json.loads(json_res)
            try:
                text = re_url.sub(res['long-url'],text)
            except:
                pass
    return text
            
            
@app.route('/home')
def home():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        page_arg = int(request.args['page'])
        count_arg = int(request.args['count'])
        tweets = g.twit_api.home_timeline(page=page_arg,count=count_arg)
        tweets_dict = []
        for t in tweets:
            t_dict = process_tweet(t)
            if hasattr(t,'retweeted_status'):
                t_dict['retweeted_status'] = process_tweet(t.retweeted_status)
            else:
                t_dict['retweeted_status'] = False
            if hasattr(t,'source_url'):
                t_dict['source_url'] = t.source_url
            else:
                t_dict['source_url'] = False
            tweets_dict.append(t_dict)
        return json.dumps(tweets_dict)
    else:
        return render_template('index.html')
            
app.secret_key = '\xfcM\xf7\xd4\x03\x14\x1e<\xe1\xd4Sn\xed\xa5e\x96\xb7\x8aq\x82\xed\x10\xdc\x93'

if __name__ == "__main__":
    port = int(os.environ.get('PORT',5000))
    app.run(host='0.0.0.0', port=port, debug = app.config['DEBUG'])