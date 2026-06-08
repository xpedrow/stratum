# STRATUM

O STRATUM é um analisador e parseador de currículos de alta precisão e cirúrgico. Ele foi projetado para extrair dados estruturados a partir de arquivos PDF de maneira eficiente e segura.

---

## ⚡ Arquitetura Client-Side / Edge com Custo Zero

Para garantir a máxima privacidade dos dados e eliminar custos de infraestrutura operacional, o STRATUM foi desenvolvido seguindo uma arquitetura moderna e eficiente:

- **100% Client-Side / Edge**: Toda a lógica de parseamento, validação e renderização ocorre diretamente no navegador do usuário ou em funções Edge descentralizadas.
- **Persistência via `localStorage`**: O histórico de análises é salvo de forma resiliente diretamente no armazenamento local do navegador do usuário. Isso resulta em **custo zero com banco de dados** e privacidade de dados ponta a ponta (Zero Trust).

---

## 🛠️ Setup Local e Instalação

Siga os passos abaixo para clonar, configurar e executar o projeto em sua máquina local:

### 1. Clonar o Repositório
```bash
git clone https://github.com/xpedrow/stratum.git
cd stratum
```

### 2. Configurar Variáveis de Ambiente
O STRATUM necessita de uma chave de API do Gemini para realizar o parseamento estruturado de currículos.

1. Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
2. Abra o arquivo `.env` e configure sua chave de acesso da API do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_aqui
   ```

### 3. Instalar Dependências
Instale as dependências necessárias do projeto:
```bash
npm install
```

### 4. Executar em Modo de Desenvolvimento
Inicie o servidor local para desenvolvimento:
```bash
npm run dev
```

O projeto estará disponível e rodando localmente no endereço padrão indicado no terminal (normalmente `http://localhost:3000`).