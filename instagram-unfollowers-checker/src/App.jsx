import { useState } from 'react'
import { DocumentArrowUpIcon, ClipboardIcon, ChevronDownIcon, UserGroupIcon } from '@heroicons/react/24/outline'

function App() {
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [unfollowers, setUnfollowers] = useState([])
  const [showInstructions, setShowInstructions] = useState(false)

  const parseJsonFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          const usernames = data.map(item => 
            item.string_list_data[0].value
          )
          resolve(usernames)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  const handleFollowersUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const usernames = await parseJsonFile(file)
        setFollowers(usernames)
        calculateUnfollowers(usernames, following)
      } catch (error) {
        alert('Error parsing followers file')
      }
    }
  }

  const handleFollowingUpload = async (event) => {
    const file = event.target.files[0]
    if (file) {
      try {
        const usernames = await parseJsonFile(file)
        setFollowing(usernames)
        calculateUnfollowers(followers, usernames)
      } catch (error) {
        alert('Error parsing following file')
      }
    }
  }

  const calculateUnfollowers = (followersList, followingList) => {
    console.log(followersList, followingList)
    if (followersList.length > 0 && followingList.length > 0) {
      const unfollowersList = followingList.filter(
        username => !followersList.includes(username)
      )
      setUnfollowers(unfollowersList)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(unfollowers.join('\n'))
    alert('Copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Instagram Unfollowers
          </h1>
          <p className="text-gray-500 text-lg">
            Find out who doesn't follow you back
          </p>
        </header>

        <div className="space-y-8">
          {/* Upload Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFollowersUpload}
                  className="hidden"
                  id="followers-upload"
                />
                <label
                  htmlFor="followers-upload"
                  className="block w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {/* <DocumentArrowUpIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" /> */}
                  <span className="text-gray-600">Upload Followers JSON</span>
                </label>
                {followers.length > 0 && (
                  <p className="mt-2 text-sm text-green-600 text-center">
                    {followers.length} followers loaded
                  </p>
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFollowingUpload}
                  className="hidden"
                  id="following-upload"
                />
                <label
                  htmlFor="following-upload"
                  className="block w-full p-4 border-2 border-dashed border-gray-200 rounded-lg text-center cursor-pointer hover:border-gray-300 transition-colors"
                >
                  {/* <DocumentArrowUpIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" /> */}
                  <span className="text-gray-600">Upload Following JSON</span>
                </label>
                {following.length > 0 && (
                  <p className="mt-2 text-sm text-green-600 text-center">
                    {following.length} following loaded
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Results Section */}
          {unfollowers.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {unfollowers.length} accounts don't follow you back
                  </h2>
                </div>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <ClipboardIcon className="h-4 w-4 mr-2 text-gray-500" />
                  Copy List
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                <ul className="divide-y divide-gray-200">
                  {unfollowers.map((username, index) => (
                    <li
                      key={index}
                      className="py-3 flex items-center"
                    >
                      <span className="w-6 h-6 flex items-center justify-center bg-white border border-gray-200 rounded-full text-sm text-gray-500 mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-900">{username}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Instructions Section */}
          <div className="border-t border-gray-200 pt-6">
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronDownIcon
                className={`h-4 w-4 mr-1 transform transition-transform ${
                  showInstructions ? 'rotate-180' : ''
                }`}
              />
              How to get your Instagram data
            </button>
            {showInstructions && (
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p>1. Visit Instagram's Data Download Page</p>
                <p>2. Request your data in JSON format</p>
                <p>3. Once you receive the email, download and unzip the archive</p>
                <p>4. Locate two files: one that represents followers and one for following</p>
                <p>5. Upload them into the tool using the appropriate buttons above</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
