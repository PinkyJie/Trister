from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, send_from_directory
import tweepy
import urllib,urllib2,re,os,json

     
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

@app.route('/home')
def home():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        tweets = g.twit_api.home_timeline(page=1)
        return '';
    else:
        return render_template('index.html')
            
app.secret_key = '\xfcM\xf7\xd4\x03\x14\x1e<\xe1\xd4Sn\xed\xa5e\x96\xb7\x8aq\x82\xed\x10\xdc\x93'

if __name__ == "__main__":
    port = int(os.environ.get('PORT',5000))
    app.run(host='0.0.0.0', port=port, debug = app.config['DEBUG'])