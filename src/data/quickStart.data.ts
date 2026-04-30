import type { QuickStartLanguage, InstallCommand } from '@/components/codex/shared/panels/CodeBlockQuickStart';

export const quickStartLanguages: QuickStartLanguage[] = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'go', name: 'Go', icon: 'GO' },
  { id: 'rust', name: 'Rust', icon: 'RS' },
];

export const quickStartCodeExamples: Record<string, string> = {
  javascript: `import { CodexAuth } from '@web3connected/codexauth-starter-kit';

const hasher = new CodexAuth({
  algorithm: 'harmonic',
  securityLevel: 'quantum-resistant'
});

// Generate a quantum-resistant hash
const result = await hasher.hash('Your data here');
console.log(result.hash);
// Output: "ch_a7b3c9d2e4f5..."`,

  python: `from codexauth import CodexAuth

hasher = CodexAuth(
    algorithm="harmonic",
    security_level="quantum-resistant"
)

# Generate a quantum-resistant hash
result = hasher.hash("Your data here")
print(result.hash)
# Output: "ch_a7b3c9d2e4f5..."`,

  go: `package main

import "github.com/web3connected/codexauth-go"

func main() {
    hasher := codexauth.New(codexauth.Options{
        Algorithm:     "harmonic",
        SecurityLevel: "quantum-resistant",
    })

    // Generate a quantum-resistant hash
    result, _ := hasher.Hash("Your data here")
    fmt.Println(result.Hash)
    // Output: "ch_a7b3c9d2e4f5..."
}`,

  rust: `use codexauth::CodexAuth;

fn main() {
    let hasher = CodexAuth::new()
        .algorithm("harmonic")
        .security_level("quantum-resistant")
        .build();

    // Generate a quantum-resistant hash
    let result = hasher.hash("Your data here").unwrap();
    println!("{}", result.hash);
    // Output: "ch_a7b3c9d2e4f5..."
}`,
};

export const quickStartInstallCommands: InstallCommand[] = [
  { manager: 'npm', command: 'npm install @web3connected/codexauth-starter-kit' },
  { manager: 'pip', command: 'pip install codexauth' },
  { manager: 'go', command: 'go get github.com/web3connected/codexauth-go' },
  { manager: 'cargo', command: 'cargo add codexauth' },
];
