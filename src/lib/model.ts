export interface TestSuite {
  properties?: Property[];
}

export interface Property {
  name: string;
  value: string;
}

export interface RunTestResult {
  failures?: Failure[];
  numFailures?: string;
  numTestsRun?: string;
  successes?: Success[];
  totalTime?: string;
  codeCoverage?: CodeCoverage[];
}

export interface CodeCoverage {
  numLocations: number;
  numLocationsNotCovered: number;
}

export interface Failure {
  id?: string;
  message: string;
  methodName: string;
  name: string;
  stackTrace: string;
  time: string;
}

export interface Success {
  id?: string;
  methodName: string;
  name: string;
  time: string;
}
