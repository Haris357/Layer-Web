// Tiny markdown renderer for release-note bodies. Covers headings, lists,
// paragraphs, inline bold/italic/code, and links — the only things we use.
// No external dependency.

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&':
        return '&amp;'
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '"':
        return '&quot;'
      case "'":
        return '&#39;'
    }
    return c
  })
}

function inline(s: string): string {
  let out = s
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, '$1<em>$2</em>')
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noreferrer">$1</a>',
  )
  return out
}

export function renderMarkdown(text: string): string {
  const escaped = escapeHtml(text)
  const blocks = escaped.split(/\n\s*\n/)
  return blocks
    .map((block) => {
      const trimmed = block.trim()
      if (!trimmed) return ''
      if (trimmed.startsWith('### ')) {
        return `<h4>${inline(trimmed.slice(4))}</h4>`
      }
      if (trimmed.startsWith('## ')) {
        return `<h3>${inline(trimmed.slice(3))}</h3>`
      }
      if (trimmed.startsWith('# ')) {
        return `<h2>${inline(trimmed.slice(2))}</h2>`
      }
      const lines = trimmed.split('\n')
      if (lines.every((l) => /^\s*[-*]\s/.test(l))) {
        const items = lines
          .map((l) => `<li>${inline(l.replace(/^\s*[-*]\s/, ''))}</li>`)
          .join('')
        return `<ul>${items}</ul>`
      }
      return `<p>${inline(trimmed.replace(/\n/g, ' '))}</p>`
    })
    .join('')
}
