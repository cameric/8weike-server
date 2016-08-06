#### What files to put in the `/shared` folder?

All files in this folder will monitored both by the
front-end file watcher (`webpack-dev-server`) and
the back-end file watcher (gulp worker). Therefore any
new file put in this folder should be a dependency on
both the client and server bundles.

#### Examples

- Routing-related files
- Webapp configuration files that the servers need to know