/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { DeployResult } from 'jsforce';
import { DeployReportJunitTestAdapater } from '../../../../lib/adapter';
import { RunTestResult } from '../../../../lib/model';

// Initialize Messages with the current plugin directory

Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('deploy-test-status', 'status');

export default class Org extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    jobid: flags.string({
      char: 'i',
      description: messages.getMessage('jobidFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  // protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const deployJobId = this.flags.jobid;
    if (deployJobId === undefined || deployJobId === '') {
      throw new SfdxError(messages.getMessage('jobidFlagMissingErrorMessage'));
    }

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    // Query sourcemetadataDeploy
    const result: DeployResult = await conn.metadata.checkDeployStatus(deployJobId, true);
    const testResult: RunTestResult = result.details['runTestResult'];

    const adapter = new DeployReportJunitTestAdapater(testResult);

    this.ux.log(adapter.testReport());

    return {};
  }
}
