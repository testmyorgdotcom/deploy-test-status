import { expect } from 'fancy-test';
import { Failure, RunTestResult, Success } from '../../src/lib/model';
import { DeployReportJunitTestAdapater } from '../../src/lib/adapter';

describe('junit adapter', () => {
  describe('base properties', () => {
    const property = (name: string, value: string): string => {
      return `<property name="${name}" value="${value}" />`;
    };
    it('has "Failed" outcome if there are failed tests', () => {
      const deployTestResult: RunTestResult = {
        numFailures: '1',
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildOutcomeProperty()).to.equal(property('outcome', 'Failed'));
    });
    it('has "Passed" outcome if there are no failed tests', () => {
      const deployTestResult: RunTestResult = {};
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildOutcomeProperty()).to.equal(property('outcome', 'Passed'));
    });
    it('has "testsRun" property', () => {
      const testsRan = '32';
      const deployTestResult: RunTestResult = {
        numTestsRun: testsRan,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildTestsRanProperty()).to.equal(property('testsRan', testsRan));
    });
    it('has "passing" property', () => {
      const testsRan = 32;
      const testsFailed = 2;
      const testsPassed = testsRan - testsFailed;
      const deployTestResult: RunTestResult = {
        numTestsRun: `${testsRan}`,
        numFailures: `${testsFailed}`,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildTestsPassedProperty()).to.equal(property('passing', `${testsPassed}`));
    });
    it('has "failing" property', () => {
      const testsFailed = 2;
      const deployTestResult: RunTestResult = {
        numFailures: `${testsFailed}`,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildTestsFailedProperty()).to.equal(property('failing', `${testsFailed}`));
    });
    it('has "skipped" property always 0', () => {
      const deployTestResult: RunTestResult = {};
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildTestsSkippedProperty()).to.equal(property('skipped', '0'));
    });
    it('has "passRate" property', () => {
      const testsRan = 100;
      const testsFailed = 37;
      const testsPassed = testsRan - testsFailed;
      const deployTestResult: RunTestResult = {
        numTestsRun: `${testsRan}`,
        numFailures: `${testsFailed}`,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildPassRateProperty()).to.equal(property('passRate', `${(testsPassed / testsRan) * 100}%`));
    });
    it('has "passRate" property 100% if no tests', () => {
      const deployTestResult: RunTestResult = {};
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildPassRateProperty()).to.equal(property('passRate', '100%'));
    });
    it('has "failRate" property', () => {
      const testsRan = 100;
      const testsFailed = 37;
      const deployTestResult: RunTestResult = {
        numTestsRun: `${testsRan}`,
        numFailures: `${testsFailed}`,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildFailRateProperty()).to.equal(property('failRate', `${(testsFailed / testsRan) * 100}%`));
    });
    it('has "failRate" property 0% if no tests', () => {
      const deployTestResult: RunTestResult = {};
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildFailRateProperty()).to.equal(property('failRate', '0%'));
    });
    it('has duration related properties', () => {
      const totalTimeInMillis = 1565.0;
      const deployTestResult: RunTestResult = {
        totalTime: `${totalTimeInMillis}`,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);

      expect(adapter.buildExecTimeProperty()).to.equal(property('testExecutionTime', `${totalTimeInMillis / 1000} s`));
      expect(adapter.buildTotalTimeProperty()).to.equal(property('testTotalTime', `${totalTimeInMillis / 1000} s`));
    });
  });
  describe('test cases', () => {
    const testCase = (methodName: string, name: string, time: string): string => {
      return `<testcase name="${methodName}" classname="${name}" time="${+time / 1000}" />`;
    };
    const failedTestCase = (
      message: string,
      methodName: string,
      name: string,
      stackTrace: string,
      time: string
    ): string => {
      return `<testcase name="${methodName}" classname="${name}" time="${+time / 1000}">${failure(
        message,
        stackTrace
      )}</testcase>`;
    };
    const failure = (message: string, stackTrace: string): string => {
      return `<failure message="${message}"><![CDATA[${stackTrace}]]></failure>`;
    };
    it('converts successfull test', () => {
      const methodName = 'testMethod';
      const className = 'TestClass';
      const time = '123.0';
      const deployTestResultSuccessfullTest: Success = {
        methodName,
        name: className,
        time,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater({});

      expect(adapter.buildSuccessfullTestCase(deployTestResultSuccessfullTest)).to.equal(
        testCase(methodName, className, time)
      );
    });
    it('converts failed test', () => {
      const message = 'System.AssertException: Assertion Failed';
      const methodName = 'testMethod';
      const className = 'TestClass';
      const stackTrace = 'Class.FailingTest.failingTest: line 10, column 1';
      const time = '123.0';
      const deployTestResultFailedTest: Failure = {
        message,
        methodName,
        name: className,
        stackTrace,
        time,
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater({});

      expect(adapter.buildFailedTestCase(deployTestResultFailedTest)).to.equal(
        failedTestCase(message, methodName, className, stackTrace, time)
      );
    });
  });
  describe('test cases', () => {
    const success = function (): Success {
      return {
        methodName: 'string',
        name: 'string',
        time: '123',
      };
    };
    const failure = function (): Failure {
      return {
        message: 'string',
        methodName: 'string',
        name: 'string',
        stackTrace: 'string',
        time: '123',
      };
    };
    it('converts all successfull tests', () => {
      const deployTestResult: RunTestResult = {
        successes: [success(), success()],
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);
      expect(adapter.buildSuccessfullTests().length).to.equal(2);
    });
    it('converts all failed tests', () => {
      const deployTestResult: RunTestResult = {
        failures: [failure(), failure(), failure(), failure()],
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);
      expect(adapter.buildFailedTests().length).to.equal(4);
    });
    it('integration test', () => {
      const deployTestResult: RunTestResult = {
        successes: [success(), success()],
        failures: [failure(), failure(), failure(), failure()],
      };
      const adapter: DeployReportJunitTestAdapater = new DeployReportJunitTestAdapater(deployTestResult);
      expect(adapter.testReport()).not.to.be.equal('');
    });
  });
});
