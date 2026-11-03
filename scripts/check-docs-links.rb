#!/usr/bin/env ruby
# frozen_string_literal: true

require "cgi"
require "pathname"

ROOT = Pathname.new(File.expand_path("..", __dir__))
SITE = ROOT.join("_site")
DOC_GLOB = ROOT.join("docs/**/*.md").to_s
SKIPPED_PREFIXES = ["/examples/"].freeze
SKIPPED_SOURCE_PREFIXES = ["docs/archive/"].freeze

def markdown_targets(text)
  text.scan(/!?\[[^\]]*\]\(([^)]+)\)/).flatten.map do |target|
    target = target.strip
    target.start_with?("<") ? target[/\A<([^>]+)>/, 1] : target.split(/\s+/, 2).first
  end.compact
end

def html_href_targets(text)
  text.scan(/href=["']([^"']+)["']/).flatten
end

def local_target?(target)
  return false if target.nil? || target.empty?
  return false if target.start_with?("http://", "https://", "mailto:", "tel:", "javascript:")
  return false if target.start_with?("{{", "{%")
  return false if SKIPPED_PREFIXES.any? { |prefix| target.start_with?(prefix) }

  true
end

def source_base_for(source_file, target_path)
  if target_path.nil? || target_path.empty?
    Pathname.new(source_file)
  elsif target_path.start_with?("/")
    ROOT.join(target_path.sub(%r{\A/}, ""))
  else
    Pathname.new(File.expand_path(target_path, File.dirname(source_file)))
  end
end

def source_candidates(source_file, target_path)
  base = source_base_for(source_file, target_path)
  base = Pathname.new(base.to_s.sub(%r{/\z}, ""))

  [
    base,
    Pathname.new("#{base}.md"),
    base.join("index.md")
  ].uniq
end

def html_candidates_for_base(source_file, target_path)
  base = source_base_for(source_file, target_path)
  base = Pathname.new(base.to_s.sub(%r{/\z}, ""))
  base = Pathname.new(base.to_s.sub(/\.md\z/, ""))

  rel = base.relative_path_from(ROOT).to_s

  [
    SITE.join("#{rel}.html"),
    SITE.join(rel, "index.html")
  ].uniq
end

def generated_ids(html_file)
  File.read(html_file).scan(/\sid=["']([^"']+)["']/).flatten
end

missing_files = []
missing_anchors = []

Dir[DOC_GLOB].sort.each do |source_file|
  relative_source = Pathname.new(source_file).relative_path_from(ROOT).to_s
  next if SKIPPED_SOURCE_PREFIXES.any? { |prefix| relative_source.start_with?(prefix) }

  text = File.read(source_file)
  targets = (markdown_targets(text) + html_href_targets(text)).uniq

  targets.each do |target|
    next unless local_target?(target)

    target_path, fragment = target.split("#", 2)
    target_path ||= ""

    unless target_path.empty? || target_path.start_with?("#")
      candidates = source_candidates(source_file, target_path)
      unless candidates.any? { |candidate| candidate.file? }
        missing_files << [source_file, target, candidates]
        next
      end
    end

    next if fragment.nil? || fragment.empty?

    html_file = html_candidates_for_base(source_file, target_path).find(&:file?)
    unless html_file
      missing_anchors << [source_file, target, nil, CGI.unescape(fragment)]
      next
    end

    anchor = CGI.unescape(fragment)
    ids = generated_ids(html_file)
    missing_anchors << [source_file, target, html_file, anchor] unless ids.include?(anchor)
  end
end

if missing_files.empty? && missing_anchors.empty?
  puts "docs links ok"
  puts "docs anchors ok"
  exit 0
end

unless missing_files.empty?
  puts "Missing local docs links:"
  missing_files.each do |source_file, target, candidates|
    relative_source = Pathname.new(source_file).relative_path_from(ROOT)
    relative_candidates = candidates.map { |candidate| candidate.relative_path_from(ROOT) }.join(", ")
    puts "- #{relative_source}: #{target} (checked: #{relative_candidates})"
  end
end

unless missing_anchors.empty?
  puts "Missing generated HTML anchors:"
  missing_anchors.each do |source_file, target, html_file, anchor|
    relative_source = Pathname.new(source_file).relative_path_from(ROOT)
    html_label = html_file ? html_file.relative_path_from(ROOT) : "no generated HTML"
    puts "- #{relative_source}: #{target} -> #{html_label} missing ##{anchor}"
  end
end

exit 1
