#!/bin/bash

# Open Test Viewer HTML in browser
# This provides a nice UI to view test commands and documentation

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VIEWER_FILE="$SCRIPT_DIR/test-viewer.html"

if [ -f "$VIEWER_FILE" ]; then
    echo "🌐 Opening Test Viewer..."
    
    # Try to open in default browser
    if command -v xdg-open > /dev/null; then
        xdg-open "$VIEWER_FILE"
    elif command -v open > /dev/null; then
        open "$VIEWER_FILE"
    elif command -v start > /dev/null; then
        start "$VIEWER_FILE"
    else
        echo "Could not open browser automatically."
        echo "Please open: $VIEWER_FILE"
    fi
else
    echo "❌ Test viewer file not found: $VIEWER_FILE"
    exit 1
fi

