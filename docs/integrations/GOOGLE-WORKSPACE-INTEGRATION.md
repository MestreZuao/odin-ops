# Google Workspace Integration - Squad OPS

## Overview

O Squad OPS está integrado com Google Workspace para documentação, dados e armazenamento de arquivos.

**Projeto:** `odin-ops`
**Status:** ⏳ Aguardando refresh token
**APIs:** Google Docs, Google Sheets, Google Drive

---

## Configuração

### Arquivos de Configuração

```
config/google-workspace-config.json  - Configuração OAuth
lib/google-client.js                 - Cliente Google para APIs
scripts/google-oauth-setup.js        - Setup de refresh token
```

### Variáveis de Ambiente

As credenciais Google são armazenadas em `.env` (gitignored):

```bash
# .env
GOOGLE_CLIENT_ID=<seu_client_id>
GOOGLE_CLIENT_SECRET=<seu_client_secret>
GOOGLE_REFRESH_TOKEN=<será obtido no próximo passo>
```

⚠️ **Nunca comite credenciais reais no repositório!**

---

## Etapa 4/5: Obter Refresh Token

### **IMPORTANTE: Execute este comando agora**

```bash
node scripts/google-oauth-setup.js
```

**O que vai acontecer:**

1. ✅ Um servidor local será iniciado em `http://localhost:3000`
2. ✅ Seu navegador abrirá automaticamente com uma página de autorização do Google
3. ✅ Clique em **Autorizar** para permitir acesso
4. ✅ O refresh token será obtido e **salvo automaticamente em .env**
5. ✅ Uma página de sucesso aparecerá no navegador

---

## Como Usar

### 1. Testar Conexão

Depois de obter o refresh token:

```bash
node lib/google-client.js
```

Você deve ver:
```
✅ Google Docs API OK
✅ Google Sheets API OK
✅ Google Drive API OK
```

### 2. Criar Documento

```javascript
const GoogleClient = require('./lib/google-client');
const google = new GoogleClient();

// Criar novo documento
const docId = await google.createDocument('Processo de Vendas');

// Escrever conteúdo
await google.writeToDocument(docId, 'Conteúdo do documento...');
```

### 3. Criar Planilha

```javascript
// Criar nova planilha com headers
const sheetId = await google.createSpreadsheet('Métricas OPS', [
  'Agent',
  'Task',
  'Duration',
  'Score'
]);

// Adicionar dados
await google.appendToSheet(sheetId, 'A2', [
  ['Tyr', 'receive-demand', '30m', '95%'],
  ['Skadi', 'discovery-process', '4h', '92%']
]);
```

### 4. Armazenar Arquivos

```javascript
// Criar pasta no Drive
const folderId = await google.createFolder('Squad OPS - Documentação');

// Upload de arquivo
await google.uploadFile('./docs/processo.md', folderId);

// Listar arquivos
const files = await google.listFiles(folderId);
```

---

## Integração com Squad OPS

### Skadi (Process Mapper)
- **Docs:** Documentação de processos descobertos
- **Sheets:** Matriz de gaps e gargalos
- **Drive:** Armazenar fluxogramas (exports do Figma)

### Vili (Architect)
- **Docs:** Documentação de arquitetura
- **Sheets:** Matriz de responsabilidades
- **Sheets:** SLAs por etapa

### Bragi (Automation Architect)
- **Docs:** Documentação de automações
- **Sheets:** Status de testes de automação
- **Drive:** Scripts e configurações

### Heimdall (QA)
- **Sheets:** Checklists de validação
- **Sheets:** Quality gate scores
- **Drive:** Reports de QA com evidências

---

## Fluxo Completo de Integração

```
Squad OPS Demand
      ↓
Skadi (Process Mapper)
  ├→ Google Docs: Documentação do processo descoberto
  ├→ Google Sheets: Gaps e gargalos identificados
  └→ Google Drive: Fluxogramas em PDF
      ↓ (70% gate)
Vili (Architect)
  ├→ Google Docs: Especificação de arquitetura
  ├→ Google Sheets: Matriz de responsabilidades
  └→ Google Sheets: SLAs definidos
      ↓ (70% gate)
Bragi (Automation Architect)
  ├→ Google Docs: Task definitions
  ├→ Google Sheets: Testes de automação
  └→ Google Drive: Scripts e configurações
      ↓ (70% gate)
Heimdall (QA)
  ├→ Google Sheets: Checklists QA
  ├→ Google Sheets: Quality gate scores
  └→ Google Drive: Reports QA
      ↓ (Final gate)
Tyr (Delivery)
  └→ Google Sheets: Histórico de demandas
```

---

## Troubleshooting

### Erro: "GOOGLE_REFRESH_TOKEN não configurado"

**Solução:**
```bash
node scripts/google-oauth-setup.js
```

### Erro: "Token expirado"

Os refresh tokens do Google não expiram. Se houver erro:
1. Verifique em `https://myaccount.google.com/permissions`
2. Remova a autorização de `OdinSquadBot`
3. Execute novamente: `node scripts/google-oauth-setup.js`

### APIs não habilitadas

Se receber erro sobre API não habilitada:
1. Vá para: https://console.cloud.google.com/apis/library
2. Procure a API (Docs, Sheets, Drive)
3. Clique em **ENABLE**

---

## Segurança

⚠️ **IMPORTANTE:**
- **NUNCA** compartilhe credenciais Google publicamente
- **NUNCA** comite `.env` com credenciais reais
- Use `.env.example` para documentar estrutura
- Credenciais armazenadas em `.env` (gitignored)
- Refresh token não expira automaticamente
- Use `https://myaccount.google.com/permissions` para revogar acesso

---

## Próximos Passos

- [ ] Executar: `node scripts/google-oauth-setup.js`
- [ ] Obter refresh token
- [ ] Testar com: `node lib/google-client.js`
- [ ] Configurar Obsidian integration
- [ ] Configurar N8N integration
- [ ] Testar fluxo completo

---

**Configuração criada:** 2026-03-09
**Status:** ⏳ Aguardando refresh token
**Próxima ação:** Execute `node scripts/google-oauth-setup.js`
