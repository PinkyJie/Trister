# coding=utf-8

import os
from functools import wraps
import json
import time

from tweepy import (parsers, OAuthHandler, API, TweepError)
from flask import (Flask, request, session, g)

from twitter_oauth import (TwitterOauth, TwitterOauthError)

application = app = Flask(__name__, static_folder='static', static_url_path='')
app.config.from_object('config')


def jsonify(f):
    @wraps(f)
    def _wrapped(*args, **kwargs):
        from flask import jsonify as flask_jsonify
        try:
            result_dict = f(*args, **kwargs)
        except Exception as e:
            result_dict = dict(success=False)
            result_dict['content'] = 'Operation failed: ' + e.message
            if app.config['DEBUG']:
                from traceback import format_exc
                result_dict['exc_info'] = format_exc(e)
        return flask_jsonify(**result_dict)
    return _wrapped


def rebuild_api():
    twit = OAuthHandler(app.config['CONSUMER_KEY'], app.config['CONSUMER_SECRET'])
    twit.set_access_token(session.get('trister_access_key'), session.get('trister_access_secret'))
    return API(auth_handler=twit, parser=parsers.RawParser())


def str2timestamp(time_str):
    time_struct = time.strptime(time_str, '%a %b %d %H:%M:%S +0000 %Y')
    return int(time.mktime(time_struct))


def is_dm_with_user(dm, user, me):
    sender = dm['sender']['screen_name']
    receiver = dm['recipient']['screen_name']
    return (sender == me and receiver == user) or (sender == user and receiver == me)


@app.before_request
def before_request():
    # print request.endpoint
    except_endpoints = ('root', 'static', 'is_login', 'oauth_login')
    if request.endpoint not in except_endpoints:
        if session.get('trister_access_key') and session.get('trister_access_secret'):
            g.twit_api = rebuild_api()
        else:
            return app.send_static_file('index.html')


@app.route('/', methods=['GET'])
def root():
    return app.send_static_file('index.html')


@app.route('/is_login', methods=['GET'])
@jsonify
def is_login():
    if session.get('trister_access_key') and session.get('trister_access_secret'):
        return dict(success=True, content=1,
                    user=dict(key=session.get('trister_access_key'),
                              secret=session.get('trister_access_secret'),
                              name=session.get('trister_user_name')
                              )
                    )
    else:
        return dict(success=True, content=0)


@app.route('/login', methods=['POST'])
@jsonify
def oauth_login():
    t = TwitterOauth(request.form['name'], request.form['password'])
    try:
        t.oauth()
    except TwitterOauthError, e:
        return dict(success=False, content=e.reason)
    else:
        session['trister_access_key'] = t.access_token
        session['trister_access_secret'] = t.access_token_secret
        session['trister_user_name'] = t.screen_name
        return dict(success=True, content=dict(key=t.access_token, secret=t.access_token_secret, name=t.screen_name))


@app.route('/home', methods=['GET'])
def get_home():
    page_arg = int(request.args['page'])
    count_arg = int(request.args['count'])
    tweets = g.twit_api.home_timeline(page=page_arg, count=count_arg)
    # f = open('homeline.json', 'w')
    # f.write(tweets)
    # f.close()
    return tweets


@app.route('/mention', methods=['GET'])
def get_reply():
    page_arg = int(request.args['page'])
    count_arg = int(request.args['count'])
    replys = g.twit_api.mentions_timeline(page=page_arg, count=count_arg)
    # f = open('mention.json', 'w')
    # f.write(replys)
    # f.close()
    return replys


@app.route('/update', methods=['POST'])
@jsonify
def update_status():
    try:
        if request.form['type'] == 'Reply':
            status = g.twit_api.update_status(status=request.form['tweet'], in_reply_to_status_id=request.form['tweet_id'])
        else:
            status = g.twit_api.update_status(request.form['tweet'])
    except TweepError, e:
        return dict(success=False, content='Failed to update tweet!', reason=json.loads(e.message))
    else:
        return dict(success=True, content='')


