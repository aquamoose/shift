const fs = require('fs');

module.exports = {
    routes: {
        get: {
            'manifest': (req, res) => {
                const appRoot = req.app.locals.appRoot;
                const config = req.app.locals.config;

                let result = null;

                const path = `${appRoot}/${config.manifestPath}` || `${appRoot}/src/manifest.json`;

                if (!fs.existsSync(path)) {
                    return res.send({ result });
                }

                const manifest = require(path);

                return res.send({ manifest });
            }
        }
    }
}
