const fs = require('fs');
const mix = require('laravel-mix');

const paths = {
    bootstrapper: 'jquery-hanging.js',
    output: 'dist/',
    source: 'src/'
};

mix.babel(paths.source + paths.bootstrapper, paths.output + function () {
    let bootstrapper = paths.bootstrapper;

    if (mix.inProduction()) {
        bootstrapper = bootstrapper.replace('.', '.min.');
    }

    return bootstrapper;
}());

mix.then(function () {
    fs.unlink('mix-manifest.json');
});
