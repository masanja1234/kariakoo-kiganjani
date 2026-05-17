export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Watumiaji wa Mfumo</h1>
      <div className="card p-8 max-w-2xl">
        <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-3">Jinsi ya Kuongeza Admin</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
          Uthibitisho unafanywa na Clerk. Kufanya mtu kuwa Admin, fuata hatua hizi:
        </p>
        <ol className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 shrink-0">1.</span>
            Nenda kwenye Clerk Dashboard (dashboard.clerk.com)
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 shrink-0">2.</span>
            Chagua mtumiaji unayetaka kumfanya Admin
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 shrink-0">3.</span>
            Nenda kwenye tab ya{" "}
            <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">Public metadata</code>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 shrink-0">4.</span>
            <span>
              Ongeza JSON hii:{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded font-mono block mt-1 text-xs">
                {"{ \"role\": \"ADMIN\" }"}
              </code>
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold text-primary-600 shrink-0">5.</span>
            Bonyeza Save — mtumiaji sasa ataweza kufikia /admin
          </li>
        </ol>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium">Muhimu:</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
            Nywila hazihifadhiwi kwenye database. Uthibitisho wote unafanywa na Clerk. Usiongeze nywila kwenye database.
          </p>
        </div>
      </div>
    </div>
  );
}
