/**
 *
 * @type {{history: boolean, prototypes: boolean}}
 */
var arguments = { history: false, prototypes: true };

/**
 *
 * @type {Neo}
 */
var $ = new Neo(arguments);

/**
 *
 */
var _document = $.select(document);

/**
 *
 */
var _window = $.select(window);