# XMLcontrol Pro - Enterprise File Manager

Um sistema profissional de gerenciamento de arquivos e XML com interface moderna, construído com React 19, Tailwind CSS 4 e componentes shadcn/ui.

## 🎯 Visão Geral

XMLcontrol Pro é uma solução empresarial para gerenciar, organizar e validar arquivos com foco especial em documentos XML. Oferece uma experiência de usuário intuitiva com recursos avançados de organização, visualização e análise de dados.

## ✨ Funcionalidades Principais

### Gerenciamento de Arquivos
- **Navegação Intuitiva**: Sistema de breadcrumb com histórico de navegação
- **Múltiplos Modos de Visualização**: Grade, Lista e Visualização Detalhada
- **Busca Inteligente**: Pesquisa em tempo real com filtros
- **Seleção em Massa**: Selecione múltiplos itens com Ctrl+A
- **Operações de Arquivo**: Criar, deletar, renomear pastas e arquivos

### Organização e Personalização
- **Cores Personalizadas**: Atribua cores únicas a pastas para melhor organização
- **Favoritos**: Marque itens importantes para acesso rápido
- **Tags e Metadados**: Organize com tags customizáveis
- **Histórico de Ações**: Rastreie todas as operações realizadas

### Análise e Exportação
- **Estatísticas de Armazenamento**: Visualize uso de espaço em disco com gráficos
- **Exportação de Dados**: Exporte em JSON ou CSV
- **Análise por Tipo de Arquivo**: Gráficos de pizza mostrando distribuição de espaço
- **Relatórios Detalhados**: Informações completas sobre arquivos e pastas

### Validação XML
- **Validação em Tempo Real**: Verifique sintaxe XML instantaneamente
- **Detecção de Erros**: Identifique problemas de formatação
- **Avisos Estruturais**: Receba sugestões de melhorias
- **Relatórios Detalhados**: Mensagens de erro com linha e coluna

### Interface Profissional
- **Design Minimalista Corporativo**: Hierarquia visual clara e espaçamento generoso
- **Tema Claro/Escuro**: Alterne entre temas conforme preferência
- **Responsivo**: Funciona perfeitamente em diferentes tamanhos de tela
- **Acessibilidade**: Navegação por teclado completa e suporte a leitores de tela

## 🎨 Design Philosophy

O XMLcontrol Pro segue a filosofia de **Design Minimalista Corporativo**, caracterizado por:

- **Clareza Absoluta**: Hierarquia visual rigorosa com espaçamento generoso
- **Paleta Profissional**: Azul profundo (#1e40af) com neutros cuidadosamente calibrados
- **Transições Suaves**: Animações de 200-300ms para feedback visual imediato
- **Tipografia Estratégica**: Fonte Geist com pesos variados para criar estrutura visual

## ⌨️ Atalhos de Teclado

| Atalho | Ação |
|--------|------|
| `Ctrl + A` | Selecionar todos os itens |
| `Delete` | Deletar item selecionado |
| `Backspace` | Voltar para pasta anterior |
| `Ctrl + E` | Abrir diálogo de exportação |
| `Ctrl + N` | Criar nova pasta |
| `Ctrl + ?` | Mostrar atalhos de teclado |
| `F2` | Renomear item selecionado |

## 🚀 Começando

### Requisitos
- Node.js 18+
- npm ou pnpm

### Instalação

```bash
# Clonar repositório
git clone https://github.com/Z0oom1/XMLcontrol.git
cd XMLcontrol

# Instalar dependências
npm install
# ou
pnpm install

# Iniciar servidor de desenvolvimento
npm run dev
# ou
pnpm dev
```

O aplicativo estará disponível em `http://localhost:3000`

## 📁 Estrutura do Projeto

```
client/
  ├── public/              # Arquivos estáticos
  ├── src/
  │   ├── components/      # Componentes React reutilizáveis
  │   │   ├── FileCard.tsx
  │   │   ├── Sidebar.tsx
  │   │   ├── Toolbar.tsx
  │   │   ├── InspectorPanel.tsx
  │   │   ├── ExportDialog.tsx
  │   │   ├── KeyboardShortcutsDialog.tsx
  │   │   └── StorageStats.tsx
  │   ├── hooks/           # Hooks customizados
  │   │   ├── useFileManager.ts
  │   │   ├── useActionHistory.ts
  │   │   └── useXMLValidator.ts
  │   ├── pages/           # Páginas da aplicação
  │   │   ├── Home.tsx
  │   │   └── NotFound.tsx
  │   ├── contexts/        # Contextos React
  │   ├── lib/             # Utilitários e helpers
  │   ├── App.tsx          # Componente raiz
  │   ├── main.tsx         # Entrada da aplicação
  │   └── index.css        # Estilos globais com Tailwind
  └── index.html           # HTML principal
```

## 🔧 Tecnologias

- **React 19**: Framework UI moderno
- **Tailwind CSS 4**: Utilitários CSS para styling
- **shadcn/ui**: Componentes acessíveis e customizáveis
- **TypeScript**: Tipagem estática para segurança
- **Lucide React**: Ícones SVG de alta qualidade
- **Recharts**: Gráficos e visualizações de dados
- **Sonner**: Notificações toast elegantes
- **Wouter**: Roteamento leve para React

## 📊 Funcionalidades Avançadas

### Hook useFileManager
Gerencia todo o estado do sistema de arquivos:
- Navegação entre pastas
- Seleção de múltiplos itens
- Busca e filtros
- Metadados de pastas
- Operações CRUD

### Hook useActionHistory
Implementa padrão Undo/Redo:
- Rastreamento de ações
- Navegação no histórico
- Exportação de histórico
- Limpeza de histórico

### Hook useXMLValidator
Validação robusta de XML:
- Verificação de sintaxe
- Detecção de tags não fechadas
- Avisos estruturais
- Relatórios detalhados

## 🎯 Casos de Uso

- **Gerenciamento Corporativo**: Organize arquivos em estruturas complexas
- **Processamento XML**: Valide e organize documentos XML
- **Análise de Dados**: Visualize distribuição de armazenamento
- **Auditoria**: Rastreie todas as operações com histórico
- **Backup e Organização**: Exporte dados para análise externa

## 🔐 Segurança

- Acesso local apenas (File System Access API)
- Sem upload para servidor
- Dados armazenados localmente no navegador
- localStorage para metadados persistentes

## 📈 Performance

- Renderização otimizada com React 19
- Lazy loading de componentes
- Memoização de callbacks
- Busca otimizada com debounce

## 🌐 Compatibilidade

- Chrome/Edge 86+
- Firefox 87+
- Safari 15+
- Requer suporte a File System Access API

## 📝 Licença

MIT

## 👥 Contribuições

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📧 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do GitHub.

---

**XMLcontrol Pro v3.0** - Sistema Profissional de Gerenciamento de Arquivos
