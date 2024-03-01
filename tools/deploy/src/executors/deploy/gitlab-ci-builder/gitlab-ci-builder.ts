import { existsSync, writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { dirname, join } from 'path';
import { GitlabCIConfig } from './gitlab-ci.config';

export type GitalbCIBuilderOptions = {
  file: string;
  output: string;
  pretty: boolean;
};

export class GitlabCIBuilder {
  public async build(options: GitalbCIBuilderOptions): Promise<void> {
    if (!existsSync(options.file)) {
      throw new Error(`the passed file ${options.file} does not exist!`);
    }

    const tsNode = await import('ts-node');
    tsNode.register({ dir: join(dirname(options.file)), transpileOnly: true });

    const exportedFile = await import(options.file);

    if (!exportedFile.createConfig || typeof exportedFile.createConfig !== 'function') {
      throw new Error(`please export a function createConfig which returns a Config instance!`);
    }

    const config: GitlabCIConfig = await exportedFile.createConfig();

    const result = dump(config.build(), { indent: 4 });

    writeFileSync(options.output, result, { encoding: 'utf-8' });

    console.log(`Successfully wrote YAML to ${options.output}`);
  }
}
