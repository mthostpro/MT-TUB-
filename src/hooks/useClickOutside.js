import { useEffect } from 'react'

// Closes popovers/menus when clicking outside the referenced element.
export default function useClickOutside(ref, handler, active = true) {
  useEffect(() => {
    if (!active) return
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) handler(e)
    }
    function onKey(e) {
      if (e.key === 'Escape') handler(e)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [ref, handler, active])
}
