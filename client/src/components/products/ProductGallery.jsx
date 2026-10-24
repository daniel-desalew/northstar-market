import { useState } from 'react'

function ProductGallery({ images = [], name }) {
  const availableImages = images.filter(Boolean)
  const [selectedImage, setSelectedImage] = useState(availableImages[0] ?? '')

  if (availableImages.length === 0) {
    return <div className="gallery-placeholder" role="img" aria-label={`${name} image unavailable`}>Image unavailable</div>
  }

  return (
    <div className="product-gallery">
      <div className="gallery-main">
        <img src={selectedImage} alt={name} />
      </div>
      {availableImages.length > 1 && (
        <div className="gallery-thumbnails" aria-label="Product images">
          {availableImages.map((image, index) => (
            <button
              type="button"
              key={image}
              className={selectedImage === image ? 'selected' : ''}
              aria-label={`Show image ${index + 1}`}
              aria-pressed={selectedImage === image}
              onClick={() => setSelectedImage(image)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGallery