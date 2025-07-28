"""
Test script for the Research Validator API
"""
import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test the health check endpoint"""
    print("Testing health check...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Health check failed: {e}")
        return False

def test_root_endpoint():
    """Test the root endpoint"""
    print("\nTesting root endpoint...")
    try:
        response = requests.get(BASE_URL)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Root endpoint test failed: {e}")
        return False

def test_research_topic(topic):
    """Test the research topic validation endpoint"""
    print(f"\nTesting research topic: '{topic}'...")
    try:
        payload = {"topic": topic}
        response = requests.post(
            f"{BASE_URL}/research-topic",
            json=payload,
            headers={"Content-Type": "application/json"}
        )
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"Success: {result.get('success')}")
            print(f"Analysis: {result.get('analysis', 'No analysis')[:200]}...")
        else:
            print(f"Error response: {response.text}")
            
        return response.status_code == 200
    except Exception as e:
        print(f"Research topic test failed: {e}")
        return False

def main():
    """Run all tests"""
    print("=== Research Validator API Tests ===\n")
    
    # Test basic endpoints
    health_ok = test_health_check()
    root_ok = test_root_endpoint()
    
    if not health_ok:
        print("\n❌ Basic health check failed. Make sure the server is running.")
        return
    
    # Test research topics
    test_topics = [
        "Climate change is caused by human activities",
        "Artificial intelligence will replace most jobs by 2030",
        "Drinking coffee reduces the risk of heart disease"
    ]
    
    success_count = 0
    for topic in test_topics:
        if test_research_topic(topic):
            success_count += 1
    
    print(f"\n=== Test Results ===")
    print(f"Health Check: {'✅' if health_ok else '❌'}")
    print(f"Root Endpoint: {'✅' if root_ok else '❌'}")
    print(f"Research Topics: {success_count}/{len(test_topics)} successful")
    
    if success_count == len(test_topics):
        print("\n🎉 All tests passed!")
    else:
        print(f"\n⚠️  {len(test_topics) - success_count} tests failed")

if __name__ == "__main__":
    main()
