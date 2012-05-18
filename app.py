from flask import Flask, request, session, g, redirect, url_for, abort, \
     render_template, flash, send_from_directory
import tweepy
import urllib,urllib2,re,os

     
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
    
@app.route('/')
def index():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        return redirect('/home')
    else:
        return redirect('/login')

        
@app.route('/login')
def login():
    return render_template('login.html')
    
@app.route('/oauth', methods=['POST'])
def oauth():
    twit = tweepy.OAuthHandler(app.config['CONSUMER_KEY'],app.config['CONSUMER_SECRET'])
    try:
        twitter_auth_url = twit.get_authorization_url()
    except tweepy.TweepError,e:
        return render_template('login.html', error='Failed to get request token.')
    else:
        auth_src = urllib.urlopen(twitter_auth_url).read()
        authenticity_token = re.compile(r'<input name="authenticity_token" type="hidden" value="(.*)" />').findall(auth_src)[0]
        oauth_token = twit.request_token.key
        post_data = {
            'session[username_or_email]': request.form['name'],
            'session[password]':  request.form['pass'],
            'authenticity_token': authenticity_token,
            'oauth_token': oauth_token
        }
        myCookie = urllib2.HTTPCookieProcessor()
        opener = urllib2.build_opener(myCookie)
        req = urllib2.Request(app.config['AUTHORIZE_URL'],urllib.urlencode(post_data))
        verifier_src = opener.open(req).read()
        verifier = re.compile(r'<kbd aria-labelledby="code-desc"><code>(.*)</code></kbd>').findall(verifier_src)[0]
        try:
            twit.get_access_token(verifier)
        except tweepy.TweepError,e:
            return render_template('login.html', error='Failed to get access token. Check your Twitter accout or password.')
        else:
            session['trister_access_key'] = twit.access_token.key
            session['trister_access_secret'] = twit.access_token.secret
            return redirect('/home')
            
@app.before_request
def before_request():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        g.twit_api = rebuild_api()

@app.route('/home')
def home():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        tweets = g.twit_api.home_timeline(page=50)
        return render_template('home.html', tweets=tweets)
    else:
        return render_template('login.html', error='Please Login first.')
            
app.secret_key = os.urandom(24)

if __name__ == "__main__":
    port = int(os.environ.get('PORT',5000))
    app.run(host='0.0.0.0', port=port, debug = app.config['DEBUG'])