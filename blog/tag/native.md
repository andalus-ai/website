---
layout: default
title: Tag - native
tag: native
---

# Tag: #native

{% assign sorted_pages = site.pages | sort: "date" | reverse %}

<section class="blog-grid">
{% for post in sorted_pages %}
  {% if post.url contains '/blog/' and post.url != '/blog/' and post.date and post.tags and post.tags contains page.tag %}
  <a class="blog-card" href="{{ post.url | relative_url }}">
    <div class="blog-cover {% if post.cover %}cover-{{ post.cover }}{% else %}cover-default{% endif %}"></div>
    <div class="blog-card-body">
      <h3>{{ post.title }}</h3>
      <p>{{ post.description }}</p>
      <p class="blog-meta">Published: {{ post.date | date: "%B %-d, %Y" }}</p>
    </div>
  </a>
  {% endif %}
{% endfor %}
</section>
