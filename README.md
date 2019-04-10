## Install
- Install firebase-tools `$ npm install -g firebase-tools`
- Sign in to Firebase `$ firebase login`- 
- `$ npm install`


## Serve to localhost API
- `npm start` 


## Deploy to Firebase Hosting - STAGING
- Clear active project `$ firebase use --clear`
- Select the project to use `$ firebase use sulbaguia-stg`
- Check the active project_id `$ firebase use`
- Deploy the webapp `$ npm run deploy-stg`
- Check sulbaguia-stg.firebaseapp.com


## Deploy to Firebase Hosting - PRODUCTION
- Clear active project `$ firebase use --clear`
- Select the project to use `$ firebase use sulbaguia`
- Check the active project_id `$ firebase use`
- Deploy the webapp `$ npm run deploy-production`
- Check admin.sulbaguia.com.br