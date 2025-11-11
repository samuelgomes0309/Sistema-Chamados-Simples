Sistema de Chamados Simples

🚀 Visão Geral do Projeto

O Sistema de Chamados Simples é uma aplicação web completa desenvolvida para gerenciar o fluxo de atendimento e suporte ao cliente. Construído com uma stack moderna e eficiente, o projeto oferece funcionalidades essenciais como autenticação de usuários, cadastro de clientes, e a abertura e gestão de chamados, utilizando o Firebase 

✨ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias:

Categoria
Tecnologia
Descrição
Frontend
React
Biblioteca JavaScript para construção da interface de usuário.
Linguagem
TypeScript
Superset do JavaScript que adiciona tipagem estática, melhorando a manutenibilidade e a qualidade do código.
Build Tool
Vite
Ferramenta de build rápida e moderna para desenvolvimento frontend.
Estilização
Tailwind CSS
Framework CSS utility-first para construção rápida de designs customizados.
Backend/DB
Firebase
Utilizado para Autenticação (getAuth), Banco de Dados (Firestore - getFirestore) e Armazenamento de Arquivos (getStorage).
Roteamento
React Router DOM
Gerenciamento de rotas e navegação na aplicação.
Formulários
React Hook Form & Zod
Solução eficiente para gerenciamento de estado de formulários e validação de esquema.
Notificações
React Toastify
Biblioteca para exibir notificações de sucesso, erro e informação.


⚙️ Funcionalidades Principais

O sistema oferece as seguintes funcionalidades:

•
Autenticação de Usuário: Login e cadastro de novos usuários.

•
Dashboard: Visão geral dos chamados abertos e em andamento.

•
Gestão de Clientes: Cadastro, listagem e edição de clientes.

•
Gestão de Chamados: Abertura de novos chamados, edição de chamados existentes e visualização do histórico.

•
Perfil do Usuário: Atualização de dados e foto de perfil.

•
Rotas Protegidas: Separação de rotas públicas e privadas (autenticadas).

🛠️ Instalação e Configuração

Para rodar o projeto localmente, siga os passos abaixo:

Pré-requisitos

Certifique-se de ter o Node.js (versão 18+) e o pnpm (ou npm/yarn) instalados em sua máquina.

1. Clonar o Repositório

Bash


git clone https://github.com/samuelgomes0309/Sistema-Chamados-Simples.git
cd Sistema-Chamados-Simples


2. Instalar Dependências

Utilize o gerenciador de pacotes de sua preferência:

Bash


# Usando pnpm
pnpm install

# Ou usando npm
npm install

# Ou usando yarn
yarn install


3. Configuração do Firebase

O projeto utiliza o Firebase para todas as operações de backend. Você precisará criar um projeto no Firebase Console e obter suas credenciais.

Crie um arquivo .env na raiz do projeto e adicione as seguintes variáveis de ambiente:

Plain Text


VITE_FIREBASE_API_KEY="SUA_API_KEY"
VITE_FIREBASE_AUTH_DOMAIN="SEU_AUTH_DOMAIN"
VITE_FIREBASE_PROJECT_ID="SEU_PROJECT_ID"
VITE_FIREBASE_STORAGE_BUCKET="SEU_STORAGE_BUCKET"
VITE_FIREBASE_MESSAGING_SENDER_ID="SEU_MESSAGING_SENDER_ID"
VITE_FIREBASE_APP_ID="SEU_APP_ID"



Atenção: Certifique-se de habilitar os serviços de Authentication (e-mail/senha), Firestore Database e Storage no seu projeto Firebase.

4. Rodar a Aplicação

Inicie o servidor de desenvolvimento:

Bash


pnpm dev
# ou npm run dev
# ou yarn dev


A aplicação estará acessível em http://localhost:5173 (ou outra porta indicada pelo Vite ).

