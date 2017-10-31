var fs = require('fs');
var path = require('path');
var glob = require("glob")
var parseChangelog = require('parse-changelog');
var semver = require('semver');
var CliCommand = require('git-cli/lib/cli-command');
var execute = require('git-cli/lib/runner').execute;
var Repository = require('git-cli').Repository;
var update = require('update-package-json');

var cwd = path.resolve(__dirname + '/..');

function getChangelog(changelog) {
    return new Promise((resolve, reject) => {
        fs.readFile(changelog, { encoding: 'utf-8' }, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(parseChangelog(data));
            }
        });
    });
}

function getNextVersion() {
    return getChangelog(path.resolve(cwd, 'CHANGELOG.md'))
        .then(changelog => {
            let lastVersion = changelog.versions
                .map(v => v.tag)
                .filter(v => v.toLowerCase().indexOf("unreleased") === -1)
                .map(v => v.replace(/^\[|\]$|\s/g, ''))[0];
            
            var gitPath = cwd +'/.git';
            var repo = new Repository(gitPath);
            
            return repo.currentBranch()
                .then(branch => {
                    if (branch === "master") {
                        return lastVersion;
                    }
                    else {
                        let nextVersion = semver.inc(lastVersion, "minor");

                        var command = new CliCommand(['git', 'rev-list'], ["HEAD", "--count"]);

                        return execute(command, repo._getOptions())
                            .then(count => nextVersion + "-alpha." + Number(count));
                    }
                });
        });
}

function searchAllPackages() {
    return new Promise((resolve, reject) => {
        glob("src/*/package.json", { cwd }, function (err, files) {
            if (err) {
                reject(err);
            }
            else {
                resolve(files);
            }
        });
    })
}

function setVersion(package, version) {
    return new Promise((resolve, reject) => {
        update(package + "/package.json", result => {
            if (result && result.dependencies) {
                for (let dependency in result.dependencies) {
                    if (dependency.startsWith("@leancode")) {
                        console.log(`Setting version of ${package}'s dependency ${dependency} to ${version}`);

                        result.dependencies[dependency] = version;
                    }
                }
            }

            console.log(`Setting version of ${package} to ${version}`)
            result.version = version;
        }, err => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}

function publishPackage(package) {
    console.log(`Publishing package ${package}`);

    return execute(new CliCommand(['npm'], ["publish"]), { cwd: package })
        .then(() => console.log(`${package} published`));
}

getNextVersion().then(version =>
    searchAllPackages()
        .then(packages => Promise.all(packages
            .map(package => path.resolve(cwd, package, '..'))
            .map(package => setVersion(package, version).then(() => publishPackage(package))))
        )
);
