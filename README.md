# bookshelf-demo

## Installation ##

The first and only thing you will need to do, to try out this demo, is to have `node` and `npm` installed on your computer.  
Luckily, if you haven't, you can sort it out in a breeze by just following this quick guide: [https://nodejs.org/en/download/package-manager/](https://nodejs.org/en/download/package-manager/).

After that, clone this repo and on its root dir just type

```
  npm install
```

This will tell `npm` to install all the needed dependencies required to build this project.

When `npm` is done with it, just type

```
  npm run build
```

to start the build process.


## Server setup ##

You won't need anything fancy. Since you already have `node` installed let's use the server that comes bundled with it.

```
  cd build
  http-server
```

This demo is now being served on `localhost:8080`. If you are using that port for something else already, you can start the server and bind it to a different port by using the `-p` option.
```
  http-server -p <port-number>
```