@app.route('/favorite/<action>', methods=['POST'])
@jsonify
def favorite(action):
    fail_msg = ''
    try:
        if action == 'add':
            g.twit_api.create_favorite(request.form['tweet_id'])
            fail_msg = 'Failed to create favorite tweet'
        elif action == 'del':
            g.twit_api.destroy_favorite(request.form['tweet_id'])
            fail_msg = 'Failed to destory favorite tweet'
    except TweepError, e:
        return dict(success=False, content=fail_msg, reason=json.loads(e.message))
    else:
        return dict(success=True, content='')


@app.route('/retweet', methods=['POST'])
@jsonify
def retweet_tweet():
    try:
        g.twit_api.retweet(request.form['tweet_id'])
    except TweepError, e:
        return dict(success=False, content='Failed to retweet tweet!', reason=json.loads(e.message))
    else:
        return dict(success=True, content='Retweet successfully!')


@app.route('/destory/<entity>', methods=['POST'])
@jsonify
def destory_entity(entity):
    try:
        if entity == 'tweet':
            g.twit_api.destroy_status(request.form['tweet_id'])
            success_msg = 'Delete tweet successfully!'
            fail_msg = 'Failed to delete tweet!'
    except TweepError, e:
        return dict(success=False, content=fail_msg, reason=json.loads(e.message))
    else:
        return dict(success=True, content=success_msg)


@app.route('/dm', methods=['GET'])
def get_direct_message():
    page_arg = int(request.args['page'])
    count_arg = int(request.args['count'])
    received_dms = json.loads(g.twit_api.direct_messages(page=page_arg, count=count_arg))
    sent_dms = json.loads(g.twit_api.sent_direct_messages(page=page_arg, count=count_arg))
    dms = received_dms + sent_dms
    dm_list = []
    me = session.get('trister_user_name')
    senders = [dm['sender']['screen_name'] for dm in dms]
    recipients = [dm['recipient']['screen_name'] for dm in dms]
    all_users = set(senders + recipients)
    users_expcept_me = [user for user in all_users if user != me]
    for user in users_expcept_me:
        _dict = {}
        _dict['dms'] = [dm for dm in dms if is_dm_with_user(dm, user, me)]
        # _dict['dms'].sort(key=lambda dm: str2timestamp(dm['created_at']), reverse=True)
        # _dict['time'] = _dict['dms'][0]['created_at']
        # _dict['me'] = me
        dm_list.append(_dict)
    # dm_list.sort(key=lambda dm: str2timestamp(dm['time']), reverse=True)
    json_str = json.dumps(dm_list)
    # f = open('dm.json', 'w')
    # f.write(json_str)
    # f.close()
    return json_str


@app.route('/dm/create', methods=['POST'])
@jsonify
def create_new_dm():
    try:
        dm = g.twit_api.send_direct_message(
            screen_name=request.form['screen_name'],
            text=request.form['text']
        )
    except TweepError, e:
        return dict(success=False, content='Failed to send DM!', reason=json.loads(e.message))
    else:
        return dict(success=True, content=json.loads(dm))


@app.route('/threads/<tweet_id>', methods=['GET'])
@jsonify
def get_reply_threads(tweet_id):
    try:
        threads = []
        while tweet_id:
            tweet = json.loads(g.twit_api.get_status(tweet_id))
            threads.append(tweet)
            tweet_id = tweet['in_reply_to_status_id_str']
    except TweepError, e:
        return dict(success=False, content='Failed to send DM!', reason=json.loads(e.message))
    else:
        return dict(success=True, content=threads)


@app.route('/user/<screen_name>', methods=['GET'])
@jsonify
def get_user(screen_name):
    try:
        user = g.twit_api.get_user(screen_name=screen_name)
        # f = open('user.json', 'w')
        # f.write(user)
        # f.close()
    except TweepError, e:
        return dict(success=False, content='Failed to find @' + screen_name, reason=json.loads(e.message))
    else:
        return dict(success=True, content=json.loads(user))


app.secret_key = '\xfcM\xf7\xd4\x03\x14\x1e<\xe1\xd4Sn\xed\xa5e\x96\xb7\x8aq\x82\xed\x10\xdc\x93'
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=app.config['DEBUG'])
