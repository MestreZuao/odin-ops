# Obsidian Integration - Squad OPS

## Overview

O Squad OPS está integrado com seu Obsidian vault **BRAIN** para centralizar toda a documentação de processos, automações, agentes e QA.

**Vault:** `D:\ProjetosIA\Obsidian\BRAIN\Brain JV`
**Status:** ✅ Configurado e pronto
**Tipo de Sincronização:** Local-only (sem cloud)

---

## Configuração

### Arquivo de Configuração

```
config/obsidian-config.json
```

### Variáveis de Ambiente

```bash
# .env
OBSIDIAN_VAULT_PATH=D:\ProjetosIA\Obsidian\BRAIN\Brain JV
```

---

## Estrutura do Vault

```
BRAIN/
└── Brain JV/
    └── 00 - Squad OPS/
        ├── 00 - Squad OPS Overview.md     (Home)
        ├── Agents/
        │   ├── Tyr - Orquestrador.md
        │   ├── Skadi - Process Mapper.md
        │   ├── Vili - Architect.md
        │   ├── Bragi - Automation.md
        │   └── Heimdall - QA.md
        ├── Processes/
        │   ├── Demanda-001.md
        │   ├── Demanda-002.md
        │   └── ...
        ├── Automations/
        │   ├── Auto-01.md
        │   └── ...
        ├── QA/
        │   ├── QA-Report-001.md
        │   └── ...
        └── Templates/
            ├── Demand-Template.md
            ├── Process-Template.md
            └── ...
```

---

## Como Usar

### 1. Criar uma Nota de Processo

```javascript
const Obsidian = require('./lib/obsidian-client');
const vault = new Obsidian();

// Criar nota de processo
await vault.createProcessNote('Otimizar Pedidos', {
  owner: 'Skadi',
  description: 'Mapear e otimizar o processo de criação de pedidos',
  steps: [
    'Entrevistar stakeholders',
    'Mapear processo atual',
    'Identificar gargalos',
    'Desenhar novo processo'
  ],
  objective: 'Reduzir tempo de 3 dias para 4 horas',
  criteria: [
    'Processo mapeado em Figma',
    'Stakeholders validarem design',
    'Documentação completa'
  ]
});
```

### 2. Criar Nota de Demanda

```javascript
await vault.createDemandNote('DEM-2026-001', {
  title: 'Otimizar processo de pedidos',
  requester: 'João da Sales',
  description: 'O processo está levando 3 dias...',
  priority: 'high',
  assignedAgent: 'Skadi'
});
```

### 3. Ler uma Nota

```javascript
const content = await vault.readNote('Tyr - Orquestrador', 'Agents');
console.log(content);
```

### 4. Listar Notas

```javascript
const processes = await vault.listNotes('Processes');
console.log(processes); // ['Demanda-001', 'Demanda-002', ...]
```

---

## Fluxo de Documentação

### 1. Demanda Recebida

Tyr cria em Obsidian:
```
Processes/
└── Demanda-2026-001.md
    ├── Informações da demanda
    ├── Solicitante
    ├── Prioridade
    └── Status
```

### 2. Processo Mapeado

Skadi atualiza:
```
Processes/
└── Demanda-2026-001.md
    ├── Mapeamento do processo atual
    ├── Gaps identificados
    ├── Gargalos identificados
    └── Links para Figma
```

### 3. Arquitetura Definida

Vili documenta:
```
Automations/
└── Auto-2026-001.md
    ├── Estrutura ClickUp
    ├── Campos personalizados
    ├── Status workflow
    └── Views por função
```

### 4. Automações Criadas

Bragi adiciona:
```
Automations/
└── Auto-2026-001.md
    ├── Task definitions
    ├── Triggers configurados
    ├── Notificações
    └── Testes executados
```

### 5. QA Validado

Heimdall finaliza:
```
QA/
└── QA-Report-2026-001.md
    ├── Checklists completados
    ├── Score final (%)
    ├── Issues encontrados
    └── Aprovação final
```

---

## Templating

### Template de Processo

```markdown
# Processo: [Nome]

## 📋 Informações Básicas
- Nome
- Data
- Status
- Responsável

## 📊 Descrição
[Descrição do processo]

## 🔄 Etapas
1. [Etapa 1]
2. [Etapa 2]
3. [Etapa 3]

## 🎯 Objetivo
[Objetivo principal]

## ✅ Critérios de Sucesso
- [ ] Critério 1
- [ ] Critério 2
```

### Template de Demanda

```markdown
# Demanda: [ID]

## 📨 Informações
- ID
- Título
- Solicitante
- Prioridade

## 📝 Descrição
[Descrição completa]

## 🔄 Progresso
[Tabela de progresso]

## 📊 Quality Gates
- [ ] Gate 1 (70%)
- [ ] Gate 2 (70%)
```

---

## Teste de Conexão

```bash
node lib/obsidian-client.js
```

Saída esperada:
```
🚀 Obsidian Client - Teste de Conexão

🔍 Testando conexão com vault Obsidian...

  Testando acesso ao vault...
  ✅ Squad OPS folder OK
  ✅ Agents
  ✅ Processes
  ✅ Automations
  ✅ QA
  ✅ Templates

✅ Conexão com Obsidian OK!

📁 Caminho do vault: D:\ProjetosIA\Obsidian\BRAIN\Brain JV
📁 Caminho Squad OPS: D:\ProjetosIA\Obsidian\BRAIN\Brain JV\00 - Squad OPS
```

---

## Backlinks no Obsidian

Use `[[Nome da Nota]]` para criar links entre notas:

```markdown
[[00 - Squad OPS Overview]]
[[Tyr - Orquestrador]]
[[Demanda-2026-001]]
[[Skadi - Process Mapper]]
```

---

## Segurança

⚠️ **IMPORTANTE:**
- Vault é local (seu computador)
- Sem sincronização em nuvem
- Sem backup automático
- Configure seu próprio backup se necessário

---

## Troubleshooting

### Erro: "Vault not found"

```
OBSIDIAN_VAULT_PATH não está correto
Verifique em .env
```

### Erro: "Permission denied"

```
Verifique permissões de pasta do Obsidian
Windows: Properties → Security → Edit permissions
Linux/Mac: chmod 755 /caminho/vault
```

---

## Próximos Passos

- [ ] Abrir Obsidian e visualizar `00 - Squad OPS`
- [ ] Explorar estrutura de pastas
- [ ] Criar primeira demanda teste
- [ ] Configurar N8N integration (próximo)
- [ ] Testar fluxo completo

---

**Configuração criada:** 2026-03-09
**Status:** ✅ Pronto para uso
**Tipo de acesso:** Local-only
**Próxima ação:** Abrir Obsidian
