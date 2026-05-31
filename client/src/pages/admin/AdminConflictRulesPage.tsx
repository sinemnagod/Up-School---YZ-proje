import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'

interface ConflictRule {
  id: string
  rule_name: string
  alert_type: string
  severity: string
  conflict_scope: string
  is_active: boolean
  explanation: string
}

export default function AdminConflictRulesPage() {
  const [rules, setRules] = useState<ConflictRule[]>([])
  const [loading, setLoading] = useState(true)

  function fetchRules() {
    api.get('/admin/conflict-rules')
      .then(({ data }) => setRules(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRules() }, [])

  async function handleToggle(id: string) {
    await api.patch(`/admin/conflict-rules/${id}/toggle`)
    fetchRules()
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this rule?')) return
    await api.delete(`/admin/conflict-rules/${id}`)
    fetchRules()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-medium tracking-widest uppercase text-gl-stone mb-1">Admin</p>
          <h1 className="font-display text-display-lg text-gl-ink">Conflict Rules</h1>
        </div>
        <Link
          to="/admin/conflict-rules/new"
          className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90 transition-all"
        >
          + Add Rule
        </Link>
      </div>

      {loading ? (
        <p className="text-gl-stone text-sm">Loading...</p>
      ) : rules.length === 0 ? (
        <p className="text-gl-stone text-sm">No conflict rules yet. Add your first one.</p>
      ) : (
        <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gl-dustypetal bg-gl-petalmist">
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Rule Name</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Severity</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Scope</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Status</th>
                <th className="text-left px-5 py-3 text-xs font-medium text-gl-stone uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule, i) => (
                <tr key={rule.id} className={`border-b border-gl-pebble ${i % 2 === 0 ? '' : 'bg-gl-petalmist'}`}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-gl-ink">{rule.rule_name}</p>
                    <p className="text-xs text-gl-stone mt-0.5 max-w-xs truncate">{rule.explanation}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-gl-softbloom text-gl-plum border border-gl-dustypetal">
                      {rule.alert_type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full ${
                      rule.severity === 'DANGER'
                        ? 'bg-gl-danger-light text-gl-danger'
                        : 'bg-[#F5EDD4] text-[#6B540A]'
                    }`}>
                      {rule.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gl-stone">
                    {rule.conflict_scope.replace('_', ' ')}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggle(rule.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${
                        rule.is_active
                          ? 'bg-gl-moss text-white'
                          : 'bg-gl-petalmist text-gl-stone border border-gl-pebble'
                      }`}
                    >
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/conflict-rules/${rule.id}/edit`}
                        className="text-gl-wildrose text-xs font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(rule.id)}
                        className="text-gl-danger text-xs font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}