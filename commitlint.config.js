/**
 * Konfigurasi commitlint: Conventional Commits dengan daftar type terbatas
 * dan header maksimal 100 karakter.
 */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'refactor', 'test', 'docs', 'build', 'ci', 'chore'],
    ],
    'header-max-length': [2, 'always', 100],
  },
}
