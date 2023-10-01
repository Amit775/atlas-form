import { ExecutorContext, logger } from '@nx/devkit';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { DeployExecutorSchema } from './schema';

type DeployType = 'production' | 'staging';

export default async function runExecutor(
  { base, head, branch }: DeployExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  logger.log('Executor ran for Deploy', { base, head, branch, context });

  const affectedApp = context.projectName;
  if (affectedApp) {
    writeYamlFile(affectedApp, branch);
  } else {
    logger.log(`no apps was changed in run, base=${base} head=${head}`);
  }

  return { success: true };
}

function writeYamlFile(affectedApp: string, branch: string): void {
  const deployType = branch === 'master' ? 'production' : 'staging';
  const yamlstr = generateGitlabCiYaml(affectedApp, deployType);
  logger.log(`generated yaml file \n\n${yamlstr}`);

  writeFileSync('affected-deploy-ci.yaml', yamlstr);
}
function generateGitlabCiYaml(app: string, deployType: DeployType): string {
  const gitlabCIBaseDefinition: Record<string, unknown> = {
    image: 'node:18',
    workflow: {
      rules: [{ when: 'always' }],
    },
  };

  const nxInstallationBase = {
    '.distributed': {
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
    image: 'node:18',
    extends: '.distributed',
    stage: 'deploy',
    script: `echo 'npx nx run ${app}:deploy-${deployType}'`,
  });

  const generatedJobsPerAffectedApp = { [`deploy-${app}`]: deployJobDefinition(app) };

  return dump({
    ...gitlabCIBaseDefinition,
    ...nxInstallationBase,
    ...generatedJobsPerAffectedApp,
  });
}
