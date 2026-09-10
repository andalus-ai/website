#!/usr/bin/env ruby
# frozen_string_literal: true

require "json"
require "pathname"

ROOT = Pathname.new(File.expand_path("..", __dir__))
TEMPLATE_DIR = ROOT.join("docs/tutorials/integrations/templates")
QUICK_START = ROOT.join("docs/tutorials/integrations/agent-serving.md")

EXPECTED_TEMPLATES = {
  "chat-agent-preflight.json" => {
    "surface" => "chat",
    "feature_profile" => "chat_agent",
    "discover_mcp_tools" => true,
    "mcp_discovery_required" => true,
    "validate_tools" => true,
    "tool_validation_required" => true,
    "validate_request" => true,
    "request_validation_required" => true,
    "request_keys" => %w[messages tools rag_context]
  },
  "responses-agent-preflight.json" => {
    "surface" => "responses",
    "feature_profile" => "responses_agent",
    "discover_mcp_tools" => true,
    "mcp_discovery_required" => true,
    "validate_tools" => true,
    "tool_validation_required" => true,
    "validate_request" => true,
    "request_validation_required" => true,
    "request_keys" => %w[instructions input tools retrieval_context]
  },
  "embedding-rag-preflight.json" => {
    "surface" => "embeddings",
    "feature_profile" => "embedding_rag",
    "discover_mcp_tools" => false,
    "mcp_discovery_required" => false,
    "validate_tools" => false,
    "tool_validation_required" => false,
    "validate_request" => true,
    "request_validation_required" => true,
    "request_keys" => %w[input dimensions encoding_format metadata]
  },
  "mcp-tools-preflight.json" => {
    "surface" => "chat",
    "feature_profile" => "mcp_tools",
    "discover_mcp_tools" => true,
    "mcp_discovery_required" => true,
    "validate_tools" => true,
    "tool_validation_required" => true,
    "validate_request" => false,
    "request_validation_required" => false,
    "request_keys" => %w[messages]
  }
}.freeze

FORBIDDEN_EXECUTION_KEYS = %w[
  execute_tools
  tool_execution
  run_retrieval
  retrieval_execution
  own_vector_store
  vector_store_ownership
  memory_store
  workflow_state
].freeze

def read_json(path, failures)
  JSON.parse(path.read)
rescue JSON::ParserError => e
  failures << "#{relative(path)} is not valid JSON: #{e.message}"
  {}
end

def relative(path)
  path.relative_path_from(ROOT)
end

def require_value(payload, path, key, expected, failures)
  return if payload[key] == expected

  failures << "#{relative(path)} expected #{key}=#{expected.inspect}, got #{payload[key].inspect}"
end

def require_request_key(request, path, key, failures)
  return if request.key?(key)

  failures << "#{relative(path)} request is missing #{key.inspect}"
end

def check_boundary_keys(payload, path, failures)
  found = FORBIDDEN_EXECUTION_KEYS.select { |key| payload.key?(key) }
  request = payload["request"]
  found += FORBIDDEN_EXECUTION_KEYS.select { |key| request.is_a?(Hash) && request.key?(key) }
  return if found.empty?

  failures << "#{relative(path)} contains execution/orchestration keys: #{found.uniq.join(", ")}"
end

failures = []
quick_start = QUICK_START.file? ? QUICK_START.read : ""
failures << "#{relative(QUICK_START)} is missing" if quick_start.empty?

EXPECTED_TEMPLATES.each do |filename, expected|
  path = TEMPLATE_DIR.join(filename)
  unless path.file?
    failures << "#{relative(path)} is missing"
    next
  end

  payload = read_json(path, failures)
  next unless payload.is_a?(Hash)

  require_value(payload, path, "surface", expected["surface"], failures)
  require_value(payload, path, "feature_profile", expected["feature_profile"], failures)
  require_value(payload, path, "discover_mcp_tools", expected["discover_mcp_tools"], failures)
  require_value(payload, path, "mcp_discovery_required", expected["mcp_discovery_required"], failures)
  require_value(payload, path, "validate_tools", expected["validate_tools"], failures)
  require_value(payload, path, "tool_validation_required", expected["tool_validation_required"], failures)
  require_value(payload, path, "validate_request", expected["validate_request"], failures)
  require_value(payload, path, "request_validation_required", expected["request_validation_required"], failures)

  policy = payload["preflight_policy"]
  unless policy.is_a?(Hash) && policy["profile"] == "requested_route"
    failures << "#{relative(path)} must default preflight_policy.profile to requested_route"
  end

  request = payload["request"]
  unless request.is_a?(Hash)
    failures << "#{relative(path)} request must be an object"
    next
  end

  failures << "#{relative(path)} request.model must match top-level model" if request["model"] != payload["model"]
  expected["request_keys"].each { |key| require_request_key(request, path, key, failures) }
  check_boundary_keys(payload, path, failures)

  template_link = "/docs/tutorials/integrations/templates/#{filename}"
  failures << "#{relative(QUICK_START)} does not link #{template_link}" unless quick_start.include?(template_link)
end

if failures.empty?
  puts "agent serving templates ok"
  exit 0
end

puts "Agent serving template check failed:"
failures.each { |failure| puts "- #{failure}" }
exit 1
