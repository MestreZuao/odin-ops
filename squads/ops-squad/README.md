# Squad OPS — Operations Orchestration

🏗️ **Orquestração e Otimização de Processos Operacionais**

Este squad funciona como o "arquiteto da casa" da sua empresa. Organiza e auxilia nos processos operacionais com especialização por função.

## 📊 Estrutura do Squad

O Squad OPS é composto por **5 agentes especializados**:

### 1. **Tyr** ⚔️ — Orquestrador Central
- **Responsabilidade:** Recebe demandas externas e distribui para especialistas
- **Tasks:** receive-demand, distribute-to-agent, track-progress, deliver-package
- **Ferramentas:** ClickUp, Telegram, Obsidian

### 2. **Skadi** 📊 — Process Mapper
- **Responsabilidade:** Mapeia e desenha processos otimizados
- **Tasks:** discovery-process, create-process
- **Ferramentas:** Figma, Obsidian, Google Docs

### 3. **Vili** 🏛️ — Architect
- **Responsabilidade:** Traduz processos em arquitetura operacional no ClickUp
- **Tasks:** design-architecture, design-executors
- **Ferramentas:** ClickUp, Obsidian, Google Sheets

### 4. **Bragi** ⚙️ — Automation Architect
- **Responsabilidade:** Cria automações que fazem o processo rodar sozinho
- **Tasks:** create-task-definitions, create-automations
- **Ferramentas:** ClickUp, N8N, Webhooks, APIs

### 5. **Heimdall** 🔍 — QA
- **Responsabilidade:** Valida que tudo funciona antes de entregar
- **Tasks:** design-qa-gates, execute-qa-gates
- **Ferramentas:** ClickUp, Obsidian, Google Sheets

## 🔄 Fluxo Operacional

```
┌─────────────────────────────────────────────────────────┐
│                    DEMANDA EXTERNA                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
        ⚔️  TYR: Recebe e estrutura demanda
                       │
                       ▼
        ⚔️  TYR: Distribui para especialista
                       │
        ┌──────────────┼──────────────┬──────────────┐
        │              │              │              │
        ▼              ▼              ▼              ▼
    📊 SKADI      🏛️  VILI       ⚙️  BRAGI     🔍 HEIMDALL
  Mapeamento    Arquitetura    Automações      Validação
        │              │              │              │
        ▼ (70% gate)   ▼ (70% gate)  ▼ (70% gate)  ▼
        └──────────────┴──────────────┴──────────────┘
                       │
                       ▼
        ⚔️  TYR: Entrega pacote final
                       │
                       ▼
        ✅ STAKEHOLDER SATISFEITO
```

## 📋 Quality Gates

Cada etapa tem um **Quality Gate de 70%**:

- **Gate 1:** Process Mapper → Architect (processo clareza ≥ 70%)
- **Gate 2:** Architect → Automation Architect (arquitetura ≥ 70%)
- **Gate 3:** Automation Architect → QA (automações testadas ≥ 70%)
- **Gate 4:** QA → Delivery (validação final ≥ 70%)

Se qualquer gate falhar, o QA aponta o que corrigir e o fluxo retorna ao agente responsável.

## 🚀 Como Usar

### 1. Criar uma Demanda

```bash
@tyr
*receive-demand
```

Forneça:
- Título
- Descrição
- Solicitante
- Prioridade

### 2. Tyr Distribui para o Especialista

O Tyr analisará e atribuirá a:
- **Skadi** (se é mapeamento de processo)
- **Vili** (se é arquitetura)
- **Bragi** (se é automação)
- **Heimdall** (se é validação)

### 3. Acompanhar Progresso

```bash
@tyr
*track-progress
```

### 4. Obter Resultado

Quando tudo estiver validado em 70%+, o Tyr entrega o resultado final.

## 📁 Estrutura de Arquivos

```
squads/ops-squad/
├── squad.yaml                 # Manifest do squad
├── README.md                  # Este arquivo
├── agents/                    # Definições dos agentes
│   ├── tyr.md
│   ├── skadi.md
│   ├── vili.md
│   ├── bragi.md
│   └── heimdall.md
├── tasks/                     # Definições de tasks
│   ├── tyr-*.md
│   ├── skadi-*.md
│   ├── vili-*.md
│   ├── bragi-*.md
│   └── heimdall-*.md
├── workflows/                 # Workflows multi-step
├── checklists/                # Checklists de validação
├── templates/                 # Templates de documentos
├── config/                    # Configurações
└── data/                      # Dados estáticos
```

## 🔧 Configuração Necessária

O squad requer acesso a:
- **ClickUp** (gestão de tasks e automações)
- **Figma** (design visual de processos)
- **N8N** (automações complexas)
- **Telegram** (notificações)
- **Google Workspace** (Docs, Sheets, Drive)
- **Obsidian** (documentação)

## 📞 Suporte

Se tiver dúvidas sobre:
- **Fluxo geral:** Consulte `README.md`
- **Como cada agente funciona:** Veja `agents/`
- **Como executar uma task:** Veja `tasks/`
- **Checklists de validação:** Veja `checklists/`

## 🎯 Casos de Uso

✅ Otimizar processos operacionais
✅ Automatizar workflows repetitivos
✅ Mapear e documentar processos
✅ Validar qualidade de implementações
✅ Gerenciar equipes operacionais
✅ Integrar sistemas e ferramentas

---

**Squad OPS v1.0** — Pronto para uso! 🚀
