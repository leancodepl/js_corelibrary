var parseChangelog = require('changelog-parser')
var semver = require('semver');
var Repository = require('git-cli').Repository;
var path = require('path');

var CliCommand = require('git-cli/lib/cli-command');
var execute = require('git-cli/lib/runner').execute;

var glob = require("glob")
 
var cwd = path.resolve(__dirname + '/..');

function getChangelog(changelog) {
    return new Promise((resolve, reject) => {
        parseChangelog(changelog, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

function getNextVersion() {
    return getChangelog('../CHANGELOG.md')
        .then(changelog => {
            let lastVersion = changelog.versions.map(v => v.version).filter(v => !!v)[0];
            let nextVersion = semver.inc(lastVersion, "minor");
            
            var gitPath = cwd +'/.git';
            var repo = new Repository(gitPath);
            
            return repo.currentBranch()
                .then(branch => {
                    if (branch === "master") {
                        return nextVersion;
                    }
                    else {
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
    return execute(new CliCommand(['npm'], ["version", version, "--allow-same-version" ]), { cwd: package });
}

function publishPackage(package) {
    console.log(`Publishing package ${package}`);

    return execute(new CliCommand(['npm'], ["publish"]), { cwd: package })
        .then(() => console.log(`${package} published`));
}

getNextVersion()
    .then(version =>
        searchAllPackages()
            .then(packages => packages
                .map(package => path.resolve(cwd, package, '..'))
                .map(package => setVersion(package, version).then(() => publishPackage(package))))
    );
