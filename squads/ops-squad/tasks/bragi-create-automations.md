---
task: Create Automations - Configure and Test
responsavel: "@bragi"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada: |
  - demand_id: ID da demanda
  - task_definitions: Definições de tasks
  - clickup_workspace: Workspace do ClickUp

Saida: |
  - automations_created: Lista de automações
  - automations_tested: Boolean
  - external_integrations: Integrações configuradas
  - documentation: Docs de automações

Checklist:
  - "[ ] Revisar task definitions"
  - "[ ] Criar automações ClickUp"
  - "[ ] Configurar triggers"
  - "[ ] Testar cada automação"
  - "[ ] Integrar sistemas externos"
  - "[ ] Documentar"
  - "[ ] Pronto para QA"
---

# *create-automations

Cria e testa automações que fazem o processo rodar sozinho.

## Entrada

```
demand_id: DEM-2026-001
task_definitions: /docs/tasks/pedidos-task-definitions.md
clickup_workspace: "Otimização de Pedidos"
```

## Processo

### 1. Revisar Definições

Entende:
- O que automatizar
- Triggers
- Ações
- Condições

### 2. Criar Automações ClickUp

Cria automações:
- **Trigger:** Status muda para "Em Processamento"
- **Ação:** Notificar responsável
- **Ação:** Setar SLA para 4 horas

### 3. Configurar Triggers

Define:
- Quando automação começa
- Condições para executar
- O que fazer quando executar

### 4. Testar

Testa cada automação:
- Trigger funciona?
- Ação executa?
- Notificações saem?
- Dados corretos?

### 5. Integrar Externos

Se necessário:
- Integrar com API de frete
- Webhook para financeiro
- Notificação no Telegram

## Saída

```yaml
automations_created:
  - automation_1: "Nova tarefa → Notificar"
  - automation_2: "Status muda → Setar SLA"
  - automation_3: "Pedido completo → Webhook financeiro"

automations_tested: true

external_integrations:
  - telegram: notificações
  - api_frete: busca valores
  - sistema_financeiro: webhook

documentation:
  - /docs/automations/pedidos-automations.md
```

## Critérios de Sucesso

✅ Todas as automações funcionando
✅ Triggers corretos
✅ Sem erros em teste
✅ Integrações testadas
✅ Documentação completa
