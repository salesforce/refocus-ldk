/**
 * src/lensinitUtils.js
 *
 * Resources to create a new lens project
 */

const util = require('util');
const path = require('path');
const fs = require('fs-extra');
const process = require('process');
//current working directory
let cwd = process.cwd();
const ldkDependencies = require('../package.json').dependencies;
const execSync = require('child_process').execSync;
/* Formatting README.md file */
const readme = '%s Lens \n\n %s ';
/* dev dependencies to add to new lens project*/
//const ldk_packages = require('../package.json').devDependencies;
const packagesToAdd = [
    'chai',
    'dateformat',
    'eslint',
    'express',
    'gulp',
    'jsdom',
    'mocha',
    'rimraf',
    'webpack'
];
//require('../package.json').devDependencies;
/* Scripts to add to new lens project */
const scriptsToAdd = {
    compile : 'lens-compile',
    zip : 'lens-zip',
    build : 'npm run compile && npm run zip',
    prototype: 'lens-prototype',
    test : ''
};

/* Adding scripts and dependencies */
function addScriptsAndDependencies(packageJson){
    if(!packageJson.scripts){
        packageJson.scripts = {};
    }
    Object.keys(scriptsToAdd).forEach(n =>{
        packageJson.scripts[n] = scriptsToAdd[n];
    });

    if(!packageJson.dependencies){
        packageJson.dependencies = {};
    }
    Object.keys(ldkDependencies).forEach((m) =>
    {
        packageJson.dependencies[m] = ldkDependencies[m];
    });

}

module.exports = {
    //Create a new directory for the project w/ src/main.js & lens.css
    createDir: (lensName) =>{
        console.log('creating project directory...');
        const dir = path.resolve(cwd,lensName);
        fs.mkdirpSync(dir,{recursive : true}, (err)=>{
            if(err) throw err;
        });
        let temp_dir = cwd;
        cwd = dir;
        [path.resolve(dir,'src'),path.resolve(dir,'test')].forEach(
            (d) => {fs.mkdirSync(d,{recursive : true})}
        );
        //console.log('current dir ' + dir);
        //console.log('temp dir' + dir);
        fs.appendFileSync(path.resolve(dir,'src/main.js'), fs.readFileSync('../main.template', 'utf8'));
        fs.appendFileSync(path.resolve(dir,'src/lens.css'), '');
    },
    //Copy devDependencies of LDK
    copyPackages:() => {
        console.log('copying packages...');
        const list = execSync('npm ls --prod --json',{cwd: __dirname});
        const dependencyTree = JSON.parse(list).dependencies;
        console.log(packagesToAdd);
        //let all_dep = getAllDependencies(packagesToAdd, dependencyTree);
        let all_dep = packagesToAdd;
        all_dep.forEach(module => {
            const fromDir = path.resolve(__dirname, '../node_modules',module);
            const toDir = path.resolve(cwd, 'node_modules',module);
            if(fs.existsSync(fromDir)){
                fs.copySync(fromDir,toDir);
            }
        });
    },
    //Set up package.json file & readme
    setupPackageJson: (dir = cwd) =>{
        console.log('setting up package.json...');
        execSync('npm init --yes', { cwd: dir, stdio: 'ignore', env : process.env});
        console.log(dir);
        const p = fs.readJsonSync(path.resolve(dir, 'package.json'));
        console.log(ldkDependencies);
        addScriptsAndDependencies(p);
        fs.writeJsonSync(path.resolve(dir, 'package.json'), p, { spaces: 2 });
        const temp = fs.readJsonSync(path.resolve(dir, 'package.json'));
        console.log('creating readme...');
        fs.writeFile( path.resolve(cwd,'README.md'), util.format(readme, temp.name, temp.description || 'A new lens project for Refocus'));
    },

    addScriptsAndDependencies

}