import React from 'react';

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Uppercase letter (A-Z)', test: (p) => /[A-Z]/.test(p) },
  { label: 'Lowercase letter (a-z)', test: (p) => /[a-z]/.test(p) },
  { label: 'Number (0-9)',           test: (p) => /[0-9]/.test(p) },
  { label: 'Special character (!@#...)', test: (p) => /[^a-zA-Z0-9]/.test(p) },
];

const levels = [
  { label: 'Very Weak', color: 'bg-red-500',    textColor: 'text-red-600'    },
  { label: 'Weak',      color: 'bg-orange-400',  textColor: 'text-orange-500' },
  { label: 'Fair',      color: 'bg-yellow-400',  textColor: 'text-yellow-600' },
  { label: 'Good',      color: 'bg-blue-400',    textColor: 'text-blue-600'   },
  { label: 'Strong',    color: 'bg-green-500',   textColor: 'text-green-600'  },
];

export function PasswordStrengthMeter({ password }) {
  if (!password) return null;

  const passed = rules.filter(r => r.test(password)).length;
  const level  = levels[Math.min(passed, levels.length - 1)];
  const widthPct = `${(passed / rules.length) * 100}%`;

  return (
    <div className="mt-2 space-y-2">
      {/* Bar */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${level.color}`}
          style={{ width: widthPct }}
        />
      </div>
      <p className={`text-xs font-medium ${level.textColor}`}>{level.label}</p>

      {/* Checklist */}
      <ul className="space-y-1">
        {rules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-green-600' : 'text-gray-400'}`}>
              <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${ok ? 'bg-green-500' : 'bg-gray-300'}`}>
                {ok ? '✓' : ''}
              </span>
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
