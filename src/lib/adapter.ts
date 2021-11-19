import { Failure, RunTestResult, Success } from './model';

export class DeployReportJunitTestAdapater {
  public deployRunTestResult: RunTestResult;
  public constructor(deployRunTestResult: RunTestResult) {
    this.deployRunTestResult = deployRunTestResult;
  }
  public testReport(): string {
    const report =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<testsuites>\n' +
      '  <testsuite>\n' +
      this.buildAllPropertiesAsXML() +
      this.buildSuccessfullTestsAsXML() +
      this.buildFailedTestsAsXML() +
      '  </testsuite>\n' +
      '</testsuites>';
    return report;
  }
  public buildOutcomeProperty(): string {
    return this.property('outcome', this.hasFailures() ? 'Failed' : 'Passed');
  }
  public buildTestsRanProperty(): string {
    return this.property('testsRan', this.deployRunTestResult.numTestsRun);
  }
  public buildTestsPassedProperty(): string {
    return this.property('passing', `${this.testsRunCount() - this.failuresCount()}`);
  }
  public buildTestsFailedProperty(): string {
    return this.property('failing', `${this.failuresCount()}`);
  }
  public buildTestsSkippedProperty(): string {
    return this.property('skipped', '0');
  }
  public buildPassRateProperty(): string {
    return this.property(
      'passRate',
      `${((this.testsRunCount() - this.failuresCount()) / this.testsRunCount()) * 100}%`
    );
  }
  public buildFailRateProperty(): string {
    return this.property('failRate', `${(this.failuresCount() / this.testsRunCount()) * 100}%`);
  }
  public buildTotalTimeProperty(): string {
    return this.property('testTotalTime', `${+this.deployRunTestResult.totalTime / 1000} s`);
  }
  public buildExecTimeProperty(): string {
    return this.property('testExecutionTime', `${+this.deployRunTestResult.totalTime / 1000} s`);
  }
  public buildSuccessfullTestCase(testCase: Success): string {
    return `<testcase name="${testCase.methodName}" classname="${testCase.name}" time="${+testCase.time / 1000}" />`;
  }
  public buildFailedTestCase(testCase: Failure): string {
    return `<testcase name="${testCase.methodName}" classname="${testCase.name}" time="${
      +testCase.time / 1000
    }">${this.buildFailure(testCase)}</testcase>`;
  }
  public buildSuccessfullTests(): string[] {
    const result: string[] = [];
    for (const testCase of this.deployRunTestResult.successes) {
      result.push(this.buildSuccessfullTestCase(testCase));
    }
    return result;
  }
  public buildFailedTests(): string[] {
    const result: string[] = [];
    for (const testCase of this.deployRunTestResult.failures) {
      result.push(this.buildFailedTestCase(testCase));
    }
    return result;
  }
  private buildSuccessfullTestsAsXML(): string {
    let result = '';
    for (const testCase of this.buildSuccessfullTests()) {
      result += `    ${testCase}\n`;
    }
    return result;
  }
  private buildFailedTestsAsXML(): string {
    let result = '';
    for (const testCase of this.buildFailedTests()) {
      result += `    ${testCase}\n`;
    }
    return result;
  }
  private buildFailure(testCase: Failure): string {
    return `<failure message="${this.escapeDoubleQuotes(testCase.message)}"><![CDATA[${
      testCase.stackTrace
    }]]></failure>`;
  }
  private escapeDoubleQuotes(s: string): string {
    return s.replace(/"/g, '&quot;');
  }
  private hasFailures(): boolean {
    return this.deployRunTestResult.numFailures !== undefined && this.deployRunTestResult.numFailures !== '0';
  }
  private failuresCount(): number {
    return this.deployRunTestResult.numFailures !== undefined ? +this.deployRunTestResult.numFailures : 0;
  }
  private testsRunCount(): number {
    return this.deployRunTestResult.numTestsRun !== undefined ? +this.deployRunTestResult.numTestsRun : 0;
  }
  private property(name: string, value: string): string {
    return `<property name="${name}" value="${value}" />`;
  }
  private buildAllPropertiesAsXML(): string {
    return (
      '    <properties>\n' +
      `      ${this.buildOutcomeProperty()}\n` +
      `      ${this.buildTestsRanProperty()}\n` +
      `      ${this.buildTestsPassedProperty()}\n` +
      `      ${this.buildTestsFailedProperty()}\n` +
      `      ${this.buildTestsSkippedProperty()}\n` +
      `      ${this.buildPassRateProperty()}\n` +
      `      ${this.buildFailRateProperty()}\n` +
      `      ${this.buildTotalTimeProperty()}\n` +
      `      ${this.buildExecTimeProperty()}\n` +
      '    </properties>'
    );
  }
}
