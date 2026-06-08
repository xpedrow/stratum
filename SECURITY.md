# Security Policy - STRATUM

A segurança e a privacidade dos dados são pilares fundamentais no desenvolvimento do **STRATUM**. Como um projeto Open-Source focado em *Recruiter Intelligence* que opera 100% no lado do cliente (Client-Side / Edge) sem bancos de dados centralizados, adotamos políticas estritas para garantir a integridade do código e a blindagem das informações processadas.

## 🔒 Privacidade e Proteção de Dados (Data Governance)

O STRATUM foi arquitetado sob o princípio de *Privacy by Design*. É importante que usuários e contribuidores compreendam como o fluxo de dados opera:

1. **Persistência Local:** Todo o histórico de análises de currículos e métricas de match são gravados exclusivamente no navegador do usuário via `localStorage`. Nenhum dado sensível de candidatos (PII) é enviado para servidores externos mantidos pelo projeto.
2. **Processamento de IA:** O upload de arquivos PDF é transmitido via requisições autenticadas e seguras diretamente para a API de IA do Google (Gemini Files API). 
3. **Gerenciamento de Chaves:** Em ambiente de produção (Vercel), as credenciais de API são injetadas estritamente por variáveis de ambiente ocultas. Para desenvolvimento local, nenhuma chave privada deve ser exposta ou comitada no histórico do repositório.

---

## 🚀 Versões Suportadas (Supported Versions)

Apenas as versões ativas diretamente na ramificação principal (`main`) recebem atualizações de segurança e correções de vulnerabilidades críticas.

| Versão | Suportada Ativamente |
| :--- | :--- |
| `v1.x` (Atual) | 🟩 Sim |
| < `v1.0.0` | 🟥 Não |

---

## 🛡️ Reportando uma Vulnerabilidade (Reporting a Vulnerability)

Se você identificar uma falha de segurança, brecha de lógica de software ou vulnerabilidade potencial no STRATUM, **por favor, não abra uma Issue pública no GitHub.** Divulgações prematuras podem expor sistemas em produção a riscos desnecessários antes que uma correção seja aplicada.

### Fluxo de Envio Seguro:
1. Envie um relatório detalhado e confidencial diretamente para o e-mail do mantenedor principal: **xxxpedrow@gmail.com**
2. No corpo do e-mail, inclua:
   - Uma descrição clara do tipo de vulnerabilidade encontrada (ex: falhas de XSS, vetores de injeção de prompt).
   - Passos passo a passo ou uma Prova de Conceito (PoC) para reproduzir o comportamento.
   - O impacto potencial da falha na privacidade ou estabilidade do sistema do usuário final.

### Nosso Compromisso de Resposta:
- Nós confirmaremos o recebimento do seu reporte em até **48 horas**.
- Manteremos você informado sobre o progresso da análise técnica e o desenvolvimento do patch de correção.
- Assim que o patch for validado e mergeado com sucesso na branch `main`, daremos os devidos créditos aos pesquisadores/contribuidores no changelog da release, se assim desejado.

---

## 🛠️ Práticas de DevSecOps Obrigatórias para Contribuidores

Para manter o ecossistema do STRATUM confiável, todos os Pull Requests devem passar pelos seguintes crivos automatizados na nossa pipeline de CI/CD:

* **Varredura SAST (Static Application Security Testing):** Todo código integrado passa pela análise automatizada do **GitHub CodeQL** para detectar falhas como Cross-Site Scripting (XSS) na renderização de dados textuais da LLM.
* **Segurança de Dependências:** O **Dependabot** audita continuamente nosso arquivo `package.json` contra vulnerabilidades conhecidas no ecossistema npm.
* **Prevenção de Vazamento de Segredos:** Mantemos travas locais (Git Hooks com Husky) para impedir que chaves da API do Gemini (`AIzaSy...`) sejam incluídas em commits de desenvolvimento.
