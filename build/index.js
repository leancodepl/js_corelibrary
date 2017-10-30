var fs = require('fs');
var path = require('path');
var glob = require("glob")
var parseChangelog = require('parse-changelog');
var semver = require('semver');
var CliCommand = require('git-cli/lib/cli-command');
var execute = require('git-cli/lib/runner').execute;
var Repository = require('git-cli').Repository;

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
    console.log(`Setting version of ${package} to ${version}`);
    return execute(new CliCommand(['npm'], ["view"]), { cwd: package })
        .then(result => eval('(' + result + ')'))
        .then(result => {
            let dependecies = result.dependencies;

            if (dependecies) {
                let leancodeDependencies = Object.keys(dependecies)
                    .filter(dependency => dependency.startsWith("@leancode"))
                    .map(dependency => dependency + "@" + version);
                
                console.log(`Setting version of ${package}'s dependencies ${leancodeDependencies.join(", ")} to ${version}`);
                return execute(new CliCommand(['npm'], ["install"].concat(leancodeDependencies).concat(["--save"])), { cwd: package });
            }
        }).then(() =>
            execute(new CliCommand(['npm'], ["version", version, "--allow-same-version"]), { cwd: package })
        );
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
