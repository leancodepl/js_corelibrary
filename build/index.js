var fs = require('fs');
var path = require('path');
var glob = require("glob")
var parseChangelog = require('parse-changelog');
var semver = require('semver');
var CliCommand = require('git-cli/lib/cli-command');
var execute = require('git-cli/lib/runner').execute;
var Repository = require('git-cli').Repository;
var update = require('update-package-json');
var cmd = require('node-cmd');

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
    let dependencies = [];
    let name = null;

    return new Promise((resolve, reject) => {
        update(package + "/package.json", result => {
            name = result.name;

            if (result && result.dependencies) {
                for (let dependency in result.dependencies) {
                    if (dependency.startsWith("@leancode")) {
                        dependencies.push(dependency);
                        console.log(`##teamcity[message text='Setting version of ${package}|'s dependency ${dependency} to ${version}' flowId='${package}']`);

                        result.dependencies[dependency] = version;
                    }
                }
            }
            
            console.log(`##teamcity[message text='Setting version of ${package} to ${version}' flowId='${package}']`);
            result.version = version;
        }, err => {
            if (err) {
                console.log(`##teamcity[message text='Couldn|'t set packages version' errorDetails='${JSON.stringify(err)}' status='ERROR' flowId='${package}']`);
                reject(err);
            }
            else {
                resolve({ package, name, dependencies });
            }
        });
    });
}

function printOutData(data, package, isError) {
    if (data && data.length > 0) {
        let lines = data.replace(/\'/g, '"').match(/[^\r\n]+/g);

        for (let line of lines) {
            console.log(`##teamcity[message text='${line}' flowId='${package}'${isError ? " status='ERROR'" : ""}]`);
        }
    }
}

function installPackage(package) {
    console.log(`##teamcity[message text='installing package ${package}']`);
    console.log(`##teamcity[compilationStarted compiler='npm' flowId='${package}']`);
    
    return new Promise((resolve, reject) => {
        cmd.get(`cd "${package}" && npm cache clean --force && npm install --dev --force`, (err, data, stderr) => {
            printOutData(data, package);
            printOutData(stderr, package, true);

            console.log(`##teamcity[compilationFinished compiler='npm' flowId='${package}']`);

            if (err) {
                printOutData(err.toString(), package, true);
                reject();
            }
            else {
                let tarball = data.substr(data.lastIndexOf("\n", data.length - 2) + 1).trim();
                
                console.log(`##teamcity[message text='${package} installed' flowId='${package}']`);
                resolve(tarball);
            }
        });
    });
}

function packPackage(package) {
    console.log(`##teamcity[message text='Packing package ${package}']`);
    
    return new Promise((resolve, reject) => {
        cmd.get(`cd "${package}" && npm pack`, (err, data, stderr) => {
            printOutData(data, package);
            printOutData(stderr, package, true);

            if (err) {
                printOutData(err.toString(), package, true);
                reject();
            }
            else {
                let tarball = data.substr(data.lastIndexOf("\n", data.length - 2) + 1).trim();
                
                console.log(`##teamcity[message text='${package} packed to ${tarball}' flowId='${package}']`);
                console.log(`##teamcity[publishArtifacts '${package}/${tarball}']`);
                resolve(tarball);
            }
        });
    });
}

function publishPackage(package, tarball) {
    console.log(`##teamcity[message text='Publishing package ${package}/${tarball}']`);
    
    return new Promise((resolve, reject) => {
        cmd.get(`cd "${package}" && npm publish "${tarball}"`, (err, data, stderr) => {
            printOutData(data, package);
            printOutData(stderr, package, true);

            if (err) {
                printOutData(err.toString(), package, true);
                resolve(err);
            }
            else {
                console.log(`##teamcity[message text='${package} published' flowId='${package}']`);
                resolve();
            }
        });
    });
}

getNextVersion().then(version =>
    searchAllPackages()
        .then(packages => {
            Promise.all(packages
                .map(package => path.resolve(cwd, package, '..'))
                .map(package => setVersion(package, version))
            ).then(dependencies => {
                let out = [];

                for (let package of dependencies) {
                    for (let i = 0; i <= out.length; i++) {
                        if (i == out.length) {
                            out.splice(i, 0, package);
                            break;
                        }
                        else {
                            if (out[i].dependencies.some(dep => dep === package.name)) {
                                out.splice(i, 0, package);
                                i++;
                                break;
                            }
                        }
                    }
                }

                console.log(`##teamcity[message text='Resolved dependency tree to: ${out.map(d => d.name).join(" -> ")}']`);
                function delay(miliseconds) {
                    return new Promise(resolve => {
                        setTimeout(resolve, miliseconds);
                    });
                }

                const publish = (i) => {
                    let package = out[i].package;

                    return installPackage(package)
                        .then(() => packPackage(package))
                        .then(tarball => publishPackage(package, tarball))
                        .then(() => {
                            if (i + 1 < out.length) {
                                return delay(120000)
                                    .then(() => publish(i + 1));
                            }
                        })
                }

                return publish(0);
            });
        })
);
