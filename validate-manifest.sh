#!/bin/bash

# validate-manifest.sh
# Script to validate the manifest.json file

echo "Validating manifest.json..."

# Check if manifest.json exists
if [ ! -f "manifest.json" ]; then
  echo "Error: manifest.json not found!"
  exit 1
fi

# Check if jq is installed (for JSON validation)
if ! command -v jq &> /dev/null
then
    echo "Warning: jq is not installed. Skipping detailed JSON validation."
    echo "To install jq on Ubuntu/Debian: sudo apt-get install jq"
    echo "To install jq on macOS: brew install jq"
else
    # Validate JSON syntax
    if jq empty manifest.json; then
        echo "✓ JSON syntax is valid"
    else
        echo "✗ JSON syntax is invalid"
        exit 1
    fi
fi

# Check for required fields
echo "Checking required fields..."

# Required fields in manifest.json
required_fields=("manifest_version" "name" "version" "description")

for field in "${required_fields[@]}"; do
    if grep -q "\"$field\"" manifest.json; then
        echo "✓ $field found"
    else
        echo "✗ $field missing"
        missing_fields=true
    fi
done

# Check for required permissions
echo "Checking required permissions..."

required_permissions=("sidePanel" "storage")

# Extract permissions array from manifest.json (handle multiline)
permissions=$(grep -A 7 '"permissions"' manifest.json | grep -o '"[^"]*"' | tr -d '"')

for permission in "${required_permissions[@]}"; do
    if echo "$permissions" | grep -q "$permission"; then
        echo "✓ $permission permission found"
    else
        echo "✗ $permission permission missing"
        missing_permissions=true
    fi
done

# Check for side_panel configuration
if grep -q "\"side_panel\"" manifest.json; then
    echo "✓ side_panel configuration found"
else
    echo "✗ side_panel configuration missing"
fi

# Check for background script
if grep -q "\"background\"" manifest.json; then
    echo "✓ background script configuration found"
else
    echo "✗ background script configuration missing"
fi

# Report overall status
echo ""
if [ "$missing_fields" = true ] || [ "$missing_permissions" = true ]; then
    echo "⚠ Manifest validation completed with warnings"
    echo "Please check the missing fields or permissions above"
else
    echo "✓ Manifest validation completed successfully"
fi