---
layout: default
title: Gollek Blog
---

<section class="hero hero-compact">
  <p class="eyebrow">Product Updates</p>
  <h1>Gollek Blog</h1>
  <p class="lead">Release notes, architecture deep dives, and practical guides for developers building with Gollek.</p>
  <div class="hero-actions">
    <a class="btn btn-primary" href="/blog/categories">Browse Categories</a>
    <a class="btn btn-ghost" href="/blog/tags">Browse Tags</a>
    <a class="btn btn-ghost" href="/feed.xml">RSS Feed</a>
  </div>
</section>

<section class="subtle-panel">
  <strong>Featured:</strong>
  <a href="/blog/why-java-for-ai-gollek-jdk25">Why Java for AI? The Engineering Behind Gollek's High-Performance Engine</a>
  <span class="blog-meta">Published: March 31, 2026</span>
</section>

{% assign sorted_pages = site.pages | sort: "date" | reverse %}
{% assign blog_count = 0 %}
{% for post in sorted_pages %}
  {% if post.url contains '/blog/' and post.url != '/blog/' and post.title and post.date %}
    {% assign blog_count = blog_count | plus: 1 %}
  {% endif %}
{% endfor %}

<section class="subtle-panel">
  <strong>{{ blog_count }}</strong> article{% if blog_count != 1 %}s{% endif %} published.
</section>

<section class="blog-grid">
{% for post in sorted_pages %}
  {% if post.url contains '/blog/' and post.url != '/blog/' and post.title and post.date %}
  <a class="blog-card" href="{{ post.url | relative_url }}">
    <div class="blog-cover {% if post.cover %}cover-{{ post.cover }}{% else %}cover-default{% endif %}"></div>
    <div class="blog-card-body">
      <h3>{{ post.title }}</h3>
      <p>{{ post.description }}</p>
      <p class="blog-meta">Published: {{ post.date | date: "%B %-d, %Y" }}</p>
      {% if post.tags %}
      <div class="chip-row">
        {% for tag in post.tags limit: 4 %}
          <span class="chip">#{{ tag }}</span>
        {% endfor %}
      </div>
      {% endif %}
    </div>
  </a>
  {% endif %}
{% endfor %}
</section>
