import { Star } from 'lucide-react'

function RatingStars({ rating, reviewCount }) {
  if (reviewCount === 0) {
    return <span className="rating-row rating-row--new">New item</span>
  }

  return (
    <span className="rating-row" aria-label={`${rating} out of 5 stars`}>
      <span className="stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={12}
            fill={index < Math.round(rating) ? 'currentColor' : 'none'}
          />
        ))}
      </span>
      <span>{reviewCount} reviews</span>
    </span>
  )
}

export default RatingStars
