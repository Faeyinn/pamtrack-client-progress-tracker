{pkgs}: {
  channel = "unstable";
  packages = [
    pkgs.nodejs_24
    pkgs.pnpm
    pkgs.docker
    pkgs.docker-compose
  ];
  idx.extensions = [
    "ms-azuretools.vscode-docker"
    "google.gemini-cli-vscode-ide-companion"
  ];
  idx.workspace = {
    onCreate = {
      pnpm-install = "pnpm install";
    };
    onStart = {
      update-pnpm = "pnpm self-update";
      install-gemini-cli = "pnpm add -g @google/gemini-cli";
      install-codex = "pnpm add -g @openai/codex";
    };
  };
  idx.previews = {
    previews = {
      web = {
        command = [
          "pnpm"
          "run"
          "dev"
          "--"
          "--port"
          "$PORT"
          "--hostname"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}