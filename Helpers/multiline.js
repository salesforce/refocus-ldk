/**
 * Copyright (c) 2016, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or
 * https://opensource.org/licenses/BSD-3-Clause
 */
var Handlebars = require('handlebars-template-loader/runtime');

Handlebars.registerHelper('multiline', (data) => {
    let output = '';
    let lines = data.split(/[\n\r]+/);
    for (let i in lines) {
        // will not allow multiple newlines to be rendered as empty lines
        if (!Handlebars.Utils.isEmpty(lines[i])) {
            output += Handlebars.escapeExpression(lines[i]) + "<br/>";
        }
    }

    return new Handlebars.SafeString(output);
});
