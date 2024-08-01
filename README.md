# Bicho Na Pista app mobile 🦎
## Sobre o projeto

Toda a parte de levantamento de requisitos, assim como o design de interface de usuário e a modelagem de banco de dados, foram desenvolvidos por mim enquanto atuei no projeto Bicho Na Pista, projeto este que tinha como objetivo o levantamento e análise de dados de atropelamentos de animais para criação de estratégias de mitigação de atropelamento de fauna.

Dessa forma, o aplicativo foi desenvolvido para registrar a presença, e atropelamentos, de animais nas pistas e rodovias de forma sistemática e padronizada. O app foi desenvolvido em React Native, para o banco de dados foi usado o serviço RDS da AWS com o sistema de gerenciamento de banco de dados MySQL em conjunto com o serviço S3 da AWS. As imagens coletadas no aplicativo ficam armazenadas em um bucket no S3 de forma que o banco de dados não precisa armazenar as imagens, apenas o link correspondente a elas no S3.

O aplicativo foi desenvolvido como trabalho de conclusão de curso de engenharia de computação.


## Screenshots

### Página inicial:

<img src="https://github.com/user-attachments/assets/1758fdf0-58c2-4af1-be24-2b1c713daf8d" width="300" alt="PagInicial1"/>
<img src="https://github.com/user-attachments/assets/4dfc7e5e-3c0e-41ec-b7b5-7ad4e371f83a" width="300" alt="PagInicial2"/>
<img src="https://github.com/user-attachments/assets/b6a0667c-9053-40bb-b2dd-40a9ac89e564" width="300" alt="PagInicial3"/>
<img src="https://github.com/user-attachments/assets/394e58c3-821a-4261-8046-d7597da56a5e" width="300" alt="PagInicial4"/>

### Página de login:

<img src="https://github.com/user-attachments/assets/70871f6c-3392-40c8-ae19-018c05316fc5" width="300" alt="PagLogin"/>

### Página para criar uma conta:

<img src="https://github.com/user-attachments/assets/d76d7eaf-710e-47b5-a3ae-661e056ba6d1" width="300" alt="PagSeRegistre"/>

### Página se esqueceu senha de login:

<img src="https://github.com/user-attachments/assets/cb74c972-d78f-4d78-b3e8-8fc629a4aa2d" width="300" alt="PagEsqueceuSenha"/>

### Página para registro de animal na pista:
(Todos os campos possuem validação do lado do cliente)

<img src="https://github.com/user-attachments/assets/b282d71a-529f-493a-aaef-b4781e6072ea" width="300" alt="PagRegistro1"/>
<img src="https://github.com/user-attachments/assets/9ca0b242-eca5-4ce2-8d67-0ff678f721c2" width="300" alt="PagRegistro2"/>
<img src="https://github.com/user-attachments/assets/3aab100e-560b-4e3b-95bb-0d9f936156d9" width="300" alt="PagRegistro3"/>

### Página para modo monitoramento:

<img src="https://github.com/user-attachments/assets/68192afe-925d-49b4-a6c9-12ace79118a3" width="300" alt="PagMonitoramento1"/>
<img src="https://github.com/user-attachments/assets/8c606408-540e-412f-9c1e-6355dbc58d2f" width="300" alt="PagMonitoramento2"/>
<img src="https://github.com/user-attachments/assets/8a1823bd-3ecf-4764-ae36-c34076f6087a" width="300" alt="PagMonitoramento3"/>

### Página para visualizar meus registros:

<img src="https://github.com/user-attachments/assets/c71f9480-11b3-4f05-85e7-45d285050034" width="300" alt="PagMeusRegistros"/>

### Página de ranking:

<img src="https://github.com/user-attachments/assets/58d21340-817e-4f43-b11a-8486c39208ae" width="300" alt="PagRank"/>

### Página para complementar destino de animal:
(Nessa tela ficam disponíveis apenas os registros marcados como "a complementar" e ao clicar em editar a pessoa é redirecionada para o formulário focado no campo de destinação, com todas as informações do animal correspondentes já preenchida. O único campo que pode ser alterado nessa opção é o de destinação.)

<img src="https://github.com/user-attachments/assets/15ccf843-9a84-405b-93f1-e8f10be4dd68" width="300" alt="PagComplementar"/>


## Tecnologias utilizadas

- `React Native`
- `Expo`
- `JavaScript`
- `Node.js`
- `Express.js`
- `MySQL`
- `AWS RDS`
- `AWS S3`


## Autor

**Ester da Cruz Andrade**

Linkedin: https://www.linkedin.com/in/ester-da-cruz-andrade/

e-mail: estercandrade02@gmail.com
