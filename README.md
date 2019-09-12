[![Matrix](https://img.shields.io/matrix/synci:dmnd.sh)](https://matrix.to/#/#synci:dmnd.sh) [![Netlify Status](https://api.netlify.com/api/v1/badges/4a19398b-ed9c-4f3d-80d5-084f08a1d7db/deploy-status)](https://app.netlify.com/sites/synci/deploys) [![Javascript Standard](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![Dependencies](https://david-dm.org/zeratax/synci/status.svg)](https://david-dm.org/zeratax/synci) [![DevDependencies](https://david-dm.org/zeratax/synci/dev-status.svg)](https://david-dm.org/zeratax/synci?type=dev) <!-- markdownlint-disable MD041 -->

# synci

synchronize spotify, youtube, etc with your friends and party!

## demo

```shell
npm install
npm start
```

## deploy
```shell
npm install
npm run build
npm run serve
```


```nginx
location / {
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $remote_addr;
    proxy_pass http://localhost:8096;
}

# rewriting the image urls, since the different builds all have different baseURIs
location /images {
    rewrite ^/images/(.*)$ /esm-bundled/images/$1 last;
}
```

### static

```shell
npm install
npm run build:static
```

And then move your prefered build from `build/` into your webroot

### ipfs

Check the `./scripts/publish-ipfs.sh` so it points at your ipns

## contribute

[Contribution guidelines for this project](CONTRIBUTING.md)
