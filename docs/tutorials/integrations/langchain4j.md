---
layout: default
title: LangChain4j Integration
parent: Platform Integrations
grand_parent: Tutorials
nav_order: 3
---

# 🦜 LangChain4j: Orchestrating LLMs

[LangChain4j](https://github.com/langchain4j/langchain4j) is a powerful framework for building AI-powered Java applications. Gollek provides a native bridge to use local and cloud models within this ecosystem.

## 1. Dependency Setup

Add the following to your `pom.xml`:

```xml
<dependency>
    <groupId>tech.kayys.gollek</groupId>
    <artifactId>gollek-langchain4j</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>
```

## 2. Basic Configuration

Use `GollekChatModel` to connect to your local Gollek instance:

```java
import tech.kayys.gollek.langchain4j.GollekChatModel;
import dev.langchain4j.model.chat.ChatLanguageModel;

ChatLanguageModel model = GollekChatModel.builder()
    .endpoint("http://localhost:8080") // Local Gollek server
    .model("gemma-4-it")
    .temperature(0.7)
    .build();

String response = model.generate("Tell me a joke about Java developers.");
System.out.println(response);
```

## 3. Streaming Responses

For real-time interactions, use `GollekStreamingChatModel`:

```java
import tech.kayys.gollek.langchain4j.GollekStreamingChatModel;

var streamingModel = GollekStreamingChatModel.builder()
    .endpoint("http://localhost:8080")
    .model("gemma-4-it")
    .build();

streamingModel.generate("Write a short poem about neural networks.", new StreamingResponseHandler<AiMessage>() {
    @Override
    public void onNext(String token) {
        System.out.print(token);
    }
});
```

---

[Back to Integrations Overview](./)
