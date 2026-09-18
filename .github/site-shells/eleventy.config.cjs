const { readFileSync } = require('node:fs');
const { join } = require('node:path');
module.exports = function(config) {
  config.ignores.add('**/ui-proposal/**');
  config.setNunjucksEnvironmentOptions({ throwOnUndefined: true, autoescape: true });
  config.addGlobalData('shells', () => JSON.parse(readFileSync(join(__dirname, 'manifest.json'), 'utf8')).pages);
  return { templateFormats: ['njk'], dir: { includes: 'components' } };
};
