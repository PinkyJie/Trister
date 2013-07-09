Trister
=======

Mobile Twitter web client based on [Flask](http://flask.pocoo.org/) &amp; [Sencha Touch 2](http://www.sencha.com/products/touch). 

Trister = Tri[sta] + [Ma]ster

Requirements
=======
Python 2.7+

* [Flask](http://flask.pocoo.org/): `pip install flask`
* [Tweepy](https://github.com/tweepy/tweepy): `pip install tweepy`

Sencha Touch (Mobile Web Framework)

* [Sencha Touch](http://www.sencha.com/products/touch/download/)

Sencha Cmd (Building Toolkit for Sencha)

* [Sencha Cmd](http://www.sencha.com/products/sencha-cmd/download)

Install(appfog)
=======
1. Install `Sencha Touch` and `Sencha Cmd`
2. Copy the Sencha Touch SDK directory to our project
  * Unzip the Sencha Touch SDK, you can get a directory `touch-x.x.x`
  * In command line, cd to `touch-x.x.x`, execute `Sencha generate app test ../test`
  * In the parent directory of `touch-x.x.x`, you can get a directory `test`
  * Copy `test/touch` directory to `Trister/static/touch`
3. Cd to `Trister` directory, execute `./build.sh` (for Linux/Mac) or `build.bat` (for Windows)
4. Cd to `build-result` directory, login to `AppFog` using `af login`, then upload code using `af update yourappname`


Demo(unstable)
=======
[https://trister.aws.af.cm](https://trister.aws.af.cm)
