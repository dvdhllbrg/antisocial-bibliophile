import xml2js from 'xml2js';

export default new xml2js.Parser({
  explicitRoot: false,
  explicitArray: false,
  mergeAttrs: true,
});
