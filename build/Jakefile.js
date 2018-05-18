var fs = require('fs');
var path = require('path');
var glob = require("glob")
var parseChangelog = require('parse-changelog');
var CliCommand = require('git-cli/lib/cli-command');
var execute = require('git-cli/lib/runner').execute;
var Repository = require('git-cli').Repository;
var update = require('update-package-json');
var cmd = require('node-cmd');

var cwd = path.resolve(__dirname + '/..');
var async = { async: true };

function runCommand(task, command, msgOnSuccess) {
    jake.logger.log(`Running command "${command}"`);

    cmd.get(command, (err, data, stderr) => {
        if (err) {
            jake.logger.error(err.toString());
        }
        else {
            msgOnSuccess && jake.logger.log(msgOnSuccess);
            task.complete();
        }
    });
}

var list = new jake.FileList();
list.include('../src/*/package.json');

var dependencies = list.toArray()
    .map(package => {
        return {
            path: package,
            package: JSON.parse(fs.readFileSync(package).toString())
        }
    });

jake.logger.log(`Found dependencies: ${dependencies.map(d => d.path).join(", ")}`);

dependencies.forEach(p => {
    var deps = Object.keys(p.package.dependencies)
        .filter(d => d.startsWith("@leancode"));

    var name = p.package.name;
    var dir = path
        .resolve(__dirname, p.path, "..");

    namespace(`${name}`, () => {
        desc(`Update ${name} version`);
        task(`version`, async, function () {
            var version = jake.Task["get-next-version"].value;

            update(p.path, result => {
                if (result && result.dependencies) {
                    for (let dependency in result.dependencies) {
                        if (dependency.startsWith("@leancode")) {
                            jake.logger.log(`Setting version of ${name}'s depenendency ${dependency} to ${version}`);

                            result.dependencies[dependency] = version;
                        }
                    }
                }
                result.version = version;
            }, err => {
                if (err) {
                    fail(err);
                }
                else {
                    this.complete();
                }
            });
        });

        desc(`Restore packages of ${name}`);
        task(`install`, [`${name}:version`].concat(deps.map(d => `${d}:build`)), async, function (params) {
            jake.logger.log(`Restore packages of ${name}`);

            var command = `yarn install --cwd "${dir}" --production=false --check-files --link`

            runCommand(this, command, `Successfully restored packages of ${name}`);
        });

        desc(`Build ${name}`);
        task(`build`, [`${name}:install`], async, function (params) {
            jake.logger.log(`Build ${name}`);

            var command = `yarn --cwd "${dir}" build`

            runCommand(this, command, `Successfully built ${name}`)
        });

        desc(`Publish ${name}`);
        task(`publish`, [`${name}:build`], function (params) {
            var version = jake.Task["get-next-version"].value;

            jake.logger.log(`Publishing package ${name}`);

            var command = `yarn publish --cwd "${dir}" --new-version "${version}"`

            runCommand(this, command, `Successfully published ${name}`)
        });
    });
});

desc("Entry point for build tool");
task("default", ["publish"], function (params) {

});

desc("Gets version from changelog")
task("get-changelog", async, function () {
    var changelog = path.resolve(cwd, 'CHANGELOG.md');

    fs.readFile(changelog, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
            error(data);
        }
        else {
            complete(parseChangelog(data))
        }
    });
});

desc("Gets next version based on changelog")
task("get-next-version", ["get-changelog"], async, function () {
    var changelog = jake.Task["get-changelog"].value;
    var lastVersion = changelog.versions
        .map(v => v.tag)
        .filter(v => v.toLowerCase().indexOf("unreleased") === -1)
        .map(v => v.replace(/^\[|\]$|\s/g, ''))[0];

    jake.logger.log(`Last version from changelog is ${lastVersion}`);

    var gitPath = cwd + '/.git';
    var repo = new Repository(gitPath);

    var command = new CliCommand(['git', 'rev-list'], ["HEAD", "--count"]);

    return execute(command, repo._getOptions())
        .then(count => lastVersion.substring(0, lastVersion.lastIndexOf(".") + 1) + Number(count))
        .then(complete);
});

desc("Publishes packages");
task("publish", ["get-next-version"], function (params) {
    jake.logger.log(`Current version to publish packages with is set to ${jake.Task["get-next-version"].value}`);

    dependencies
        .map(d => `${d.package.name}:publish`)
        .forEach(d => jake.Task[d].invoke());
});
