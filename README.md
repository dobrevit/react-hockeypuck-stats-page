# Getting Started with Hockeypuck OpenPGP Stats

This project is a React app that displays statistics about the Hockeypuck OpenPGP keyserver deployment. It's a modern take on the already existing [Hockeypuck Stats](https://github.com/hockeypuck/hockeypuck/blob/master/contrib/templates/stats.html.tmpl) page.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

### Deployment

Once you've built the app copy `manifest.json`, `asset-manifest.json`, and the `static` folder to the `webroot` of your Hockeypuck server. Then copy `index.html` to the `templates` folder of your Hockeypuck server, usually `/var/lib/hockeypuck/templates`, and rename it to `modernstats.html.tmpl`. Then edit the `hockeypuck` section of your Hockeypuck configuration file to include the new template:

```toml
[hockeypuck]
...
statsTemplate="/var/lib/hockeypuck/templates/modernstats.html.tmpl"
```

and restart Hockeypuck after.

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
