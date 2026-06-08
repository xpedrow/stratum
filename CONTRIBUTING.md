# Guia de Contribuição (CONTRIBUTING.md)

Agradecemos o seu interesse em contribuir para o STRATUM! Para manter a qualidade, a segurança e a consistência do projeto, siga as diretrizes abaixo.

---

## 🚀 Processo para Envio de Pull Requests

1. **Faça um Fork do Repositório**: Crie uma cópia do projeto em sua conta pessoal.
2. **Crie uma Branch Temática**: Use nomes descritivos baseados no tipo de alteração:
   - `feature/nome-da-feature`
   - `bugfix/nome-do-bug`
   - `docs/melhoria-na-documentacao`
3. **Mantenha a Branch Atualizada**: Faça rebase com a branch `main` oficial antes de abrir o PR para evitar conflitos.
4. **Abra o Pull Request**:
   - Forneça uma descrição clara e objetiva sobre o que foi alterado e o porquê.
   - Associe o PR a uma Issue existente caso aplique.
5. **Revisão de Código**: Todo PR passará por revisões de segurança e qualidade por parte dos mantenedores e pela esteira automatizada de CI/CD (SAST via CodeQL).

---

## 📝 Padronização de Commits

Adotamos a especificação de [Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/) para manter o histórico de alterações legível e automatizável:

Formato de mensagem:
```
<tipo>(<escopo>): <descrição curta em letras minúsculas>
```

### Tipos permitidos:
- **feat**: Implementação de novas funcionalidades.
- **fix**: Correção de bugs.
- **docs**: Alterações exclusivamente em documentações.
- **style**: Formatações de código que não afetam a lógica (espaços, ponto e vírgula, etc.).
- **refactor**: Alterações que melhoram a estrutura do código sem alterar comportamento.
- **test**: Adição ou correção de testes automatizados.
- **chore**: Atualizações de tarefas de build, pacotes de dependências ou configurações de CI.

---

## 🧪 Obrigatoriedade de Testes Locais

Antes de realizar o commit ou abrir um Pull Request, é obrigatório garantir que todas as validações passem localmente.

1. **Instalação das dependências**:
   ```bash
   npm install
   ```
2. **Execução de Linter e Formatadores**:
   ```bash
   npm run lint
   ```
3. **Execução dos Testes**:
   ```bash
   npm test
   ```

A esteira de integração contínua (CI) rejeitará automaticamente contribuições que falharem nos testes, apresentarem vulnerabilidades de segurança detectadas por ferramentas estáticas ou possuam erros de formatação.
