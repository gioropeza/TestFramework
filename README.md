## Testing NodeJS with Jasmine, Istanbul and SonarQube
This guide assumes you have NodeJS already installed in your environment. If you haven't installed NodeJS yet, please do so by following
these instructions [Installing NodeJS](https://nodejs.org/en/download/package-manager/).

### Installation
* Create your project directory `mkdir myproject && cd myproject`
* Install [Istanbul](https://github.com/yahoo/istanbul) `npm install -g istanbul` (I used `-g` to install it globally for ease of use)
* Install [Jasmine](https://www.npmjs.com/package/jasmine) `npm install -g jasmine`

### Getting started with Jasmine
[Jasmine](http://jasmine.github.io/2.4/introduction.html) is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript framework and it has a clean, obvious syntax so that you can easily write tests. 
* To initialize Jasmine use `jasmine unit`. It creates the `spec` directories and `spec/support/jasmine.json` 
which contains Jasmine's configurations
* Add the following files

`./lib/pill.js`
```
exports.pill = function (pillColor) {
  if(pillColor=='red') return 'red';
  else if (pillColor == 'blue') return 'blue';
  else return null;
};
```
`./spec/pillSpec.js`
```
describe("Pill", function() {

  var Pill = require('../lib/pill');
  
  it("should be red", function() {
    expect(Pill.pill("red")).toBe("red");
  });
  
  /*it("should be blue", function(){
    expect(Pill.pill("blue")).toBe("blue");
  });
  
  it("should be null", function () {
    expect(Pill.pill()).toBe(null);
  });*/
});
```
* Running `jasmine` will execute the tests within `spec/` on the files under `lib/`

### Getting started with Istanbul
Yet another JS code coverage tool that computes statement, line, function and branch coverage with module loader hooks to transparently add coverage when running tests. In my own words, Istanbul analyses your test results (from Jasmine in this case) and your actual code, then creates a coverage report.
* Create yml config file `touch .istanbul.yml` and add the following configurations. There are tons of configurations you can add here including what type of report you want Istanbul to generate.
```
verbose: false
instrumentation:
    root: .
    excludes: ['**/spec/**']

```
The `exclude` clause will prevent Istanbul to instrument the tests themselves. By default Istanbul ignores the `test` folder, with this code it will also ignore the `spec` folder.
* Run `istanbul cover jasmine` to execute the test and create the coverage report
* Istanbul will generate the report under `./coverage/`

### Getting started with SonarQube
SonarQube (formerly known as sonar) is a code analyzer tool for continuous code quality analysis. In our use case, we're using sonar to perform another level of analysis on our code plus use the report (`myproject/coverage/lcov.info`) provided by Istanbul's run. SonarQube also provides a user friendly web UI to navigate through your code and understand your code coverage and what's missing.
* Make sure you have your SonarQube server up and running and have the credentials to push reports
* Create a `sonar-project.properties` file in your project's root directory and add the following code
```
# Required metadata
sonar.host.url=Your SonarQube Host
sonar.login=Sonar User with Push Rights
sonar.password=User Password
sonar.projectKey=Unique value for the project
sonar.projectName=Display name for your project in the SonarQube UI
sonar.projectDescription=Project Description
sonar.projectVersion=1.0
sonar.projectBaseDir=./myproject

# Comma-separated paths to directories with sources (required)
sonar.sources=myproject/lib/
sonar.tests=myproject/spec/

# Encoding of the source files
sonar.sourceEncoding=UTF-8
sonar.language=js

# Report Paths
sonar.javascript.forceZeroCoverage=false
sonar.javascript.jstest.reportsPath=myproject/coverage
sonar.javascript.lcov.reportPath=tmyproject/coverage/lcov.info
```
* There are multiple ways to execute sonar. I've used the `sonar-runner` and also the `SonarQube Jenkins Plugin` since I'm using Jenkins to build my own projects.
* For both ways you need to make sure the [JavaScript plugin](http://docs.sonarqube.org/display/PLUG/JavaScript+Plugin) is [installed](http://docs.sonarqube.org/display/SONAR/Installing+a+Plugin) in SonarQube.
* To use the SonarQube Jenkins Plugin you need to install it in Jenkins so make sure you have admin rights.
* Once you have the plugin installed in Jenkins you'll need to configure the plugin:
![Jenkins SonarQube Plugin Configuration](http://i.imgur.com/d4FLVDw.png?1)
* Once you have your plugin configured, go to your job and add the build step `Invoke Standalone SonarQube Analysis`. Here is the setup I have based on my own configurations. Notice how I specify both a property file and then some more properties that I pulled from Jenkins global configs. 
![Jenkins SonarQube Runner](http://i.imgur.com/t1CLlPz.png?1)
* If you want to use the `sonar-runner` instead, follow the instructions [here](http://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner). You can still use the same `sonar-project.properties` with the runner.

### Other useful documentation
* To checkout a Jasmine Test example run `jasmine examples`
* [Jasmine](http://jasmine.github.io/2.1/node.html)

![meme](http://www.daedtech.com/wp-content/uploads/2012/12/TestAllTheThings.jpg)
