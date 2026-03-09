---
task: Receive and Structure Demand
responsavel: "@tyr"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada: |
  - demand_title: Título da demanda
  - demand_description: Descrição completa
  - requester: Quem solicitou
  - priority: low | medium | high | critical
  - attached_docs: Documentos anexos (opcional)

Saida: |
  - demand_id: ID único da demanda
  - structured_demand: Demanda estruturada em JSON
  - created_in_clickup: Boolean
  - tyr_initial_analysis: Análise inicial

Checklist:
  - "[ ] Receber demanda completa"
  - "[ ] Validar se descrição está clara"
  - "[ ] Estruturar em JSON"
  - "[ ] Criar ticket em ClickUp"
  - "[ ] Analisar tipo de demanda (que agent?)"
  - "[ ] Documentar em Obsidian"
  - "[ ] Retornar ID da demanda"
---

# *receive-demand

Recebe uma nova demanda externa e a estrutura em ClickUp para distribuição.

## Entrada

```json
{
  "demand_title": "Otimizar processo de pedidos",
  "demand_description": "Processo de criação de pedidos está levando 3 dias...",
  "requester": "João da Sales",
  "priority": "high",
  "attached_docs": ["./prd-vendas.md"]
}
```

## Processo

### 1. Receber Demanda

Coleta título, descrição, solicitante e prioridade.

### 2. Validar Completude

Verifica se há informação suficiente para começar. Se não:
- Pede esclarecimento ao solicitante
- Documenta no Obsidian

### 3. Estruturar em ClickUp

Cria ticket em ClickUp com:
- Título
- Descrição
- Prioridade
- Solicitante
- Status: NOVO
- Documentos anexos

### 4. Analisar Tipo

Identifica que tipo de demanda é:
- Mapeamento de processo? → Skadi
- Arquitetura? → Vili
- Automação? → Bragi
- Validação? → Heimdall

### 5. Documentar

Cria documento em Obsidian com:
- Data de recebimento
- Solicitante
- Análise inicial de Tyr
- Próximos passos

## Saída

```json
{
  "demand_id": "DEM-2026-001",
  "structured_demand": {
    "title": "Otimizar processo de pedidos",
    "description": "...",
    "priority": "high",
    "requester": "João da Sales",
    "type": "process-optimization"
  },
  "created_in_clickup": true,
  "clickup_url": "https://app.clickup.com/...",
  "suggested_agent": "skadi",
  "tyr_initial_analysis": "Demanda clara, prioridade alta, requer mapeamento completo do processo"
}
```

## Critérios de Sucesso

✅ Demanda estruturada claramente
✅ Ticket criado em ClickUp
✅ Documentação em Obsidian
✅ Análise inicial realizada
✅ Solicitante confirmou recebimento
