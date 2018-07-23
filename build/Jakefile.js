var fs = require('fs');
var path = require('path');
var glob = require("glob")
var parseChangelog = require('parse-changelog');
var CliCommand = require('git-cli/lib/cli-command');
var execute = require('git-cli/lib/runner').execute;
var Repository = require('git-cli').Repository;
var cmd = require('node-cmd');
var spawn = require('child_process').spawn;

var cwd = path.resolve(__dirname + '/..');
var async = { async: true };

function runCommand(task, command, msgOnSuccess) {
    jake.logger.log(`Running command "${command}"`);

    cmd.get(command, (err, data, stderr) => {
        if (err) {
            jake.logger.error(stderr);
            jake.logger.error(err.toString());
        }
        else {
            msgOnSuccess && jake.logger.log(msgOnSuccess);
            task.complete();
        }
    });
}

desc("Entry point for build tool");
task("default", ["build"], function (params) {

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

desc("Bootstrap packages");
task("bootstrap", async, function (params) {
    var command = `lerna bootstrap`

    runCommand(this, command, "Successfully bootstrapped packages");
});

desc("Build packages");
task("build", ["bootstrap"], function (params) {
    var command = `lerna run prepare`

    runCommand(this, command, "Successfully built packages");
});

desc("Publishes packages");
task("publish", ["bootstrap", "get-next-version"], function (params) {
    var version = jake.Task["get-next-version"].value;

    jake.logger.log(`Current version to publish packages with is set to ${version}`);

    var command = `lerna publish --skip-git --repo-version "${version}" --registry "https://www.myget.org/F/leancode/npm/" --yes`

    runCommand(this, command, "Successfully published packages");
});

desc("Update local version of packages. Useful after bumping version in changelog.");
task("update-local", ["get-next-version"], function (params) {
    var version = jake.Task["get-next-version"].value;

    jake.logger.log(`Current version to publish packages with is set to ${version}`);

    var command = `lerna publish --skip-git --skip-npm --repo-version "${version}" --yes`

    runCommand(this, command, "Successfully updated packages versions");
});

