---
task: Execute QA Gates - Validate Complete Process
responsavel: "@heimdall"
responsavel_type: agent
atomic_layer: task
elicit: true

Entrada: |
  - demand_id: ID da demanda
  - qa_checklists: Checklists de validação
  - clickup_workspace: Workspace completo

Saida: |
  - qa_report: Relatório de QA
  - validation_result: passed | needs-fixes | blocked
  - issues_found: Lista de issues
  - evidence_screenshots: Screenshots

Checklist:
  - "[ ] Executar checklist completo"
  - "[ ] Testar como usuário leigo"
  - "[ ] Documentar problemas"
  - "[ ] Coletar evidências"
  - "[ ] Calcular score de validação"
  - "[ ] Apontar próximos passos"
  - "[ ] Entregar relatório"
---

# *execute-qa-gates

Valida tudo na prática usando checklists. Se tudo passar em 70%+, processo vai para entrega. Se falhar, aponta o que corrigir.

## Entrada

```
demand_id: DEM-2026-001
qa_checklists: /docs/checklists/pedidos-qa-gates.md
clickup_workspace: "Otimização de Pedidos"
```

## Processo

### 1. Executar Checklist

Para cada item:
- ✅ ou ❌
- Se ❌, detalhar problema
- Tirar screenshot da falha

### 2. Testar como Leigo

Simula usuário novo:
- Consegue criar pedido novo?
- Entende o status?
- Sabe quem é responsável?
- Processo é rápido?

### 3. Validar Automações

Confirma:
- Triggers disparam?
- Notificações chegam?
- Dados estão corretos?
- Sem erros inesperados?

### 4. Documentar Problemas

Para cada problema:
- Título claro
- Reprodução (passo a passo)
- Screenshot/vídeo
- Severidade (crítico/alto/médio/baixo)

### 5. Calcular Score

Score = (itens passaram / total) × 100

Se ≥ 70% → PASSA
Se < 70% → FALHA (volta para agente corrigir)

## Saída

```yaml
qa_report:
  demand_id: DEM-2026-001
  validation_date: 2026-03-09
  total_checks: 15
  checks_passed: 12
  checks_failed: 3
  score: 80%
  result: PASSED

validation_result: passed

issues_found:
  - issue_1:
      title: "Notificação não chega no Telegram"
      severity: high
      steps: "1. Criar novo pedido, 2. Mudar para em processamento"
      screenshots: [link1, link2]

evidence_screenshots: [link1, link2, link3]

next_steps:
  - "Processo aprovado para entrega"
  - "Tyr pode notificar stakeholder"
```

## Critérios de Sucesso

✅ Score ≥ 70%
✅ Problemas críticos resolvidos
✅ Documentação com evidências
✅ Stakeholders validarem resultado
✅ Pronto para entrega
