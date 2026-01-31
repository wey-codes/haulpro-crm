#!/bin/bash

# Ralph - Autonomous AI Agent Loop
# Executes tasks from prd.json using Claude Code CLI

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Defaults
MAX_ITERATIONS=20

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --max|-m)
            MAX_ITERATIONS="$2"
            shift 2
            ;;
        *)
            MAX_ITERATIONS="$1"
            shift
            ;;
    esac
done

cd "$PROJECT_ROOT"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🤖 Ralph - Autonomous Agent Loop"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   Project: $PROJECT_ROOT"
echo "   Max iterations: $MAX_ITERATIONS"
echo ""

# Read the prompt
PROMPT=$(cat "$SCRIPT_DIR/prompt.md")

# Add autonomous execution instructions
FULL_PROMPT="$PROMPT

## EXECUTION MODE: FULLY AUTONOMOUS

Execute ALL remaining stories without stopping. Do NOT ask for permission.
- Auto-accept everything
- Do NOT stop between phases
- Do NOT ask 'Should I continue?'
- Just keep building until all stories pass

Now read prd.json and progress.txt, find the next incomplete story, and implement it."

# Check remaining stories
check_completion() {
    local incomplete=$(jq '[.userStories[] | select(.passes == false)] | length' scripts/ralph/prd.json 2>/dev/null || echo "0")
    echo "$incomplete"
}

REMAINING=$(check_completion)
if [[ "$REMAINING" == "0" ]]; then
    echo "✅ All stories already complete!"
    echo "   Nothing to do."
    exit 0
fi

echo "📋 Remaining stories: $REMAINING"
echo ""

# Main loop
for ((i=1; i<=MAX_ITERATIONS; i++)); do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔄 Iteration $i of $MAX_ITERATIONS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    REMAINING=$(check_completion)
    if [[ "$REMAINING" == "0" ]]; then
        echo ""
        echo "✅ All stories complete!"
        exit 0
    fi

    echo "📋 Stories remaining: $REMAINING"
    echo ""

    # Run Claude Code CLI with prompt
    echo "🚀 Starting Claude..."
    claude --dangerously-skip-permissions -p "$FULL_PROMPT" 2>&1 || true

    # Check for completion after each iteration
    REMAINING=$(check_completion)
    if [[ "$REMAINING" == "0" ]]; then
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "✅ Ralph completed all stories!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "📄 Check scripts/ralph/progress.txt for details."
        exit 0
    fi

    echo ""
    echo "⏳ Continuing to next iteration..."
    sleep 2
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚠️  Max iterations ($MAX_ITERATIONS) reached"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
REMAINING=$(check_completion)
echo "   Stories remaining: $REMAINING"
echo "   Check scripts/ralph/progress.txt for current status."
exit 1
