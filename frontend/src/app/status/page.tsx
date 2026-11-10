import Link from "next/link";

import { StatusBadge } from "@/components/route-header";
import { ALL_ROUTES, docUrl } from "@/lib/nav-config";

/** The same table as README §8, generated from nav-config. */
export default function StatusPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold">Status overview</h1>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-xs uppercase text-slate-500 dark:border-slate-800">
            <tr>
              <th className="px-4 py-2">Doc page</th>
              <th className="px-4 py-2">Route</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Gap</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 align-top dark:divide-slate-800">
            {ALL_ROUTES.map((r) => (
              <tr key={r.path}>
                <td className="px-4 py-2">
                  <a href={docUrl(r)} target="_blank" rel="noreferrer" className="underline">
                    {r.title}
                  </a>
                </td>
                <td className="px-4 py-2">
                  <Link href={r.path} className="font-mono text-xs underline">
                    {r.path}
                  </Link>
                </td>
                <td className="px-4 py-2">
                  <StatusBadge status={r.status} />
                </td>
                <td className="max-w-md px-4 py-2 text-xs text-slate-600 dark:text-slate-400">
                  {r.docGap ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
