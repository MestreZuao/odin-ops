---
task: Discovery Process - Map Current State
responsavel: "@skadi"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada: |
  - demand_id: ID da demanda
  - process_description: Descrição do processo atual
  - stakeholders: Lista de pessoas a entrevistar
  - current_docs: Documentação existente

Saida: |
  - process_map_figma: Link do Figma com mapeamento
  - discovery_document: Documento em Obsidian
  - gaps_identified: Lista de gaps
  - bottlenecks: Lista de gargalos
  - stakeholder_feedback: Feedback coletado

Checklist:
  - "[ ] Entrevistar stakeholders"
  - "[ ] Mapear processo do fim pro começo"
  - "[ ] Criar fluxograma em Figma"
  - "[ ] Identificar gaps e gargalos"
  - "[ ] Documentar em Obsidian"
  - "[ ] Validar com stakeholders"
  - "[ ] Pronto para próxima etapa"
---

# *discovery-process

Mapeia o processo atual do fim pro começo, identificando gaps e gargalos.

## Entrada

```
demand_id: DEM-2026-001
process_description: "Processo de criação de pedidos"
stakeholders: ["Ana (Sales)", "Bruno (Operações)", "Carol (Financeiro)"]
current_docs: ["./processo-atual.md"]
```

## Processo

### 1. Entrevistar Stakeholders

Conversa com cada person envolvida:
- Como começa o processo?
- Quais são os passos?
- Quem faz cada etapa?
- Quanto tempo leva cada etapa?
- Qual é o maior problema?

### 2. Mapear Processo

Desenha no Figma:
- Cada etapa do processo
- Quem é responsável
- Tempo de execução
- Caminhos alternativos (erros)
- Integrações com outros sistemas

### 3. Identificar Problemas

Aponta:
- **Gaps:** O que falta?
- **Gargalos:** Onde demora mais?
- **Erros:** Onde há mais mistakes?
- **Duplicação:** O que é repetido?

### 4. Documentar

Cria em Obsidian:
- Mapa em texto (estrutura)
- Entrevistas resumidas
- Gaps encontrados
- Gargalos identificados
- Recomendações iniciais

## Saída

```
process_map_figma: https://figma.com/...
discovery_document: /docs/processes/discovery-pedidos.md

gaps_identified:
  - Falta validação de estoque antes de confirmar pedido
  - Não há integração com sistema financeiro
  - Feedback do cliente não é rastreado

bottlenecks:
  - Aprovação manual leva 2 dias (deveria ser 4h)
  - Integração com logística é manual
  - Cálculo de frete é feito por email

stakeholder_feedback:
  - Ana: "Processo é muito lento"
  - Bruno: "Faltam automações"
  - Carol: "Dados não batem com financeiro"
```

## Critérios de Sucesso

✅ Mapeamento completo e claro
✅ Todos os stakeholders entrevistados
✅ Gaps e gargalos claramente documentados
✅ Fluxograma em Figma
✅ Documentação em Obsidian pronta
