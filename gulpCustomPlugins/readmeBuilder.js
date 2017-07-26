(function(factory) {
    'use strict';
    /* istanbul ignore next */
    // CommonJS
    if (typeof exports == "object" && typeof require == "function") {
        module.exports = factory(require("lodash"),
            require("../src/lodash-collection-helpers"),
            require("../readme"),
            require("../package"),
            require("../bower"));
    }
    // AMD
    else if (typeof define == "function" && define.amd) {
        define(["lodash", "./src/lodash-collection-helpers", "./readme", "./package", "./bower"], factory);
    }
}(function(_, CollectionHelpers, readmeDotJSON, packageDotJSON, bowerDotJSON) {
    var config = CollectionHelpers.leftJoin(
        [CollectionHelpers.selectAll(packageDotJSON, {
            main: 'npm.main'
        })], [CollectionHelpers.selectAll(bowerDotJSON, {
            main: 'bower.main'
        })],
        'name');
    var name = _.get(config, '[0].name', '');
    var user = 'JSystemsTech';
    var badges = {
        bower:'[!Bower Package](https://github.com/' + user + '/' + name + '/gulpCustomPlugins/customBadges/bower-badge.png)[bower-url]',
        license: '[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)][license-url]',
        npm: '[![NPM version](http://img.shields.io/npm/v/' + name + '.svg?style=flat)][npm-url]',
        downloads: '[![NPM downloads](http://img.shields.io/npm/dm/' + name + '.svg?style=flat)][npm-url]',
        travis: '[![Build Status](https://travis-ci.org/' + user + '/' + name + '.svg?branch=master)][travis-url]',
        dependencies: '[![Dependency Status](https://david-dm.org/' + user + '/' + name + '.svg?style=flat)][dependencies-url]',
        coverage: '[![Coverage Status](https://coveralls.io/repos/github/' + user + '/' + name + '/badge.svg?branch=master)][coverage-url]'
    };
    var links = [
        '[license-url]: LICENSE',
        '[npm-url]: https://www.npmjs.com/package/' + name,
        '[travis-url]: https://travis-ci.org/' + user + '/' + name + '?branch=master',
        '[dependencies-url]: https://david-dm.org/' + user + '/' + name,
        '[coverage-url]: https://coveralls.io/repos/github/' + user + '/' + name + '?branch=master',
        '[bower-url]: https://github.com/' + user + '/' + name + '#README'
    ].join('\n');
    var tableColumnAllignmentMap = {
        left: '----',
        center: ':----:',
        right: '----:'
    };
    var buildTable = function(columns, rows) {
        var tableMDConfigRow = _.map(columns, function(column) {
            return tableColumnAllignmentMap[_.get(column, 'allignment', 'left')];
        });
        var tableHeaderLabels = _.map(columns, function(column) {
            return _.get(column, 'lable', '');
        });
        var tableRows = _.map(rows, function(row) {
            return '| ' + row.join(' | ') + ' |';
        }).join('\n') + '\n';
        var tableHeaders = '| ' + tableHeaderLabels.join(' | ') + ' |\n';
        var tableAlingmentRow = '| ' + tableMDConfigRow.join(' | ') + ' |\n';
        return tableHeaders + tableAlingmentRow + tableRows;
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
                return buildTable(sectionContent.columns, sectionContent.rows);
            } else if (sectionContent.type === 'code_block') {
                return getCodeBlock(sectionContent.syntax, sectionContent.code);
            }else {
                return getSectionContent(_.get(sectionContent, 'content', ''));
            }
        } else if (_.isString(sectionContent)) {
            return sectionContent + '\n';
        }
    };

    var compileToMdFormat = function(argument) {

        var regions = [
            getBadges(_.get(readmeDotJSON, 'badges', [])), '## <a name="pagetop"></a>Table of Contents\n'
        ]

        _.each(_.get(readmeDotJSON, 'sections', []), function(section, index) {
            var sectionID = _.kebabCase(section.title);
            var tableOfContentsEntry = (index + 1) + '. [' + section.title + '](#' + sectionID + ')\n';
            regions[1] = regions[1] + tableOfContentsEntry;
            var sectionHeader = '## <a name="' + sectionID + '"></a>' + section.title + '\n';
            var sectionContent = getSectionContent(_.get(section, 'content', ''));

            regions.push(sectionHeader + sectionContent);
        });
        regions = regions.concat(['[Return to Top](#pagetop)\n', links]);
        return regions.join('\n');

    };
    return {
        compileToMdFormat: compileToMdFormat
    };
}));