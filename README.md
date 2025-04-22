# Serverless GraphQL Chat Application

**Forked from** [enaki/DisertationProject](https://github.com/enaki/DisertationProject)  
*This version has been cleaned of sensitive AWS configurations.*

**A scalable chat application built with AWS Serverless technologies based on GraphQL.**  
▶️ Running at: [https://discutie.link/](https://discutie.link/)

## 🧪 Testing Credentials

For demonstration purposes, you can use the following test account:

```plaintext
Email: mabel@student.tuiasi.ro
Password: 1qaz2wsx
```

## 🛠️ Core Components

| Component              | AWS Services Used                    | Implementation Details               |
|------------------------|--------------------------------------|--------------------------------------|
| **Real-Time Messaging**| AppSync, DynamoDB                    | GraphQL, VTL resolvers               |
| **Authentication**     | Cognito, Lambda                      | JWT tokens, post-confirmation hooks  |
| **File Sharing**       | S3, Lambda, CloudFront               | Pre-signed URLs, CDN distribution    |
| **Frontend Hosting**   | S3, CloudFront, Route53              | Angular SPA, HTTPS delivery          |
| **Infrastructure**     | CloudFormation, Amplify              | IaC, CI/CD pipelines                 |


## 📋 Architecture
![System Architecture](https://github.com/enaki-projects/ServerlessChatApplication/blob/main/Documentation/ChatApp-Architecture.png)  

## 📽️ Demo

Presentation Slides hosted [here](https://docs.google.com/presentation/d/1_p6wW6KyBkag2IygBa95vKQQEoDgxW4-/edit?usp=sharing&ouid=100319267693311271464&rtpof=true&sd=true).

[![Demo](https://github.com/enaki-projects/ServerlessChatApplication/blob/main/Documentation/ChatApp-Demo.png)](https://www.youtube.com/watch?v=Lm9l-lrQcXg&list=PLD6xT8DPeCYdweBGFREKoigCH3T07-Rkv&index=1)

## References

- [Amplify Documentation](https://docs.amplify.aws/)
- [AppSync Resolvers](https://docs.aws.amazon.com/appsync/latest/devguide/tutorials.html)