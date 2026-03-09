---
task: Design Architecture - ClickUp Structure
responsavel: "@vili"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada: |
  - demand_id: ID da demanda
  - optimized_flowchart: Fluxograma otimizado (Figma)
  - team_size: Número de pessoas na equipe

Saida: |
  - clickup_structure: Estrutura definida
  - custom_fields: Campos personalizados
  - status_workflow: Fluxo de status
  - templates_created: Templates de tasks

Checklist:
  - "[ ] Revisar fluxograma"
  - "[ ] Definir pastas e listas"
  - "[ ] Criar campos personalizados"
  - "[ ] Definir status e transições"
  - "[ ] Criar templates"
  - "[ ] Definir views por função"
  - "[ ] Validar com time"
---

# *design-architecture

Traduz o fluxograma otimizado em estrutura ClickUp pronta para ser usada.

## Entrada

```
demand_id: DEM-2026-001
optimized_flowchart: https://figma.com/...
team_size: 5
```

## Processo

### 1. Revisar Fluxograma

Entende:
- Etapas do processo
- Responsáveis
- Handoffs
- Status necessários

### 2. Definir Estrutura

Cria em ClickUp:
- **Pasta:** Otimização de Pedidos
  - **Lista:** Pedidos Novos
  - **Lista:** Pedidos em Processamento
  - **Lista:** Pedidos Completados

### 3. Campos Personalizados

Cria campos:
- Status (enum)
- Responsável (person)
- SLA (date)
- Prioridade (enum)
- Cliente (text)
- Valor (currency)

### 4. Status Workflow

Define transições:
- Novo → Em Processamento
- Em Processamento → Validação
- Validação → Pronto para Envio
- Pronto para Envio → Enviado

### 5. Templates

Cria templates para:
- Pedido Novo
- Aprovação
- Processamento

## Saída

```yaml
clickup_structure:
  folder: "Otimização de Pedidos"
  lists:
    - "Pedidos Novos"
    - "Pedidos em Processamento"
    - "Pedidos Validados"

custom_fields:
  - field: status
    type: enum
    options: [Novo, Em Processamento, Validado, Enviado]
  - field: responsavel
    type: person
  - field: sla
    type: date

status_workflow:
  "Novo" → "Em Processamento"
  "Em Processamento" → "Validado"
  "Validado" → "Enviado"

templates_created:
  - Novo Pedido
  - Aprovação Pendente
  - Validação Final
```

## Critérios de Sucesso

✅ Estrutura ClickUp funcional
✅ Campos claros e necessários
✅ Workflow de status lógico
✅ Templates padrão criados
✅ Time consegue usar sem dúvidas
