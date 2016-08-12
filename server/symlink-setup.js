/* This script symlinks an arbitrary folder (e.g. ./app) to node_modules/.
 * This lets us use statements like require('app/config/config') rather than
 * a mess of ../../../.
 */

const fs = require('fs');
const path = require('path');

const toLink = process.argv.slice(1);
toLink.forEach((elem) => {
    const src = path.join('../', elem);
    const dst = path.join('node_modules/', elem);
    fs.exists(dst, (err) => {
        err || fs.symlinkSync(src, dst, 'dir');
    });
});
