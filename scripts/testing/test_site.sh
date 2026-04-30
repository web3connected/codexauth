#!/bin/bash

echo "🧪 CodexAuth Site Testing"
echo "========================"

#!/bin/bash

# Test CodexAuth Site Health
echo "🔍 Testing CodexAuth Site Health..."

BASE_URL="http://localhost:3000"

# Test routes array
routes=(
    "/"
    "/learn"
    "/learn/harmonic-hashing"
    "/docs"
    "/docs/getting-started" 
    "/tools"
    "/tools/generator"
    "/pricing"
    "/security"
    "/enterprise"
    "/api/hash"
    "/api/verify"
)

echo -e "\n📋 Testing Routes:"
echo "=================="

passed=0
failed=0

for route in "${routes[@]}"; do
    echo -n "Testing $route ... "
    
    # Get HTTP status code
    status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route" 2>/dev/null)
    
    if [ "$status" = "200" ]; then
        echo "✅ PASS ($status)"
        ((passed++))
    elif [ "$status" = "404" ]; then
        echo "❌ NOT FOUND ($status)"
        ((failed++))
    elif [ "$status" = "500" ]; then
        echo "💥 SERVER ERROR ($status)"
        ((failed++))
    else
        echo "⚠️  UNKNOWN ($status)"
        ((failed++))
    fi
done

echo -e "\n📊 Results:"
echo "==========="
echo "✅ Passed: $passed"
echo "❌ Failed: $failed"
echo "📈 Success Rate: $((passed * 100 / (passed + failed)))%"

if [ $failed -eq 0 ]; then
    echo -e "\n🎉 All tests passed! Site is ready for deployment."
else
    echo -e "\n⚠️  Some routes failed. Please check the issues above."
fi