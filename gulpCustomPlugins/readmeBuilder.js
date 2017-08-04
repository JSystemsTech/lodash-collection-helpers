(function(factory) {
    'use strict';
    /* istanbul ignore next */
    // CommonJS
    if (typeof exports == "object" && typeof require == "function") {
        module.exports = factory(require("lodash"),
            require("uuid"),
            require("../src/lodash-collection-helpers"),
            require("../devconfig"),
            require("../readme"),
            require("../package"),
            require("../bower"));
    }
    // AMD
    else if (typeof define == "function" && define.amd) {
        define(["lodash", "uuid", "../src/lodash-collection-helpers", "../devconfig", "../readme", "../package", "../bower"], factory);
    }
}(function(_, uuid, CollectionHelpers, devConfig, readmeDotJSON, packageDotJSON, bowerDotJSON) {
    var config = CollectionHelpers.leftJoin(
        [CollectionHelpers.selectAll(packageDotJSON, {
            main: 'npm.main'
        })], [CollectionHelpers.selectAll(bowerDotJSON, {
            main: 'bower.main'
        })],
        'name');
    var name = _.get(config, '[0].name', '');
    var user = 'JSystemsTech';
    var targetBranch = devConfig.branch;
    var escapedBranch = targetBranch.replace(/\//g, "%2F");
    var badges = {
        bower: '<a href="https://github.com/' + user + '/' + name + '#README"><img src="https://github.com/' + user + '/' + name + '/raw/' + targetBranch + '/gulpCustomPlugins/customBadges/bower-badge.png" alt="Bower Package" height="30" width="130"></a>',
        license: '[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)][license-url]',
        npm: '[![NPM version](http://img.shields.io/npm/v/' + name + '.svg?style=flat)][npm-url]',
        downloads: '[![NPM downloads](http://img.shields.io/npm/dm/' + name + '.svg?style=flat)][npm-url]',
        travis: '[![Build Status](https://travis-ci.org/' + user + '/' + name + '.svg?branch=' + escapedBranch + ')][travis-url]',
        dependencies: '[![Dependency Status](https://david-dm.org/' + user + '/' + name + '.svg?style=flat&branch=' + escapedBranch + ')][dependencies-url]',
        'dev-dependencies': '[![devDependencies Status](https://david-dm.org/' + user + '/' + name + '/dev-status.svg?branch=' + escapedBranch + ')][dev-dependencies-url]',
        //coverage: '[![Coverage Status](https://coveralls.io/repos/github/' + user + '/' + name + '/badge.svg?branch=' + escapedBranch + ')][coverage-url]'
        coverage: '<a href="https://coveralls.io/github/' + user + '/' + name + '?branch=' + targetBranch + '"><img src="https://coveralls.io/repos/github/' + user + '/' + name + '/badge.svg?branch=' + targetBranch + '" alt="Coverage Status" /></a>'
    };
    var links = [
        '[license-url]: LICENSE',
        '[npm-url]: https://www.npmjs.com/package/' + name,
        '[travis-url]: https://travis-ci.org/' + user + '/' + name + '?branch=' + escapedBranch,
        '[dependencies-url]: https://david-dm.org/' + user + '/' + name + '?branch=' + escapedBranch,
        '[dev-dependencies-url]:https://david-dm.org/' + user + '/' + name + '?type=dev&branch=' + escapedBranch,
        '[coverage-url]: https://coveralls.io/github/' + user + '/' + name + '?branch=' + escapedBranch,
        '[documentation-url]: https://github.com/' + user + '/' + name + '/blob/' + targetBranch + '/DOCUMENTATION.md',
        '[readme-url]: https://github.com/' + user + '/' + name + '/blob/' + targetBranch + '/README.md'
    ];

    documenationLinks = _.map(_.keys(CollectionHelpers.getCollectionHelpers()), function(key) {
        return '[' + key + '-url]: https://github.com/' + user + '/' + name + '/blob/' + targetBranch + '/DOCUMENTATION.md#' + key.toLowerCase();
    });
    documenationLinks.push('[getCollectionHelpers-url]: https://github.com/' + user + '/' + name + '/blob/' + targetBranch + '/DOCUMENTATION.md#getcollectionhelpers');
    links = links.concat(documenationLinks).join('\n')

    var tableColumnAllignmentMap = {
        left: '----',
        center: ':----:',
        right: '----:'
    };
    var buildTable = function(columns, rows, header) {
        var mainHeader = '';
        if (header) {
            mainHeader = '### ' + _.startCase(header) + '\n';
        }
        var tableMDConfigRow = _.map(columns, function(column) {
            return tableColumnAllignmentMap[_.get(column, 'allignment', 'left')];
        });
        var tableHeaderLabels = _.map(columns, function(column) {
            return _.get(column, 'label', '');
        });
        var tableRows = _.map(rows, function(row) {
            return '| ' + row.join(' | ') + ' |';
        }).join('\n') + '\n';
        var tableHeaders = '| ' + tableHeaderLabels.join(' | ') + ' |\n';
        var tableAlingmentRow = '| ' + tableMDConfigRow.join(' | ') + ' |\n';
        return mainHeader + tableHeaders + tableAlingmentRow + tableRows;
    };
    var toBadgeText = function(value) {
        return value.replace(/ /g, "_").replace(/-/g, "--");
    };
    var buildBadgeList = function(list) {
        return _.map(list, function(item) {
            var label = toBadgeText(_.get(item, 'label'));
            var value = toBadgeText(_.get(item, 'value'));
            var badgeURL = 'https://img.shields.io/badge/' + label + '-' + value + '-green.svg?style=social';
            return '![' + _.get(item, 'label') + '](' + badgeURL + ')';
        }).join('<br>') + '\n';
    };
    var getBadges = function(badgesToUse) {
        return _.map(_.pick(badges, badgesToUse), function(badge) {
            return badge;
        }).join(' ');
    };
    var getCodeBlock = function(syntax, code) {
        return ['``` ' + syntax, code, '```'].join('\n') + '\n';
    };
    var getSectionContent = function(sectionContent) {
        if (_.isArray(sectionContent)) {
            return _.map(sectionContent, function(content) {
                return getSectionContent(content);
            }).join('\n');
        } else if (_.isPlainObject(sectionContent)) {
            if (sectionContent.type === 'table') {
                return buildTable(sectionContent.columns, sectionContent.rows, sectionContent.header);
            } else if (sectionContent.type === 'code_block') {
                return getCodeBlock(sectionContent.syntax, sectionContent.code);
            } else if (sectionContent.type === 'badge-list') {
                return buildBadgeList(sectionContent.list);
            } else {
                return getSectionContent(_.get(sectionContent, 'content', ''));
            }
        } else if (_.isString(sectionContent)) {
            return sectionContent + '\n';
        }
    };

    var compileToMdFormat = function(argument) {
        var pagetopID = uuid.v4();
        var title = '# ' + _.startCase(name);
        var description = '*' + _.get(config, '[0].description', '') + '*\n';
        var badges = getBadges(_.get(readmeDotJSON, 'badges', []));
        var tableOfContents = ['## <a name="' + pagetopID + '"></a>Table of Contents'];
        var mainContent = _.map(_.get(readmeDotJSON, 'sections', []), function(section, index) {
            var sectionID = uuid.v4();
            var formattedTitle = _.startCase(section.title);
            var tableOfContentsEntry = (index + 1) + '. [' + formattedTitle + '](#' + sectionID + ')\n';
            //regions[1] = regions[1] + tableOfContentsEntry;
            tableOfContents.push(tableOfContentsEntry);
            var sectionHeader = '## <a name="' + sectionID + '"></a>' + formattedTitle + '\n';
            var sectionContent = getSectionContent(_.get(section, 'content', ''));

            return sectionHeader + sectionContent;
        });
        var regions = [title, description, badges, tableOfContents.join('\n'), mainContent.join('\n'), '[Return to Top](#' + pagetopID + ')\n', links];
        return regions.join('\n');

    };
    return {
        compileToMdFormat: compileToMdFormat
    };
}));