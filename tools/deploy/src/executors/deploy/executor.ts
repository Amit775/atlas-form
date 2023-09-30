import { logger } from '@nx/devkit';
import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DeployExecutorSchema } from './schema';

type DeployType = 'production' | 'staging';
type DeployArgv = { base: string; head: string; branch: string };

export default async function runExecutor({ base, head, branch }: DeployExecutorSchema): Promise<{ success: boolean }> {
  logger.log('Executor ran for Deploy', { base, head, branch });

  const affectedApps = getAffectedApps();
  if (affectedApps.length > 0) {
    writeYamlFile(affectedApps, branch);
  } else {
    logger.log(`no apps was changed in run, base=${base} head=${head}`);
  }

  return { success: true };
}

function getAffectedApps(): string[] {
  const command = `nx show projects --affected --plain`;
  logger.log(command);

  const projects = execSync(command).toString('utf-8').trim();
  logger.log('affected', projects);
  if (projects === '') {
    return [];
  } else {
    const affectedApps = projects.split(' ');
    logger.log(`affected apps to be deployed = ${affectedApps}`);
    return affectedApps;
  }
}
function writeYamlFile(affectedApps: Array<string>, branch: string): void {
  const deployType = branch === 'master' ? 'production' : 'staging';
  const yamlstr = generateGitlabCiYaml(affectedApps, deployType);
  logger.log(`generated yaml file \n\n${yamlstr}`);

  writeFileSync('affected-deploy-ci.yaml', yamlstr);
}
function generateGitlabCiYaml(affectedApps: Array<string>, deployType: DeployType): string {
  const gitlabCIBaseDefinition: Record<string, unknown> = {
    image: 'node:16',
    workflow: {
      rules: [{ when: 'always' }],
    },
  };
  const nxInstallationBase = {
    '.distributed': {
      tags: ['docker-main'],
      interruptible: true,
      cache: {
        key: {
          files: ['package-lock.json'],
        },
        paths: ['.npm/'],
      },
      before_script: ['npm ci --cache .npm --prefer-offline'],
      artifacts: {
        paths: ['node_modules/.cache/nx'],
      },
    },
  };

  const deployJobDefinition = (app: string): Record<string, string | string[]> => ({
    image: 'node:14.16.0',
    extends: '.distributed',
    stage: 'deploy',
    script: `echo 'npx nx run ${app}:deploy-${deployType}'`,
  });

  const generatedJobsPerAffectedApp = affectedApps.reduce<object>((tmpobj: object, app: string) => {
    tmpobj[`deploy-${app}`] = deployJobDefinition(app);
    return tmpobj;
  }, {});

  return dump({
    ...gitlabCIBaseDefinition,
    ...nxInstallationBase,
    ...generatedJobsPerAffectedApp,
  });
}

function extractCmdLineArgs(args: string[]): DeployArgv {
  const argv = yargs(hideBin(args)).options({
    base: { type: 'string', demand: true },
    head: { type: 'string', demand: true },
    branch: { type: 'string', demand: true },
  }).argv;

  return argv as DeployArgv;
}
