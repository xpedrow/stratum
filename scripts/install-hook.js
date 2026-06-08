const fs = require('fs');
const path = require('path');

const gitDir = path.join(__dirname, '..', '.git');
const hooksDir = path.join(gitDir, 'hooks');
const preCommitFile = path.join(hooksDir, 'pre-commit');

if (fs.existsSync(gitDir)) {
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir);
  }

  const hookContent = `#!/bin/sh
git diff --cached --name-only --diff-filter=ACM | while read -r file; do
  if [ "$file" != ".env.example" ] && [ -f "$file" ]; then
    if git show :"$file" | grep -E -q "AIzaSy[A-Za-z0-9_-]{33}"; then
      echo "========================================================"
      echo "ERRO: Chave de API do Gemini detectada em: $file"
      echo "Commit abortado para evitar vazamento de credenciais."
      echo "========================================================"
      exit 1
    fi
  fi
done
`;

  fs.writeFileSync(preCommitFile, hookContent, { mode: 0o755 });
  try {
    fs.chmodSync(preCommitFile, 0o755);
  } catch (err) {}
}
