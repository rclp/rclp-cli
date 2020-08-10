# rclp-cli

![Build Status of Unit Test](https://github.com/rclp/rclp-cli/workflows/Unit%20Test/badge.svg)

rclp CLI.


## How to install

```
$ npm install -g @rclp/rclp-cli
```

Or if you want to checkout Git repo directly:

```
$ git clone https://github.com/rclp/rclp-cli.git
```

## How to use

Install it first, then authenticate using your Google Account:

```
$ rclp -a
```

If you checked out the Git repo:

```
$ node cli.js -a
```

Copy data to your remote clipboard from stdin:


```
$ echo "hi there" | rclp -c
```

If you checked out the Git repo:

```
$ echo "hi there" | node cli.js -c
```

Paste the latest data from your remote clipboard:

```
$ rclp -p
```

If you checked out the Git repo:

```
$ node cli.js -p
```


## Development

TBD.


## Test

```
$ npm test
```
