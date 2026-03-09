# Telegram Integration - Squad OPS

## Overview

O Squad OPS está integrado com Telegram para notificações automáticas em tempo real sobre o progresso das tarefas operacionais.

**Bot:** `@OdinSquadBot`
**Status:** ✅ Ativo e validado
**ID do Bot:** 7993651039

---

## Configuração

### Arquivo de Configuração

```
config/telegram-config.json
```

Este arquivo contém:
- Credenciais do bot
- Features habilitadas
- Integrações com agentes
- Tipos de notificações

### Variáveis de Ambiente

```bash
# .env
TELEGRAM_BOT_TOKEN=7993651039:AAFcdkCnPg61VlP2IsPQamsc6gF7KGAiNQ8
TELEGRAM_CHAT_ID=<seu_chat_id>  # Opcional, para targeting específico
```

---

## Como Usar

### 1. Adicionar o Bot no Telegram

1. Abra Telegram
2. Procure por **@OdinSquadBot**
3. Clique em `Start`

### 2. Receber Notificações

O bot enviará notificações automáticas quando:

#### Tyr (Orchestrator)
- ✉️ Nova demanda recebida
- ✉️ Demanda distribuída para especialista
- ✉️ Resultado final pronto para entrega

#### Skadi (Process Mapper)
- ✉️ Discovery process iniciado
- ✉️ Processo mapeado e documentado
- ✉️ Pronto para próxima etapa

#### Vili (Architect)
- ✉️ Arquitetura de ClickUp iniciada
- ✉️ Estrutura criada e validada
- ✉️ Matriz de responsabilidades pronta

#### Bragi (Automation Architect)
- ✉️ Task definitions criadas
- ✉️ Automações em teste
- ✉️ Automações ativadas com sucesso

#### Heimdall (QA)
- ✉️ QA gates iniciado
- ✉️ Validação em progresso
- ✉️ Resultado: ✅ PASSOU ou ❌ FALHOU
- ✉️ Próximos passos (se correção necessária)

---

## Tipos de Notificação

### 1. Task Started
```
⚙️ [Task Started]
Agent: @tyr
Task: receive-demand
Demanda: "Otimizar processo de pedidos"
Status: IN_PROGRESS
```

### 2. Quality Gate Passed
```
✅ [Quality Gate Passed]
From: @skadi (Process Mapper)
To: @vili (Architect)
Score: 92%
Duration: 4h 23m
```

### 3. Quality Gate Failed
```
❌ [Quality Gate Failed]
From: @bragi (Automation)
To: @heimdall (QA)
Score: 58%
Issues:
  - Notification not reaching Telegram
  - SLA not updating correctly
Next: Bragi needs to fix and retest
```

### 4. Task Completed
```
✅ [Task Completed]
Agent: @heimdall
Task: execute-qa-gates
Result: APPROVED
Duration: 8h 15m
Delivery: Ready
```

---

## Comandos Disponíveis (via Telegram)

```
/status          - Ver status atual do Squad OPS
/demands         - Listar demandas em andamento
/agents          - Ver status de cada agente
/recent          - Últimas notificações
/help            - Ajuda e comandos
```

---

## Exemplos de Uso

### Cenário 1: Acompanhar Demanda Completa

```
1. Você envia demanda via Tyr
   ↓ Telegram: ✉️ "Nova demanda recebida: Otimizar processo de pedidos"

2. Tyr distribui para Skadi
   ↓ Telegram: ✉️ "Demanda atribuída a Skadi (Process Mapper)"

3. Skadi mapeia e passa para Vili
   ↓ Telegram: ✉️ "✅ Quality Gate Passed | Skadi → Vili (92%)"

4. Vili cria arquitetura e passa para Bragi
   ↓ Telegram: ✉️ "✅ Quality Gate Passed | Vili → Bragi (85%)"

5. Bragi cria automações e passa para Heimdall
   ↓ Telegram: ✉️ "✅ Quality Gate Passed | Bragi → Heimdall (88%)"

6. Heimdall valida e aprova
   ↓ Telegram: ✉️ "✅ Final QA Passed (90%) | Ready for Delivery"

7. Tyr entrega resultado
   ↓ Telegram: ✉️ "✅ [DELIVERY COMPLETE] Demanda finalizada com sucesso"
```

---

## Troubleshooting

### Bot não está enviando notificações

**Solução:**
1. Verifique se você iniciou o chat com o bot
2. Confirme `TELEGRAM_BOT_TOKEN` em `.env`
3. Confirme `TELEGRAM_CHAT_ID` em `.env` (se usando chat específico)
4. Reinicie o serviço

### Token Inválido

**Solução:**
1. Verifique o token em BotFather
2. Atualize em `.env`
3. Teste com: `curl https://api.telegram.org/botTOKEN/getMe`

### Mensagens Antigas

O bot mantém histórico de notificações. Use `/recent` para ver últimas.

---

## Segurança

⚠️ **IMPORTANTE:**
- **NUNCA** compartilhe o token de bot publicamente
- **NUNCA** comite `.env` com credenciais reais
- Use `.env.example` para documentar estrutura
- Token está armazenado em `.env` (gitignored)

---

## Próximos Passos

- [ ] Configurar Google Workspace integration
- [ ] Configurar Obsidian integration
- [ ] Configurar N8N integration
- [ ] Testar fluxo completo de demanda

---

**Configuração criada:** 2026-03-09
**Status:** ✅ Ativa e validada
**Bot:** @OdinSquadBot
