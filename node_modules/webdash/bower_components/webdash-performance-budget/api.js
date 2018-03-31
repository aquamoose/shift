const glob = require('glob');

module.exports = {
    routes: {
        get: {
            'js-size': async (req, res) => {
                const config = req.app.locals.config;

                const pattern = config.jsBudgetPath || "./dist/*.min.js";

                const g = glob(pattern, { stat: true }, (er, files) => { });

                let size = 0;
                g.on('stat', function (path, stat) {
                    size += stat.size;
                })
                g.on('end', () => {
                    res.send({ size });
                });
            }
        }
    }
}
