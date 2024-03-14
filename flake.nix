{
  description = "golang flake";
  inputs.nixpkgs.url = "nixpkgs/nixos-unstable";
  outputs = { self, nixpkgs }:
    let
      # versioning
      lastModifiedDate = self.lastModifiedDate or self.lastModified or "19700101";
      version = builtins.substring 0 8 lastModifiedDate;

      # list of systems to support
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];

      # generate an attrset '{ x86_64-linux = f "x86_64-linux"; ... }'.
      forAllSystems = nixpkgs.lib.genAttrs supportedSystems;

      # instantiate the nixpkgs for supported systems so they can be used
      nixpkgsFor = forAllSystems (system: import nixpkgs { inherit system; });
    in
    {
      # dev shell packages
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgsFor.${system};
          arduino-lsp-wrapper = pkgs.writeShellScriptBin "arduino-lsp-wrapper" ''
            ${pkgs.arduino-language-server}/bin/arduino-language-server \
              -cli ${pkgs.arduino-cli}/bin/arduino-cli \
              -clangd ${pkgs.clang-tools}/bin/clangd \
              -cli-config /home/soonann/.arduino15/arduino-cli.yaml \
              -fqbn arduino:mbed_nano:nano33ble
          '';

        in
        {
          default = pkgs.mkShell {
            buildInputs = with pkgs;
              [
                clang-tools
                clang
                cmake
                arduino-cli
                arduino-ide
                arduino-mk
                arduino-lsp-wrapper
                arduino-language-server
                python3
                virtualenv
                mqttx
              ];

            shellHook = ''
              export PS1="(flake) $PS1"
              . <(arduino-cli completion bash)
            '';
          };
        });

      # default package to output
      defaultPackage = forAllSystems (system: self.packages.${system}.soonann-flake);
    };
}
