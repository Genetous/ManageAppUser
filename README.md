# Genetous Rule Engine Manager

It allows you to create role-based permissions for functions in **Genetous Services**. Thanks to role-based permissions, you can use **Genetous Services more safely and efficiently**.

## For installation

```console
git clone https://github.com/Genetous/ManageAppUser.git
cd ManageAppGenetous
npm install
```
### in .env file
```js
REACT_APP_AUTH_SERVICE=Your Auth Service Proxy Address on NGINX
REACT_APP_RULE_ENGINE=Your Rule Engine Proxy Address on NGINX
```

### If you want to build
```console
npm run build
```

### If you want to start
```console
npm start
```