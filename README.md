# rclp-cli

rclp CLI.


## How to install

```
$ git clone https://github.com/rclp/rclp-cli.git
$ cd rclp-cli
```

## How to use

Install it first, then authenticate using your Google Account:

```
$ node cli.js -a
```

Copy data to your remote clipboard from stdin:

```
echo "hi there" | node cli.js -c
```

Paste the latest data from your remote clipboard:

```
$ node cli.js -p
```


## Development

TBD.


## Test

```
$ npm test
```
