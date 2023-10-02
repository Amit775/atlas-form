import { ExecutorContext, logger } from '@nx/devkit';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { DeployExecutorSchema } from './schema';

type ExecutorResult = { success: boolean };

export default async function runExecutor(options: DeployExecutorSchema, context: ExecutorContext): Promise<ExecutorResult> {
  logger.log('Executor ran for Deploy', { options, context });

  const project = context.projectName;
  if (!project) {
    logger.log(`no project name`);
    return { success: true };
  }

  try {
    writeYamlFile(project, options.deployType);
  } catch (error: unknown) {
    logger.error(error);
    return { success: false };
  }

  return { success: true };
}

function writeYamlFile(project: string, deployType: string): void {
  const yamlstr = generateGitlabCiYaml(project, deployType);
  logger.log(`generated yaml file \n\n${yamlstr}`);

  writeFileSync('affected-deploy-ci.yaml', yamlstr);
}

function generateGitlabCiYaml(app: string, deployType: string): string {
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

  const generatedJobs = { [`deploy-${app}`]: deployJobDefinition(app) };

  return dump({
    ...gitlabCIBaseDefinition,
    ...nxInstallationBase,
    ...generatedJobs,
  });
}
