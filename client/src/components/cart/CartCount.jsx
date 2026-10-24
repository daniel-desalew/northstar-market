import { useCartStore } from '../../store/cartStore.js'

function CartCount() {
  const count = useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0),
  )

  return <span aria-live="polite" aria-atomic="true">{count}</span>
}

export default CartCount