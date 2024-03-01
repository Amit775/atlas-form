export class GitlabCIConfig {
  build(): GitlabCI {
    return {};
  }
}

export type GitlabCI = Record<string, unknown>;
