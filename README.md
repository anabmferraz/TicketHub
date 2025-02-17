# TicketHub
### Projeto equivale a segunda parte do projeto avaliativo da disciplina de Programação Back-End  ES51. O sistema de vendas de ingressos pretende gerenciar a comercialização de ingressos para um evento específico.  

---

##  Visão Geral
Sistema completo com API REST e interface web para:
- Cadastro e autenticação de usuários
- CRUD de tipos de ingressos (apenas administradores)
- Controle de vendas com atualização de estoque em tempo real
- Histórico de compras e visualização detalhada de ingressos

---

## Funcionalidades

### API REST
| Módulo              | Endpoints                          | Métodos HTTP  |
|---------------------|------------------------------------|---------------|
| **Usuários**        | `/api/auth/register`              | POST          |
|                     | `/api/auth/login`                 | POST          |
| **Ingressos**       | `/api/tickets`                    | GET, POST     |
|                     | `/api/tickets/:id`                | GET, PUT, DELETE |
| **Compras**         | `/api/purchases`                  | GET, POST     |

### Interface Web
| Funcionalidade       | Rota               | Descrição                     |
|----------------------|--------------------|-------------------------------|
| Login                | `/login`           | Autenticação via email/senha ou token |
| Cadastro             | `/register`        | Cadastro para login  |
| Histórico de Compras | `/purchases`       | Listagem de ingressos adquiridos |

---
