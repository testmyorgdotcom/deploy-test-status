/* eslint-disable @typescript-eslint/member-ordering */
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
      this.buildTestSuite() +
      this.buildAllPropertiesAsXML() +
      this.buildSuccessfullTestsAsXML() +
      this.buildFailedTestsAsXML() +
      '  </testsuite>\n' +
      '</testsuites>';
    return report;
  }
  public buildTestSuite(): string {
    return (
      `  <testsuite ${this.attribute('name', 'force.apex')} ${this.attribute('tests', this.testsRun())} ` +
      `${this.attribute('failures', this.failuresCount())} ` +
      `${this.attribute('time', this.totalTime() / 1000)}>\n`
    );
  }
  private attribute(name: string, value: string | number): string {
    return `${name}="${value}"`;
  }
  public buildOutcomeProperty(): string {
    return this.property('outcome', this.hasFailures() ? 'Failed' : 'Passed');
  }
  public buildTestsRanProperty(): string {
    return this.property('testsRan', this.testsRun());
  }
  private testsRun(): string {
    return this.deployRunTestResult.numTestsRun || '0';
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
    const passRate =
      this.testsRunCount() === 0
        ? '100%'
        : `${((this.testsRunCount() - this.failuresCount()) / this.testsRunCount()) * 100}%`;
    return this.property('passRate', passRate);
  }
  public buildFailRateProperty(): string {
    const failRate = this.testsRunCount() === 0 ? '0%' : `${(this.failuresCount() / this.testsRunCount()) * 100}%`;
    return this.property('failRate', failRate);
  }
  public buildTotalTimeProperty(): string {
    return this.property('testTotalTime', `${this.totalTime() / 1000} s`);
  }
  public buildCoveredLinesProperty(): string {
    return this.property('coveredLines', this.calculateCoveredLines());
  }
  private totalTime(): number {
    return +this.deployRunTestResult.totalTime;
  }
  private calculateCoveredLines(): number {
    return this.deployRunTestResult.codeCoverage.reduce((prev, cover) => {
      return +prev + +cover.numLocations - +cover.numLocationsNotCovered;
    }, 0);
  }
  public buildTestRunCoverageProperty(): string {
    const totalLines = this.deployRunTestResult.codeCoverage.reduce((prev, cover) => +prev + +cover.numLocations, 0);
    return this.property('testRunCoverage', `${(this.calculateCoveredLines() / totalLines) * 100}%`);
  }
  private hasCoverage(): boolean {
    return this.deployRunTestResult.codeCoverage && this.deployRunTestResult.codeCoverage.length > 0;
  }
  public buildExecTimeProperty(): string {
    return this.property('testExecutionTime', `${this.totalTime() / 1000} s`);
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
    if (this.deployRunTestResult.successes !== undefined) {
      for (const testCase of this.deployRunTestResult.successes) {
        result.push(this.buildSuccessfullTestCase(testCase));
      }
    }
    return result;
  }
  public buildFailedTests(): string[] {
    const result: string[] = [];
    if (this.deployRunTestResult.failures !== undefined) {
      for (const testCase of this.deployRunTestResult.failures) {
        result.push(this.buildFailedTestCase(testCase));
      }
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
  private property(name: string, value: string | number): string {
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
      `${this.hasCoverage() ? this.buildCoverageProperties() + '\n' : ''}` +
      '    </properties>\n'
    );
  }
  private buildCoverageProperties(): string {
    return `      ${this.buildCoveredLinesProperty()}\n` + `      ${this.buildTestRunCoverageProperty()}`;
  }
}
