import time
import random
import urllib
import urllib2
import hmac
import hashlib
import re
import config
import logging

logging.basicConfig()

# constants
CONSUMER_KEY = config.CONSUMER_KEY
CONSUMER_SECRET = config.CONSUMER_SECRET
REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'
AUTHORIZE_URL = 'https://api.twitter.com/oauth/authorize'
ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
CALLBACK_URL = None


# utility functions
def qt(s):
    return urllib.quote(s, '~')


def str2dict(s):
    dic = {}
    for param in s.split('&'):
        (key, value) = param.split('=')
        dic[key] = value
    return dic


def dict2str(dic):
    return ', '.join(['%s="%s"' % (key, value) for key, value in dic.iteritems()])


class TwitterOauthError(Exception):
    def __init__(self, message, reason):
        Exception.__init__(self, message)
        self.reason = reason


class TwitterOauth(object):
    """docstring for TwitterOauth"""
    def __init__(self, username, password):
        super(TwitterOauth, self).__init__()
        self.username = username
        self.password = password
        self.logger = logging.getLogger(__name__)

    def build_header(self, params, base_url, oauth_token_secret='', method='POST'):
        common_params = {
            'oauth_consumer_key': CONSUMER_KEY,
            'oauth_version': '1.0',
            'oauth_signature_method': 'HMAC-SHA1',
            'oauth_timestamp': int(time.time()),
            'oauth_nonce': ('%x' % random.getrandbits(64))
        }
        params.update(common_params)
        if CALLBACK_URL:
            params['oauth_callback'] = qt(CALLBACK_URL)
        keys = sorted(list(params.keys()))
        encoded = qt('&'.join(['%s=%s' % (key, params[key]) for key in keys]))
        base_string = '%s&%s&%s' % (method, qt(base_url), encoded)
        # print base_string
        signing_key = CONSUMER_SECRET + '&' + oauth_token_secret
        params['oauth_signature'] = qt(hmac.new(signing_key, base_string, hashlib.sha1).digest().encode('base64')[:-1])
        return params

    def get_request_token(self):
        req = urllib2.Request(REQUEST_TOKEN_URL, headers={'Authorization': 'OAuth ' +
                              dict2str(self.build_header({}, REQUEST_TOKEN_URL))})
        res = None
        try:
            res = urllib2.urlopen(req, {}).read()
        except Exception, e:
            self.logger.error('get request token error: ' + e.message)
            raise TwitterOauthError(e.message,
                                    'Failed to get access token. There maybe a server error. Try again later!')
        else:
            res_dict = str2dict(res)
            if res_dict['oauth_callback_confirmed'] == 'true':
                self.oauth_token = res_dict['oauth_token']
                self.oauth_token_secret = res_dict['oauth_token_secret']
                self.logger.debug('get request token: ok ')
                self.logger.debug(res_dict)
            else:
                self.logger.error('get request token error: callback not true')
                raise TwitterOauthError('', 'Failed to get access token. There maybe a server error. Try again later!')

    def get_pin_code(self):
        redirect_url = AUTHENTICATE_URL + '?oauth_token=' + self.oauth_token
        res_temp = urllib.urlopen(redirect_url).read()
        re_token = re.compile(r'<input name="authenticity_token" type="hidden" value="(\w+)" />')
        pin_params = {}
        pin_params['authenticity_token'] = re_token.findall(res_temp)[0]
        pin_params['oauth_token'] = self.oauth_token
        pin_params['session[username_or_email]'] = self.username
        pin_params['session[password]'] = self.password
        req = urllib2.Request(AUTHORIZE_URL, urllib.urlencode(pin_params))
        res = None
        try:
            res = urllib2.urlopen(req).read()
        except Exception, e:
            self.logger.error('get pin code error: ' + e.message)
            raise TwitterOauthError(e.message,
                                    'Failed to get pin code. There maybe a server error. Try again later!')
        else:
            re_pin = re.compile(r'<code>(\d*)</code>')
            pin_code = re_pin.findall(res)[0]
            if len(pin_code) > 0:
                self.pin_code = pin_code
                self.logger.debug('get pin code ok: ' + pin_code)
            else:
                self.logger.error('get pin code error: username or password error')
                raise TwitterOauthError(e.message,
                                        'Failed to get pin code. Check your Username or Password!')

    def get_access_token(self):
        access_params = {}
        access_params['oauth_token'] = self.oauth_token
        access_params['oauth_verifier'] = self.pin_code
        req = urllib2.Request(ACCESS_TOKEN_URL, headers={'Authorization': 'OAuth ' +
                              dict2str(self.build_header(access_params, ACCESS_TOKEN_URL, self.oauth_token_secret))})
        res = None
        try:
            res = urllib2.urlopen(req, {}).read()
        except Exception, e:
            self.logger.error('get access token error: ' + e.message)
            raise TwitterOauthError(e.message,
                                    'Failed to access token. There maybe a server error. Try again later!')
        else:
            res_dict = str2dict(res)
            self.access_token = res_dict['oauth_token']
            self.access_token_secret = res_dict['oauth_token_secret']
            self.scree_name = res_dict['screen_name']
            self.logger.debug('get access token: ok ')
            self.logger.debug(res_dict)

    def oauth(self):
        try:
            self.get_request_token()
        except TwitterOauthError, e1:
            raise e1
        else:
            try:
                self.get_pin_code()
            except TwitterOauthError, e2:
                raise e2
            else:
                try:
                    self.get_access_token()
                except TwitterOauthError, e3:
                    raise e3


if __name__ == '__main__':
    # test
    t = TwitterOauth('xxx', 'xxx')
    try:
        t.oauth()
    except TwitterOauthError, e:
        print e.reason
    else:
        print t.access_token
        print t.access_token_secret
        print t.screen_name
