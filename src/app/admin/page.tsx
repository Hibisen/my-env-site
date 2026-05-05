export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome to the admin panel. Use the navigation to manage your content.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Posts</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">—</p>
          <p className="mt-2 text-sm text-gray-600">
            Manage blog posts and content
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Storage</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">—</p>
          <p className="mt-2 text-sm text-gray-600">
            Upload and manage media files
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900">Settings</h3>
          <p className="mt-2 text-3xl font-bold text-purple-600">—</p>
          <p className="mt-2 text-sm text-gray-600">
            Configure your preferences
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
        <ul className="space-y-2">
          <li>
            <a href="/admin/posts" className="text-blue-600 hover:text-blue-800">
              → Go to Posts Management
            </a>
          </li>
          <li>
            <a href="/admin/upload" className="text-blue-600 hover:text-blue-800">
              → Upload Media Files
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
